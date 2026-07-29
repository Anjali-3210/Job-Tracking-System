import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

import {
  FaBriefcase,
  FaBuilding,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [status, setStatus] = useState("Applied");
    const [editingJobId, setEditingJobId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
};

useEffect(() => {
    const fetchJobs = async () => {
        try {
            setLoading(true);

            const response = await api.get("/jobs");
            setJobs(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    fetchJobs();
}, []);

const handleAddJob = async () => {
  try {
        if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, {
            company,
            position,
            status,
        });

        setEditingJobId(null);
        alert("Job updated successfully!");
    } else {
        await api.post("/jobs", {
            company,
            position,
            status,
        });

        alert("Job added successfully!");
    }

    const response = await api.get("/jobs");
    setJobs(response.data);

    setCompany("");
    setPosition("");
    setStatus("Applied");
  } catch (error) {
    console.log(error);
    alert("Failed to add job");
  }
};

const handleDeleteJob = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        await api.delete(`/jobs/${id}`);

        const response = await api.get("/jobs");
        setJobs(response.data);

        alert("Job deleted successfully!");
    } catch (error) {
        console.log(error);
        alert("Failed to delete job");
    }
};

const handleEditJob = (job) => {
    setEditingJobId(job.id);
    setCompany(job.company);
    setPosition(job.position);
    setStatus(job.status);
};

const totalJobs = jobs.length;

const appliedJobs = jobs.filter(
    (job) => job.status === "Applied"
).length;

const interviewJobs = jobs.filter(
    (job) => job.status === "Interview"
).length;

const offerJobs = jobs.filter(
    (job) => job.status === "Offer"
).length;

const rejectedJobs = jobs.filter(
    (job) => job.status === "Rejected"
).length;

const filteredJobs = jobs.filter((job) =>
  job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
  job.position.toLowerCase().includes(searchTerm.toLowerCase())
);

if (loading) {
    return (
        <div className="loading-container">
            <div className="loader"></div>
            <h2>Loading jobs...</h2>
        </div>
    );
}

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">

      <div className="header-title">
          <h1>📋 Job Tracker</h1>
          <p>Welcome back, {user.name} 👋</p>
      </div>

      <button
          className="logout-btn"
          onClick={handleLogout}
      >
          Logout
      </button>

      </div>

      <div className="stats-container">

      <div className="stat-card">
          <h3>Total Jobs</h3>
          <p>{totalJobs}</p>
      </div>

      <div className="stat-card applied-card">
          <h3>Applied</h3>
          <p>{appliedJobs}</p>
      </div>

      <div className="stat-card interview-card">
          <h3>Interview</h3>
          <p>{interviewJobs}</p>
      </div>

      <div className="stat-card offer-card">
          <h3>Offer</h3>
          <p>{offerJobs}</p>
      </div>

      <div className="stat-card rejected-card">
          <h3>Rejected</h3>
          <p>{rejectedJobs}</p>
      </div>

      </div>

      <div className="add-job-card">

        <h2>Add New Job</h2>

        <div className="form-group">
            <label>Company</label>
            <input
                type="text"
                className="form-input"
                placeholder="Enter company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />
        </div>

        <div className="form-group">
            <label>Position</label>
            <input
                type="text"
                className="form-input"
                placeholder="Enter job position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
            />
        </div>

        <div className="form-group">
            <label>Status</label>
            <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
            </select>
        </div>

        <button className="add-btn" onClick={handleAddJob}>
            {editingJobId ? "Update Job" : "Add Job"}
        </button>

      </div>

      <div className="search-container">
      <FaSearch className="search-icon" />

      <input
        type="text"
        placeholder="Search by company or position..."
        className="form-input search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>

      <h2 className="jobs-heading">Your Jobs</h2>

{filteredJobs.length > 0 ? (
  filteredJobs.map((job) => (
    <div className="job-card" key={job.id}>
      <h3 className="job-company">
      <FaBuilding /> {job.company}
      </h3>

      <p className="job-position">
        <FaBriefcase /> <strong>Position:</strong> {job.position}
      </p>

      <span className={`job-status status-${job.status.toLowerCase()}`}>
        {job.status}
      </span>

      <div className="job-actions">
        <button
        className="edit-btn"
        onClick={() => handleEditJob(job)}>
        <FaEdit /> Edit
        </button>

        <button
        className="delete-btn"
        onClick={() => handleDeleteJob(job.id)}>
        <FaTrash /> Delete
        </button>
        
      </div>
    </div>
  ))
) : (
  <div className="empty-state">
    <h3>🔍 No jobs found</h3>
    <p>Try searching with a different company or position.</p>
  </div>
)}
</div>
  );
}

export default Dashboard;