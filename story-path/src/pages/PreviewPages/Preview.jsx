import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Preview = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('Homescreen');
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [score, setScore] = useState(0);

  const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with your actual JWT token

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

    // Fetch the locations associated with the project
    fetch(`https://0b5ff8b0.uqcloud.net/api/location?project_id=eq.${id}`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching locations: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, [id]);

  if (!project || locations.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="preview-container">
      
    </div>
  );
};

export default Preview;




// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// function Preview() {
//   const { id } = useParams();
//   const projectId = id;
//   const [project, setProject] = useState(null);
//   const [locations, setLocations] = useState([]);
//   const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk';

//   useEffect(() => {
//     // Fetch locations from the API when the component mounts
//     fetch('https://0b5ff8b0.uqcloud.net/api/location', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${JWT_TOKEN}`,  
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => setLocations(data))
//       .catch((error) => console.error('Error fetching locations:', error));
//       fetch(`https://0b5ff8b0.uqcloud.net/api/project?id=eq.${projectId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${JWT_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//       })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.length > 0) {
//           setProject(data); 
//         }
//       })
//       .catch((error) => console.error('Error fetching project:', error));
//     }, [projectId]);


//   return (
//     <main className="preview-page">
//       <div className='preview-mobile'>
//         <p>{project}</p>
//       </div>
//     </main>
//   );
// }

// export default Preview;
