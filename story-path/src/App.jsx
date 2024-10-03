import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Projects from './pages/Projects';
import AddEditProject from './pages/ProjectForm';  // Combined Add/Edit component
import Footer from './pages/Footer';
import Header from './pages/Header';
import './App.css';
import Locations from './pages/Locations';
import AddEditLocation from './pages/LocationForm';
import Preview from './pages/Preview';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/add-project" element={<AddEditProject />} />
          <Route path="/edit-project/:id" element={<AddEditProject />} />
          <Route path="/locations/:id" element={<Locations />} />
          <Route path="/add-location/:projectId" element={<AddEditLocation />} />
          <Route path="/edit-location/:projectId/:id" element={<AddEditLocation />} />
          <Route path="/preview/:id" element={<Preview />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
