import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import { inngest } from "../inngest/client.js"
import {status } from "http-status"

export const signup = async(req , res)=>{
    const { email , password , role , skills=[] } = req.body;  
    console.log(email , password , role , skills, req.body) 
    if(!email || !password || !role ){
        return res.status(status.BAD_REQUEST).json({error: "email or password or role is missing"})
    } 
    const existedUser = await User.findOne({email}); 
    console.log(existedUser)
    if(existedUser)
    {
        return res.status(status.CONFLICT).json({error:"User with email or username already exists"});  
    }

    try{
        const hashedPassword = await bcrypt.hash(password , 10); 
        const user = await User.create({email , password:hashedPassword ,role ,  skills })
        console.log(user)
        //fire inngest event 
        console.log("i am inggest")
        await inngest.send({
            name : "user/signup" , 
            data : {
                email 
            }
    }); 
    const token = jwt.sign(
        {_id : user._id , rolw : user.role} 
        , process.env.JWT_SECRET , 
        {expiresIn:"2d"}
    );
    const signedUpUser = await User.findOne({email}).select("-password"); 
    return res
        .status(status.CREATED)
        .json({user:signedUpUser , token})
    }catch(error){
        res
            .status(500)
            .json({error:"signup failed" , details : error.message})
    }
}



export const login = async(req , res )=>{

    const {email , password} = req.body ;
    console.log(email , password , req.body);
    if(!email || !password){
        return res.status(status.BAD_REQUEST).json({error: "email or password is missing"})
    } 

    try {
         const user = await User.findOne({email}); 
         if(!user ) return res.status(401).json({error:"User not found"}) ; 

        const isMatch = await bcrypt.compare(password , user.password); 
        if(!isMatch){
            return res.status(401).json({error: "Invalid credentials"})
        }

        const token = jwt.sign(
            {_id:user._id , role:user.role} , 
            process.env.JWT_SECRET
        ); 
        res.json({user , token}); 
    } catch (error) {
        res
            .status(500)
            .json({error:"login failed" , details:error.message})
    }
    
}



//jwt is stateless
export const logout = async(req , res )=>{
    try{
        const token = req.headers.authorization.split(" ")[1]; 
        if(!token) return res.status(401).json({error:"unauthorized"})

        jwt.verify(token , process.env.JWT_SECRET , (error, decoded)=>{
            if(error) return res.status(401).json({error:"unauthorized"})
        })

        res
        .status(status.OK)
        .json({message:"Logout successfully"});
    }catch(error){
        res
            .status(500)
            .json({error:"logout failed" , details:error.message})
    }
}


export const updateUser = async(req , res)=>{
    const {skills =[] , role , email } = req.body

    try {
        if(req.user?.role !== "admin"){
            return res.status(403).json({error:"Forbidden"})
        }
        const user = await User.findOne({email})
        if(!user)return res.status(401).json({error:"User not found"})

        await User.updateOne(
            {email} , 
            {skills : skills.length ? skills :user.skills , role}
        )

        return res.json({message:"User updated successfully"})
    } catch (error) {
        res
            .status(500)
            .json({error:"Update failed" , details:error.message})
    }

}

export const getUsers = async (req , res)=>{
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({error:"Forbidden"})
        }
        const users = await User.find().select("-password"); 
        return res.json(users)
    } catch (error) {
        res
            .status(500)
            .json({error:"Get Users failed" , details:error.message})
    }
}