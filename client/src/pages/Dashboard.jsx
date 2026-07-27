import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [status, setStatus] = useState("Applied");
    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
};

useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  fetchJobs();
}, []);

const handleAddJob = async () => {
  try {
    await api.post("/jobs", {
  company,
  position,
  status,
});

const response = await api.get("/jobs");
setJobs(response.data);

setCompany("");
setPosition("");
setStatus("Applied");

alert("Job Added Successfully!");
  } catch (error) {
    console.log(error);
    alert("Failed to add job");
  }
};

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name} 👋</p>
      <button onClick={handleLogout}>
        Logout
      </button>

      <h2>Add New Job</h2>

      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />

      <br /><br />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      <br /><br />

      <button onClick={handleAddJob}>Add Job</button>

      <hr />

      <h2>Your Jobs</h2>

      {jobs.map((job) => (
        <div key={job.id}>
          <h3>{job.company}</h3>
          <p>Position: {job.position}</p>
          <p>Status: {job.status}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Dashboard;