import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";
import { toast } from "react-toastify";

import {
  FaBriefcase,
  FaBuilding,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

import {
  FaClipboardList,
  FaPaperPlane,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
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
    const [notes, setNotes] = useState("");
    const [interviewDate, setInterviewDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
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
            notes,
            interviewDate,
        });

        setEditingJobId(null);
        toast.success("Job updated successfully!");
    } else {
        await api.post("/jobs", {
            company,
            position,
            status,
            notes,
            interviewDate,
        });

        toast.success("Job added successfully!");
    }

    const response = await api.get("/jobs");
    setJobs(response.data);

    setCompany("");
    setPosition("");
    setStatus("Applied");
    setNotes("");
    setInterviewDate("");
  } catch (error) {
    console.log(error);
    toast.error("Failed to add job");
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

        toast.success("Job deleted successfully!");
    } catch (error) {
        console.log(error);
        toast.error("Failed to delete job");
    }
};

const handleEditJob = (job) => {
  setCompany(job.company);
  setPosition(job.position);
  setStatus(job.status);

  setNotes(job.notes || "");

  setInterviewDate(
    job.interviewDate
      ? new Date(job.interviewDate).toISOString().slice(0, 16)
      : ""
  );

  setEditingJobId(job.id);
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

const filteredJobs = jobs
  .filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.applicationDate) - new Date(a.applicationDate);
    }

    if (sortBy === "oldest") {
      return new Date(a.applicationDate) - new Date(b.applicationDate);
    }

    if (sortBy === "company") {
      return a.company.localeCompare(b.company);
    }

    return 0;
  });


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

        <div className="welcome-section">

            <h2>
                Welcome back, {user?.name || "User"} 👋
            </h2>

            <p>
                Keep track of your applications and land your dream job.
            </p>

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
        <div className="stat-icon">
            <FaClipboardList />
        </div>

        <div>
            <h3>Total Jobs</h3>
            <p>{totalJobs}</p>
        </div>
    </div>

    <div className="stat-card applied-card">
        <div className="stat-icon">
            <FaPaperPlane />
        </div>

        <div>
            <h3>Applied</h3>
            <p>{appliedJobs}</p>
        </div>
    </div>

    <div className="stat-card interview-card">
        <div className="stat-icon">
            <FaUserTie />
        </div>

        <div>
            <h3>Interview</h3>
            <p>{interviewJobs}</p>
        </div>
    </div>

    <div className="stat-card offer-card">
        <div className="stat-icon">
            <FaCheckCircle />
        </div>

        <div>
            <h3>Offer</h3>
            <p>{offerJobs}</p>
        </div>
    </div>

    <div className="stat-card rejected-card">
        <div className="stat-icon">
            <FaTimesCircle />
        </div>

        <div>
            <h3>Rejected</h3>
            <p>{rejectedJobs}</p>
        </div>
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

        <div className="form-group">
        <label>Interview Date</label>
        <input
            type="datetime-local"
            className="form-input"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
        />
        </div>

        <div className="form-group">
            <label>Notes</label>
            <textarea
                className="form-input"
                placeholder="Add interview notes or reminders..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
            />
        </div>

        <button className="add-btn" onClick={handleAddJob}>
            {editingJobId ? "Update Job" : "Add Job"}
        </button>

      </div>

      <div className="filter-bar">

        <div className="search-box">
            <input
                type="text"
                placeholder="Search company or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="filter-select">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="All">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
            </select>
        </div>

        <div className="filter-select">
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="company">Company A-Z</option>
                <option value="status">Status</option>
            </select>
        </div>

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

      <div className="job-header">
        <span className={`job-status status-${job.status.toLowerCase()}`}>
            {job.status}
        </span>
        </div>

      <p className="job-date">
        📅 <strong>Applied:</strong>{" "}
        {new Date(job.applicationDate).toLocaleDateString()}
      </p>

    {job.interviewDate && (
        <p className="job-date">
            ⏰ <strong>Interview:</strong>{" "}
            {new Date(job.interviewDate).toLocaleString()}
        </p>
    )}

    {job.notes && (
        <div className="job-notes">
            <strong>📝 Notes:</strong>
            <p>{job.notes}</p>
        </div>
    )}

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