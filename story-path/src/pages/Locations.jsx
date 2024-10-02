import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function Locations() {
    const [locations, setLocations] = useState([])
    const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk';
    const { id: projectId } = useParams(); // get project_id
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
      }, [projectId]);

      const handleDelete = (id) => {
        // Delete location from the API
        fetch(`https://0b5ff8b0.uqcloud.net/api/location?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`,  // Replace with your JWT token
          },
        })
          .then(() => {
            // Update the local state by removing the local location
            setLocations(locations.filter((location) => location.id !== id));
          })
          .catch((error) => console.error('Error deleting location:', error));
      };

    return (
    <div className="locations-content">
        <h1>Locations</h1>
        <Link to={`/add-location/${projectId}`} className="add-location-link">Add location</Link>
    
        {locations.length > 0 ? (
        locations.map((location) => (
            <div key={location.id} className="location-item">
            <div className="location-header">
                <h2>{location.location_name}</h2>
            </div>
            
            <div className="location-actions">
                <a href={`/edit-location/${projectId}/${location.id}`} className="edit-link"><button>Edit</button></a>
                <button className="delete-button" onClick={() => handleDelete(location.id)}>Delete</button>
                <a href={`/qrcode/${projectId}`} className="qr-button"><button>Print QR Code</button></a>
            </div>
            </div>
        ))
        ) : (
        <p>No locations available. Please add a location.</p>
        )}
    </div>
    );
}

export default Locations;