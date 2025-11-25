'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Sparkles, Heart, Mail, Github, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
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
  );
};
