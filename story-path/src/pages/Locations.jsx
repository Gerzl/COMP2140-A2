import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Locations() {
    const [locations, setLocations] = useState([]);
    const [projectTitle, setProjectTitle] = useState('');
    const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk';
    const { id: projectId } = useParams(); // get project_id
    const navigate = useNavigate(); // Used to programmatically navigate

    useEffect(() => {
        // Fetch locations from the API when the component mounts
        fetch('https://0b5ff8b0.uqcloud.net/api/location', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`,  
          },
        })
          .then((response) => response.json())
          .then((data) => setLocations(data.filter(location => location.project_id == projectId)))
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
              setProjectTitle(data[0].title); // Assuming 'title' is the field name
            } else {
              setProjectTitle('Unknown Project');
            }
          })
          .catch((error) => console.error('Error fetching project title:', error));
    }, [projectId]);
    console.log(locations)
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

    const handleEdit = (locationId) => {
        // Navigate to the edit-location page
        navigate(`/edit-location/${projectId}/${locationId}`);
    };

    const handleAddLocation = () => {
        // Navigate to add-location page
        navigate(`/add-location/${projectId}`);
    };

    const handlePrintQRCode = () => {
        // Navigate to the QR code generation page
        navigate(`/qrcode/${projectId}`);
    };

    const handlePrintAllQRCode = () => {
      navigate('/placeholder')
    }

    const handlePreview = () => {
      navigate(`/preview/${projectId}`);
    };

    return (
        <div className="locations-content">
            <div className='page-header'>
              <h2 className='page-title'>{projectTitle} - Locations</h2>
              <div className='header-actions'>
                <button onClick={handlePrintAllQRCode} className="printAll-button">Print QR Codes for All</button>
                <button onClick={handlePreview} className="preview-button">Preview</button>
              </div>
            </div>
            <button onClick={handleAddLocation} className="add-button">Add location</button>
            {locations.length > 0 ? (
                locations.map((location) => (
                    <div key={location.id} className="location-item">
                        <div className="location-header">
                            <h2>{location.location_name}</h2>
                            <div className="location-actions">
                                <button className="edit-button" onClick={() => handleEdit(location.id)}>Edit</button>
                                <button className="qr-button" onClick={handlePrintQRCode}>Print QR Code</button>
                                <button className="delete-button" onClick={() => handleDelete(location.id)}>Delete</button>
                            </div>
                        </div>
                        <div className="location-content">
                          <h2>Trigger: {location.location_trigger}</h2>
                          <h2>Position: {location.location_position}</h2>
                          <h2>Score: {location.score_points}</h2>
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
