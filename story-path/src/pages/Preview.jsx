import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Preview() {
  const { id } = useParams();
  const projectId = id;
  const [projectDetails, setProject] = useState(null);
  const [locations, setLocations] = useState([]);
  const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk';

  useEffect(() => {
    // Fetch locations from the API when the component mounts
    fetch('https://0b5ff8b0.uqcloud.net/api/location', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,  
      },
    })
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error('Error fetching locations:', error));
      fetch(`https://0b5ff8b0.uqcloud.net/api/project?id=eq.${projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setProject(data); // Assuming 'title' is the field name
        }
      })
      .catch((error) => console.error('Error fetching project title:', error));
    }, [projectId]);


  return (
    <main className="preview-page">
      {projectDetails ? (
        <div>
          <h1>{projectDetails.title} - Preview</h1>
          {locations.length > 0 ? (
            locations.map((location) => (
              <div key={location.id} className="location-item">
                <h2>{location.location_name}</h2>
                <p>Trigger: {location.location_trigger}</p>
                <p>Position: {location.location_position}</p>
                <p>Score: {location.score_points}</p>
              </div>
            ))
          ) : (
            <p>No locations available for this project.</p>
          )}
        </div>
      ) : (
        <p>Loading project details...</p>
      )}
    </main>
  );
}

export default Preview;
