'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatDistanceToNow } from '@/lib/utils/date';

interface ActivityItem {
  id: string;
  type: 'assessment' | 'candidate' | 'search' | 'report';
  title: string;
  timestamp: string;
  description?: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Mock data - would be replaced with API call
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'assessment',
        title: 'Frontend Developer Assessment',
        description: 'You created a new assessment',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        type: 'candidate',
        title: 'Sarah Johnson shortlisted',
        description: 'You added a candidate to your shortlist',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'search',
        title: 'Senior Developer Search',
        description: 'You started a new search',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        type: 'report',
        title: 'Technical Skills Report',
        description: 'New report available',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    
    setActivities(mockActivities);
  }, []);

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'assessment':
        return 'bg-accent-blue text-white';
      case 'candidate':
        return 'bg-accent-green text-white';
      case 'search':
        return 'bg-accent-blue text-white';
      case 'report':
        return 'bg-accent-coral text-white';
      default:
        return 'bg-accent-slate text-white';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment':
        return '📝';
      case 'candidate':
        return '👤';
      case 'search':
        return '🔍';
      case 'report':
        return '📊';
      default:
        return '⚡';
    }
  };

  const getActivityPath = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'assessment':
        return `/assessment`;
      case 'candidate':
        return `/candidates`;
      case 'search':
        return `/search/results`;
      case 'report':
        return `/assessment/reports`;
      default:
        return `/dashboard`;
    }
  };

  return (
    <div className="bg-white border border-border rounded-lg shadow-card">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-primary text-lg">Recent Activity</h2>
      </div>
      
      <div className="divide-y divide-border">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 hover:bg-background/50 hover:border-accent-blue hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-primary">{activity.title}</h3>
                    <span className="text-xs text-secondary">
                      {formatDistanceToNow(new Date(activity.timestamp))}
                    </span>
                  </div>
                  
                  {activity.description && (
                    <p className="text-sm text-secondary mt-1">{activity.description}</p>
                  )}
                  
                  <div className="mt-2">
                    <Link href={getActivityPath(activity)} className="text-xs text-accent-blue hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-4 text-center text-secondary">
            No recent activity
          </div>
        )}
      </div>
      
      <div className="p-3 bg-background/50 flex justify-center">
        <Link href="/activity" className="text-sm text-accent-blue hover:underline">
          View All Activity
        </Link>
      </div>
    </div>
  );
} 