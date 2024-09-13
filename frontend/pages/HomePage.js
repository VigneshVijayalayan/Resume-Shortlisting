import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Ensure this file contains the updated CSS

const HomePage = () => {
  const [date, setDate] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [companyName, setCompanyName] = useState(''); // State for company name
  const [jobType, setJobType] = useState(''); // State for job type
  const [startDate, setStartDate] = useState(''); // State for preferred start date

  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleStartProcess = () => {
    console.log('Start button clicked'); // Debugging line
    if (date && role && location && companyName && jobType && startDate) {
      localStorage.setItem(
        'recruiterDetails',
        JSON.stringify({ date, role, location, companyName, jobType, startDate })
      );
      navigate('/job-description');
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <nav>
          <ul>
            <li><button onClick={() => handleNavigate('/job-description')}>Job Description</button></li>
            <li><button onClick={() => handleNavigate('/resume-upload')}>Resume Upload</button></li>
            <li><button onClick={() => handleNavigate('/shortlisting')}>Shortlisting</button></li>
          </ul>
        </nav>
      </header>
      <main className="home-main">
        {/* <h1>Recruiter Input</h1> */}
        <form className="home-form">
          <div className="form-group">
            <label>Date of Report:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Role Required:</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Company Name:</label>
            <select
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            >
              <option value="">Select Company</option>
              <option value="Hinduja Tech">Hinduja Tech</option>
              <option value="Ashok Leyland">Ashok Leyland</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location:</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              <option value="Chennai">Chennai</option>
              <option value="Pune">Pune</option>
              <option value="Banglore">Banglore</option>
            </select>

          </div>

          <div className="form-group">
            <label>Job Type:</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </form>
        <button className="start-button" onClick={handleStartProcess}>Start</button>
      </main>
    </div>
  );
};

export default HomePage;
