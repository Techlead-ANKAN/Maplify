import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight,
  Copy, 
  ExternalLink, 
  Brain,
  Target,
  BookOpen,
  FileText,
  CheckCircle2,
  Circle
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const iconMap = {
  0: Brain,
  1: Target,
  2: BookOpen,
  3: FileText
};

const MindMapNode = ({ node, level = 0, index = 0, parentIndex = "" }) => {
  const [expanded, setExpanded] = useState(level < 2);

  if (!node) return null;

  const isRoot = level === 0;
  const hasChildren = node.children && node.children.length > 0;
  const IconComponent = iconMap[level] || Circle;
  const nodeNumber = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        "relative",
        !isRoot && "ml-8"
      )}
    >
      {/* Main node card */}
      <div
        className={cn(
          "group relative rounded-xl border overflow-hidden transition-all duration-300",
          isRoot 
            ? "border-white/30 bg-gradient-to-br from-white/10 to-white/5 p-5 mb-6 shadow-xl" 
            : level === 1
            ? "border-white/20 bg-white/5 p-4 mb-4 hover:bg-white/[0.08] hover:border-white/30"
            : level === 2
            ? "border-white/15 bg-white/[0.03] p-3 mb-3 hover:bg-white/[0.06] hover:border-white/25"
            : "border-white/10 bg-white/[0.02] p-2.5 mb-2 hover:bg-white/[0.04] hover:border-white/20"
        )}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex items-start gap-3">
          {/* Number badge */}
          {!isRoot && (
            <div 
              className={cn(
                "flex-shrink-0 flex items-center justify-center rounded-lg font-bold transition-all duration-300",
                level === 1 
                  ? "w-8 h-8 bg-blue-500/20 text-blue-300 text-sm" 
                  : level === 2
                  ? "w-7 h-7 bg-purple-500/20 text-purple-300 text-xs"
                  : "w-6 h-6 bg-pink-500/20 text-pink-300 text-xs"
              )}
            >
              {nodeNumber}
            </div>
          )}

          {/* Icon for root */}
          {isRoot && (
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg">
              <IconComponent className="w-6 h-6" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {!isRoot && level <= 2 && (
                <IconComponent className={cn(
                  "flex-shrink-0",
                  level === 1 ? "w-4 h-4 text-blue-400" : "w-3.5 h-3.5 text-purple-400"
                )} />
              )}
              <h3 
                className={cn(
                  "font-semibold text-white leading-tight",
                  isRoot 
                    ? "text-2xl" 
                    : level === 1 
                    ? "text-lg" 
                    : level === 2
                    ? "text-base"
                    : "text-sm"
                )}
              >
                {node.title}
              </h3>
            </div>

            {/* Resources - Compact inline style */}
            {node.resources && node.resources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {node.resources.slice(0, 2).map((resource, idx) => (
                  <motion.a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-200 text-xs text-white/70 hover:text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="max-w-[150px] truncate">{resource.title}</span>
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Expand/Collapse */}
          {hasChildren && (
            <motion.button
              onClick={() => setExpanded(!expanded)}
              className={cn(
                "flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-200",
                level === 1
                  ? "w-7 h-7 bg-white/10 hover:bg-white/20"
                  : "w-6 h-6 bg-white/5 hover:bg-white/15",
                "text-white/60 hover:text-white"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className={level === 1 ? "w-4 h-4" : "w-3 h-3"} />
              </motion.div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Children with cleaner spacing */}
      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2 overflow-hidden"
          >
            {node.children.map((child, idx) => (
              <MindMapNode
                key={idx}
                node={typeof child === "string" ? { title: child } : child}
                level={level + 1}
                index={idx}
                parentIndex={level === 0 ? `${index + 1}` : nodeNumber}
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
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Compact Header */}
      <motion.div 
        className="relative mb-8 p-6 rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {data.topic}
            </h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" />
                {totalNodes} concepts
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                {data.subtopics?.length || 0} topics
              </span>
            </div>
          </div>

          <Button
            onClick={handleCopyData}
            disabled={isLoading}
            size="sm"
            className="bg-white text-black hover:bg-white/90 font-medium"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            Copy
          </Button>
        </div>

        {/* Status */}
        <AnimatePresence>
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "mt-3 p-2.5 rounded-lg text-xs font-medium",
                status.type === "success" && "bg-green-500/10 text-green-400 border border-green-500/20",
                status.type === "error" && "bg-red-500/10 text-red-400 border border-red-500/20",
                status.type === "info" && "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              )}
            >
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Clean roadmap layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-5"
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

      {/* Minimal footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-10 py-6 text-center border-t border-white/10"
      >
        <p className="text-white/40 text-xs">
          Powered by Maplify AI • {totalNodes} learning concepts
        </p>
      </motion.div>
    </div>
  );
};

export default ModernMindMap;