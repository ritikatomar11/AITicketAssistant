import React, { useState , useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom";
function CheckAuth({children , protectedRoute , isAdmin}){
    const {id} = useParams(); 
    const navigate = useNavigate() ;
    const [loading , setLoading] = useState(true); 

    useEffect(()=>{
        const token = localStorage.getItem("token")
        console.log(token); 
        if(protectedRoute){
            if(token==null){
                navigate("/login")
            }
        }else{
            if(token && id){
                navigate(`/tickets/${id}`)
            }else if(token && isAdmin){
                navigate("/admin")
            }else if(token){
                navigate("/")
            }
        }
        setLoading(false)

    },[navigate , protectedRoute])

    if(loading){
        return <div>loading...</div>
    }
    return children||null;

}
export default CheckAuth