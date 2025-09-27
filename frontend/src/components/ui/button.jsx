import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false, 
  children,
  ...props 
}, ref) => {
  const Comp = asChild ? "span" : "button";
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-white text-black hover:bg-white/90 shadow-lg": variant === "default",
            "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
            "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm": variant === "outline",
            "hover:bg-white/5 text-white": variant === "ghost",
            "text-white underline-offset-4 hover:underline": variant === "link",
            "bg-white/10 text-white hover:bg-white/20": variant === "secondary",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3": size === "sm",
            "h-12 px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    </motion.div>
  );
});

Button.displayName = "Button";
