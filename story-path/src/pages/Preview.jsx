import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * The Preview component fetches project and location data based on the project ID from the URL.
 * Used to simulate how the project would look in a mobile device. Testing
 * scoring from going to locations in the projects.
 */
const Preview = () => {
  const { id } = useParams(); // Get ProjectId from URL
  // State variables.
  const [project, setProject] = useState(null); 
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('Homescreen');
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [score, setScore] = useState(0);

  // JWT token for accessing API
  const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk'; 

  /**
   * useEffect runs to fetch project AND location data using API accessed with 
   * JWT token
   */
  useEffect(() => {
    // Fetch the project data using the ID
    fetch(`https://0b5ff8b0.uqcloud.net/api/project?id=eq.${id}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching project: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 0) { // check if data/project exists
        setProject(data[0]);
      } else {
        throw new Error('Project not found');
      }
    })
    .catch(error => console.error('Error fetching project:', error));
  
    // Fetch the locations and filter using current project ID.
    fetch('https://0b5ff8b0.uqcloud.net/api/location', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,  
      },
    })
    .then((response) => response.json())
    .then((data) => setLocations(data.filter(location => location.project_id == id))) // filter locations relating to current project.
    .catch((error) => console.error('Error fetching locations:', error));
  }, [id]);

  /**
   * Handles changes to current location, updating related variables
   * 
   * @param {*} locationName - Self explanatory
   */
  const handleLocationChange = (locationName) => {
    setCurrentLocation(locationName);
    
    // Avoid re-scoring if the location has been visited
    if (!visitedLocations.includes(locationName) && locationName !== 'Homescreen') {
      setVisitedLocations([...visitedLocations, locationName]);

      // Update score based on participant_scoring
      if (project.participant_scoring !== 'Not Scored') {
        const location = locations.find(loc => loc.location_name === locationName);
        if (location && location.score_points) {
          setScore(score + location.score_points);
        }
      }
    }
  };
  
  /**
   * Renders scoreboard displaying user score and number of visited locations.
   * 
   * @returns {JSX} - Scoreboard to be displayed
   */
  const renderScoreBoard = () => (
    <div className="scoreboard">
        <p className='score'>Score: {score} / {locations.map(location => location.score_points).reduce((total, score) => total + score)} </p>
        <p className='visited'>Locations Visited: {visitedLocations.length} / {locations.length}</p>
    </div>
  )
  /**
   * Renders homescreen, displaying initial info to be provided in app.
   * 
   * @returns {JSX} - Homescreen to be displayed
   */
  const renderHomescreen = () => (
    <div className="homescreen">
      <h1>{project.title}</h1>
      <p>{project.instructions}</p>
      {/* Check if item to be displayed is initial clue */}
      {project.homescreen_display === 'Display initial clue' && project.initial_clue && (
        <div className="initial-clue">
          <h2>Initial Clue</h2>
          <p>{project.initial_clue}</p>
        </div>
      )}
      {/* Check if item to be displayed is all locations */}
      {project.homescreen_display === 'Display all locations' && (
        <div className="locations-list">
          <h2>Locations</h2>
          <ul>
            {locations.map(location => (
              <li key={location.id}>{location.location_name}</li>
            ))}
          </ul>
        </div>
      )}
      {renderScoreBoard()}
    </div>
  );  

  /**
   * Renders page for given location.
   * 
   * @param {*} currentLocation - Name of current location.
   * @returns {JSX} Location data to be displayed.
   */
  const renderLocationPage = (currentLocation) => (
    <div className="location-screen">
      <h1>{currentLocation}</h1>
      {renderScoreBoard()}
    </div>
  )
  
  // Main render function.
  return (
    <div className="preview-container">
      <div className="location-dropdown">
        <select 
          className="dropdown" 
          value={currentLocation} 
          // Update the current location.
          onChange={(e) => {handleLocationChange(e.target.value);
        }}>
          {/* Dropdown option for homescreen  */}
          <option value="Homescreen">Homescreen</option>
          {/* Dropdown options for each location */}
          {locations.map(location => (
            <option key={location.id} value={location.location_name}>
              {location.location_name}
            </option>
          ))}
        </select>
      </div>
      <div className='display-simulation'>
        {(project === null || locations.length === 0) ? (
          "Loading"
        ) : (
          currentLocation === 'Homescreen' ? renderHomescreen() : renderLocationPage(currentLocation)
        )}
      </div>
    </div>
  );
};

export default Preview;


