    // Navbar.js
    import React from 'react';
    import { Link } from 'react-router-dom';
    import "../CSS/Nav.css"

    function NavBar() {
      return (
        <nav className="navbar">
          <div className="navbar-brand">
            <button className="MyProg"><Link id="MyProg" to="/">My Progress</Link></button> {/* Link to home page */}
            <button className="login-links"><Link to="/logIn">Login</Link></button>
          </div>
          <ul className="navbar-links">
            <li><button className="navbar-links-Meal"><Link to="/addMeal">Add Meal</Link></button></li>
            <li><button className="navbar-links-Goal"><Link to="/addGoal">Add Goal</Link></button></li>
          </ul>

          <hr id="LINE"></hr>
        </nav>
      );
    };


export default NavBar;