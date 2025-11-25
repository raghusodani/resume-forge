'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Zap, Target, FileText } from 'lucide-react';

export const FeatureGrid = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const features = [
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
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
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
  );
};
