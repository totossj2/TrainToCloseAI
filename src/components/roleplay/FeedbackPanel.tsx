import React, { useState } from 'react';
import { BarChart3, Lightbulb, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';

interface FeedbackPanelProps {
  conversation: { speaker: 'ai' | 'user', text: string }[];
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ conversation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Mock feedback data - in a real implementation, this would come from AI analysis
  const feedbackData = {
    score: 78,
    strengths: [
      'Good use of open-ended questions',
      'Clear articulation of value proposition',
      'Professional tone and pacing'
    ],
    improvements: [
      'Consider addressing pricing objections more directly',
      'Provide more specific examples to support claims',
      'Follow up on customer concerns before moving forward'
    ],
    keyPhrases: [
      { text: 'implementation timeline', sentiment: 'neutral' },
      { text: 'data migration', sentiment: 'concern' },
      { text: 'dedicated support', sentiment: 'positive' },
      { text: 'competitive pricing', sentiment: 'positive' },
    ],
    metrics: {
      talkRatio: 58,
      questionsAsked: 3,
      objectionHandling: 72,
      clarity: 85,
      engagement: 81
    }
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${isExpanded ? '' : ''}`}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 size={18} className="mr-2 text-indigo-600" />
          Real-time Performance Feedback
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
      
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[800px]' : 'max-h-20'}`}>
        <div className="p-4">
          {conversation.length <= 1 ? (
            <div className="text-center py-4 text-gray-500">
              Begin the conversation to see real-time feedback
            </div>
          ) : (
            <div>
              {/* Score and Key Metrics */}
              <div className="flex flex-col md:flex-row mb-6">
                <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
                  <div className="relative">
                    <svg className="w-32 h-32">
                      <circle
                        className="text-gray-200"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className="text-indigo-600"
                        strokeWidth="10"
                        strokeDasharray={360}
                        strokeDashoffset={360 - (360 * feedbackData.score) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <span className="text-3xl font-bold text-gray-900">{feedbackData.score}</span>
                      <span className="text-sm block text-gray-500">Score</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <MetricItem label="Talk/Listen Ratio" value={`${feedbackData.metrics.talkRatio}%`} />
                  <MetricItem label="Questions Asked" value={feedbackData.metrics.questionsAsked} />
                  <MetricItem label="Objection Handling" value={`${feedbackData.metrics.objectionHandling}%`} />
                  <MetricItem label="Message Clarity" value={`${feedbackData.metrics.clarity}%`} />
                  <MetricItem label="Engagement" value={`${feedbackData.metrics.engagement}%`} />
                </div>
              </div>
              
              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FeedbackSection 
                  title="Strengths" 
                  icon={<Lightbulb size={18} className="text-green-500" />}
                  items={feedbackData.strengths}
                  type="strength"
                />
                <FeedbackSection 
                  title="Areas for Improvement" 
                  icon={<AlertTriangle size={18} className="text-amber-500" />}
                  items={feedbackData.improvements}
                  type="improvement"
                />
              </div>
              
              {/* Key Phrases */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Conversation Points</h4>
                <div className="flex flex-wrap gap-2">
                  {feedbackData.keyPhrases.map((phrase, index) => (
                    <span 
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        phrase.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        phrase.sentiment === 'concern' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {phrase.text}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                  View Detailed Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-gray-50 rounded-lg p-3 text-center">
    <div className="text-lg font-semibold text-gray-900">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

const FeedbackSection = ({ 
  title, 
  icon, 
  items, 
  type 
}: { 
  title: string; 
  icon: React.ReactNode; 
  items: string[];
  type: 'strength' | 'improvement';
}) => (
  <div>
    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h4>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li 
          key={index}
          className={`text-sm p-2 rounded-lg ${
            type === 'strength' ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default FeedbackPanel;