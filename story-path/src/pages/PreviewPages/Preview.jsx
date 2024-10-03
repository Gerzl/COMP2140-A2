import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Preview = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('Homescreen');
  const [currentLocationId, setCurrentLocationId] = useState(0);
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [score, setScore] = useState(0);

  const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk'; 

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
        if (data.length > 0) {
          setProject(data[0]); // Assuming the API returns an array
        } else {
          throw new Error('Project not found');
        }
      })
      .catch(error => console.error('Error fetching project:', error));
    fetch('https://0b5ff8b0.uqcloud.net/api/location', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,  
      },
    })
      .then((response) => response.json())
      .then((data) => setLocations(data.filter(location => location.project_id == id)))
      .catch((error) => console.error('Error fetching locations:', error));
  }, [id]);

  const handleLocationChange = (locationId, locationName) => {
    setCurrentLocationId(locationId);
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

  const renderScoreBoard = () => (
    <div className="scoreboard">
        <p><strong>Score:</strong> {score} / {locations.map(location => location.score_points).reduce((total, score) => total + score)} </p>
        <p><strong>Locations Visited:</strong> {visitedLocations.length} / {locations.length}</p>
    </div>
  )

  const renderHomescreen = () => (
    <div className="homescreen">
      <h1>{project.title}</h1>
      <p>{project.instructions}</p>
      {project.homescreen_display === 'Display initial clue' && project.initial_clue && (
        <div className="initial-clue">
          <h2>Initial Clue</h2>
          <p>{project.initial_clue}</p>
        </div>
      )}
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

  const renderLocationPage = (currentLocation) => (
    <div className="location-screen">
      <h1>{currentLocation}</h1>
      {renderScoreBoard()}
    </div>
  )
  
  return (
    <div className="preview-container">
      <div className="location-dropdown">
      <select value={currentLocation} onChange={(e) => {
        handleLocationChange(e.target.key, e.target.value);
      }}>
        <option value="Homescreen">Homescreen</option>
        {locations.map(location => (
          <option key={location.id} value={location.location_name}>
            {location.location_name}
          </option>
        ))}
      </select>
    </div>
      {(project === null || locations.length === 0) ? (
        "Loading"
      ) : (
        currentLocation === 'Homescreen' ? renderHomescreen() : renderLocationPage(currentLocation)
      )}
    </div>
  );
};

export default Preview;


