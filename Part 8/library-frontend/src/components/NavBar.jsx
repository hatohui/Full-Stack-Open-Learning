import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate("/authors")}>To Author</button>
      <button onClick={() => navigate("/books")}>To Books</button>
      <button onClick={() => navigate("/add")}>Create New</button>
      <button onClick={() => navigate("/login")}>login</button>
    </div>
  );
};

export default NavBar;
