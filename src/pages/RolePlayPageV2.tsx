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
import { Button } from "@headlessui/react";

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

const RolePlayPageV2 = () => {
  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [difficulty, setDifficulty] = useState("medium");
  const [userInput, setUserInput] = useState("");
  const [productInput, setProductInput] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

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

  const handleStartSession = async () => {
    if (!productInput.trim()) {
      toast.error("Please enter a product or service");
      return;
    }

    setHasStarted(true);
    // Initialize conversation with product context
    const initialPrompt = `You are a potential customer interested in ${productInput}. Act naturally and ask relevant questions about the product/service. Start by greeting the salesperson.`;
    resetConversation(initialPrompt);
    startTimer();
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {!hasStarted ? (
          <>
            <div className="mb-8 flex flex-col items-center justify-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                What do you sell?
              </h1>
              <p className="text-gray-600">
                Choose a product or service and practice your sales pitch with
                AI.
              </p>
              <input
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="Enter your product or service"
                className="w-full max-w-md p-2 rounded-md border border-gray-300"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleStartSession();
                  }
                }}
              />
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleStartSession}
                className="bg-blue-500 text-white px-8 py-4 rounded-full shadow-lg hover:bg-blue-600 mx-auto text-lg font-semibold flex items-center justify-center gap-2"
              >
                <span>Start</span>
                <Play className="w-6 h-6" />
              </Button>
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">
                    Sales Practice: {productInput}
                  </h2>
                  <p className="text-gray-600">Practice your pitch with AI</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleToggleRecording}
                    className={`p-3 rounded-full ${
                      isRecording ? "bg-red-500" : "bg-blue-500"
                    } text-white`}
                  >
                    {isRecording ? <MicOff /> : <Mic />}
                  </button>
                  <button
                    onClick={handleEndSession}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Clock />
                    <span className="ml-2">{formatTime(sessionTime)}</span>
                  </button>
                </div>
              </div>

              <ConversationArea
                conversation={conversation}
                isRecording={isRecording}
                isPaused={false}
                transcription={transcription || ""}
                isLoading={isLoading}
              />

              <AudioControls
                isRecording={isRecording}
                isPaused={false}
                audioUrl={audioUrl}
                isLoading={isLoading}
                userInput={userInput}
                onToggleRecording={handleToggleRecording}
                onPlayRecording={playRecording}
                onSkipStep={() => {
                  // For now, just simulate the next AI response
                  simulateAIResponse();
                }}
                onSendMessage={() => {
                  if (userInput.trim()) {
                    handleUserMessage(userInput);
                    setUserInput("");
                  }
                }}
                onSaveSession={() => {
                  // TODO: Implement save session functionality
                  toast.success("Session saved successfully!");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePlayPageV2;
