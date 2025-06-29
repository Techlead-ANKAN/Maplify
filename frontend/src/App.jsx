import React, { useState } from "react";
import MindMap from "./components/MindMap.jsx";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [mindMapData, setMindMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError("");
    setMindMapData(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/mindmap/${encodeURIComponent(topic)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate mind map");
      }

      const data = await response.json();
      if (data.mindmap) {
        setMindMapData(data.mindmap);
      } else {
        setMindMapData(data); // fallback for old format
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <span className="gradient-text">MindMapper</span>
          <span className="beta-badge">BETA</span>
        </h1>
        <p className="app-subtitle">Visual Learning Roadmap Generator</p>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="input-group">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic to explore..."
              className="search-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="search-button"
              disabled={isLoading || !topic.trim()}
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                <span>Generate Roadmap</span>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            {error}
          </div>
        )}

        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">
              Crafting your knowledge map<br />
              <span className="loading-subtext">Good things take time...</span>
            </p>
          </div>
        )}

        {mindMapData && <MindMap data={mindMapData} />}
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} MindMapper | Transform Learning into Insight</p>
      </footer>
    </div>
  );
}

export default App;