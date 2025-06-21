import React from "react";
import { useNavigate } from "react-router-dom";

function MainSection() {
  const navigate = useNavigate();

  return (

    <section className="flex items-center justify-center h-[calc(100vh-160px)] text-center">
    
      <div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to AI Ticket Assistant
        </h2>
        <button
          onClick={() => navigate("/signup")}
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-full font-semibold"
        >
          Sign up
        </button>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-full font-semibold"
        >
          Sign in 
        </button>
      </div>
    </section>
  );
}

export default MainSection;
