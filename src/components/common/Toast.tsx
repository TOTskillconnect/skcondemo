'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', isVisible, onClose }: ToastProps) {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-accent-green';
      case 'error':
        return 'bg-accent-coral';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
        return 'bg-accent-blue';
      default:
        return 'bg-accent-blue';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <span className="text-xl">✓</span>;
      case 'error':
        return <span className="text-xl">✕</span>;
      case 'warning':
        return <span className="text-xl">⚠</span>;
      case 'info':
        return <span className="text-xl">ℹ</span>;
      default:
        return <span className="text-xl">ℹ</span>;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 ${getBackgroundColor()} text-white px-6 py-3 rounded-lg shadow-lg z-50`}
        >
          <div className="flex items-center space-x-2">
            {getIcon()}
            <p>{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 