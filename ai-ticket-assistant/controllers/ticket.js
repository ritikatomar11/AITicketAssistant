import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.js"
import status from "http-status";

export const createTicket = async(req ,res)=>{
    try {
        const {title , description} = req.body ; 
        console.log(title , description , req.body);
        if(!title || !description){
            return res.status(status.BAD_REQUEST).json({message:"Title and description are required"});          
        }

        const newTicket = await Ticket.create({
            title , 
            description ,
            createdBy:req.user._id.toString()
        })

        //trigger the inngest function 
        await inngest.send({
            name:"ticket/created" , 
            data:{
                ticketId : (await newTicket)._id.toString() , 
                title , 
                description , 
                createdBy:req.user._id.toString()
            }
        }); 
        return res
            .status(status.OK)
            .json({message:"Ticket created and processing started " , 
            ticket:newTicket
        })
        
    } catch (error) {
        
        console.error("Error creating ticket " , error.message)
        return res
                    .status(status.INTERNAL_SERVER_ERROR)
                    .json({error:"Internal server error"})
    }
}

export const getTickets = async(req , res)=>{
    try{
        const user = req.user 
        let tickets = []
        if(user.role !== "user"){
            tickets = await Ticket.find({})
            .populate("assignedTo" , ["email" , "_id"])
            .sort({createdAt:-1})
        }else{
            await Ticket.find({createdBy:user._id})
            .select("title description status createdAt")
            .sort({createdAt:-1})
        }
        console.log(tickets)
        return res
            .status(status.OK)
            .json(tickets)
    }catch(error){
        console.error("Error fetching tickets" , error.message); 
        return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json({message:"Internal server error"})
    }
}


export const getTicket = async(req , res)=>{  
    try {
        const user = req.user 
        let ticket; 
        if(user.role !== "user"){
            ticket = await Ticket.findById(req.params.id).populate("assignedTo" ,["email" , "_id"])
        }else{
            ticket = await Ticket.findOne({
                createdBy:user._id , 
                _id : req.params.id
            }).select("title description status createdAt relatedSkills helpfulNotes")
        }
        if(!ticket){
            return res
                .status(status.NOT_FOUND)
                .json({message:"Ticket not found"})
        }

        return res
            .status(status.OK)
            .json({ticket})

    } catch (error) {
        console.log("Error fetching the ticket ")
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({message:"Internal server error"})
    }
}