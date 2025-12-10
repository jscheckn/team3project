// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import "../CSS/Nav.css"

function NavBar() {
  const {loggedIn} = useAuth();
  let navItems = <>
    <div className="navbar-brand">
      <button className="login-links"><Link to="/logIn">Login</Link></button>
      <button className="login-links"><Link to="/signUp">Sign Up</Link></button>
    </div>
  </>;
  if (loggedIn)
    navItems = <>
      <div className="navbar-brand">
        <button className="MyProg"><Link id="MyProg" to="/">My Progress</Link></button> {/* Link to home page */}
        <button className="login-links"><Link to="/logOut">Logout</Link></button>
      </div>
      <ul className="navbar-links">
        <li><button className="navbar-links-Meal"><Link to="/addMeal">Add Meal</Link></button></li>
        <li><button className="navbar-links-Goal"><Link to="/addGoal">Add Goal</Link></button></li>
        <li><button className="navbar-links-Recipe"><Link to="/recipes">Recipes</Link></button></li>
      </ul>
    </>;
  return (
    <nav className="navbar">
      {navItems}
      <hr id="LINE"></hr>
    </nav>
  )
};


export default NavBar;