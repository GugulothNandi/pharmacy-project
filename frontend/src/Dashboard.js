import { useEffect, useState } from "react";

function Dashboard() {
  const [data, setData] = useState({});

  function loadDashboard() {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data));
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <h3>Total Items: {data.total_items || 0}</h3>

      <h3>Low Stock Items: {data.low_stock || 0}</h3>
    </div>
  );
}

export default Dashboard;
