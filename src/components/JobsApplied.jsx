import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './jobsapplied.css';

const JobsApplied = () => {
  const [jobList, setJobList] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [inputData, setInputData] = useState({
    companyName: '',
    appliedDate: '',
    site: '',
    password: '',
    status: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch jobs from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://dreamdeskserver.onrender.com/api/jobs');
        setJobList(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleVerification = () => {
    setIsVerified(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleAddOrUpdateJob = async () => {
    if (!inputData.companyName || !inputData.appliedDate || !inputData.site || !inputData.password || !inputData.status) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (editIndex !== null) {
        // Update job
        const response = await axios.put(`https://dreamdeskserver.onrender.com/api/jobs/${editId}`, inputData);

        const updatedJobList = [...jobList];
        updatedJobList[editIndex] = response.data;

        setJobList(updatedJobList);
        setEditIndex(null);
        setEditId(null);
      } else {
        // Add new job
        const response = await axios.post('https://dreamdeskserver.onrender.com/api/jobs', inputData);
        setJobList([...jobList, response.data]);
      }

      setInputData({ companyName: '', appliedDate: '', site: '', password: '', status: '' });
    } catch (error) {
      console.error('Error adding/updating job:', error);
    }
  };

  const handleEditJob = (index) => {
    setInputData(jobList[index]);
    setEditIndex(index);
    setEditId(jobList[index]._id); // Assuming jobs have a unique `_id` field
  };

  const handleDeleteJob = async (id, index) => {
    try {
      await axios.delete(`https://dreamdeskserver.onrender.com/api/jobs/${id}`);
      const updatedJobList = jobList.filter((_, i) => i !== index);
      setJobList(updatedJobList);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div>
      {!isVerified ? (
        <Modal secretCode="Ultron@1419" onVerified={handleVerification} />
      ) : (
        <div className="jobs-container">
          <h1>Jobs Applied</h1>

          <div className="input-section">
            <input
              type="text"
              name="companyName"
              value={inputData.companyName}
              onChange={handleInputChange}
              placeholder="Company Name"
            />
            <input
              type="date"
              name="appliedDate"
              value={inputData.appliedDate}
              onChange={handleInputChange}
              placeholder="Applied Date"
            />
            <input
              type="text"
              name="site"
              value={inputData.site}
              onChange={handleInputChange}
              placeholder="Website"
            />
            <input
              type="password"
              name="password"
              value={inputData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
            <select
              name="status"
              value={inputData.status}
              onChange={handleInputChange}
            >
              <option value="">Select Status</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Tech Interview">Tech Interview</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Completed">Completed</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button onClick={handleAddOrUpdateJob}>
              {editIndex !== null ? 'Update' : 'Add'}
            </button>
          </div>

          <ul className="job-list">
            {jobList.map((job, index) => (
              <li key={job._id} className="job-item">
                <div>
                  <strong>Company:</strong> {job.companyName}
                </div>
                <div>
                  <strong>App. Date:</strong> {job.appliedDate.split('T')[0]}
                </div>
                <div>
                  <strong>Website:</strong> {job.site}
                </div>
                <div>
                  <strong>Status:</strong> {job.status}
                </div>
                <div className="actions">
                  <button onClick={() => handleEditJob(index)}>Edit</button>
                  <button onClick={() => handleDeleteJob(job._id, index)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobsApplied;
