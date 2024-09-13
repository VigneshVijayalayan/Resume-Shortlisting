import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ResumeUploadPage.css';

const ResumeUploadPage = () => {
  const [files, setFiles] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [excelLink, setExcelLink] = useState('');
  const [loading, setLoading] = useState(false);  // Add a loading state
  const navigate = useNavigate();

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      alert('Please upload at least one resume.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      setLoading(true);  // Set loading state to true when uploading
      const response = await axios.post('http://localhost:5000/upload', formData);
      setCandidates(response.data);

      // Generate the Excel download link
      const excelResponse = await axios.get('http://localhost:5000/download/extracted_resumes.xlsx', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([excelResponse.data]));
      setExcelLink(url);

    } catch (error) {
      console.error("Error uploading resumes:", error);
    } finally {
      setLoading(false);  // Reset loading state once the operation is complete
    }
  };

  const handleShortlist = async () => {
    // Retrieve job data from local storage
    const jobData = JSON.parse(localStorage.getItem('jobData'));

    if (!jobData) {
      alert("No job data available. Please upload the job description first.");
      return;
    }

    if (candidates.length === 0) {
      alert("No candidates uploaded. Please upload resumes before shortlisting.");
      return;
    }

    try {
      setLoading(true);  // Show a loading state while processing

      const response = await axios.post('http://localhost:5000/shortlist', { 
        job_data: jobData, 
        resumes: candidates 
      });

      localStorage.setItem('shortlisted', JSON.stringify(response.data.shortlisted));
      localStorage.setItem('rejected', JSON.stringify(response.data.rejected));

      // Navigate to the shortlisting page upon success
      navigate('/shortlisting');
    } catch (error) {
      console.error('Error shortlisting candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-upload-container">
      <h1>Resume Upload</h1>
      <input type="file" multiple onChange={handleFilesChange} />
      <button onClick={handleFileUpload} disabled={loading}>Upload</button>
      
      <div className="candidates-details">
        {candidates.length > 0 ? (
          candidates.map((candidate, index) => (
            <div key={index} className="candidate-details">
              <p><strong>Name:</strong> {candidate.name}</p>
              <p><strong>Experience:</strong> {candidate.experience ? candidate.experience.join(', ') : 'N/A'}</p>
              <p><strong>Email ID:</strong> {candidate.email}</p>
              <p><strong>Qualification:</strong> {candidate.qualification}</p>
              <p><strong>Primary Skills:</strong> {candidate.primary_skills ? candidate.primary_skills.join(', ') : 'N/A'}</p>
              <p><strong>Secondary Skills:</strong> {candidate.secondary_skills ? candidate.secondary_skills.join(', ') : 'N/A'}</p>
            </div>
          ))
        ) : (
          <p>No resumes uploaded.</p>
        )}
      </div>
      
      {excelLink && (
        <a href={excelLink} download="extracted_resumes.xlsx" className="download-button">
          Download Resumes Excel
        </a>
      )}

      {/* Disable the button when loading */}
      <button onClick={handleShortlist} disabled={loading || candidates.length === 0}>Shortlist</button>
      
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default ResumeUploadPage;
