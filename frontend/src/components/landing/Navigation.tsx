'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Navigation = () => {
  return (
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
          <Image 
            src="/logo.png" 
            alt="Resume Forge Logo" 
            width={44} 
            height={44} 
            className="rounded-xl shadow-lg shadow-cyan-500/50"
          />
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
  );
};
