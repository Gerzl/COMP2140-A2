import React from 'react';
import { Link } from 'react-router-dom';


/**
 * The Header component is the navbar that is displayed in every page of the
 * app, useful in navigating the app.
 * 
 * @returns {JSX} - The navbar to be displayed.
 */
function Header() {
  return (
    <nav className="navbar">
      <p className="navbar-title">StoryPath</p>
      <Link to="/">Home</Link>
      <Link to="/projects">Projects</Link>
    </nav>
  );
}

export default Header;
