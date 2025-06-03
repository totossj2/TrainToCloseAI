import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  SkipForward,
  Settings,
  BarChart3,
  Save,
  Clock,
} from "lucide-react";
import ScenarioSelector from "../components/roleplay/ScenarioSelector";
import AudioVisualizer from "../components/roleplay/AudioVisualizer";
import FeedbackPanel from "../components/roleplay/FeedbackPanel";
import SessionHeader from "../components/roleplay/SessionHeader";
import ConversationArea from "../components/roleplay/ConversationArea";
import AudioControls from "../components/roleplay/AudioControls";
import { scenarios } from "../data/scenarios";
import {
  simulateSalesConversation,
  simulateSalesConversationForUI,
} from "../utils/chatgpt";
import { toast } from "react-hot-toast";

// Custom hooks
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useAudioRecording from "../hooks/useAudioRecording";
import useConversation from "../hooks/useConversation";
import useSessionTimer from "../hooks/useSessionTimer";

// Definición de tipos para Speech Recognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const RolePlayPage = () => {
  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [difficulty, setDifficulty] = useState("medium");
  const [userInput, setUserInput] = useState("");

  // Custom hooks
  const {
    transcription,
    isListening,
    error: speechError,
    startListening,
    stopListening,
    resetTranscription,
  } = useSpeechRecognition();

  const {
    isRecording,
    audioUrl,
    startRecording,
    stopRecording,
    playRecording,
    error: audioError,
  } = useAudioRecording();

  const {
    conversation,
    chatHistory,
    isLoading,
    currentStep,
    handleUserMessage,
    handleTranscriptionMessage,
    simulateAIResponse,
    resetConversation,
  } = useConversation();

  const {
    sessionTime,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
  } = useSessionTimer();

  // Initialize conversation when scenario changes
  useEffect(() => {
    if (selectedScenario) {
      resetConversation(selectedScenario.initialPrompt);
      resetTimer();
    }
  }, [selectedScenario, resetConversation, resetTimer]);

  const handleScenarioChange = (scenario: (typeof scenarios)[0]) => {
    setSelectedScenario(scenario);
    stopRecording();
    stopListening();
    resetTranscription();
  };

  const handleToggleRecording = async () => {
    if (!isRecording) {
      await startRecording();
      startListening();
      startTimer();
    } else {
      await stopRecording();
      stopListening();
      if (transcription) {
        await handleTranscriptionMessage(transcription, selectedScenario.title);
      }
      resetTranscription();
    }
  };

  const handleEndSession = () => {
    stopRecording();
    stopListening();
    stopTimer();
    // Additional cleanup if needed
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sales Role-Play Practice
          </h1>
          <p className="text-gray-600">
            Perfect your pitch with AI-powered conversation practice
          </p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="easy">Easy - Beginner</option>
                  <option value="medium">Medium - Intermediate</option>
                  <option value="hard">Hard - Advanced</option>
                  <option value="expert">
                    Expert - Challenging Objections
                  </option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Areas
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="objection-handling"
                      className="h-4 w-4 text-indigo-600"
                      defaultChecked
                    />
                    <label
                      htmlFor="objection-handling"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Objection Handling
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="closing-techniques"
                      className="h-4 w-4 text-indigo-600"
                      defaultChecked
                    />
                    <label
                      htmlFor="closing-techniques"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Closing Techniques
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="value-proposition"
                      className="h-4 w-4 text-indigo-600"
                      defaultChecked
                    />
                    <label
                      htmlFor="value-proposition"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Value Proposition
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="discovery-questions"
                      className="h-4 w-4 text-indigo-600"
                      defaultChecked
                    />
                    <label
                      htmlFor="discovery-questions"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Discovery Questions
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Response Time
                </label>
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
              <SessionHeader
                title={selectedScenario.title}
                description={selectedScenario.description}
                userRole={selectedScenario.userRole}
                aiRole={selectedScenario.aiRole}
                sessionTime={sessionTime}
                onEndSession={handleEndSession}
              />

              <ConversationArea
                conversation={conversation}
                isRecording={isRecording}
                isPaused={!isListening}
                transcription={transcription}
                isLoading={isLoading}
              />

              <div className="p-6 border-t border-gray-200">
                <div className="mb-4">
                  <AudioVisualizer isActive={isRecording && isListening} />
                </div>

                <AudioControls
                  isRecording={isRecording}
                  isPaused={!isListening}
                  audioUrl={audioUrl}
                  isLoading={isLoading}
                  userInput={userInput}
                  onToggleRecording={handleToggleRecording}
                  onPlayRecording={playRecording}
                  onSkipStep={simulateAIResponse}
                  onSendMessage={() => handleUserMessage(userInput)}
                  onSaveSession={() => {}}
                />
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
