import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Brain, Sparkles, Download, Copy, Eye, FileText, Zap, GitBranch } from "lucide-react";
import MindMap from "./components/MindMap.jsx";
import { AuroraBackground } from "./components/ui/aurora-background.jsx";
import { BackgroundBeams } from "./components/ui/background-beams.jsx";
import { FloatingElements } from "./components/ui/floating-elements.jsx";
import { TextGenerateEffect } from "./components/ui/text-generate-effect.jsx";
import { Button } from "./components/ui/button.jsx";
import { Input } from "./components/ui/input.jsx";
import { cn } from "./lib/utils.js";

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
        setMindMapData(data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Mind Maps",
      description: "Generate comprehensive learning roadmaps using advanced AI technology"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Generation",
      description: "Create detailed mind maps in seconds, not hours"
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Hierarchical Structure",
      description: "Organized content with clear progression and connections"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <FloatingElements />
      
      {/* Header */}
      <motion.header 
        className="relative z-10 border-b border-slate-200/50 dark:border-slate-700/50 glass"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Maplify
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">AI Learning Roadmaps</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                Beta
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10">
        {/* Hero Section */}
        {!mindMapData && (
          <motion.section 
            className="relative py-20 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <TextGenerateEffect 
                  words="Transform Any Topic Into Visual Learning Roadmaps"
                  className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                />
              </motion.div>
              
              <motion.p 
                className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Generate comprehensive, AI-powered mind maps that break down complex topics into 
                structured learning paths with resources and actionable insights.
              </motion.p>

              {/* Search Form */}
              <motion.form 
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto mb-16"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter any topic (e.g., Machine Learning, Web Development, Data Science...)"
                    className="pl-12 pr-32 h-14 text-lg glass border-slate-200/50 dark:border-slate-700/50"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <Button
                      type="submit"
                      disabled={isLoading || !topic.trim()}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.form>

              {/* Features Grid */}
              <motion.div 
                className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group p-6 rounded-2xl glass border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl border border-slate-200/50 dark:border-slate-700/50"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Crafting Your Knowledge Map
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Our AI is analyzing your topic and creating a comprehensive learning roadmap...
                </p>
                <div className="flex justify-center">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="max-w-2xl mx-auto px-4 py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mind Map Display */}
        <AnimatePresence>
          {mindMapData && (
            <motion.div 
              className="px-4 sm:px-6 lg:px-8 pb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="max-w-7xl mx-auto">
                <MindMap data={mindMapData} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 border-t border-slate-200/50 dark:border-slate-700/50 glass mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Maplify
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Transform Learning into Insight • Built with ❤️ by{" "}
              <a 
                href="https://portfolio-ankan.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Techlead-ANKAN
              </a>
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://portfolio-ankan.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Portfolio
              </a>
              <a
                href="https://github.com/Techlead-ANKAN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/ankan-maity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;