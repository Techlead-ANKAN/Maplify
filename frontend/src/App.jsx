import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Globe,
  Zap,
  Target,
  BookOpen,
  Star,
  ChevronDown
} from "lucide-react";
import ModernMindMap from "./components/ModernMindMap.jsx";
import { Spotlight } from "./components/ui/spotlight.jsx";
import { GridBackground } from "./components/ui/background-patterns.jsx";
import { MeteorEffect } from "./components/ui/meteors.jsx";
import { TextGenerateEffect } from "./components/ui/text-generate-effect.jsx";
import { HoverEffect } from "./components/ui/card-hover-effect.jsx";
import { MobileNav } from "./components/ui/mobile-nav.jsx";
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

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limit errors specifically
        if (response.status === 429) {
          throw new Error(
            data.message || "API rate limit exceeded. Please wait a moment and try again."
          );
        }
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            data.message || "Invalid API key. Please check your Gemini API configuration."
          );
        }
        throw new Error(data.message || data.error || "Failed to generate mind map");
      }

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
      title: "AI-Powered Generation",
      description: "Advanced artificial intelligence creates comprehensive learning roadmaps tailored to any topic you choose.",
      link: "#"
    },
    {
      title: "Instant Results",
      description: "Generate detailed mind maps in seconds, not hours. Transform complex topics into structured knowledge instantly.",
      link: "#"
    },
    {
      title: "Interactive Learning",
      description: "Navigate through hierarchical content with expandable nodes, resources, and clear progression paths.",
      link: "#"
    },
    {
      title: "Export & Share",
      description: "Copy your mind map data to share your learning roadmaps with others and save for future reference.",
      link: "#"
    },
    {
      title: "Resource Integration",
      description: "Each node includes relevant learning resources, articles, and links to enhance your understanding.",
      link: "#"
    },
    {
      title: "Visual Organization",
      description: "Clean, modern interface that makes complex information easy to understand and navigate.",
      link: "#"
    }
  ];

  const stats = [
    { label: "Mind Maps Generated", value: "10K+" },
    { label: "Topics Covered", value: "500+" },
    { label: "Learning Paths", value: "1M+" },
    { label: "Resources Curated", value: "50K+" }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <GridBackground />
      <MeteorEffect number={30} />
      
      {/* Spotlight Effect */}
      <Spotlight
        className="top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Header */}
      <motion.header 
        className="relative z-30 border-b border-white/5"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
                <div className="relative p-3 bg-white text-black rounded-2xl">
                  <Brain className="w-7 h-7" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Maplify
                </h1>
                <p className="text-sm text-white/60">AI Knowledge Mapping</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="hidden md:flex items-center space-x-4 text-white/60">
                <a 
                  href="https://github.com/Techlead-ANKAN" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/ankan-maity" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://portfolio-ankan.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
              <div className="px-3 py-1.5 bg-white/10 border border-white/20 text-white/80 rounded-full text-xs font-medium backdrop-blur-sm">
                Beta
              </div>
              <MobileNav />
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-20">
        {/* Hero Section */}
        {!mindMapData && (
          <motion.section 
            className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="max-w-6xl mx-auto">
              {/* Hero Content */}
              <div className="text-center mb-20">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm mb-8">
                    <Star className="w-4 h-4" />
                    Powered by Advanced AI
                  </div>
                  
                  <TextGenerateEffect 
                    words="Transform Complex Topics Into Visual Learning Journeys"
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                  />
                </motion.div>
                
                <motion.p 
                  className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Generate comprehensive, AI-powered mind maps that break down any subject into structured learning paths with curated resources and actionable insights.
                </motion.p>

                {/* Search Form */}
                <motion.form 
                  onSubmit={handleSubmit}
                  className="max-w-3xl mx-auto mb-16"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm" />
                    <div className="relative flex items-center p-2">
                      <div className="flex items-center pl-4 text-white/40">
                        <Search className="h-6 w-6" />
                      </div>
                      <Input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter any topic (e.g., Machine Learning, Quantum Physics, Web Development...)"
                        className="flex-1 bg-transparent border-0 text-white placeholder-white/40 text-lg px-4 py-4 focus:ring-0 focus:outline-none"
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || !topic.trim()}
                        className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center gap-2"
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
                            Generate
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.form>

                {/* Stats */}
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mb-20"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-white/60 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Features Grid */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Everything You Need to Learn Effectively
                  </h2>
                  <p className="text-white/60 text-lg">
                    Powerful features designed to accelerate your learning journey
                  </p>
                </div>
                
                <HoverEffect items={features} className="max-w-5xl mx-auto" />
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white/10 border border-white/20 rounded-3xl p-8 text-center max-w-md mx-4 backdrop-blur-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent" />
                  <Brain className="w-10 h-10 text-white relative z-10" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  Crafting Your Knowledge Map
                </h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  Our AI is analyzing your topic and creating a comprehensive learning roadmap with curated resources...
                </p>
                
                <div className="flex justify-center items-center space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white/60 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1], 
                        opacity: [0.4, 1, 0.4],
                        y: [0, -8, 0]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="max-w-2xl mx-auto px-4 py-8 relative z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center backdrop-blur-sm">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-red-100 mb-3">
                  Something went wrong
                </h3>
                <p className="text-red-300/80 mb-4">{error}</p>
                <Button
                  onClick={() => setError("")}
                  variant="outline"
                  className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mind Map Display */}
        <AnimatePresence>
          {mindMapData && (
            <motion.div 
              className="px-4 sm:px-6 lg:px-8 pb-20 relative z-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="max-w-7xl mx-auto">
                {/* Back button */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      setMindMapData(null);
                      setTopic("");
                    }}
                    variant="outline"
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
                  >
                    <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
                    Generate Another Map
                  </Button>
                </motion.div>
                
                <ModernMindMap data={mindMapData} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer 
        className="relative z-20 border-t border-white/5 mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-lg" />
                <div className="relative w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
              </div>
              <span className="text-2xl font-bold text-white">
                Maplify
              </span>
            </div>
            
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Transform complex knowledge into visual learning journeys. Built with passion for learners worldwide.
            </p>
            
            <div className="flex justify-center items-center space-x-8 mb-8">
              <a
                href="https://portfolio-ankan.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                <span>Portfolio</span>
              </a>
              <a
                href="https://github.com/Techlead-ANKAN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/ankan-maity"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
            
            <div className="border-t border-white/10 pt-8">
              <p className="text-white/40 text-sm">
                © 2024 Maplify. Created by{" "}
                <a 
                  href="https://portfolio-ankan.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white font-medium transition-colors"
                >
                  Techlead-ANKAN
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;