import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [jobs, setJobs] = useState([]);
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

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name} 👋</p>
      <button onClick={handleLogout}>
        Logout
      </button>

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