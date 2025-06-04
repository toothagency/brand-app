import React from 'react';

interface QuickStatsProps {
  answeredCount: number;
  totalQuestions: number;
  currentStep: number;
  overallProgress: number;
}

// Define configuration for each stat to avoid repetition
const statsConfig = [
  { label: "Answered", key: "answeredCount", color: "blue" },
  { label: "Current Step", key: "currentStep", color: "green" },
  { label: "Progress", key: "overallProgress", suffix: "%", color: "purple" },
  { label: "Remaining", key: "remaining", color: "orange" },
];

const QuickStats: React.FC<QuickStatsProps> = ({
  answeredCount,
  totalQuestions,
  currentStep,
  overallProgress,
}) => {
  // Calculate remaining questions
  const remaining = totalQuestions - answeredCount;

  // Map props to a simple object for easier access in the loop
  const statsData = {
    answeredCount,
    currentStep,
    overallProgress: Math.round(overallProgress), // Round progress
    remaining,
  };

  return (
    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      {statsConfig.map(stat => (
        <div key={stat.label} className="bg-white rounded-lg p-4 shadow">
          <div className={`text-2xl font-bold text-${stat.color}-600`}>
            {/* Access the value using the key from statsData */}
            {statsData[stat.key as keyof typeof statsData]}
            {/* Add suffix if defined (e.g., %) */}
            {stat.suffix}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;