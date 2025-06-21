
import jwt from "jsonwebtoken"
import { User } from "../models/user.js"
import status from "http-status"

export const verifyJWT = async(req , res , next)=>{
    // get token ,check if valid , decode it , compare with db 

 try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")

    if(!token){
        res.status(status.UNAUTHORIZED).json(  {error:"Unauthorized request"})
    }

    const decodedToken = jwt.verify(token , process.env.JWT_SECRET); 

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken"); 
    if(!user){
        res.status(status.UNAUTHORIZED).json(  {error:"Invalid access token"})
    }

    req.user = user 
    next()
 } catch (error) {
    res.status(status.UNAUTHORIZED).json(  {error:"Invalid access token"})

 }
}