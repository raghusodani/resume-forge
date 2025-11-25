'use client';

import { motion } from 'framer-motion';
import { Loader } from './Loader';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState = ({ message = 'Loading...', fullScreen = false }: LoadingStateProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 flex flex-col items-center space-y-4 shadow-2xl">
          <Loader />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-sm font-medium"
          >
            {message}
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
};
