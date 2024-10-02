import React from 'react';
import { Link } from 'react-router-dom';

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
