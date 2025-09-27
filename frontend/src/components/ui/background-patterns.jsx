import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const GridBackground = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full bg-black bg-grid-white/[0.02] bg-grid-16",
        className
      )}
      {...props}
    />
  );
};

export const DotBackground = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full bg-black bg-dot-white/[0.2]",
        className
      )}
      {...props}
    />
  );
};

export const PatternBackground = ({ className, children, ...props }) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute inset-0 h-full w-full bg-black",
          "[background-image:radial-gradient(88px_at_40px_40px,transparent_40%,white_40%),radial-gradient(88px_at_40px_40px,transparent_40%,white_40%)]",
          "[background-size:80px_80px] [background-position:0_0,40px_40px]",
          "[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_100%)]",
          className
        )}
        {...props}
      />
      {children}
    </div>
  );
};