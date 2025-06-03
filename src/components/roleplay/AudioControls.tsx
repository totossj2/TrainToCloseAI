import React from "react";
import { Mic, Pause, Play, SkipForward, Save } from "lucide-react";

interface AudioControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  audioUrl: string | null;
  isLoading: boolean;
  userInput: string;
  onToggleRecording: () => void;
  onPlayRecording: () => void;
  onSkipStep: () => void;
  onSendMessage: () => void;
  onSaveSession: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isRecording,
  isPaused,
  audioUrl,
  isLoading,
  userInput,
  onToggleRecording,
  onPlayRecording,
  onSkipStep,
  onSendMessage,
  onSaveSession,
}) => {
  return (
    <div className="p-6 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleRecording}
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-indigo-600 text-white"
            }`}
          >
            {isRecording ? <Pause size={20} /> : <Mic size={20} />}
          </button>
          {audioUrl && (
            <button
              onClick={onPlayRecording}
              className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors duration-200"
            >
              <Play size={18} />
            </button>
          )}
          <button
            onClick={onSkipStep}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          >
            <SkipForward size={18} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSendMessage}
            disabled={isLoading || !userInput.trim()}
            className={`px-4 py-2 ${
              isLoading || !userInput.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white rounded-md transition-colors duration-200`}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
          <button
            onClick={onSaveSession}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
          >
            <Save size={16} className="inline mr-1" />
            Save Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
