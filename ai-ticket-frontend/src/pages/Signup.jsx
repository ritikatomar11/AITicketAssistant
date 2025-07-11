import React , {useState} from 'react'
import { useNavigate } from "react-router-dom"

function Signup() {
  const [form , setForm] = useState({email:"" , password:"" , role:"" , skills:""});
  const [loading , setLoading] = useState(false);  
  const navigate = useNavigate(); 


  const handleChange = (e)=>{
    setForm({...form , [e.target.name]:e.target.value})
  }; 

  const handleSignup = async(e)=>{
    e.preventDefault(); 
    if (!form.email || !form.password || !form.role) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true); 
    try{
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup` , 
        {
          method:"POST" , 
          headers:{
            "Content-Type":"application/json" 
          } , 
          credentials:"include",
          body:JSON.stringify(form),
        }
      )
      console.log(res)
      const data = await res.json(); 
      console.log(data); 
      if(res.ok){
        setForm({email:"" , password:"" , role:"" , skills:""}); 
        // localStorage.setItem("token",data.token); 
        localStorage.setItem("user" , JSON.stringify(data.user)); 
        navigate("/"); 
      }else{
        alert(data.error ||"Signup failed")
      }
    }catch(error){
      alert("Something went wrong");
      console.error(error); 
    }finally{
      setLoading(false)
    }

  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleSignup} className="card-body">
          <h2 className="card-title justify-center">Sign Up</h2>

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
          
          <select name="role"
                 id="role" 
                 value={form.role} 
                 onChange={handleChange}
                 className="select select-bordered"
          >
            <option value="">Select Role:</option>
            <option value="user">USER</option>
            <option value="moderator">MODERATOR</option>
            <option value="admin">ADMIN</option>
          </select>

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma-separated)"
            className="input input-bordered"
            value={form.skills}
            onChange={handleChange}
          />  

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup