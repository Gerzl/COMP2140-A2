import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Projects() {
  const [projects, setProjects] = useState([]);
  const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk';
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation
  
  useEffect(() => {
    // Fetch projects from the API when the component mounts
    fetch('https://0b5ff8b0.uqcloud.net/api/project', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, 
      },
    })
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const handleDelete = (id) => {
    // Delete project from the API
    fetch(`https://0b5ff8b0.uqcloud.net/api/project?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`, 
      },
    })
      .then(() => {
        // Update the local state by removing the deleted project
        setProjects(projects.filter((project) => project.id !== id));
      })
      .catch((error) => console.error('Error deleting project:', error));
  };

  const handleAddProject = () => {
    // Navigate to the add-project page
    navigate('/add-project');
  };

  const handleEditProject = (projectId) => {
    // Navigate to the edit-project page
    navigate(`/edit-project/${projectId}`);
  };

  const handleViewLocations = (projectId) => {
    // Navigate to the locations page for the project
    navigate(`/locations/${projectId}`);
  };

  return (
    <div className="projects-content">
      <h1>Projects</h1>
      <button onClick={handleAddProject} className="add-button">Add Project</button>

      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="project-item">
            <div className="project-header">
              <h2 className="title">{project.title}</h2>
              <p className={project.is_published ? "published" : "unpublished"}>
                {project.is_published ? "Published" : "Unpublished"}
              </p>
              <div className="project-actions">
                <button className="edit-button" onClick={() => handleEditProject(project.id)}>Edit</button>
                <button className="locations-button" onClick={() => handleViewLocations(project.id)}>View Location/s</button>
                <button className="delete-button" onClick={() => handleDelete(project.id)}>Delete</button>
              </div>
            </div>
            <p className="project-description">{project.description}</p>
            
          </div>
        ))
      ) : (
        <p>No projects available. Please add a project.</p>
      )}
    </div>
  );
}

export default Projects;
