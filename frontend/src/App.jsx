// import React, { useState } from 'react'
// import MindMap from "./components/MindMap.jsx"

// function App() {
//   const [courseName, setCourseName] = useState("");
//   const [mindMapData, setMindMapData] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:3000/api/mindmap/${courseName}`)
//       const data = await response.json();
//       console.log(data)
//       setMindMapData(data);
//     } catch (error) {
//       console.error('Error fetching mind map data:', error);
//     }
//   }

//   return (
//     <div>
//       <h1>Mind Map Generator</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={courseName}
//           onChange={(e) => setCourseName(e.target.value)}
//           placeholder="Enter what you want to learn"
//           required
//         />
//         <button type='submit'>Generate Mind Map</button>
//       </form>
//       {mindMapData && <MindMap data={mindMapData} />}
//     </div>
//   )
// }




// export default App;

// import React, { useState } from "react";
// import MindMap from "./components/MindMap";

// function App() {
//   const [courseName, setCourseName] = useState("");
//   const [mindMapData, setMindMapData] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:3000/api/mindmap/${courseName}`);
//       if (!response.ok) throw new Error('Network response was not ok');
//       const data = await response.json();
//       setMindMapData(data);
//     } catch (error) {
//       console.error('Error fetching mind map data:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Mind Map Generator</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           value={courseName}
//           onChange={(e) => setCourseName(e.target.value)}
//           placeholder="Enter course name"
//         />
//         <button type="submit">Generate Mind Map</button>
//       </form>
//       {mindMapData && <MindMap data={mindMapData} />}
//     </div>
//   );
// }

// export default App;






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
        `${import.meta.env.VITE_API_URL}api/mindmap/${encodeURIComponent(topic)}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate mind map");
      }
      
      const data = await response.json();
      setMindMapData(data);
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