'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ReportMetricsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  description?: string;
  colorScheme?: 'blue' | 'coral' | 'green' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export default function ReportMetricsCard({
  title,
  value,
  icon,
  description,
  colorScheme = 'blue',
  size = 'md',
}: ReportMetricsCardProps) {
  const getColorsByScheme = (scheme: string) => {
    switch (scheme) {
      case 'blue':
        return {
          main: '#38B2AC',
          light: 'rgba(56, 178, 172, 0.1)',
          textColor: 'text-accent-blue',
          bgColor: 'bg-accent-blue/10',
          borderColor: 'border-accent-blue/20',
        };
      case 'coral':
        return {
          main: '#F56565',
          light: 'rgba(245, 101, 101, 0.1)',
          textColor: 'text-accent-coral',
          bgColor: 'bg-accent-coral/10',
          borderColor: 'border-accent-coral/20',
        };
      case 'green':
        return {
          main: '#68D391',
          light: 'rgba(104, 211, 145, 0.1)',
          textColor: 'text-accent-green',
          bgColor: 'bg-accent-green/10',
          borderColor: 'border-accent-green/20',
        };
      default:
        return {
          main: '#94A3B8',
          light: 'rgba(148, 163, 184, 0.1)',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const colors = getColorsByScheme(colorScheme);
  
  const pieData = [
    { name: 'Value', value: value },
    { name: 'Remaining', value: 100 - value },
  ];

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  return (
    <div className={`bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow border ${colors.borderColor} ${sizeClasses[size]}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {icon && <span className={`${colors.textColor}`}>{icon}</span>}
            <h3 className="font-medium text-primary">{title}</h3>
          </div>
          <p className={`text-2xl font-bold ${colors.textColor}`}>{value}%</p>
          {description && <p className="text-xs text-secondary mt-1">{description}</p>}
        </div>
        
        <div className="w-16 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={30}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill={colors.main} />
                <Cell fill={colors.light} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 