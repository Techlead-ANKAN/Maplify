import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const SparklesCore = ({ 
  id, 
  background = "transparent", 
  minSize = 0.4, 
  maxSize = 1, 
  particleDensity = 1200, 
  className,
  particleColor = "#FFF"
}) => {
  const generateSparkles = () => {
    const sparkles = [];
    for (let i = 0; i < particleDensity; i++) {
      sparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: Math.random() * 3 + 1,
        delay: Math.random() * 2,
      });
    }
    return sparkles;
  };

  const sparkles = generateSparkles();

  return (
    <div className={cn("relative h-full w-full", className)}>
      <svg
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100%" height="100%" fill={background} />
        {sparkles.map((sparkle) => (
          <motion.circle
            key={sparkle.id}
            cx={sparkle.x}
            cy={sparkle.y}
            r={sparkle.size}
            fill={particleColor}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1, 0],
            }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};
