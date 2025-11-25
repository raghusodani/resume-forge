'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, Sparkles, Zap, Target, FileText, Heart, Mail, Github, Linkedin } from 'lucide-react';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-cyan-500/30">
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.15),transparent_50%)]" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px]"
          animate={{
            x: [0, 150, 0],
            y: [0, -150, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/25 rounded-full blur-[120px]"
          animate={{
            x: [0, -150, 0],
            y: [0, 150, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]"
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-cyan-500/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-11 h-11 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              ResumeForge
            </span>
          </motion.div>
          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/login">
              <Button variant="ghost" size="md" className="text-white hover:bg-white/10 text-base">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button 
                size="md" 
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-lg shadow-cyan-500/40 text-base"
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
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
                          ease: "easeInOut",
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

            {/* Floating Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-10 h-10" />,
                  title: "Lightning Fast",
                  description: "AI-powered resume tailoring in seconds",
                  color: "from-yellow-500 to-orange-500",
                  delay: 0.5
                },
                {
                  icon: <Target className="w-10 h-10" />,
                  title: "Precision Targeting",
                  description: "Match job requirements perfectly",
                  color: "from-blue-500 to-cyan-500",
                  delay: 0.6
                },
                {
                  icon: <FileText className="w-10 h-10" />,
                  title: "Pro Output",
                  description: "Stunning PDF resumes that impress",
                  color: "from-purple-500 to-pink-500",
                  delay: 0.7
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: feature.delay, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  style={{
                    transform: index === 1 
                      ? `translateY(${y1}px)` 
                      : index === 2 
                        ? `translateY(${y2}px)` 
                        : 'none'
                  }}
                >
                  <Card className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 p-8 h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <motion.div 
                      className={`mb-6 text-transparent bg-gradient-to-br ${feature.color} bg-clip-text`}
                      animate={{
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-lg">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-950/50 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ResumeForge
                </span>
              </div>
              <p className="text-gray-400 mb-6 text-lg">
                AI-powered resume crafting for career success
              </p>
              <div className="flex items-center gap-2 text-gray-400">
                Crafted by Raghu with <Heart className="w-5 h-5 text-red-400 mx-1 fill-red-400 animate-pulse" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors text-lg">Dashboard</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors text-lg">Sign In</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Get in Touch</h3>
              <Link href="mailto:contact@resumeforge.ai">
                <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white mb-6 text-lg py-6">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
              <div className="flex gap-4">
                <motion.a 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Github className="w-6 h-6" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 text-center text-gray-500">
            © 2024 ResumeForge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
