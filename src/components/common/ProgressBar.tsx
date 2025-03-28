'use client';

interface ProgressBarProps {
  currentStep: number;
  steps: number;
  colors?: {
    completed: string;
    current: string;
    pending: string;
  };
}

export default function ProgressBar({ 
  currentStep, 
  steps, 
  colors = {
    completed: '#fbb130',
    current: '#fbb130',
    pending: '#e5e7eb'
  }
}: ProgressBarProps) {
  const progress = ((currentStep) / (steps - 1)) * 100;

  return (
    <div className="w-full">
      <div className="relative h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-in-out"
          style={{ 
            width: `${Math.min(100, progress)}%`,
            backgroundColor: colors.completed
          }}
        />
      </div>
      
      <div className="relative flex justify-between mt-2">
        {Array.from({ length: steps }, (_, index) => {
          let status = '';
          
          if (index < currentStep) status = 'completed';
          else if (index === currentStep) status = 'current';
          else status = 'pending';
          
          return (
            <div 
              key={index}
              className="absolute transform -translate-x-1/2"
              style={{ 
                left: `${(index / (steps - 1)) * 100}%`,
              }}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300`}
                style={{
                  backgroundColor: 
                    status === 'completed' 
                      ? colors.completed 
                      : status === 'current' 
                        ? colors.current 
                        : colors.pending
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
} 