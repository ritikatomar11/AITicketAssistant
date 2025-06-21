import React from 'react'
import {useState } from "react"
import { useNavigate } from 'react-router-dom'


function Login() {
  const [ form , setForm ] = useState({email:"" , password:""});
  const [loading , setLoading ] = useState(false); 
  const navigate = useNavigate(); 

  const handleChange = (e)=>{
    setForm({...form , [e.target.name]:e.target.value})
  }

  const handleLogin = async(e)=>{
    e.preventDefault(); 
    setLoading(true); 
    try{
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login` , 
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json" , 
          }, 
          body:JSON.stringify(form),
          credentials : "include"

        },
      )

      const data = await res.json();

      if(res.ok){
        setForm({email:"" , password:""}); 
        // localStorage.setItem("token" , data.token);
        localStorage.setItem("user" ,JSON.stringify(data.user));
       setLoading(false); 
        navigate("/");
      }else{
        alert(data.message || "Login failed"); 
      }
    }catch(error){
      alert("Something went wrong");
      console.error(error) 
    }finally{
      setLoading(false);
    }

  }
  return (
     <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleLogin} className="card-body">
          <h2 className="card-title justify-center">Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
    
  )
}

export default Login