import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const TextGenerateEffect = ({ words, className, filter = true, duration = 0.5 }) => {
  const wordsArray = words.split(" ");
  
  const renderWords = () => {
    return (
      <motion.div>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-black opacity-0 dark:text-white"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: duration,
                delay: idx * 0.1,
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="leading-snug tracking-wide text-black dark:text-white">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
