import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QRCode from "react-qr-code";

/**
 * 
 * Lcoations handles displaying a list of locations for a given project.
 * It allows users to add, edit, delete locations and show/hide QR codes for each location.
 * Also a page to access the project preview.
 * 
 * @returns {JSX} - The page to be displayed navigating a list of locations.
 */
function Locations() {
    
    const [locations, setLocations] = useState([]);
    const [projectTitle, setProjectTitle] = useState('');
    const [qrCodeStatus, setQrCodeStatus] = useState([]);

    // JWT token for accessing API
    const JWT_TOKEN = ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk');

    const { id: projectId } = useParams(); // Get project_id
    const navigate = useNavigate(); // Hook to navigate
    
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

    const handlePrintQRCode = (locationId) => {
      // Toggle QR code visibility for the selected location
      setQrCodeStatus(prevStatus =>
        prevStatus.includes(locationId)
          ? prevStatus.filter(id => id !== locationId) // Remove if already in the list
          : [...prevStatus, locationId] // Add if not in the list
      );
    };


    const handlePrintAllQRCode = () => {
      locations.length <= qrCodeStatus.length ? setQrCodeStatus([]) : setQrCodeStatus(locations.map(location => location.id));
    }

    const handlePreview = () => {
      navigate(`/preview/${projectId}`);
    };

    return (
        <div className="locations-content">
            <div className='page-header'>
              <h2 className='page-title'>{projectTitle} - Locations</h2>
              <div className='header-actions'>
                <button onClick={handlePrintAllQRCode} className="printAll-button">{locations.length <= qrCodeStatus.length ? "Hide QR Codes for All" : "Print QR Codes for All"}</button>
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
                                <button className="qr-button" onClick={() => handlePrintQRCode(location.id)}>
                                  {qrCodeStatus.includes(location.id) ? 'Hide QR Code' : 'Show QR Code'}
                                </button>
                                <button className="delete-button" onClick={() => handleDelete(location.id)}>Delete</button>
                            </div>
                        </div>
                        <div className="location-content">
                          <div className='location-details'>
                            <h2>Trigger: {location.location_trigger}</h2>
                            <h2>Position: {location.location_position}</h2>
                            <h2>Score: {location.score_points}</h2>
                          </div>
                          <div className='qr-code-container'>
                            {qrCodeStatus.includes(location.id) && (
                              <div className="qr-code">
                                <QRCode value={`Location: ${location.location_name}, Position: ${location.location_position}`} />
                              </div>
                            )}
                          </div>
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
