"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SimpleHeroSliderProps {
  images: string[];
  overlayOpacity?: number;
}

export function SimpleHeroSlider({ images, overlayOpacity = 0.6 }: SimpleHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          <img
            src={images[currentIndex]}
            alt="Background"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div 
        className="absolute inset-0 bg-banking-blue" 
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
