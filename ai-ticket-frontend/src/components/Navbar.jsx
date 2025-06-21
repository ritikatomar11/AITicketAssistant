import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Ticket Assistant</h1>
        <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
