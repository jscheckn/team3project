    // Navbar.js
    import React from 'react';
    import { Link } from 'react-router-dom';

    function NavBar() {
      return (
        <nav className="navbar">
          <div className="navbar-brand">
            <Link to="/">My Progress</Link> {/* Link to home page */}
          </div>
          <ul className="navbar-links">
            <li><Link to="/addMeal">Add Meal</Link></li>
            <li><Link to="/addGoal">Add Goal</Link></li>
          </ul>
          <hr></hr>
        </nav>
      );
    };


export default NavBar;