import React, { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResearch = async () => {
    if (!topic) return alert("Please enter a topic!");
    setLoading(true);
    setReport("");
    try {
      const response = await axios.get(
        `http://localhost:8000/analyze?topic=${topic}`,
      );
      setReport(response.data.report);
    } catch (error) {
      console.error("Error fetching data:", error);
      setReport(
        "Failed to connect to the AI Agent. Make sure the backend is running.",
      );
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "50px auto",
        fontFamily: "system-ui",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#2563eb" }}>Invenio AI Analyst</h1>
      <p>Enter a company or technology to get a real-time market brief.</p>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="e.g. NVIDIA AI Chips"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            padding: "12px",
            width: "60%",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleResearch}
          disabled={loading}
          style={{
            padding: "12px 24px",
            marginLeft: "10px",
            borderRadius: "8px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Agent Researching..." : "Run Agent"}
        </button>
      </div>

      {report && (
        <div
          style={{
            textAlign: "left",
            padding: "20px",
            backgroundColor: "#f3f4f6",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            whiteSpace: "pre-wrap",
          }}
        >
          <h3>Market Report:</h3>
          {report}
        </div>
      )}
    </div>
  );
}

export default App;
