// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import FetchingFragment from './FetchingFragment';
import "../CSS/Nav.css"

function NavBar() {
  return FetchingFragment(
    '/api/accounts/validate',
    <div>Loading...</div>,
    error => <div style={{ color: 'red' }}>Error: {error}</div>,
    authResult => {
      let navItems = <>
        <div className="navbar-brand">
          <button className="login-links"><Link to="/logIn">Login</Link></button>
          <button className="login-links"><Link to="/signUp">Sign Up</Link></button>
        </div>
      </>;
      if (authResult.error === undefined)
        navItems = <>
          <div className="navbar-brand">
            <button className="MyProg"><Link id="MyProg" to="/">My Progress</Link></button> {/* Link to home page */}
            <button className="login-links"><Link to="/logOut">Logout</Link></button>
          </div>
          <ul className="navbar-links">
            <li><button className="navbar-links-Meal"><Link to="/addMeal">Add Meal</Link></button></li>
            <li><button className="navbar-links-Goal"><Link to="/addGoal">Add Goal</Link></button></li>
          </ul>
        </>;
      return (
        <nav className="navbar">
          {navItems}
          <hr id="LINE"></hr>
        </nav>
      )
    }
  );
};


export default NavBar;