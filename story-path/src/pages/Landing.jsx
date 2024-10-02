import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/projects");
  }
  
  return (
    <main className="landing-page">
      <div className="page-content">
        <h1>Welcome to StoryPath</h1>
        <p>Create engaging tours, hunts, and adventures!</p>

        <ul className="features-list">
          <li>Museum Tours</li>
          <li>Campus Tours</li>
          <li>Treasure Hunts</li>
          <li>And more!</li>
        </ul>
        <button onClick={handleGetStarted} className="get-started-button" >
          Get Started
        </button>

        {/* Wrap the image with a container to make it full-width */}
        <div className="landing-image-container">
          <img
            src="\assets\story_path_home.png"
            alt="Illustration for StoryPath"
            className="landing-image"
          />
        </div>
      </div>
    </main>
  );
}

export default Landing;
