import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <nav className="footer">
            <p>&copy; 2024 StoryPath. All rights reserved.</p>
            <Link to="/placeholder">About Us</Link>
            <Link to="/placeholder">Contact Us</Link>
            <Link to="/placeholder">Privacy Policy</Link>
            {/* <p>About Us</p>
            <p>Contact Us</p>
            <p>Privacy Policy</p> */}
        </nav>
    );
  };
  

export default Footer;
