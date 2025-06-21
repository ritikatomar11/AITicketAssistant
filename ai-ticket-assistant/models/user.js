import mongoose from "mongoose"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    email : {type : String , required : true , unique : true} , 
    password : {type :String , required : true } , 
    role : {type : String , default:"user" , enum:["user" , "moderator" , "admin"]} , 
    skills : {String} , 
    createdAt : {type :Date , default : Date.now} , 
})

//for generating tokens - custom method
userSchema.methods.generateToken = function (){
    return jwt.sign(
        {_id : this._id , role : this.role} 
        , process.env.JWT_SECRET , 
        {expiresIn:"2d"}
    );
}

export default mongoose.model("User" , userSchema); 