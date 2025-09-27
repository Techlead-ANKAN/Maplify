import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Brain, Github, Linkedin, Globe } from "lucide-react";
import { cn } from "../../lib/utils";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Portfolio",
      href: "https://portfolio-ankan.vercel.app/",
      icon: Globe,
    },
    {
      name: "GitHub",
      href: "https://github.com/Techlead-ANKAN",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/ankan-maity",
      icon: Linkedin,
    },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white/60 hover:text-white transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              className="fixed top-0 right-0 h-full w-72 bg-black/90 backdrop-blur-xl border-l border-white/10 z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold text-white">Maplify</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </motion.a>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};