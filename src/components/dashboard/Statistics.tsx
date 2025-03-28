'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Metric {
  title: string;
  value: string; 
  icon: string;
  color: 'blue' | 'coral' | 'green' | 'slate';
  trend: number;
  tooltip: string;
}

export default function Statistics() {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const metrics: Metric[] = [
    {
      title: "Avg Match Score",
      value: "84%",
      icon: "📊",
      color: "blue",
      trend: 12,
      tooltip: "Average match score across all hires"
    },
    {
      title: "Shortlisted",
      value: "28",
      icon: "⭐",
      color: "green",
      trend: 8,
      tooltip: "Candidates in your shortlist"
    },
    {
      title: "Assessments",
      value: "12",
      icon: "📝",
      color: "blue",
      trend: -3,
      tooltip: "Ongoing assessments"
    },
    {
      title: "Hiring Process",
      value: "14d",
      icon: "⏱",
      color: "coral",
      trend: -5,
      tooltip: "Average time to hire"
    },
    {
      title: "Candidate Pool",
      value: "315",
      icon: "👥",
      color: "slate",
      trend: 24,
      tooltip: "Total candidates in your database"
    },
  ];

  const getColorClass = (color: string): string => {
    switch (color) {
      case 'blue':
        return 'text-accent-blue';
      case 'coral':
        return 'text-accent-coral';
      case 'green':
        return 'text-accent-green';
      case 'slate':
        return 'text-accent-slate';
      default:
        return 'text-accent-blue';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
          onMouseEnter={() => setHoveredMetric(metric.title)}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className={`bg-white p-6 rounded-lg shadow-card hover:shadow-card-hover transition-shadow border border-border`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{metric.icon}</span>
              <div className={`flex items-center ${metric.trend >= 0 ? 'text-accent-green' : 'text-accent-coral'}`}>
                <span className="text-sm font-medium">
                  {metric.trend >= 0 ? '+' : ''}{metric.trend}%
                </span>
                <span className="ml-1">
                  {metric.trend >= 0 ? '↑' : '↓'}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">{metric.title}</h3>
            <p className={`text-3xl font-bold ${getColorClass(metric.color)}`}>{metric.value}</p>
          </div>

          {/* Tooltip */}
          {hoveredMetric === metric.title && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 bg-gray-900 text-white text-sm rounded-lg py-2 px-3 -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            >
              {metric.tooltip}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
} 