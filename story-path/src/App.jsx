import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Projects from './pages/Projects';
import AddEditProject from './pages/ProjectForm';  // Combined Add/Edit component
import Footer from './pages/Footer';
import Header from './pages/Header';
import './App.css';
import ProjectForm from './pages/ProjectForm';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/add-project" element={<ProjectForm />} />
          <Route path="/edit-project/:id" element={<ProjectForm />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
