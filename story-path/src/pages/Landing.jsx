import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * The landing page component is the first page displayed when the user
 * opens the app. Displaying the app image and a button to direct the user how
 * to start.
 * 
 * @returns {JSX} - Landing page to be displayed
 */
function Landing() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/projects");
  }
  
  return (
    <main className="landing-page">
      <div className="page-content">
        <div className='app-details'>
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
        </div>
        <div className='app-image'>
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
