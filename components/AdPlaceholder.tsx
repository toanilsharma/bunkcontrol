
import React from 'react';

interface AdPlaceholderProps {
  className?: string;
  slotName?: string;
  format?: 'horizontal' | 'rectangle' | 'vertical';
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className, slotName = "Ad Space", format = 'horizontal' }) => {
  // In a real deployment, this would be replaced by the Google AdSense code.
  // For AdSense approval, having clear, distinct areas for content vs ads is crucial.
  
  let heightClass = 'h-24'; // standard leaderboard
  if (format === 'rectangle') heightClass = 'h-64';
  if (format === 'vertical') heightClass = 'h-96';

  return (
    <div className={`w-full bg-gray-100 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center p-4 text-center overflow-hidden transition-colors ${heightClass} ${className}`}>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Advertisement</span>
      <div className="text-gray-300 dark:text-gray-600 font-medium text-sm">
        {slotName}
      </div>
    </div>
  );
};

export default AdPlaceholder;
