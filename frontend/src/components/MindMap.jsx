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







import React from "react";
import "./MindMap.css";

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
  if (!data) return null;
  
  return (
    <div className="mindmap-container">
      <div className="mindmap-header">
        <h2 className="mindmap-title">{data.topic}</h2>
        <div className="mindmap-stats">
          {data.subtopics && (
            <span>{data.subtopics.length} Main Concepts</span>
          )}
        </div>
      </div>
      
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