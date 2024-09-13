import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './JobDescriptionPage.css';

const JobDescriptionPage = () => {
  const [jobData, setJobData] = useState({});
  const [file, setFile] = useState(null);
  const [excelLink, setExcelLink] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload-job', formData);
      setJobData(response.data);  // This part works if the job data is showing

      // Fetch Excel download link after the job description is uploaded
      const excelResponse = await axios.get('http://localhost:5000/download/job_description.xlsx', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([excelResponse.data]));
      console.log('Excel download link:', url); // Debugging
      setExcelLink(url);

    } catch (error) {
      console.error("Error uploading job description:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!jobData.location || !jobData.experience || !jobData.primary_skills || !jobData.qualification) {
      alert("Please upload a valid job description and ensure all fields are filled.");
      return;
    }

    localStorage.setItem('jobData', JSON.stringify(jobData));
    navigate('/resume-upload');
  };

  return (
    <div className="job-description-container">
      <header>
        <h1>Upload Job Description</h1>
      </header>
      <main>
        <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        <div className="job-description-details">
          <p><strong className='bolder'>Location:</strong> {jobData.location}</p>
          <p><strong className='bolder'>Experience:</strong> {jobData.experience && jobData.experience.join(', ')}</p>
          <p><strong className='bolder'>Primary Skills:</strong> {jobData.primary_skills && jobData.primary_skills.join(', ')}</p>
          <p><strong className='bolder'>Secondary Skills:</strong> {jobData.secondary_skills && jobData.secondary_skills.join(', ')}</p>
          <p><strong className='bolder'>Qualification:</strong> {jobData.qualification}</p>
          <p><strong className='bolder'>Projects:</strong> {jobData.projects}</p>
        </div>
        
        {excelLink ? (
          <a href={excelLink} download="job_description.xlsx" className="download-button">
            Download Job Description Excel
          </a>
        ) : (
          <p>Loading Excel link...</p> // Add this to make it clear when the link isn't ready
        )}

        <button onClick={handleNext}>Go to Resume Upload</button>
      </main>
    </div>
  );
};

export default JobDescriptionPage;
