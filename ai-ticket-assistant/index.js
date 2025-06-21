import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import {serve} from "inngest/express"
import {inngest} from "./inngest/client.js"
import{onUserSignup} from "./inngest/functions/on-signup.js"
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js"

import userRoutes from "./routes/user.js"
import ticketRoutes from "./routes/ticket.js"

dotenv.config(); 

const app = express(); 


app.use(cors({
  origin: "http://localhost:5173", // or your frontend URL
  credentials: true
})); 
app.use(express.json())
app.use(cookieParser())


app.use("/api/auth" , userRoutes)
app.use("/api/tickets" , ticketRoutes)

//for inngest
app.use(
    "/api/inngest" , serve({
        client:inngest , 
        functions:[onUserSignup , onTicketCreated]
    })
)
const connectDB = async()=>{
    try {
        console.log("connected to db")
        await mongoose.connect(`${process.env.MONGO_URI}`)

    }catch(error){
        console.log("MONGODB connection error" , error);
        process.exit(1) 
    }
}

connectDB()
.then(()=>{

    app.on("error" , (error)=>{
        console.log("ERRR: " , error); 
        throw error 
    })
    const port = process.env.PORT || 3000; 
    app.listen( port, ()=>{
        console.log(`Server is running at port : ${port}`)
    })
})
.catch((err)=>{
    console.log("MONGO DB Connection failed !!")
})
