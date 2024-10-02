import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Projects from './pages/Projects';
import AddEditProject from './pages/ProjectForm';  // Combined Add/Edit component
import Navbar from './pages/Navbar';
import './App.css';
import Locations from './pages/Locations';
import AddEditLocation from './pages/LocationForm';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <Navbar />
        </header>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/add-project" element={<AddEditProject />} />
          <Route path="/edit-project/:id" element={<AddEditProject />} />
          <Route path="/locations/:id" element={<Locations />} />
          <Route path="/add-location/:projectId" element={<AddEditLocation />} />
          <Route path="/edit-location/:projectId/:id" element={<AddEditLocation />} />
        </Routes>

        <footer className="footer">
          <p>© 2024 StoryPath. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
