// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobDescriptionPage from './pages/JobDescriptionPage'; // Ensure you have this file
import ResumeUploadPage from './pages/ResumeUploadPage'; // Ensure you have this file
import ShortlistingPage from './pages/ShortlistingPage'; // Ensure you have this file

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/job-description" element={<JobDescriptionPage />} />
      <Route path="/resume-upload" element={<ResumeUploadPage />} />
      <Route path="/shortlisting" element={<ShortlistingPage />} />
    </Routes>
  );
};

export default App;
