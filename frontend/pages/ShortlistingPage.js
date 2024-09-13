import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF AutoTable plugin for tables
import './ShortlistingPage.css';

const ShortlistingPage = () => {
  const [shortlisted, setShortlisted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [jobData, setJobData] = useState({});
  const [homeData, setHomeData] = useState({});

  useEffect(() => {
    // Fetch data from localStorage
    const shortlistedData = JSON.parse(localStorage.getItem('shortlisted')) || [];
    const rejectedData = JSON.parse(localStorage.getItem('rejected')) || [];
    const uploadedResumesData = JSON.parse(localStorage.getItem('uploadedResumes')) || [];
    const jobData = JSON.parse(localStorage.getItem('jobData')) || {};
    const homeData = JSON.parse(localStorage.getItem('recruiterDetails')) || {};

    setShortlisted(shortlistedData);
    setRejected(rejectedData);
    setUploadedResumes(uploadedResumesData);
    setJobData(jobData);
    setHomeData(homeData);
  }, []);

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/download/${filename}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
  
    // Set custom font and colors for the header
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204); // Blue color for the header
    doc.text('Summary Report', 105, 20, null, null, 'center');
  
    // Add a line under the header
    doc.setDrawColor(0, 102, 204); // Blue line color
    doc.line(10, 25, 200, 25); // Horizontal line
  
    // Set fonts and colors for home details section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black color for regular text
    doc.text('Recruiter Details', 14, 35);
    doc.setFontSize(12);
    doc.setTextColor(102, 102, 102); // Grey text for data
    doc.text(`Date of Report: ${homeData.date || 'N/A'}`, 14, 45);
    doc.text(`Role Required: ${homeData.role || 'N/A'}`, 14, 55);
    doc.text(`Location: ${homeData.location || 'N/A'}`, 14, 65);
    doc.text(`Company Name: ${homeData.companyName || 'N/A'}`, 14, 75);
    doc.text(`Job Type: ${homeData.jobType || 'N/A'}`, 14, 85);
    doc.text(`Start Date: ${homeData.startDate || 'N/A'}`, 14, 95);
  
    // Job Description Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Job Description Details', 14, 110);
    doc.setFontSize(12);
    doc.setTextColor(102, 102, 102);
    doc.text(`Role Required: ${jobData.role || 'N/A'}`, 14, 120);
    doc.text(`Location: ${jobData.location || 'N/A'}`, 14, 130);
    doc.text(`Experience: ${jobData.experience ? jobData.experience.join(', ') : 'N/A'}`, 14, 140);
    doc.text(`Primary Skills: ${jobData.primary_skills ? jobData.primary_skills.join(', ') : 'N/A'}`, 14, 150);
    doc.text(`Secondary Skills: ${jobData.secondary_skills ? jobData.secondary_skills.join(', ') : 'N/A'}`, 14, 160);
    doc.text(`Qualification: ${jobData.qualification || 'N/A'}`, 14, 170);
    doc.text(`Projects: ${jobData.projects || 'N/A'}`, 14, 180);
  
    // Resumes table
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    // doc.text('Uploaded Resumes', 14, 200);
  
    doc.autoTable({
      startY: 210,
      // head: [['Name', 'Exp', 'Email ID', 'Qual', 'Primary Skills', 'Secondary Skills']],
      body: uploadedResumes.map(resume => [
        resume.name,
        resume.experience ? resume.experience.join(', ') : 'N/A',
        resume.email,
        resume.qualification,
        resume.primary_skills ? resume.primary_skills.join(', ') : 'N/A',
        resume.secondary_skills ? resume.secondary_skills.join(', ') : 'N/A'
      ]),
      styles: { fontSize: 10, halign: 'center' },
      headStyles: { fillColor: [0, 102, 204] }, // Blue header
    });
  
    // Shortlisted candidates table
    doc.setFontSize(14);
    doc.text('Shortlisted Candidates', 14, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [['Name', 'Exp', 'Email ID', 'Qual', 'Primary Skills', 'Secondary Skills', 'Fit Score']],
      body: shortlisted.map(candidate => [
        candidate.name,
        candidate.experience.join(', '),
        candidate.email,
        candidate.qualification,
        candidate.primary_skills ? candidate.primary_skills.join(', ') : 'N/A',
        candidate.secondary_skills ? candidate.secondary_skills.join(', ') : 'N/A',
        candidate.fit_score
      ]),
      styles: { fontSize: 10, halign: 'center' },
      headStyles: { fillColor: [0, 153, 76] }, // Green header for shortlisted
    });
  
    // Rejected candidates table
    doc.setFontSize(14);
    doc.text('Rejected Candidates', 14, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [['Name', 'Exp', 'Email ID', 'Qual', 'Primary Skills', 'Secondary Skills', 'Rejection Reason']],
      body: rejected.map(candidate => [
        candidate.name,
        candidate.experience.join(', '),
        candidate.email,
        candidate.qualification,
        candidate.primary_skills ? candidate.primary_skills.join(', ') : 'N/A',
        candidate.secondary_skills ? candidate.secondary_skills.join(', ') : 'N/A',
        candidate.rejection_reason
      ]),
      styles: { fontSize: 10, halign: 'center' },
      headStyles: { fillColor: [204, 0, 0] }, // Red header for rejected
    });
  
    // Save the PDF
    doc.save('summary_report.pdf');
  };
  

  const formatList = (list) => (Array.isArray(list) ? list.join(', ') : 'N/A');

  return (
    <div className="shortlisting-container">
      <h1>Shortlisted Candidates</h1>
      <div className="candidates-section">
        {shortlisted.length > 0 ? (
          shortlisted.map((candidate, index) => (
            <div key={index} className="candidate">
              <p><strong>Name:</strong> {candidate.name}</p>
              <p><strong>Experience:</strong> {formatList(candidate.experience)}</p>
              <p><strong>Email ID:</strong> {candidate.email}</p>
              <p><strong>Qualification:</strong> {candidate.qualification}</p>
              <p><strong>Primary Skills:</strong> {formatList(candidate.primary_skills)}</p>
              <p><strong>Secondary Skills:</strong> {formatList(candidate.secondary_skills)}</p>
              <p><strong>Fit Score:</strong> {candidate.fit_score}</p>
            </div>
          ))
        ) : (
          <p>No shortlisted candidates.</p>
        )}
      </div>
      <h1>Rejected Candidates</h1>
      <div className="candidates-section">
        {rejected.length > 0 ? (
          rejected.map((candidate, index) => (
            <div key={index} className="candidate">
              <p><strong>Name:</strong> {candidate.name}</p>
              <p><strong>Experience:</strong> {formatList(candidate.experience)}</p>
              <p><strong>Email ID:</strong> {candidate.email}</p>
              <p><strong>Qualification:</strong> {candidate.qualification}</p>
              <p><strong>Primary Skills:</strong> {formatList(candidate.primary_skills)}</p>
              <p><strong>Secondary Skills:</strong> {formatList(candidate.secondary_skills)}</p>
              <p><strong>Reason for Rejection:</strong> {candidate.rejection_reason}</p>
            </div>
          ))
        ) : (
          <p>No rejected candidates.</p>
        )}
      </div>
      <div className="download-links">
        <button onClick={generateReport}>Download Summary Report</button>
        <button onClick={() => handleDownload('shortlisted_candidates.xlsx')}>Download Shortlisted Candidates</button>
        <button onClick={() => handleDownload('rejected_candidates.xlsx')}>Download Rejected Candidates</button>
      </div>
    </div>
  );
};

export default ShortlistingPage;