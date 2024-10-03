import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectForm = () => {
  // State for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [participantScoring, setParticipantScoring] = useState('Number of Scanned QR Codes');
  const [instructions, setInstructions] = useState('');
  const [initialClue, setInitialClue] = useState('');
  const [homescreenDisplay, setHomescreenDisplay] = useState('Display initial clue');
  const [validationErrors, setValidationErrors] = useState({});

  const [isEdit, setIsEdit] = useState(false);
  const [projectId, setProjectId] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();  // Get project id from the URL
  
  const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk';  

  useEffect(() => { // is run every render
    if (id) {
      setIsEdit(true);
      setProjectId(id);
      // Fetch existing project details for .
      fetch(`https://0b5ff8b0.uqcloud.net/api/project?id=eq.${id}`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`,
        },
      })
        .then((response) => response.json())
        .then((data) => { /* construct project data with all given elements. */
          const project = data[0];
          setTitle(project.title);  
          setDescription(project.description);  
          setIsPublished(project.is_published);  
          setParticipantScoring(project.participant_scoring);  
          setInstructions(project.instructions);
          setInitialClue(project.initial_clue); 
          setHomescreenDisplay(project.homescreen_display); 
        })
        .catch((error) => { /* throw an error in the case that fetch fails. */
          console.error('Error fetching project details:', error);
          alert('Failed to load project data.');
        });
    }
  }, [id]);

  const submitForm = async () => {
    // If title does not exist, prompt again
    if (!title) {
      alert('Title is required');
      return;
    }
    if (title.length > 17) {
      alert('Title length too long (less than 17 characters)');
      return
    }

    const projectData = {
      title,
      description,
      is_published: isPublished,
      participant_scoring: participantScoring,
      instructions,
      initial_clue: initialClue,
      homescreen_display: homescreenDisplay,
      username: "s4745201",  // username - used for row level sec.
    };
    
    // get url for api
    const url = isEdit
      ? `https://0b5ff8b0.uqcloud.net/api/project?id=eq.${projectId}`
      : 'https://0b5ff8b0.uqcloud.net/api/project';
    const method = isEdit ? 'PATCH' : 'POST';
  
    try {
      // Send HTTP request using fetch with API as endpoint.
      const response = await fetch(url, { 
        method,
        headers: {
          'Content-Type': 'application/json', // Send data as JSON
          'Authorization': `Bearer ${JWT_TOKEN}`, // include JWT for authorisation
        },
        body: JSON.stringify(projectData),
      });
  
      // Check if the response is OK and throw error if not with message
      if (!response.ok) {
        const errorDetails = await response.text(); 
        console.error('Error details:', errorDetails);
        throw new Error('Failed to save project');
      }
  
      // Check if response has a body before parsing
      const data = response.headers.get("content-length") > 0 ? await response.json() : {}; 
      alert(`Project ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/projects'); // Return to projects page if successful
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  return (
    <div className="page-content">
      <div className="form-page">

        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h2 className="mb-4">{isEdit ? 'Edit Project' : 'Add New Project'}</h2>
            
            {/* Project Form */}
            <div className="border p-3 mb-3">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The name of your project"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a brief description of your project."
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="instructions" className="form-label">Instructions</label>
                <textarea
                  className="form-control"
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Instructions for participants."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="initialClue" className="form-label">Initial Clue</label>
                <textarea
                  className="form-control"
                  id="initialClue"
                  value={initialClue}
                  onChange={(e) => setInitialClue(e.target.value)}
                  placeholder="The first clue to start the project."
                />
              </div>
              <div className="mb-3">
                <label htmlFor="homescreenDisplay" className="form-label">Homescreen Display</label>
                <select
                  className="form-select"
                  id="homescreenDisplay"
                  value={homescreenDisplay}
                  onChange={(e) => setHomescreenDisplay(e.target.value)}
                >
                  <option value="Display initial clue">Display initial clue</option>
                  <option value="Display all locations">Display all locations</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="participantScoring" className="form-label">Participant Scoring</label>
                <select
                  className="form-select"
                  id="participantScoring"
                  value={participantScoring}
                  onChange={(e) => setParticipantScoring(e.target.value)}
                >
                  <option value="Not Scored">Not Scored</option>
                  <option value="Number of Scanned QR Codes">Number of Scanned QR Codes</option>
                  <option value="Number of Locations Entered">Number of Locations Entered</option>
                </select>
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="published"
                  checked={isPublished}
                  onChange={() => setIsPublished(!isPublished)}
                />
                <label htmlFor="published" className="form-check-label">Published</label>
              </div>
            </div>

            {/* Form submission button */}
            <div className="input-group mb-3">
              <button
                className="btn btn-primary"
                onClick={submitForm}
              >
                {isEdit ? 'Save Project' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
