// import React, { useState } from "react";
// import "./MindMap.css";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// // Recursive node with expand/collapse for children, and resources
// const MindMapNode = ({ node, level = 0 }) => {
//   const [expanded, setExpanded] = useState(false);

//   if (!node) return null;

//   const isRoot = level === 0;
//   const hasChildren = node.children && node.children.length > 0;

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
//         {hasChildren && (
//           <button
//             className="expand-btn"
//             onClick={() => setExpanded((prev) => !prev)}
//             aria-label={expanded ? "Collapse" : "Expand"}
//           >
//             {expanded ? "−" : "+"}
//           </button>
//         )}
//       </div>

//       {/* Show resources if present */}
//       {node.resources && node.resources.length > 0 && (
//         <div className="node-resources">
//           <span className="resources-label">Resources:</span>
//           <ul>
//             {node.resources.map((res, idx) => (
//               <li key={idx}>
//                 <a href={res.url} target="_blank" rel="noopener noreferrer">
//                   {res.title}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {hasChildren && expanded && (
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
//   const [status, setStatus] = useState({ message: "", type: "" });
//   const [isCopying, setIsCopying] = useState(false);
//   const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

//   if (!data) return null;

//   const countMainConcepts = data.subtopics ? data.subtopics.length : 0;

//   const copyRawData = async () => {
//     try {
//       setIsCopying(true);
//       const jsonString = JSON.stringify(data, null, 2);
//       await navigator.clipboard.writeText(jsonString);
//       setStatus({ message: "JSON copied to clipboard!", type: "success" });
//     } catch (err) {
//       setStatus({ message: "Failed to copy JSON", type: "error" });
//       console.error("Copy failed:", err);
//     } finally {
//       setIsCopying(false);
//       setTimeout(() => setStatus({ message: "", type: "" }), 3000);
//     }
//   };

//   const downloadPDF = async () => {
//     try {
//       setIsGeneratingPdf(true);
//       setStatus({ message: "Generating PDF...", type: "info" });

//       const doc = new jsPDF();
//       const title = data.topic;
//       const date = new Date().toLocaleDateString();
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const margin = 15;
//       const contentWidth = pageWidth - margin * 2;
//       const footerHeight = 10;
//       const maxContentHeight = 280 - footerHeight; // Reserve space for footer

//       // Add header
//       doc.setFontSize(24);
//       doc.setTextColor(99, 102, 241);
//       doc.text(title, margin, 20);

//       doc.setFontSize(12);
//       doc.setTextColor(100, 100, 120);
//       doc.text(`Generated on ${date} • ${countMainConcepts} Main Concepts`, margin, 28);

//       doc.setDrawColor(99, 102, 241);
//       doc.setLineWidth(0.5);
//       doc.line(margin, 32, pageWidth - margin, 32);

//       let yPosition = 40;

//       // Add table of contents
//       if (data.subtopics && data.subtopics.length > 0) {
//         doc.setFontSize(16);
//         doc.setTextColor(0, 0, 0);
//         doc.text("Table of Contents", margin, yPosition);
//         yPosition += 10;

//         doc.setFontSize(10);
//         data.subtopics.forEach((subtopic, idx) => {
//           if (yPosition > maxContentHeight) {
//             doc.addPage();
//             yPosition = 20;
//           }
//           doc.text(`${idx + 1}. ${subtopic.title}`, margin, yPosition);
//           yPosition += 7;
//         });
//         yPosition += 10;
//       }

//       // Add detailed content
//       const addContent = (items, depth = 0) => {
//         items.forEach(item => {
//           // Check if we need a new page before adding content
//           if (yPosition > maxContentHeight) {
//             doc.addPage();
//             yPosition = 20;
//           }

//           // Handle string items
//           if (typeof item === 'string') {
//             const lines = doc.splitTextToSize(`• ${item}`, contentWidth - (depth * 8));
//             lines.forEach((line, i) => {
//               if (yPosition > maxContentHeight) {
//                 doc.addPage();
//                 yPosition = 20;
//               }
//               doc.setFontSize(10);
//               doc.setTextColor(0, 0, 0);
//               doc.text(line, margin + (depth * 8), yPosition);
//               yPosition += 7;
//             });
//           }
//           // Handle node objects
//           else if (item && item.title) {
//             // Node title
//             const fontSize = depth === 0 ? 14 : depth === 1 ? 12 : 10;
//             const fontWeight = depth <= 1 ? 'bold' : 'normal';
//             doc.setFontSize(fontSize);
//             doc.setFont(undefined, fontWeight);
//             doc.setTextColor(0, 0, 0);

//             const prefix = depth > 0 ? "• " : "";
//             const titleText = `${prefix}${item.title}`;

//             // Split long titles if needed
//             const titleLines = doc.splitTextToSize(titleText, contentWidth - (depth * 8));
//             titleLines.forEach((line, i) => {
//               if (yPosition > maxContentHeight) {
//                 doc.addPage();
//                 yPosition = 20;
//               }
//               doc.text(line, margin + (depth * 8), yPosition);
//               yPosition += i === titleLines.length - 1 ? 10 : 7;
//             });

//             // Resources
//             if (item.resources && item.resources.length > 0) {
//               doc.setFontSize(9);
//               doc.setTextColor(30, 120, 200);

//               if (yPosition > maxContentHeight) {
//                 doc.addPage();
//                 yPosition = 20;
//               }
//               doc.text("Resources:", margin + (depth * 8) + 5, yPosition);
//               yPosition += 6;

//               item.resources.forEach((res, idx) => {
//                 doc.setFontSize(8);
//                 doc.setTextColor(0, 0, 0);

//                 // Resource title
//                 const resTitle = `  ${idx + 1}. ${res.title}`;
//                 const resTitleLines = doc.splitTextToSize(resTitle, contentWidth - (depth * 8) - 10);
//                 resTitleLines.forEach(line => {
//                   if (yPosition > maxContentHeight) {
//                     doc.addPage();
//                     yPosition = 20;
//                   }
//                   doc.text(line, margin + (depth * 8) + 10, yPosition);
//                   yPosition += 5;
//                 });

//                 // Resource URL
//                 doc.setFontSize(7);
//                 doc.setTextColor(100, 100, 100);
//                 const urlLines = doc.splitTextToSize(res.url, contentWidth - 15 - (depth * 8));
//                 urlLines.forEach(line => {
//                   if (yPosition > maxContentHeight) {
//                     doc.addPage();
//                     yPosition = 20;
//                   }
//                   doc.text(`    ${line}`, margin + (depth * 8) + 15, yPosition);
//                   yPosition += 4;
//                 });
//                 yPosition += 3;
//               });
//               yPosition += 5;
//             }

//             // Children
//             if (item.children && item.children.length > 0) {
//               addContent(item.children, depth + 1);
//             }
//           }
//         });
//       };

//       // Add main content
//       if (data.subtopics) {
//         addContent(data.subtopics);
//       }

//       // Add footer to each page
//       const pageCount = doc.internal.getNumberOfPages();
//       for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);
//         doc.setFontSize(10);
//         doc.setTextColor(150, 150, 150);

//         // Place footer at the bottom of the page
//         doc.text("Generated by Maplify • Built from scratch by Techlead-ANKAN",
//           pageWidth / 2, 290, null, null, "center");

//         // Add page number above the footer
//         doc.setFontSize(10);
//         doc.setTextColor(100, 100, 120);
//         doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, 285, null, null, "right");
//       }

//       // Save PDF
//       const filename = `mindmap_${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
//       doc.save(filename);

//       setStatus({ message: "PDF downloaded successfully!", type: "success" });
//     } catch (err) {
//       setStatus({ message: "Failed to generate PDF", type: "error" });
//       console.error("PDF generation failed:", err);
//     } finally {
//       setIsGeneratingPdf(false);
//       setTimeout(() => setStatus({ message: "", type: "" }), 3000);
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
//           <div className="action-buttons">
//             <button
//               onClick={copyRawData}
//               className={`action-button ${isCopying ? "copying" : ""}`}
//               disabled={isCopying}
//             >
//               {isCopying ? (
//                 <span className="action-spinner"></span>
//               ) : (
//                 <span className="action-icon">📋</span>
//               )}
//               <span>Copy Raw Data</span>
//             </button>
//             <button
//               onClick={downloadPDF}
//               className={`action-button ${isGeneratingPdf ? "generating" : ""}`}
//               disabled={isGeneratingPdf}
//             >
//               {isGeneratingPdf ? (
//                 <span className="action-spinner"></span>
//               ) : (
//                 <span className="action-icon">📄</span>
//               )}
//               <span>Download PDF</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {status.message && (
//         <div className={`status-message ${status.type}`}>
//           <div className="status-icon">
//             {status.type === "success" ? "✅" :
//               status.type === "error" ? "❌" : "⏳"}
//           </div>
//           {status.message}
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

//       {/* Main follow-up question below the mind map */}
//       {data.subtopics && data.subtopics.length > 0 && (
//         <div className="main-followup">
//           <span>Which subtopic would you like to explore in more detail? Click <b>+</b> to expand!</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MindMap;























import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  Download, 
  Copy, 
  Eye, 
  FileText, 
  Brain,
  Sparkles,
  BookOpen,
  Target,
  Link,
  X,
  Check
} from "lucide-react";
import { Button } from "./ui/button.jsx";
import { cn } from "../lib/utils.js";
import jsPDF from "jspdf";

// Modern Mind Map Node Component
const MindMapNode = ({ node, level = 0, isExpanded, onToggleExpand }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!node) return null;

  const isRoot = level === 0;
  const hasChildren = node.children && node.children.length > 0;

  const getNodeIcon = (level) => {
    switch (level) {
      case 0: return <Brain className="w-5 h-5" />;
      case 1: return <BookOpen className="w-4 h-4" />;
      case 2: return <Target className="w-4 h-4" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  const getNodeStyle = (level) => {
    const baseStyle = "relative overflow-hidden group cursor-pointer";
    
    switch (level) {
      case 0:
        return cn(baseStyle, "bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-2xl border-0");
      case 1:
        return cn(baseStyle, "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-lg hover:shadow-xl");
      case 2:
        return cn(baseStyle, "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-lg shadow-md hover:shadow-lg");
      default:
        return cn(baseStyle, "bg-slate-25 dark:bg-slate-950 border border-slate-50 dark:border-slate-900 p-3 rounded-lg shadow-sm hover:shadow-md");
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className={getNodeStyle(level)}
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={() => setShowDetails(true)}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-inherit" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={cn(
              "flex items-center justify-center rounded-lg",
              level === 0 ? "bg-white/20 p-2" : "bg-blue-100 dark:bg-blue-900/30 p-2"
            )}>
              {getNodeIcon(level)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold leading-tight",
                level === 0 ? "text-xl text-white" : 
                level === 1 ? "text-lg text-slate-900 dark:text-white" :
                "text-base text-slate-800 dark:text-slate-200"
              )}>
                {node.title}
              </h3>
              {node.resources && node.resources.length > 0 && (
                <div className="flex items-center mt-1 space-x-1">
                  <Link className="w-3 h-3 text-blue-500" />
                  <span className={cn(
                    "text-xs",
                    level === 0 ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                  )}>
                    {node.resources.length} resource{node.resources.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              className={cn(
                "ml-2 p-1 rounded-full transition-transform duration-200",
                level === 0 ? "text-white hover:bg-white/20" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700",
                isExpanded && "rotate-180"
              )}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            className="mt-4 ml-8 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Connection line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-300 to-transparent dark:from-blue-600" />
            
            {node.children.map((child, idx) => (
              <MindMapNodeContainer
                key={idx}
                node={typeof child === "string" ? { title: child } : child}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node Details Modal */}
      <NodeDetailsModal 
        node={node}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        level={level}
      />
    </motion.div>
  );
};

// Container for node state management
const MindMapNodeContainer = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  
  return (
    <MindMapNode
      node={node}
      level={level}
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded(!isExpanded)}
    />
  );
};

// Node Details Modal
const NodeDetailsModal = ({ node, isOpen, onClose, level }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                {level === 0 ? <Brain className="w-5 h-5 text-blue-600" /> :
                 level === 1 ? <BookOpen className="w-5 h-5 text-blue-600" /> :
                 <Target className="w-5 h-5 text-blue-600" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {node.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Level {level + 1} • {node.resources?.length || 0} resources
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {node.resources && node.resources.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Link className="w-5 h-5 mr-2 text-blue-600" />
                  Learning Resources
                </h3>
                <div className="space-y-3">
                  {node.resources.map((resource, idx) => (
                    <motion.a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 group"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                          {resource.url}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 ml-3" />
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {node.children && node.children.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Subtopics ({node.children.length})
                </h3>
                <div className="space-y-2">
                  {node.children.map((child, idx) => (
                    <div
                      key={idx}
                      className="flex items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {typeof child === "string" ? child : child.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main MindMap Component
const MindMap = ({ data }) => {
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isCopying, setIsCopying] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [viewMode, setViewMode] = useState('hierarchical');

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
      
      // Add header
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246);
      doc.text(title, 20, 30);

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 120);
      doc.text(`Generated on ${date} • ${countMainConcepts} Main Concepts`, 20, 40);

      // Add content recursively
      let yPosition = 60;
      if (data.subtopics) {
        data.subtopics.forEach((subtopic, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.text(`${index + 1}. ${subtopic.title}`, 20, yPosition);
          yPosition += 15;

          if (subtopic.resources) {
            subtopic.resources.forEach((resource) => {
              if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
              }
              doc.setFontSize(10);
              doc.setTextColor(30, 120, 200);
              doc.text(`   • ${resource.title}`, 25, yPosition);
              yPosition += 8;
            });
          }
          yPosition += 10;
        });
      }

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("Generated by Maplify • Built by Techlead-ANKAN", 
          doc.internal.pageSize.getWidth() / 2, 285, null, null, "center");
      }

      const filename = `mindmap_${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(filename);

      setStatus({ message: "PDF downloaded successfully!", type: "success" });
    } catch (err) {
      setStatus({ message: "Failed to generate PDF", type: "error" });
    } finally {
      setIsGeneratingPdf(false);
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div 
        className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {data.topic}
              </h1>
              <div className="flex items-center mt-1 space-x-4">
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <Target className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{countMainConcepts} Main Concepts</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={copyRawData}
              disabled={isCopying}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              {isCopying ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>Copy JSON</span>
            </Button>
            
            <Button
              onClick={downloadPDF}
              disabled={isGeneratingPdf}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              {isGeneratingPdf ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Download className="w-4 h-4" />
                </motion.div>
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Export PDF</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Status Message */}
      <AnimatePresence>
        {status.message && (
          <motion.div
            className={cn(
              "mb-6 p-4 rounded-xl flex items-center space-x-3",
              status.type === "success" && "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700",
              status.type === "error" && "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700",
              status.type === "info" && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {status.type === "success" && <Check className="w-5 h-5" />}
            {status.type === "error" && <X className="w-5 h-5" />}
            {status.type === "info" && <Sparkles className="w-5 h-5" />}
            <span className="font-medium">{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mind Map Content */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {data.subtopics ? (
          <>
            {/* Root Node */}
            <MindMapNodeContainer 
              node={{ title: data.topic, children: data.subtopics }}
              level={0}
            />
            
            {/* Learning Path Summary */}
            <motion.div 
              className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  🎯 Your Learning Journey Awaits
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Explore each concept by clicking on the nodes above. Each section contains curated resources and structured subtopics to guide your learning path.
                </p>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No roadmap generated
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try a different topic or check the console for errors
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MindMap;