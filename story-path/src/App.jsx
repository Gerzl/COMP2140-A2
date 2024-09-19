import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Projects from './pages/Projects';
import AddEditProject from './pages/ProjectForm';  // Combined Add/Edit component
import Navbar from './pages/Navbar';
import './App.css';

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
        </Routes>

        <footer className="footer">
          <p>© 2024 StoryPath. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
