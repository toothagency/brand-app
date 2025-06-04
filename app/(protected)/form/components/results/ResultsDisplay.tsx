import React from "react";
import {
  Target,
  Palette,
  Lightbulb,
  FileText,
  MessageSquare,
  Download,
  Share2,
} from "lucide-react";
import type { GeneratedBrand } from "../../utils/types"; // Adjust path

interface ResultsDisplayProps {
  generatedBrand: GeneratedBrand;
  onStartOver: () => void;
  // Add props for download/share functionality if needed
  // onDownload?: () => void;
  // onShare?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  generatedBrand,
  onStartOver,
  // onDownload,
  // onShare
}) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4 sm:p-6 md:p-8">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Your Brand Blueprint is Ready! 🎉
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Explore your AI-generated brand package below.
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Brand Overview & Palette */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResultCard title="Brand Overview" icon={Target} iconColor="blue">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Brand Name:</span>
                <p className="text-gray-600 text-lg">
                  {generatedBrand.brandName}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Tagline:</span>
                <p className="text-gray-600 italic">
                  "{generatedBrand.tagline}"
                </p>
              </div>
            </div>
          </ResultCard>
          <ResultCard title="Color Palette" icon={Palette} iconColor="purple">
            <div className="flex gap-2 sm:gap-3">
              {generatedBrand.colorPalette.map((color, index) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    className="w-full h-16 sm:h-20 rounded-lg mb-1.5 shadow-inner"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                  <p className="text-xs text-gray-500">{color}</p>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>

        {/* Logo Ideas */}
        <ResultCard title="Logo Ideas" icon={Lightbulb} iconColor="yellow">
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {generatedBrand.logoIdeas.map((idea, index) => (
              <li key={index}>{idea}</li>
            ))}
          </ul>
        </ResultCard>

        {/* Brand Guidelines */}
        <ResultCard title="Brand Guidelines" icon={FileText} iconColor="orange">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Voice:</span>{" "}
              {generatedBrand.brandGuidelines.voice}
            </p>
            <p>
              <span className="font-semibold">Tone:</span>{" "}
              {generatedBrand.brandGuidelines.tone}
            </p>
            <p>
              <span className="font-semibold">Messaging Focus:</span>{" "}
              {generatedBrand.brandGuidelines.messaging}
            </p>
          </div>
        </ResultCard>

        {/* Social Media Posts */}
        <ResultCard
          title="Sample Social Media Posts"
          icon={MessageSquare}
          iconColor="green"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedBrand.socialPosts.map((post, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300"
              >
                <p className="text-sm text-gray-700">{post}</p>
              </div>
            ))}
          </div>
        </ResultCard>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 md:mt-12">
        <button
          // onClick={onDownload} // Add handler if needed
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Download className="w-5 h-5" /> Download Package
        </button>
        <button
          // onClick={onShare} // Add handler if needed
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Share2 className="w-5 h-5" /> Share Results
        </button>
        <button
          onClick={onStartOver}
          className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md"
        >
          Start Over
        </button>
      </div>
    </div>
  </div>
);

// Optional: Helper component for consistent card styling
interface ResultCardProps {
  title: string;
  icon: React.ElementType;
  iconColor: "blue" | "purple" | "yellow" | "orange" | "green"; // Add more as needed
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  icon: Icon,
  iconColor,
  children,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
    <h3
      className={`text-xl font-bold text-gray-900 mb-4 flex items-center gap-2`}
    >
      <Icon className={`w-5 h-5 text-${iconColor}-600`} />
      {title}
    </h3>
    {children}
  </div>
);

export default ResultsDisplay;
