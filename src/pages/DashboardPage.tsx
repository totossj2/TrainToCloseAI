import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, Award, Calendar, Check, XCircle, PieChart, ListChecks, ChevronDown, ChevronUp } from 'lucide-react';

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [expandedSession, setExpandedSession] = useState<number | null>(null);

  const toggleSession = (index: number) => {
    if (expandedSession === index) {
      setExpandedSession(null);
    } else {
      setExpandedSession(index);
    }
  };

  // Mock data
  const recentSessions = [
    { 
      id: 1, 
      scenario: 'Software Demo Call', 
      date: '2025-05-01T14:30:00', 
      duration: '12:45',
      score: 87,
      strengths: ['Value proposition clarity', 'Objection handling', 'Active listening'],
      improvements: ['Closing techniques', 'Technical knowledge'],
      keywords: ['ROI', 'implementation', 'scalable', 'integration'],
    },
    { 
      id: 2, 
      scenario: 'Enterprise Solution Pitch', 
      date: '2025-04-28T10:15:00', 
      duration: '15:22',
      score: 72,
      strengths: ['Discovery questions', 'Needs analysis'],
      improvements: ['Objection handling', 'Value articulation', 'Confidence'],
      keywords: ['enterprise', 'security', 'compliance', 'scale'],
    },
    { 
      id: 3, 
      scenario: 'Product Upgrade Conversation', 
      date: '2025-04-25T16:00:00', 
      duration: '08:33',
      score: 93,
      strengths: ['Product knowledge', 'Benefits articulation', 'Rapport building'],
      improvements: ['Price objection handling'],
      keywords: ['features', 'upgrade', 'value', 'enhancement'],
    },
    { 
      id: 4, 
      scenario: 'Contract Renewal Discussion', 
      date: '2025-04-22T09:45:00', 
      duration: '11:17',
      score: 81,
      strengths: ['Relationship management', 'Account knowledge'],
      improvements: ['Upselling opportunities', 'Negotiation tactics'],
      keywords: ['renewal', 'loyalty', 'satisfaction', 'terms'],
    },
  ];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Sales Performance</h1>
            <p className="text-gray-600">Track your progress and identify areas for improvement</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  timeRange === 'week' 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 text-sm font-medium border-t border-b ${
                  timeRange === 'month' 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                  timeRange === 'year' 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Year
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<Clock className="text-teal-500" size={24} />}
            title="Practice Time"
            value="18.5 hours"
            change="+2.3 hours"
            isPositive={true}
          />
          <StatCard 
            icon={<ListChecks className="text-indigo-500" size={24} />}
            title="Sessions Completed"
            value="34"
            change="+8"
            isPositive={true}
          />
          <StatCard 
            icon={<Award className="text-amber-500" size={24} />}
            title="Average Score"
            value="82%"
            change="+5%"
            isPositive={true}
          />
          <StatCard 
            icon={<TrendingUp className="text-emerald-500" size={24} />}
            title="Improvement Rate"
            value="23%"
            change="+7%"
            isPositive={true}
          />
        </div>

        {/* Charts and Recent Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Trends</h2>
            <div className="aspect-[16/9] bg-indigo-50 rounded-lg flex items-center justify-center">
              <BarChart3 size={64} className="text-indigo-300" />
              <span className="ml-4 text-indigo-400">Interactive performance chart would appear here</span>
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <PerformanceMetric 
                title="Objection Handling"
                score={78}
                prevScore={65}
              />
              <PerformanceMetric 
                title="Value Articulation"
                score={85}
                prevScore={80}
              />
              <PerformanceMetric 
                title="Discovery Questions"
                score={92}
                prevScore={84}
              />
              <PerformanceMetric 
                title="Closing Techniques"
                score={71}
                prevScore={75}
                isPositive={false}
              />
              <PerformanceMetric 
                title="Active Listening"
                score={88}
                prevScore={79}
              />
              <PerformanceMetric 
                title="Product Knowledge"
                score={94}
                prevScore={89}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills Breakdown</h2>
            <div className="h-64 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
              <PieChart size={48} className="text-indigo-300" />
              <span className="ml-4 text-indigo-400">Skills distribution chart</span>
            </div>
            <div className="space-y-3">
              <SkillBar name="Rapport Building" percentage={92} />
              <SkillBar name="Needs Analysis" percentage={85} />
              <SkillBar name="Objection Handling" percentage={78} />
              <SkillBar name="Closing" percentage={71} />
              <SkillBar name="Follow-up" percentage={89} />
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Practice Sessions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentSessions.map((session, index) => (
              <div key={session.id} className="px-6 py-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSession(index)}
                >
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      session.score >= 90 ? 'bg-green-100 text-green-600' : 
                      session.score >= 75 ? 'bg-blue-100 text-blue-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {session.score}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{session.scenario}</h3>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar size={14} className="mr-1" /> 
                        {formatDate(session.date)}
                        <span className="mx-2">•</span>
                        <Clock size={14} className="mr-1" /> 
                        {session.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="text-indigo-600 hover:text-indigo-800">
                      {expandedSession === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {expandedSession === index && (
                  <div className="mt-4 pl-16 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <Check size={16} className="mr-2 text-green-500" />
                          Strengths
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {session.strengths.map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <XCircle size={16} className="mr-2 text-amber-500" />
                          Areas for Improvement
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {session.improvements.map((improvement, i) => (
                            <li key={i}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {session.keywords.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800">
                        View Details
                      </button>
                      <button className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800">
                        Replay Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 text-center">
            <button className="text-indigo-600 font-medium hover:text-indigo-800">
              View All Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, isPositive = true }: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  change: string;
  isPositive?: boolean;
}) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {isPositive ? '↑' : '↓'} {change}
          <span className="text-gray-500 ml-1">vs last {timeRange}</span>
        </p>
      </div>
    </div>
  </div>
);

const PerformanceMetric = ({ title, score, prevScore, isPositive = true }: {
  title: string;
  score: number;
  prevScore: number;
  isPositive?: boolean;
}) => {
  // Calculate if positive based on score comparison if not explicitly provided
  const actualIsPositive = isPositive !== undefined ? isPositive : score >= prevScore;
  const difference = Math.abs(score - prevScore);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className="text-sm font-medium text-gray-900">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${
            score >= 90 ? 'bg-green-500' : 
            score >= 75 ? 'bg-blue-500' : 
            score >= 60 ? 'bg-amber-500' : 
            'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="mt-1">
        <span className={`text-xs ${actualIsPositive ? 'text-green-600' : 'text-red-600'}`}>
          {actualIsPositive ? '↑' : '↓'} {difference}%
        </span>
      </div>
    </div>
  );
};

const SkillBar = ({ name, percentage }: { name: string; percentage: number }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium text-gray-700">{name}</span>
      <span className="text-sm font-medium text-gray-900">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${
          percentage >= 90 ? 'bg-green-500' : 
          percentage >= 75 ? 'bg-blue-500' : 
          percentage >= 60 ? 'bg-amber-500' : 
          'bg-red-500'
        }`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export default DashboardPage;