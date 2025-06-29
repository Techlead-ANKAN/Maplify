// import React from 'react'
// import "./MindMap.css"


// function MindMap({ data }) {
//   const renderMindMap = (node) => {
//     return (
//       <div className="mindmap-node">
//         <h3>{node.topic}</h3>
//         {node.subtopics && node.subtopics.length > 0 && (
//           <div className="mindmap-children">
//             {node.subtopics.map((subtopic, index) => (
//               <div key={index} className="mindmap-subtopic">
//                 {renderMindMap(subtopic)}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }
//   return (
//     <div className="mindmap">
//       {data ? renderMindMap(data) : <p>No data available</p>}
//     </div>
//   )
// }

// export default MindMap


// import React from "react";

// function MindMapNode({ node }) {
//   if (!node) return null;

//   return (
//     <ul>
//       <li>
//         <strong>{node.title}</strong>
//         {node.children && node.children.length > 0 && (
//           <ul>
//             {node.children.map((child, idx) => (
//               <MindMapNode key={idx} node={child} />
//             ))}
//           </ul>
//         )}
//       </li>
//     </ul>
//   );
// }

// export default function MindMap({ data }) {
//   if (!data) return null;

//   return (
//     <div>
//       <h2>{data.topic}</h2>
//       {data.subtopics && data.subtopics.map((sub, idx) => (
//         <MindMapNode key={idx} node={sub} />
//       ))}
//     </div>
//   );
// }







// import React from "react";
// import "./MindMap.css";

// const MindMapNode = ({ node, level = 0 }) => {
//   if (!node) return null;

//   const isRoot = level === 0;
//   const isLeaf = !node.children || node.children.length === 0;

//   return (
//     <div className={`node-container ${isRoot ? "root-node" : ""}`}>
//       <div className={`node-content level-${level}`}>
//         <div className="node-icon">
//           {isRoot ? "🌐" : 
//            level === 1 ? "📚" : 
//            level === 2 ? "📝" : 
//            "🔹"}
//         </div>
//         <div className="node-title">{node.title}</div>
//       </div>

//       {!isLeaf && (
//         <div className="node-children">
//           {node.children.map((child, idx) => (
//             <React.Fragment key={idx}>
//               <div className="connection-line"></div>
//               <MindMapNode 
//                 node={typeof child === "string" ? { title: child } : child} 
//                 level={level + 1} 
//               />
//             </React.Fragment>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const MindMap = ({ data }) => {
//   if (!data) return null;

//   return (
//     <div className="mindmap-container">
//       <div className="mindmap-header">
//         <h2 className="mindmap-title">{data.topic}</h2>
//         <div className="mindmap-stats">
//           {data.subtopics && (
//             <span>{data.subtopics.length} Main Concepts</span>
//           )}
//         </div>
//       </div>

//       <div className="mindmap-content">
//         {data.subtopics ? (
//           <div className="nodes-wrapper">
//             {data.subtopics.map((subtopic, idx) => (
//               <MindMapNode key={idx} node={subtopic} level={1} />
//             ))}
//           </div>
//         ) : (
//           <div className="empty-state">
//             <div className="empty-icon">🧠</div>
//             <h3>No roadmap generated</h3>
//             <p>Try a different topic or check the console for errors</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MindMap;








// import React, { useState } from "react";
// import "./MindMap.css";

// const MindMapNode = ({ node, level = 0 }) => {
//   if (!node) return null;

//   const isRoot = level === 0;
//   const isLeaf = !node.children || node.children.length === 0;

//   return (
//     <div className={`node-container ${isRoot ? "root-node" : ""}`}>
//       <div className={`node-content level-${level}`}>
//         <div className="node-icon">
//           {isRoot ? "🌐" :
//             level === 1 ? "📚" :
//               level === 2 ? "📝" :
//                 "🔹"}
//         </div>
//         <div className="node-title">{node.title}</div>
//       </div>

//       {!isLeaf && (
//         <div className="node-children">
//           {node.children.map((child, idx) => (
//             <React.Fragment key={idx}>
//               <div className="connection-line"></div>
//               <MindMapNode
//                 node={typeof child === "string" ? { title: child } : child}
//                 level={level + 1}
//               />
//             </React.Fragment>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const MindMap = ({ data }) => {
//   const [copyStatus, setCopyStatus] = useState("");
//   const [isCopied, setIsCopied] = useState(false);

//   if (!data) return null;

//   const countMainConcepts = data.subtopics ? data.subtopics.length : 0;

//   const copyRawData = async () => {
//     try {
//       const jsonString = JSON.stringify(data, null, 2);
//       await navigator.clipboard.writeText(jsonString);
//       setIsCopied(true);
//       setCopyStatus("JSON copied to clipboard!");

//       // Reset status after 3 seconds
//       setTimeout(() => {
//         setIsCopied(false);
//         setCopyStatus("");
//       }, 3000);
//     } catch (err) {
//       setCopyStatus("Failed to copy JSON");
//       console.error("Copy failed:", err);
//     }
//   };

//   return (
//     <div className="mindmap-container">
//       <div className="mindmap-header">
//         <h2 className="mindmap-title">{data.topic}</h2>
//         <div className="header-actions">
//           <div className="mindmap-stats">
//             <span className="stat-icon">📊</span>
//             {countMainConcepts} Main Concepts
//           </div>
//           <button
//             onClick={copyRawData}
//             className={`copy-button ${isCopied ? "copied" : ""}`}
//             disabled={isCopied}
//           >
//             {isCopied ? (
//               <span className="copy-icon">✅</span>
//             ) : (
//               <span className="copy-icon">📋</span>
//             )}
//             <span>{isCopied ? "Copied!" : "Copy Raw Data"}</span>
//           </button>
//         </div>
//       </div>

//       {copyStatus && (
//         <div className={`copy-status ${isCopied ? "success" : "error"}`}>
//           {copyStatus}
//         </div>
//       )}

//       <div className="mindmap-content">
//         {data.subtopics ? (
//           <div className="nodes-wrapper">
//             {data.subtopics.map((subtopic, idx) => (
//               <MindMapNode key={idx} node={subtopic} level={1} />
//             ))}
//           </div>
//         ) : (
//           <div className="empty-state">
//             <div className="empty-icon">🧠</div>
//             <h3>No roadmap generated</h3>
//             <p>Try a different topic or check the console for errors</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MindMap;









import React, { useState } from "react";
import "./MindMap.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MindMapNode = ({ node, level = 0 }) => {
  if (!node) return null;

  const isRoot = level === 0;
  const isLeaf = !node.children || node.children.length === 0;

  return (
    <div className={`node-container ${isRoot ? "root-node" : ""}`}>
      <div className={`node-content level-${level}`}>
        <div className="node-icon">
          {isRoot ? "🌐" :
            level === 1 ? "📚" :
              level === 2 ? "📝" :
                "🔹"}
        </div>
        <div className="node-title">{node.title}</div>
      </div>

      {!isLeaf && (
        <div className="node-children">
          {node.children.map((child, idx) => (
            <React.Fragment key={idx}>
              <div className="connection-line"></div>
              <MindMapNode
                node={typeof child === "string" ? { title: child } : child}
                level={level + 1}
              />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

const MindMap = ({ data }) => {
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isCopying, setIsCopying] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!data) return null;

  const countMainConcepts = data.subtopics ? data.subtopics.length : 0;

  const copyRawData = async () => {
    try {
      setIsCopying(true);
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setStatus({ message: "JSON copied to clipboard!", type: "success" });
    } catch (err) {
      setStatus({ message: "Failed to copy JSON", type: "error" });
      console.error("Copy failed:", err);
    } finally {
      setIsCopying(false);
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    }
  };

  const downloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      setStatus({ message: "Generating PDF...", type: "info" });

      // Create a new PDF document
      const doc = new jsPDF();
      const title = data.topic;
      const date = new Date().toLocaleDateString();

      // Add title
      doc.setFontSize(24);
      doc.setTextColor(99, 102, 241);
      doc.text(title, 15, 20);

      // Add subtitle
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 120);
      doc.text(`Generated on ${date} • ${countMainConcepts} Main Concepts`, 15, 28);

      // Add horizontal line
      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.5);
      doc.line(15, 32, 195, 32);

      // Set starting position
      let yPosition = 40;
      const maxWidth = 180; // Max width for text
      const lineHeight = 6; // Height between lines

      // Function to add text with word wrap
      const addTextWithWrap = (text, x, y, maxWidth, fontSize = 10) => {
        doc.setFontSize(fontSize);
        const splitText = doc.splitTextToSize(text, maxWidth);
        doc.text(splitText, x, y);
        return splitText.length * lineHeight;
      };

      // Recursive function to add content
      const addContent = (items, depth = 0) => {
        items.forEach(item => {
          // Check if we need a new page
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }

          if (typeof item === 'string') {
            // Handle string leaf nodes
            const heightUsed = addTextWithWrap(`• ${item}`, 15 + (depth * 8), yPosition, maxWidth - (depth * 8));
            yPosition += heightUsed + 2;
          } else if (item && item.title) {
            // Handle object nodes
            const fontSize = depth === 0 ? 14 : depth === 1 ? 12 : 10;
            const fontWeight = depth <= 1 ? 'bold' : 'normal';

            doc.setFontSize(fontSize);
            doc.setFont(undefined, fontWeight);
            doc.setTextColor(0, 0, 0); // Black text

            // Add bullet for all levels except top-level
            const prefix = depth > 0 ? "• " : "";
            const titleText = `${prefix}${item.title}`;

            // Add title with word wrap
            const heightUsed = addTextWithWrap(titleText, 15 + (depth * 8), yPosition, maxWidth - (depth * 8), fontSize);
            yPosition += heightUsed + 4;

            // Process children
            if (item.children && item.children.length > 0) {
              addContent(item.children, depth + 1);
            }
          }
        });
      };

      // Add all content to the PDF
      if (data.subtopics) {
        addContent(data.subtopics);
      }

      // Add footer to all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Add footer line
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("Generated by Maplify • Built from scratch by Techlead-ANKAN", 105, 290, null, null, "center");

        // Add page numbers
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 120);
        doc.text(`Page ${i} of ${pageCount}`, 190, 285, null, null, "right");
      }

      // Save the PDF
      const filename = `mindmap_${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(filename);

      setStatus({ message: "PDF downloaded successfully!", type: "success" });
    } catch (err) {
      setStatus({ message: "Failed to generate PDF", type: "error" });
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    }
  };

  return (
    <div className="mindmap-container">
      <div className="mindmap-header">
        <h2 className="mindmap-title">{data.topic}</h2>
        <div className="header-actions">
          <div className="mindmap-stats">
            <span className="stat-icon">📊</span>
            {countMainConcepts} Main Concepts
          </div>
          <div className="action-buttons">
            <button
              onClick={copyRawData}
              className={`action-button ${isCopying ? "copying" : ""}`}
              disabled={isCopying}
            >
              {isCopying ? (
                <span className="action-spinner"></span>
              ) : (
                <span className="action-icon">📋</span>
              )}
              <span>Copy Raw Data</span>
            </button>
            <button
              onClick={downloadPDF}
              className={`action-button ${isGeneratingPdf ? "generating" : ""}`}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <span className="action-spinner"></span>
              ) : (
                <span className="action-icon">📄</span>
              )}
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {status.message && (
        <div className={`status-message ${status.type}`}>
          <div className="status-icon">
            {status.type === "success" ? "✅" :
              status.type === "error" ? "❌" : "⏳"}
          </div>
          {status.message}
        </div>
      )}

      <div className="mindmap-content">
        {data.subtopics ? (
          <div className="nodes-wrapper">
            {data.subtopics.map((subtopic, idx) => (
              <MindMapNode key={idx} node={subtopic} level={1} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🧠</div>
            <h3>No roadmap generated</h3>
            <p>Try a different topic or check the console for errors</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MindMap;