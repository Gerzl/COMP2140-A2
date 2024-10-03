import React from 'react';
import { Link } from 'react-router-dom';

/**
 * The Footer component renders info at the bottom of every page.
 * 
 * @returns {JSX} - Footer to be displayed
 */
const Footer = () => {
    return (
        <nav className="footer">
            <p>&copy; 2024 StoryPath. All rights reserved.</p>
            <div className='links'>
                <Link to="/placeholder">About Us</Link>
                <Link to="/placeholder">Contact Us</Link>
                <Link to="/placeholder">Privacy Policy</Link>
            </div>
        </nav>
    );
  };
  

export default Footer;
