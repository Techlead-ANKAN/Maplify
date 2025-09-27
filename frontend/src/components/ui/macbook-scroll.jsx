import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const MacbookScroll = ({ src, showGradient, title, badge, ...props }) => {
  return (
    <div
      className={cn(
        "min-h-screen w-full bg-black relative overflow-hidden",
        props.className
      )}
    >
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      </div>
      
      <div className="relative z-20 py-10 md:py-40">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            {badge && (
              <div className="mb-8 flex justify-center">
                <div className="rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-1.5 text-sm text-neutral-200">
                  {badge}
                </div>
              </div>
            )}
            
            {title && (
              <h1 className="text-center text-4xl font-bold text-white md:text-7xl">
                {title}
              </h1>
            )}
            
            <div className="relative mx-auto mt-16 h-full max-w-4xl">
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-neutral-700/20 via-neutral-900/20 to-neutral-700/20 blur-xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-neutral-800 bg-black/50 p-8 backdrop-blur-sm">
                  {src && (
                    <img
                      src={src}
                      alt="Preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  )}
                  {props.children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showGradient && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full bg-gradient-to-t from-black via-black to-transparent" />
      )}
    </div>
  );
};