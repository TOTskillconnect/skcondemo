'use client';

interface ContextFitCardProps {
  context: string;
  averageContextFit: number;
}

export default function ContextFitCard({ context, averageContextFit }: ContextFitCardProps) {
  const getContextAnalysis = () => {
    if (averageContextFit >= 90) {
      return {
        summary: 'Exceptional context understanding',
        analysis: 'Candidates demonstrated exceptional understanding of the business context and specific requirements.',
        recommendations: 'These candidates are likely to adapt quickly to the role with minimal onboarding related to context.',
        color: 'bg-teal-50 border-teal-200'
      };
    } else if (averageContextFit >= 80) {
      return {
        summary: 'Strong context understanding',
        analysis: 'Most candidates showed strong comprehension of the business context with only minor gaps.',
        recommendations: 'Consider addressing specific context areas during onboarding to ensure complete alignment.',
        color: 'bg-accent-blue/5 border-accent-blue/20'
      };
    } else if (averageContextFit >= 70) {
      return {
        summary: 'Moderate context understanding',
        analysis: 'Candidates demonstrated basic understanding but missed some important context nuances.',
        recommendations: 'Plan for more extensive context discussion during onboarding and early role phases.',
        color: 'bg-orange-50 border-orange-200'
      };
    } else {
      return {
        summary: 'Limited context understanding',
        analysis: 'Significant gaps in understanding the business context were evident across candidates.',
        recommendations: 'Consider re-evaluating the assessment context clarity or candidate fit for this specific context.',
        color: 'bg-red-50 border-red-200'
      };
    }
  };

  const analysis = getContextAnalysis();

  return (
    <div className="bg-white rounded-md border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-mauve-12">Context Fit Analysis</h3>
        <div className="px-2 py-1 rounded bg-accent-blue/10 text-accent-blue text-sm font-medium">
          {averageContextFit}% Average
        </div>
      </div>

      <div className={`p-4 rounded-md ${analysis.color} mb-4`}>
        <h4 className="font-medium text-mauve-12 mb-2">{analysis.summary}</h4>
        <p className="text-sm text-secondary">{analysis.analysis}</p>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs font-medium text-mauve-11">Recommendation</p>
          <p className="text-sm text-secondary">{analysis.recommendations}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-mauve-12 mb-2">Original Context</h4>
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-secondary">{context}</p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-mauve-12 mb-2">Context Fit Scale</h4>
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-semibold inline-block text-red-600">Poor</span>
            </div>
            <div>
              <span className="text-xs font-semibold inline-block text-orange-500">Basic</span>
            </div>
            <div>
              <span className="text-xs font-semibold inline-block text-accent-blue">Good</span>
            </div>
            <div>
              <span className="text-xs font-semibold inline-block text-teal-600">Excellent</span>
            </div>
          </div>
          <div className="h-2 flex rounded overflow-hidden">
            <div className="bg-red-400 flex-1"></div>
            <div className="bg-orange-400 flex-1"></div>
            <div className="bg-accent-blue flex-1"></div>
            <div className="bg-teal-500 flex-1"></div>
          </div>
          <div 
            className="absolute h-4 w-4 rounded-full bg-white border-2 border-accent-blue -mt-1 transform -translate-x-1/2" 
            style={{ left: `${averageContextFit}%` }}
          />
        </div>
      </div>
    </div>
  );
} 