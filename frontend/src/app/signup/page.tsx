'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, User, Lock } from 'lucide-react';

const allCompanies = [
  { 
    name: 'Google', 
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    x: '15%',
    y: '20%',
    delay: 0,
    bgColor: 'bg-white'
  },
  { 
    name: 'Microsoft', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    x: '80%',
    y: '15%',
    delay: 1.5,
    bgColor: 'bg-white'
  },
  { 
    name: 'Amazon', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    x: '85%',
    y: '70%',
    delay: 3,
    bgColor: 'bg-white'
  },
  { 
    name: 'Apple', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    x: '10%',
    y: '75%',
    delay: 2,
    bgColor: 'bg-white'
  },
  { 
    name: 'Meta', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    x: '90%',
    y: '40%',
    delay: 4,
    bgColor: 'bg-white'
  },
  { 
    name: 'Netflix', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    x: '12%',
    y: '45%',
    delay: 2.5,
    bgColor: 'bg-black'
  },
  { 
    name: 'Tesla', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg',
    x: '75%',
    y: '85%',
    delay: 1,
    bgColor: 'bg-white'
  },
  { 
    name: 'Spotify', 
    logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png',
    x: '20%',
    y: '90%',
    delay: 3.5,
    bgColor: 'bg-white'
  },
  { 
    name: 'Airbnb', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
    x: '78%',
    y: '55%',
    delay: 0,
    bgColor: 'bg-white'
  },
  { 
    name: 'Uber', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    x: '18%',
    y: '60%',
    delay: 0,
    bgColor: 'bg-white'
  },
  { 
    name: 'Twitter', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
    x: '50%',
    y: '10%',
    delay: 0,
    bgColor: 'bg-white'
  },
  { 
    name: 'Adobe', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg',
    x: '25%',
    y: '30%',
    delay: 0,
    bgColor: 'bg-white'
  },
  { 
    name: 'Intel', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg',
    x: '65%',
    y: '78%',
    delay: 0,
    bgColor: 'bg-white'
  },
];

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCompanies, setVisibleCompanies] = useState(8);
  const [shootingStar, setShootingStar] = useState<number | null>(null);
  const { signup } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCompanies((prev) => {
        if (prev < allCompanies.length) {
          setShootingStar(prev);
          setTimeout(() => setShootingStar(null), 3000);
          return prev + 1;
        }
        return prev;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup(username, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Animated Background with Floating Company "Stars" */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />
        
        {/* Creative Background Text */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none select-none overflow-hidden pl-8">
          <motion.p 
            className="text-[8rem] font-black bg-gradient-to-r from-cyan-400/50 via-blue-400/50 to-purple-400/50 bg-clip-text text-transparent transform rotate-[-90deg] origin-left text-left leading-tight whitespace-nowrap"
            animate={{
              backgroundPosition: ['0%', '100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% auto',
              transformOrigin: 'left top',
            }}
          >
            Start Your Journey Today ✨
          </motion.p>
        </div>

        {/* Shooting Star Effect */}
        <AnimatePresence>
          {shootingStar !== null && (
            <>
              {/* Shooting Star Particle */}
              <motion.div
                className="absolute pointer-events-none z-50"
                initial={{ 
                  left: `calc(${allCompanies[shootingStar].x} - 150px)`,
                  top: `calc(${allCompanies[shootingStar].y} - 100px)`,
                }}
                animate={{ 
                  left: allCompanies[shootingStar].x,
                  top: allCompanies[shootingStar].y,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 3,
                  ease: [0.16, 0.84, 0.44, 1], // Very smooth easing
                }}
              >
                {/* Glowing Core */}
                <motion.div
                  className="relative"
                  animate={{
                    opacity: [0, 0.4, 0.6, 0.3, 0],
                  }}
                  transition={{
                    duration: 3,
                    times: [0, 0.2, 0.5, 0.8, 1],
                    ease: "easeInOut"
                  }}
                >
                  {/* Main Star */}
                  <div 
                    className="w-3 h-3 rounded-full bg-cyan-400/80"
                    style={{
                      boxShadow: `
                        0 0 15px 3px rgba(6,182,212,0.5),
                        0 0 25px 5px rgba(6,182,212,0.3)
                      `,
                    }}
                  />
                  
                  {/* Trail Glow */}
                  <motion.div
                    className="absolute top-1/2 right-full h-0.5 origin-right"
                    style={{
                      width: '60px',
                      background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.4) 40%, rgba(6,182,212,0.7) 100%)',
                      transform: 'translateY(-50%)',
                      filter: 'blur(3px)',
                    }}
                    animate={{
                      scaleX: [0, 1, 0.8, 0],
                      opacity: [0, 0.6, 0.4, 0],
                    }}
                    transition={{
                      duration: 3,
                      times: [0, 0.3, 0.7, 1],
                      ease: "easeOut"
                    }}
                  />
                  
                  {/* Sparkle Particles */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-300/60 rounded-full"
                      style={{
                        left: -8 - i * 10,
                        top: Math.random() * 6 - 3,
                      }}
                      animate={{
                        opacity: [0, 0.5, 0],
                        scale: [0, 1.2, 0],
                        x: [0, -5, -8],
                        y: [0, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 10],
                      }}
                      transition={{
                        duration: 2,
                        delay: 0.5 + i * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Company Logos as Floating Stars */}
        <AnimatePresence mode="sync">
          {allCompanies.slice(0, visibleCompanies).map((company, index) => (
            <motion.div
              key={company.name}
              layoutId={company.name}
              className="absolute"
              style={{
                left: company.x,
                top: company.y,
                willChange: 'transform, opacity',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0, 0.3, 0.6, 0.3],
                scale: [0, 0, 0.9, 1, 0.9],
                x: [0, 0, 0, Math.random() * 30 - 15, 0],
                y: [0, 0, 0, Math.random() * 30 - 15, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                opacity: { 
                  duration: index === visibleCompanies - 1 ? 3.6 : 0.6,
                  times: index === visibleCompanies - 1 ? [0, 0.83, 0.83, 0.92, 1] : undefined,
                  ease: "easeOut" 
                },
                scale: { 
                  duration: index === visibleCompanies - 1 ? 3.6 : 0.6,
                  times: index === visibleCompanies - 1 ? [0, 0.83, 0.83, 0.92, 1] : undefined,
                  ease: "easeOut" 
                },
                x: { duration: 8 + Math.random() * 4, repeat: Infinity, ease: "easeInOut", delay: company.delay },
                y: { duration: 8 + Math.random() * 4, repeat: Infinity, ease: "easeInOut", delay: company.delay },
              }}
            >
              <motion.div
                className={`w-24 h-24 rounded-3xl ${company.bgColor} border-2 border-white/40 flex items-center justify-center p-4 shadow-2xl`}
                style={{
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
                whileHover={{ 
                  scale: 1.4,
                  opacity: 1,
                  boxShadow: '0 0 40px rgba(6,182,212,0.6)',
                  transition: { duration: 0.3 }
                }}
              >
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="w-full h-full object-contain"
                  title={`${company.name} - Your next opportunity?`}
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Twinkling Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="w-full max-w-md px-6 z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center justify-center gap-3 mb-12 cursor-pointer group relative z-30"
              whileHover={{ scale: 1.05 }}
            >
              <Image 
                src="/logo.png" 
                alt="Resume Forge Logo" 
                width={56} 
                height={56} 
                className="rounded-2xl shadow-lg shadow-cyan-500/50"
              />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                ResumeForge
              </h1>
            </motion.div>
          </Link>

          {/* Welcome Text */}
          <div className="text-center mb-10 relative z-30">
            <h2 className="text-3xl font-bold text-white mb-3">
              Create Account 🚀
            </h2>
            <p className="text-lg text-gray-400">
              Join the future of resume tailoring
            </p>
          </div>

          {/* Signup Card */}
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-2 border-white/10 shadow-2xl shadow-cyan-500/10 p-8 relative z-30">
            <form className="space-y-7" onSubmit={handleSignup}>
              {/* Username Field */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  className="flex h-14 w-full rounded-xl border-2 border-white/20 bg-black/40 backdrop-blur-sm px-4 py-3 text-lg font-medium text-white placeholder:text-gray-500 placeholder:italic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 transition-all duration-200 hover:border-white/30 hover:bg-black/50"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a strong password"
                  required
                  className="flex h-14 w-full rounded-xl border-2 border-white/20 bg-black/40 backdrop-blur-sm px-4 py-3 text-lg font-medium text-white placeholder:text-gray-500 placeholder:italic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all duration-200 hover:border-white/30 hover:bg-black/50"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center bg-red-500/10 p-4 rounded-xl border border-red-500/30 backdrop-blur-sm"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-xl shadow-cyan-500/30 text-lg py-7 font-bold cursor-pointer"
                size="lg"
                isLoading={isLoading}
              >
                {!isLoading && (
                  <>
                    Sign Up
                    <ArrowRight className="ml-2 w-6 h-6" />
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Log in here
                </Link>
              </p>
            </div>
          </Card>

          {/* Footer Links */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              href="/" 
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm relative z-30"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
