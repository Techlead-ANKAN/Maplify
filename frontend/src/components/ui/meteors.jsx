import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const MeteorEffect = ({ number = 20, className, ...props }) => {
  const meteors = new Array(number).fill(true);
  
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} {...props}>
      {meteors.map((meteor, idx) => (
        <span
          key={idx}
          className={cn(
            "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent"
          )}
          style={{
            top: Math.floor(Math.random() * (0 - -400) + -400) + "px",
            left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        />
      ))}
    </div>
  );
};