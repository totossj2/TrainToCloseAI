import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, SkipForward, Settings, BarChart3, Save, Clock } from 'lucide-react';
import ScenarioSelector from '../components/roleplay/ScenarioSelector';
import AudioVisualizer from '../components/roleplay/AudioVisualizer';
import FeedbackPanel from '../components/roleplay/FeedbackPanel';
import { scenarios } from '../data/scenarios';

const RolePlayPage = () => {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [conversation, setConversation] = useState<{ speaker: 'ai' | 'user', text: string }[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [sessionTime, setSessionTime] = useState(0);

  // Simulate loading conversation history
  useEffect(() => {
    if (selectedScenario) {
      // Initialize with the AI's first message
      setConversation([{ 
        speaker: 'ai', 
        text: selectedScenario.initialPrompt 
      }]);
      setCurrentStep(0);
    }
  }, [selectedScenario]);

  // Timer for session duration
  useEffect(() => {
    let timer: number;
    if (isRecording && !isPaused) {
      timer = window.setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleScenarioChange = (scenario: typeof scenarios[0]) => {
    setSelectedScenario(scenario);
    setIsRecording(false);
    setIsPaused(false);
    setSessionTime(0);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const simulateUserResponse = () => {
    // In a real implementation, this would be replaced by actual speech recognition
    const userResponses = [
      "I understand your concerns about implementation time. We'll work closely with your team to ensure a smooth transition.",
      "That's a great question. Our pricing is competitive and we offer flexible payment options.",
      "I appreciate your feedback. Let me show you how our solution addresses that specific pain point.",
      "Based on what you've shared, I think our premium tier would be the best fit for your needs.",
    ];
    
    const randomResponse = userResponses[Math.floor(Math.random() * userResponses.length)];
    
    setConversation(prev => [...prev, { speaker: 'user', text: randomResponse }]);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      simulateAIResponse();
    }, 1500);
  };
  
  const simulateAIResponse = () => {
    // In a real implementation, this would be a call to an AI service
    const aiResponses = [
      "That sounds promising, but I'm still concerned about the total cost of ownership. Can you break down all the fees?",
      "What about training? Will our team need extensive training to use your solution?",
      "I've had bad experiences with similar products in the past. How is yours different?",
      "I need to discuss this with my team. What materials can you provide to help me present this internally?",
    ];
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    setConversation(prev => [...prev, { speaker: 'ai', text: randomResponse }]);
    setCurrentStep(prev => prev + 1);
  };

  const skipCurrentStep = () => {
    simulateAIResponse();
  };

  const endSession = () => {
    setIsRecording(false);
    setIsPaused(false);
    // In a real implementation, we would save the session and analyze performance
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Role-Play Practice</h1>
          <p className="text-gray-600">Perfect your pitch with AI-powered conversation practice</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Scenario Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <ScenarioSelector 
                scenarios={scenarios}
                selectedScenario={selectedScenario}
                onSelect={handleScenarioChange}
              />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings size={18} className="mr-2 text-indigo-600" />
                Session Settings
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="easy">Easy - Beginner</option>
                  <option value="medium">Medium - Intermediate</option>
                  <option value="hard">Hard - Advanced</option>
                  <option value="expert">Expert - Challenging Objections</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Focus Areas</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="objection-handling" className="h-4 w-4 text-indigo-600" defaultChecked />
                    <label htmlFor="objection-handling" className="ml-2 text-sm text-gray-700">Objection Handling</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="closing-techniques" className="h-4 w-4 text-indigo-600" defaultChecked />
                    <label htmlFor="closing-techniques" className="ml-2 text-sm text-gray-700">Closing Techniques</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="value-proposition" className="h-4 w-4 text-indigo-600" defaultChecked />
                    <label htmlFor="value-proposition" className="ml-2 text-sm text-gray-700">Value Proposition</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="discovery-questions" className="h-4 w-4 text-indigo-600" defaultChecked />
                    <label htmlFor="discovery-questions" className="ml-2 text-sm text-gray-700">Discovery Questions</label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Response Time</label>
                <div className="flex items-center">
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value="3" 
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Quick</span>
                  <span>Realistic</span>
                  <span>Slow</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Panel - Conversation Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Scenario Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedScenario.title}</h3>
                    <p className="text-sm text-gray-600">{selectedScenario.description}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center text-sm text-gray-500 mr-4">
                      <Clock size={16} className="mr-1" />
                      <span>{formatTime(sessionTime)}</span>
                    </div>
                    <button 
                      onClick={endSession}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-md transition-colors duration-200"
                    >
                      End Session
                    </button>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-700 mr-2">Your role:</span>
                  <span className="font-medium text-indigo-700">{selectedScenario.userRole}</span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="text-gray-700 mr-2">AI role:</span>
                  <span className="font-medium text-teal-700">{selectedScenario.aiRole}</span>
                </div>
              </div>

              {/* Conversation Area */}
              <div className="p-6 h-96 overflow-y-auto">
                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md rounded-xl px-4 py-3 ${
                          message.speaker === 'ai' ? 'bg-gray-100 text-gray-800' : 'bg-indigo-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isRecording && !isPaused && (
                    <div className="flex justify-start">
                      <div className="max-w-xs md:max-w-md rounded-xl px-4 py-3 bg-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-150"></div>
                          <span className="text-sm text-gray-500">AI is listening...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Audio Visualizer and Controls */}
              <div className="p-6 border-t border-gray-200">
                <div className="mb-4">
                  <AudioVisualizer isActive={isRecording && !isPaused} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={toggleRecording}
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        isRecording 
                          ? isPaused ? 'bg-indigo-100 text-indigo-600' : 'bg-red-500 text-white animate-pulse' 
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {isRecording ? (
                        isPaused ? <Play size={20} /> : <Pause size={20} />
                      ) : (
                        <Mic size={20} />
                      )}
                    </button>
                    <button 
                      onClick={skipCurrentStep}
                      className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <SkipForward size={18} />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={simulateUserResponse} // This is just for the demo
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Simulate Response
                    </button>
                    <button 
                      onClick={() => {}}
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
                    >
                      <Save size={16} className="inline mr-1" />
                      Save Session
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Panel */}
            <div className="mt-6">
              <FeedbackPanel conversation={conversation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePlayPage;