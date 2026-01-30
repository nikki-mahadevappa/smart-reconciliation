import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Upload from "./Upload";

const COLORS = ["#4CAF50", "#F44336"];

function App() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/dashboard/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch(() => alert("Backend not running"));
  }, []);

  if (!summary) {
    return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  }

  const chartData = [
    { name: "Matched", value: summary.matched },
    { name: "Unmatched", value: summary.unmatched },
  ];

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Smart Reconciliation Dashboard</h1>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <Card title="Total Uploaded" value={summary.totalUploaded} />
        <Card title="Matched" value={summary.matched} />
        <Card title="Unmatched" value={summary.unmatched} />
        <Card title="Accuracy" value={`${summary.accuracyPercentage}%`} />
      </div>

      {/* Chart */}
      <h2>Match Distribution</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* Upload Section */}
      <Upload />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        minWidth: 150,
        textAlign: "center",
        background: "#f9f9f9",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: 22, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

export default App;
