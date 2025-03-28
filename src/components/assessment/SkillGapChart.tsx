'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SkillGapChartProps {
  skillGaps: Array<{skill: string; gap: number}>;
}

export default function SkillGapChart({ skillGaps }: SkillGapChartProps) {
  // Transform data for the chart
  const chartData = skillGaps.map(item => ({
    name: item.skill,
    gap: item.gap,
    proficiency: 100 - item.gap,
  })).sort((a, b) => b.gap - a.gap); // Sort by gap size descending

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded p-2 border border-gray-200 text-xs">
          <p className="font-medium text-mauve-12">{label}</p>
          <p className="text-accent-blue">Gap: {payload[0].value}%</p>
          <p className="text-teal-600">Proficiency: {payload[1].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-md border border-border p-4">
      <h3 className="text-sm font-medium text-mauve-12 mb-4">Skill Gap Analysis</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="gap" stackId="a" fill="#FBB130" name="Gap" />
            <Bar dataKey="proficiency" stackId="a" fill="#14B8A6" name="Proficiency" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-xs text-secondary">
        <p>This analysis shows the gap between required skills and candidate performance in each area.</p>
        <div className="flex items-center mt-2 space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent-blue rounded mr-1"></div>
            <span className="text-sm text-gray-600">Skill Gap</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-500 rounded mr-1"></div>
            <span>Current Proficiency</span>
          </div>
        </div>
      </div>
    </div>
  );
} 