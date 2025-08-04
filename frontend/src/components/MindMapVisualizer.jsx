"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import * as d3 from "d3"

const MindMapVisualizer = ({ data }) => {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Color contrast utility function
  const getContrastColor = useCallback((backgroundColor) => {
    // Convert hex to RGB
    const hex = backgroundColor.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return white for dark backgrounds, dark for light backgrounds
    return luminance > 0.5 ? "#1f2937" : "#ffffff"
  }, [])

  // Improved collision detection and positioning
  const preventNodeOverlap = useCallback((nodes, width, height) => {
    const iterations = 50
    const padding = 30

    for (let i = 0; i < iterations; i++) {
      let moved = false

      for (let j = 0; j < nodes.length; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          const nodeA = nodes[j]
          const nodeB = nodes[k]

          const dx = nodeB.x - nodeA.x
          const dy = nodeB.y - nodeA.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const minDistance = padding + (nodeA.level === 0 ? 40 : nodeA.level === 1 ? 30 : 20)

          if (distance < minDistance && distance > 0) {
            const angle = Math.atan2(dy, dx)
            const targetDistance = minDistance
            const factor = (targetDistance - distance) / distance

            const moveX = dx * factor * 0.5
            const moveY = dy * factor * 0.5

            // Move nodes apart
            nodeB.x += moveX
            nodeB.y += moveY
            nodeA.x -= moveX
            nodeA.y -= moveY

            // Keep nodes within bounds
            nodeA.x = Math.max(50, Math.min(width - 50, nodeA.x))
            nodeA.y = Math.max(50, Math.min(height - 50, nodeA.y))
            nodeB.x = Math.max(50, Math.min(width - 50, nodeB.x))
            nodeB.y = Math.max(50, Math.min(height - 50, nodeB.y))

            moved = true
          }
        }
      }

      if (!moved) break
    }

    return nodes
  }, [])

  // Handle responsive dimensions
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const width = Math.max(320, rect.width)
        const height = Math.max(400, Math.min(700, width * 0.75))
        setDimensions({ width, height })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!data || !data.subtopics || !svgRef.current) return

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
    const { width, height } = dimensions
    const centerX = width / 2
    const centerY = height / 2

    // Create main group
    const g = svg.append("g")

    // Prepare data - create a hierarchy with better spacing
    const nodes = []
    const links = []

    // Add root node
    const rootNode = {
      id: "root",
      name: data.topic,
      level: 0,
      x: centerX,
      y: centerY,
      fixed: true,
      color: "#6366f1",
    }
    nodes.push(rootNode)

    // Add main topic nodes in a circle around root with better spacing
    const mainTopics = data.subtopics.slice(0, 8)
    const angleStep = (2 * Math.PI) / mainTopics.length
    const mainRadius = Math.min(width, height) * 0.25

    mainTopics.forEach((topic, i) => {
      const angle = i * angleStep
      const x = centerX + Math.cos(angle) * mainRadius
      const y = centerY + Math.sin(angle) * mainRadius

      const node = {
        id: `topic-${i}`,
        name: topic.title,
        level: 1,
        x: x,
        y: y,
        data: topic,
        fixed: true,
        color: "#8b5cf6",
      }
      nodes.push(node)

      // Add link from root to this topic
      links.push({
        source: rootNode,
        target: node,
      })

      // Add subtopics with improved positioning
      if (topic.children && topic.children.length > 0) {
        const subTopics = topic.children.slice(0, 4)
        const subRadius = Math.min(width, height) * 0.15
        const subAngleSpread = Math.PI / 3 // 60 degrees spread
        const subAngleStart = angle - subAngleSpread / 2

        subTopics.forEach((subTopic, j) => {
          const subAngle = subAngleStart + (j / (subTopics.length - 1 || 1)) * subAngleSpread
          const subX = x + Math.cos(subAngle) * subRadius
          const subY = y + Math.sin(subAngle) * subRadius

          const subNode = {
            id: `sub-${i}-${j}`,
            name: typeof subTopic === "string" ? subTopic : subTopic.title,
            level: 2,
            x: subX,
            y: subY,
            data: subTopic,
            fixed: true,
            color: "#06b6d4",
          }
          nodes.push(subNode)

          // Add link from topic to subtopic
          links.push({
            source: node,
            target: subNode,
          })
        })
      }
    })

    // Apply collision detection to prevent overlapping
    const adjustedNodes = preventNodeOverlap(nodes, width, height)

    // Create gradient definitions for enhanced visuals
    const defs = svg.append("defs")

    // Create gradients for nodes
    const gradients = ["root", "topic", "subtopic"]
    const colors = [
      { start: "#6366f1", end: "#4f46e5" },
      { start: "#8b5cf6", end: "#7c3aed" },
      { start: "#06b6d4", end: "#0891b2" },
    ]

    gradients.forEach((type, idx) => {
      const gradient = defs
        .append("radialGradient")
        .attr("id", `gradient-${type}`)
        .attr("cx", "30%")
        .attr("cy", "30%")
        .attr("r", "70%")

      gradient.append("stop").attr("offset", "0%").attr("stop-color", colors[idx].start).attr("stop-opacity", 1)

      gradient.append("stop").attr("offset", "100%").attr("stop-color", colors[idx].end).attr("stop-opacity", 1)
    })

    // Add glow filter
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")

    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur")

    const feMerge = filter.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // Draw enhanced links with gradients
    const linkElements = g
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", "url(#link-gradient)")
      .attr("stroke-width", Math.max(2, width / 300))
      .attr("opacity", 0.6)
      .attr("stroke-linecap", "round")

    // Add link gradient
    const linkGradient = defs.append("linearGradient").attr("id", "link-gradient")

    linkGradient.append("stop").attr("offset", "0%").attr("stop-color", "#94a3b8").attr("stop-opacity", 0.8)

    linkGradient.append("stop").attr("offset", "100%").attr("stop-color", "#cbd5e1").attr("stop-opacity", 0.4)

    // Draw enhanced nodes
    const nodeElements = g
      .selectAll(".node")
      .data(adjustedNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .style("cursor", "pointer")

    // Add node shadows
    nodeElements
      .append("circle")
      .attr("class", "node-shadow")
      .attr("r", (d) => {
        const baseRadius = Math.max(10, width / 45)
        return baseRadius * (d.level === 0 ? 1.8 : d.level === 1 ? 1.4 : 1.1) + 2
      })
      .attr("fill", "rgba(0, 0, 0, 0.1)")
      .attr("cx", 2)
      .attr("cy", 2)

    // Add main node circles with gradients
    const baseRadius = Math.max(10, width / 45)
    nodeElements
      .append("circle")
      .attr("class", "node-circle")
      .attr("r", (d) => {
        return baseRadius * (d.level === 0 ? 1.8 : d.level === 1 ? 1.4 : 1.1)
      })
      .attr("fill", (d) => {
        if (d.level === 0) return "url(#gradient-root)"
        if (d.level === 1) return "url(#gradient-topic)"
        return "url(#gradient-subtopic)"
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", Math.max(2, width / 200))
      .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.15))")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d) => {
            const multiplier = d.level === 0 ? 2.1 : d.level === 1 ? 1.6 : 1.3
            return baseRadius * multiplier
          })
          .style("filter", "url(#glow)")

        // Highlight connected links
        linkElements
          .filter((link) => link.source === d || link.target === d)
          .transition()
          .duration(200)
          .attr("stroke-width", Math.max(4, width / 200))
          .attr("opacity", 1)
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d) => {
            const multiplier = d.level === 0 ? 1.8 : d.level === 1 ? 1.4 : 1.1
            return baseRadius * multiplier
          })
          .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.15))")

        // Reset links
        linkElements
          .transition()
          .duration(200)
          .attr("stroke-width", Math.max(2, width / 300))
          .attr("opacity", 0.6)
      })
      .on("click", (event, d) => {
        setSelectedNode(d)
      })

    // Add text labels with better contrast
    const baseFontSize = Math.max(11, width / 55)
    nodeElements
      .append("text")
      .text((d) => {
        const maxLength = width < 600 ? 8 : d.level === 0 ? 15 : d.level === 1 ? 12 : 10
        return d.name.length > maxLength ? d.name.substring(0, maxLength) + "..." : d.name
      })
      .attr("text-anchor", "middle")
      .attr("dy", (d) => {
        const offset = baseRadius * (d.level === 0 ? 2.8 : d.level === 1 ? 2.4 : 2.2)
        return offset
      })
      .attr("font-family", "system-ui, -apple-system, sans-serif")
      .attr("font-size", (d) => {
        const multiplier = d.level === 0 ? 1.3 : d.level === 1 ? 1.1 : 1
        return `${baseFontSize * multiplier}px`
      })
      .attr("font-weight", (d) => (d.level === 0 ? "700" : d.level === 1 ? "600" : "500"))
      .attr("fill", "#ffffff")
      .attr("stroke", "#1f2937")
      .attr("stroke-width", "0.5px")
      .attr("paint-order", "stroke fill")
      .style("pointer-events", "none")
      .style("user-select", "none")

    // Add zoom and pan with constraints
    const zoom = d3
      .zoom()
      .scaleExtent([0.4, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom)

    // Add double-click to reset zoom
    svg.on("dblclick.zoom", () => {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity)
    })
  }, [data, dimensions, preventNodeOverlap, getContrastColor])

  if (!data || !data.subtopics) {
    return (
      <div className="mindmap-container">
        <div className="mindmap-empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">🧠</div>
            <h3 className="empty-state-title">No data to visualize</h3>
            <p className="empty-state-description">Generate a mind map first</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mindmap-container" ref={containerRef}>
      <div className="mindmap-wrapper">
        <div className="mindmap-header">
          <div className="header-content">
            <h3 className="mindmap-title">Visual Mind Map</h3>
            <div className="mindmap-controls">
              <span className="control-hint">
                Scroll to zoom • Drag to pan • Double-click to reset • Click nodes for details
              </span>
            </div>
          </div>
        </div>

        <div className="mindmap-visualization">
          <div className="grid-background"></div>
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="mindmap-svg"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          />

          {selectedNode && (
            <div className="node-details-overlay" onClick={() => setSelectedNode(null)}>
              <div className="node-details-panel" onClick={(e) => e.stopPropagation()}>
                <div className="panel-header">
                  <div className="header-left">
                    <div className={`level-badge level-${selectedNode.level}`}>
                      {selectedNode.level === 0 ? "Root" : selectedNode.level === 1 ? "Topic" : "Subtopic"}
                    </div>
                    <h2 className="node-title">{selectedNode.name}</h2>
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="close-btn" aria-label="Close details panel">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M15 5L5 15M5 5L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="panel-content">
                  {selectedNode.data && selectedNode.data.resources && selectedNode.data.resources.length > 0 && (
                    <div className="content-section">
                      <div className="section-header">
                        <div className="section-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <h3 className="section-title">Resources</h3>
                        <div className="section-count">{selectedNode.data.resources.length}</div>
                      </div>
                      <div className="resources-grid">
                        {selectedNode.data.resources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-card"
                          >
                            <div className="resource-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M18 13V6A2 2 0 0 0 16 4H8A2 2 0 0 0 6 6V13"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M18 13H22L20 20H4L2 13H6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <div className="resource-content">
                              <span className="resource-title">{resource.title}</span>
                              <div className="external-indicator">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M7 17L17 7M17 7H7M17 7V17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedNode.data && selectedNode.data.children && selectedNode.data.children.length > 0 && (
                    <div className="content-section">
                      <div className="section-header">
                        <div className="section-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M22 12H18L15 21L9 3L6 12H2"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <h3 className="section-title">Subtopics</h3>
                        <div className="section-count">{selectedNode.data.children.length}</div>
                      </div>
                      <div className="subtopics-list">
                        {selectedNode.data.children.slice(0, 6).map((child, idx) => (
                          <div key={idx} className="subtopic-item">
                            <div className="subtopic-marker"></div>
                            <span className="subtopic-text">{typeof child === "string" ? child : child.title}</span>
                          </div>
                        ))}
                        {selectedNode.data.children.length > 6 && (
                          <div className="subtopic-item more-indicator">
                            <div className="subtopic-marker more"></div>
                            <span className="subtopic-text">+{selectedNode.data.children.length - 6} more items</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(!selectedNode.data ||
                    (!selectedNode.data.resources?.length && !selectedNode.data.children?.length)) && (
                    <div className="empty-content">
                      <div className="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                          <path
                            d="M12 6V12L16 14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <h4 className="empty-title">No additional details</h4>
                      <p className="empty-description">
                        This node doesn't have any resources or subtopics associated with it yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MindMapVisualizer
