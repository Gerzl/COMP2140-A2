import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// importing map stuff
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
// importing map related stuff
import {Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

/**
 * LocationForm handles creating or editing a location within a project.
 *
 * @returns {JSX} The form to be displayed for adding or editing a location
 */
const LocationForm = () => {
  // Default Options for forms
  const [locationName, setLocationName] = useState('');
  const [locationTrigger, setLocationTrigger] = useState('Location Entry'); 
  const [latitude, setLatitude] = useState('0');
  const [longitude, setLongitude] = useState('0');
  const [locationOrder, setLocationOrder] = useState(1);
  const [locationContent, setLocationContent] = useState('');
  const [clue, setClue] = useState('');
  const [scorePoints, setScorePoints] = useState(0);

  const [isEdit, setIsEdit] = useState(false);
  const [locationId, setLocationId] = useState(null);
  const { projectId, id } = useParams();  // Get location id and project id from the URL
  const defaultCoordinates = [-27.499443772628354, 153.01529617736375]

  const navigate = useNavigate(); // Hook for navigation
  
  // JWT token for accessing API
  const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk';  

   // ReactQuill formatting info
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font"
  ];

  // ReactQuill modules info
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }]
    ]
  };

  /**
   * UseEffect of LocationForm is used to fetch information if editing.
   */
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
  
  /**
   * Returns user to the appropriate locations page if they wish to cancel
   * either the edit or creation of a location.
   */
  const cancelForm = async () => {
    navigate(`/locations/${projectId}`)
  }

  /**
   * Submits form to save or update location.
   */
  const submitForm = async () => {
    const errors = {};
    if (!locationName) errors.locationName = 'Location name is required';
    if (Object.keys(errors).length > 0) {
      alert('Location name is required');
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

    // Gets appropriate url and method if editing
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

      const data = response.headers.get("content-length") > 0 ? await response.json() : {}; 
      alert(`Location ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate(`/locations/${projectId}`);
    } catch (error) {
      console.error('Error submitting location:', error);
      alert('Failed to save location. Please try again.');
    }
  };
  
  /**
   * LocationMarker function allowing users to click on the map
   * to select a location coordinate which is seen in latitude and longtitude
   * variables.
   * 
   * @returns [int, int] - An array with two ints, latitude and longtitude in that order. 
   */
  function LocationMarker() {
    const [position, setPosition] = useState(null);
  
    useMapEvents({
      click(event) {
        // Get the clicked location's coordinates
        const { lat, lng } = event.latlng;
        setLatitude(lat);
        setLongitude(lng); 
      },
    });
    
    return position === null ? null : (
      <Marker position={position}>
        <Popup>
          Selected Position: <br />
          Latitude: {position[0]}, Longitude: {position[1]}
        </Popup>
      </Marker>
    );
  }
  
  // Main render for location form.
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
                  <select
                    type="text"
                    className="form-control"
                    id="locationTrigger"
                    value={locationTrigger}
                    onChange={(e) => setLocationTrigger(e.target.value)}
                    placeholder="Enter location trigger"
                  >
                    <option value="Location Entry">Location Entry</option>
                    <option value="QR Code Scan">QR Code Scan</option>
                    <option value="Both Location Entry and QR Code Scan">Both Location Entry and QR Code Scan</option>
                  </select>
                </div>
                <div className='map-container' style={{ height: '400px', width: '100%' }}> 
                  <MapContainer center={defaultCoordinates} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker  />
                    <Marker position={[-27.499443772628354, 153.01529617736375]}>
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker>
                  </MapContainer>
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
                  <div className="editor-container">
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      value={locationContent}
                      onChange={(content) => setLocationContent(content)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="clue" className="form-label">Clue</label>
                  <textarea
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
