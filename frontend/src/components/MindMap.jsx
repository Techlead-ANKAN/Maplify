import React, { useState } from "react";
import "./MindMap.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Recursive node with expand/collapse for children, and resources
const MindMapNode = ({ node, level = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!node) return null;

  const isRoot = level === 0;
  const hasChildren = node.children && node.children.length > 0;

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
        {hasChildren && (
          <button
            className="expand-btn"
            onClick={() => setExpanded((prev) => !prev)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "−" : "+"}
          </button>
        )}
      </div>

      {/* Show resources if present */}
      {node.resources && node.resources.length > 0 && (
        <div className="node-resources">
          <span className="resources-label">Resources:</span>
          <ul>
            {node.resources.map((res, idx) => (
              <li key={idx}>
                <a href={res.url} target="_blank" rel="noopener noreferrer">
                  {res.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasChildren && expanded && (
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

      const doc = new jsPDF();
      const title = data.topic;
      const date = new Date().toLocaleDateString();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      const footerHeight = 10;
      const maxContentHeight = 280 - footerHeight; // Reserve space for footer

      // Add header
      doc.setFontSize(24);
      doc.setTextColor(99, 102, 241);
      doc.text(title, margin, 20);

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 120);
      doc.text(`Generated on ${date} • ${countMainConcepts} Main Concepts`, margin, 28);

      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.5);
      doc.line(margin, 32, pageWidth - margin, 32);

      let yPosition = 40;

      // Add table of contents
      if (data.subtopics && data.subtopics.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Table of Contents", margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        data.subtopics.forEach((subtopic, idx) => {
          if (yPosition > maxContentHeight) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`${idx + 1}. ${subtopic.title}`, margin, yPosition);
          yPosition += 7;
        });
        yPosition += 10;
      }

      // Add detailed content
      const addContent = (items, depth = 0) => {
        items.forEach(item => {
          // Check if we need a new page before adding content
          if (yPosition > maxContentHeight) {
            doc.addPage();
            yPosition = 20;
          }

          // Handle string items
          if (typeof item === 'string') {
            const lines = doc.splitTextToSize(`• ${item}`, contentWidth - (depth * 8));
            lines.forEach((line, i) => {
              if (yPosition > maxContentHeight) {
                doc.addPage();
                yPosition = 20;
              }
              doc.setFontSize(10);
              doc.setTextColor(0, 0, 0);
              doc.text(line, margin + (depth * 8), yPosition);
              yPosition += 7;
            });
          }
          // Handle node objects
          else if (item && item.title) {
            // Node title
            const fontSize = depth === 0 ? 14 : depth === 1 ? 12 : 10;
            const fontWeight = depth <= 1 ? 'bold' : 'normal';
            doc.setFontSize(fontSize);
            doc.setFont(undefined, fontWeight);
            doc.setTextColor(0, 0, 0);

            const prefix = depth > 0 ? "• " : "";
            const titleText = `${prefix}${item.title}`;

            // Split long titles if needed
            const titleLines = doc.splitTextToSize(titleText, contentWidth - (depth * 8));
            titleLines.forEach((line, i) => {
              if (yPosition > maxContentHeight) {
                doc.addPage();
                yPosition = 20;
              }
              doc.text(line, margin + (depth * 8), yPosition);
              yPosition += i === titleLines.length - 1 ? 10 : 7;
            });

            // Resources
            if (item.resources && item.resources.length > 0) {
              doc.setFontSize(9);
              doc.setTextColor(30, 120, 200);

              if (yPosition > maxContentHeight) {
                doc.addPage();
                yPosition = 20;
              }
              doc.text("Resources:", margin + (depth * 8) + 5, yPosition);
              yPosition += 6;

              item.resources.forEach((res, idx) => {
                doc.setFontSize(8);
                doc.setTextColor(0, 0, 0);

                // Resource title
                const resTitle = `  ${idx + 1}. ${res.title}`;
                const resTitleLines = doc.splitTextToSize(resTitle, contentWidth - (depth * 8) - 10);
                resTitleLines.forEach(line => {
                  if (yPosition > maxContentHeight) {
                    doc.addPage();
                    yPosition = 20;
                  }
                  doc.text(line, margin + (depth * 8) + 10, yPosition);
                  yPosition += 5;
                });

                // Resource URL
                doc.setFontSize(7);
                doc.setTextColor(100, 100, 100);
                const urlLines = doc.splitTextToSize(res.url, contentWidth - 15 - (depth * 8));
                urlLines.forEach(line => {
                  if (yPosition > maxContentHeight) {
                    doc.addPage();
                    yPosition = 20;
                  }
                  doc.text(`    ${line}`, margin + (depth * 8) + 15, yPosition);
                  yPosition += 4;
                });
                yPosition += 3;
              });
              yPosition += 5;
            }

            // Children
            if (item.children && item.children.length > 0) {
              addContent(item.children, depth + 1);
            }
          }
        });
      };

      // Add main content
      if (data.subtopics) {
        addContent(data.subtopics);
      }

      // Add footer to each page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);

        // Place footer at the bottom of the page
        doc.text("Generated by Maplify • Built from scratch by Techlead-ANKAN",
          pageWidth / 2, 290, null, null, "center");

        // Add page number above the footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 120);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, 285, null, null, "right");
      }

      // Save PDF
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

      {/* Main follow-up question below the mind map */}
      {data.subtopics && data.subtopics.length > 0 && (
        <div className="main-followup">
          <span>Which subtopic would you like to explore in more detail? Click <b>+</b> to expand!</span>
        </div>
      )}
    </div>
  );
};

export default MindMap;