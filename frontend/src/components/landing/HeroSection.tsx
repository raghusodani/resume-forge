'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-10 leading-none tracking-tight"
              style={{
                transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
              }}
            >
              <span className="block bg-gradient-to-b from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-2xl">
                Forge Your
              </span>
              <motion.span 
                className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% auto',
                }}
              >
                Dream Career
              </motion.span>
            </motion.h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-4xl text-gray-300 mb-16 leading-relaxed font-light"
          >
            Transform your resume with AI-powered precision.
            <br />
            <span className="text-cyan-400 font-medium">Stand out. Get hired. Win.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24"
          >
            <Link href="/login">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                {/* Subtle Glow Effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-orange-600/30 via-amber-600/30 to-yellow-600/30 rounded-2xl blur-lg opacity-40 group-hover:opacity-70"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-orange-700 via-amber-700 to-yellow-700 hover:from-orange-600 hover:via-amber-500 hover:to-yellow-500 shadow-xl shadow-orange-500/30 text-2xl px-16 py-10 rounded-2xl font-bold overflow-hidden group transition-all duration-300"
                  style={{
                    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  {/* Gentle Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 2,
                    }}
                  />
                  
                  {/* Hover Color Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-amber-400/0 to-orange-400/0 group-hover:from-yellow-400/20 group-hover:via-amber-400/20 group-hover:to-orange-400/20"
                    transition={{
                      duration: 0.3,
                    }}
                  />

                  <span className="relative z-10 flex items-center gap-3">
                    {/* Animated Hammer */}
                    <motion.svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:stroke-white transition-all"
                      animate={{
                        rotate: [0, -25, 0, -25, 0],
                        y: [0, -3, 0, -3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
                      <path d="M17.64 15 22 10.64" />
                      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
                    </motion.svg>
                    Start Forging 
                    <motion.div
                      animate={{
                        x: [0, 5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="w-7 h-7 group-hover:scale-110 transition-transform" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
