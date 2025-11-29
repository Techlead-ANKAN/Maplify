import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  ExternalLink, 
  FileText, 
  Zap,
  Brain,
  Target,
  BookOpen,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card-hover-effect";
import { cn } from "../lib/utils";

const iconMap = {
  0: Brain,
  1: Target,
  2: BookOpen,
  3: FileText,
  default: Zap
};

const MindMapNode = ({ node, level = 0, index = 0 }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const [hovering, setHovering] = useState(false);

  if (!node) return null;

  const isRoot = level === 0;
  const hasChildren = node.children && node.children.length > 0;
  const IconComponent = iconMap[level] || iconMap.default;

  const nodeVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const childrenVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "relative",
        isRoot ? "mb-8" : "mb-4",
        level > 0 && "ml-6"
      )}
      variants={nodeVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
    >
      {/* Connection line for non-root nodes */}
      {level > 0 && (
        <div className="absolute -left-6 top-4 w-6 h-px bg-gradient-to-r from-white/20 to-transparent" />
      )}
      
      {/* Node content */}
      <div
        className={cn(
          "relative group rounded-2xl border transition-all duration-300",
          isRoot 
            ? "border-white/20 bg-white/5 p-6" 
            : "border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.05]",
          hovering && "border-white/30 shadow-lg shadow-white/10"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div 
            className={cn(
              "flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-300",
              isRoot 
                ? "w-12 h-12 bg-white text-black" 
                : "w-8 h-8 bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white"
            )}
          >
            <IconComponent className={isRoot ? "w-6 h-6" : "w-4 h-4"} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 
              className={cn(
                "font-semibold text-white mb-2 leading-tight",
                isRoot ? "text-2xl" : level === 1 ? "text-lg" : "text-base"
              )}
            >
              {node.title}
            </h3>

            {node.description && (
              <p className="text-white/60 text-sm leading-relaxed mb-3">
                {node.description}
              </p>
            )}

            {/* Resources */}
            {node.resources && node.resources.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider font-medium">
                  <LinkIcon className="w-3 h-3" />
                  Resources
                </div>
                <div className="grid gap-2">
                  {node.resources.slice(0, 3).map((resource, idx) => (
                    <motion.a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
                      whileHover={{ x: 4 }}
                    >
                      <ExternalLink className="w-3 h-3 text-white/40 group-hover/link:text-white/70 flex-shrink-0" />
                      <span className="text-white/70 text-sm group-hover/link:text-white truncate">
                        {resource.title}
                      </span>
                    </motion.a>
                  ))}
                  {node.resources.length > 3 && (
                    <div className="text-white/40 text-xs text-center py-1">
                      +{node.resources.length - 3} more resources
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Expand/Collapse button */}
          {hasChildren && (
            <motion.button
              onClick={() => setExpanded(!expanded)}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-3 h-3" />
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            variants={childrenVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="mt-4 space-y-3 overflow-hidden"
          >
            {node.children.map((child, idx) => (
              <MindMapNode
                key={idx}
                node={typeof child === "string" ? { title: child } : child}
                level={level + 1}
                index={idx}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ModernMindMap = ({ data }) => {
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  if (!data) return null;

  const handleCopyData = async () => {
    try {
      setIsLoading(true);
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setStatus({ message: "Data copied to clipboard!", type: "success" });
    } catch (err) {
      setStatus({ message: "Failed to copy data", type: "error" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    }
  };



  const countNodes = (nodes) => {
    if (!nodes) return 0;
    return nodes.reduce((count, node) => {
      return count + 1 + (node.children ? countNodes(node.children) : 0);
    }, 0);
  };

  const totalNodes = countNodes(data.subtopics);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        className="relative mb-8 p-8 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {data.topic}
              </h1>
              <div className="flex items-center gap-6 text-white/60">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm">{totalNodes} concepts</span>
                </div>
                {data.subtopics && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">{data.subtopics.length} main topics</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleCopyData}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Data
              </Button>
            </div>
          </div>

          {/* Status message */}
          <AnimatePresence>
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "mt-4 p-3 rounded-lg text-sm",
                  status.type === "success" && "bg-green-500/10 text-green-400 border border-green-500/20",
                  status.type === "error" && "bg-red-500/10 text-red-400 border border-red-500/20",
                  status.type === "info" && "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                )}
              >
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mind Map Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="space-y-6"
      >
        {data.subtopics && data.subtopics.map((topic, index) => (
          <MindMapNode
            key={index}
            node={topic}
            level={0}
            index={index}
          />
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm">
          <Zap className="w-3 h-3" />
          Generated by Maplify AI
        </div>
      </motion.div>
    </div>
  );
};

export default ModernMindMap;