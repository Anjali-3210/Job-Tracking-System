import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
};

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name} 👋</p>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;