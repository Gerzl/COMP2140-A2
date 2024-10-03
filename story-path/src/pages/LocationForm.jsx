import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LocationForm = () => {
  // State for form inputs (Location-specific)
  const [locationName, setLocationName] = useState('');
  const [locationTrigger, setLocationTrigger] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationOrder, setLocationOrder] = useState(1);
  const [locationContent, setLocationContent] = useState('');
  const [clue, setClue] = useState('');
  const [scorePoints, setScorePoints] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const [isEdit, setIsEdit] = useState(false);
  const [locationId, setLocationId] = useState(null);
  const { projectId, id } = useParams();  // Get location id and project id from the URL

  const navigate = useNavigate();
  
  const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk';  

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      setLocationId(id);
      // Fetch existing location details for editing
      fetch(`https://0b5ff8b0.uqcloud.net/api/location?id=eq.${id}`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const location = data[0];
          setLocationName(location.location_name);
          setLocationTrigger(location.location_trigger);
          const [lat, long] = location.location_position
            ? location.location_position.replace(/[()]/g, '').split(',')
            : ['', ''];
          setLatitude(lat);
          setLongitude(long);
          setLocationOrder(location.location_order);
          setLocationContent(location.location_content);
          setClue(location.clue);
          setScorePoints(location.score_points);
        })
        .catch((error) => {
          console.error('Error fetching location details:', error);
          alert('Failed to load location data.');
        });
    }
  }, [id]);

  const cancelForm = async () => {
    navigate(`/locations/${projectId}`)
  }

  const submitForm = async () => {
    // Validation check for location name
    const errors = {};
    if (!locationName) errors.locationName = 'Location name is required';
    if (Object.keys(errors).length > 0) {
      alert('Location name is required');
      setValidationErrors(errors);
      return;
    }

    // Combine latitude and longitude into one variable (locationPosition)
    const locationPosition = `${latitude},${longitude}`;

    const locationData = {
      project_id: projectId,  // Linking the location to the correct project
      location_name: locationName,
      location_trigger: locationTrigger,
      location_position: locationPosition,  // Combined lat and long
      location_order: locationOrder,
      location_content: locationContent,
      clue,
      score_points: scorePoints,
      username: "s4745201",  // Hardcoded username
    };

    const url = isEdit
      ? `https://0b5ff8b0.uqcloud.net/api/location?id=eq.${locationId}`
      : 'https://0b5ff8b0.uqcloud.net/api/location';
    const method = isEdit ? 'PATCH' : 'POST';
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT_TOKEN}`,
        },
        body: JSON.stringify(locationData),
      });
  
      // Check if the response is OK
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error details:', errorDetails);
        throw new Error('Failed to save location');
      }
  
      // Check if response has a body before parsing
      const data = response.headers.get("content-length") > 0 ? await response.json() : {}; 
      alert(`Location ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate(`/locations/${projectId}`);
    } catch (error) {
      console.error('Error submitting location:', error);
      alert('Failed to save location. Please try again.');
    }
  };

  return (
    <div className="page-content">
      <div className="form-page">
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <h2 className="mb-4">{isEdit ? 'Edit Location' : 'Add New Location'}</h2>
              
              {/* Location Form */}
              <div className="border p-3 mb-3">
                <div className="mb-3">
                  <label htmlFor="locationName" className="form-label">Location Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="locationName"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Enter location name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="locationTrigger" className="form-label">Location Trigger</label>
                  <input
                    type="text"
                    className="form-control"
                    id="locationTrigger"
                    value={locationTrigger}
                    onChange={(e) => setLocationTrigger(e.target.value)}
                    placeholder="Enter location trigger"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="latitude" className="form-label">Latitude</label>
                  <input
                    type="text"
                    className="form-control"
                    id="latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Enter latitude"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="longitude" className="form-label">Longitude</label>
                  <input
                    type="text"
                    className="form-control"
                    id="longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Enter longitude"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="locationOrder" className="form-label">Location Order</label>
                  <input
                    type="number"
                    className="form-control"
                    id="locationOrder"
                    value={locationOrder}
                    onChange={(e) => setLocationOrder(e.target.value)}
                    placeholder="Enter location order"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="locationContent" className="form-label">Location Content</label>
                  <textarea
                    className="form-control"
                    id="locationContent"
                    value={locationContent}
                    onChange={(e) => setLocationContent(e.target.value)}
                    placeholder="Enter content for this location"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="clue" className="form-label">Clue</label>
                  <input
                    type="text"
                    className="form-control"
                    id="clue"
                    value={clue}
                    onChange={(e) => setClue(e.target.value)}
                    placeholder="Enter clue for this location"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="scorePoints" className="form-label">Score Points</label>
                  <input
                    type="number"
                    className="form-control"
                    id="scorePoints"
                    value={scorePoints}
                    onChange={(e) => setScorePoints(e.target.value)}
                    placeholder="Enter score points for this location"
                  />
                </div>
              </div>

              <div className="input-group mb-3">
                <button
                  className="btn btn-primary"
                  onClick={submitForm}
                >
                  {isEdit ? 'Save Location' : 'Create Location'}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={cancelForm}
                >
                  {isEdit ? 'Cancel Edit' : 'Cancel Form'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
