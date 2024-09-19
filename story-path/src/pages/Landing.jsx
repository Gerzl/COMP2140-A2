import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <main className="page-content">
      <h1>Welcome to StoryPath</h1>
      <p>Create engaging tours, hunts, and adventures!</p>

      <ul className="features-list">
        <li>Museum Tours</li>
        <li>Campus Tours</li>
        <li>Treasure Hunts</li>
        <li>And more!</li>
      </ul>

      <Link to="/projects" className="get-started-button">
        Get Started
      </Link>

      {/* Wrap the image with a container to make it full-width */}
      <div className="landing-image-container">
        <img
          src="src\assets\story_path_home.png"
          alt="Illustration for StoryPath"
          className="landing-image"
        />
      </div>
    </main>
  );
}

export default Landing;
