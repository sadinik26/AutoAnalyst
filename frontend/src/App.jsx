import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [boxHeight, setBoxHeight] = useState(400);
  const isResizing = useRef(false);

  const handleResearch = async () => {
    if (!topic) return alert("Please enter a topic!");
    setLoading(true);
    setReport("");
    try {
      const response = await axios.get(
        `http://localhost:8000/analyze?topic=${encodeURIComponent(topic)}`,
      );
      setReport(response.data.report);
    } catch (error) {
      console.error("Error fetching data:", error);
      setReport("Connection failed. Ensure the backend is running.");
    }
    setLoading(false);
  };

  const startResizing = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = "ns-resize";
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResizing);
    document.body.style.cursor = "default";
  };

  const resize = (e) => {
    if (!isResizing.current) return;
    const newHeight = window.innerHeight - e.clientY - 20;
    if (newHeight > 150 && newHeight < window.innerHeight * 0.85) {
      setBoxHeight(newHeight);
    }
  };

  const renderReport = (rawText) => {
    // 1. Clean technical markdown tags and remove ALL bold marks (**)
    const cleanText = rawText
      .replace(/```markdown|```/g, "")
      .replace(/\*\*/g, "")
      .trim();

    // 2. Split by any header (## or ###)
    const sections = cleanText.split(/(?=###? )/g);

    // 3. Map and Filter to remove empty/useless boxes
    return sections
      .map((section, index) => {
        const trimmed = section.trim();

        // REMOVE: Empty strings or just stray # symbols
        if (!trimmed || /^#+$/.test(trimmed)) {
          return null;
        }

        const isMainHeader = trimmed.startsWith("## ");
        const displayContent = trimmed.replace(/###? /g, "").trim();

        // REMOVE: Generic titles or boxes with no real length
        if (
          displayContent.toLowerCase().includes("recent market developments") ||
          displayContent.length < 2
        ) {
          return null;
        }

        return (
          <div key={index} className="report-card">
            <div className="report-card-content">
              <div
                className={
                  isMainHeader
                    ? "report-card-title topic-highlight"
                    : "report-sub-section"
                }
              >
                {displayContent}
              </div>
            </div>
          </div>
        );
      })
      .filter(Boolean); // This removes all the 'null' entries from the array
  };

  return (
    <div className="hero-container">
      <div className="accent-circle"></div>

      <div className="content-wrapper">
        <div className="text-section">
          <h1 className="main-title">MarketIQ</h1>
          <p className="subtitle">
            AI-driven market insights at your fingertips.
          </p>
        </div>
        <div className="form-section">
          <div className="glass-card">
            <div className="input-group">
              <label>MARKET DESTINATION</label>
              <input
                type="text"
                placeholder="e.g. NVIDIA AI Chips"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleResearch()}
              />
            </div>
            <button
              className="start-btn"
              onClick={handleResearch}
              disabled={loading}
            >
              {loading ? "SEARCHING..." : "START ANALYSIS"}
            </button>
          </div>
        </div>
      </div>

      {report && (
        <div className="bottom-report-overlay">
          <div className="wide-report-box" style={{ height: `${boxHeight}px` }}>
            <div className="resize-handle" onMouseDown={startResizing}>
              <div className="handle-bar"></div>
            </div>

            <div className="report-header">
              <h2 className="analysis-header">Results: {topic}</h2>
              <button className="clear-btn" onClick={() => setReport("")}>
                ✕
              </button>
            </div>
            <div className="report-grid">{renderReport(report)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
