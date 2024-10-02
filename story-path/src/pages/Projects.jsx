import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Projects() {
  const [projects, setProjects] = useState([]);
  const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDUyMDEifQ.tR4ZyBoqQRRNMXkEKzplDtDr5YuMBv1HoGdK2nRwuhk';
  
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

  return (
    <div className="projects-content">
      <h1>Projects</h1>
      <a href="/add-project" className="add-project-link"><button>Add Project</button></a>

      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="project-item">
            <div className="project-header">
              <h2>{project.title}</h2>
              <p className={project.is_published ? "published" : "draft"}>
                {project.is_published ? "Published" : "Unpublished"}
              </p>
            </div>
            <p>{project.description}</p>  {/* Removed project.status as it's not available */}
            
            <div className="project-actions">
              <a href={`/edit-project/${project.id}`} className="edit-button"><button>Edit</button></a>
              <button className="delete-button" onClick={() => handleDelete(project.id)}>Delete</button>
              <a href={`/locations/${project.id}`} className="locations-button"><button>View Location/s</button></a>
            </div>
          </div>
        ))
      ) : (
        <p>No projects available. Please add a project.</p>
      )}
    </div>
  );
}

export default Projects;
