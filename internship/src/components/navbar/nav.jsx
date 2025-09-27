import React from "react";
import { useNavigate } from "react-router-dom";
import "./nav.css";
// import Logo from "../../assets/logo.png";
import Logo1 from "../../assets/logo1.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">
        <img
          src={Logo1}// random logo
          alt="logo"

        />
       
      </div>
      
      <ul className="nav-links">
        <li>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </li>
        <li>
          <button onClick={() => navigate("/login")}>Login</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
