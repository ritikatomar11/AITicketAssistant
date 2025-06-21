import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-center py-4 mt-8">
      <p className="text-sm text-gray-400">
        &copy; {new Date().getFullYear()} AI Ticket Assistant. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
