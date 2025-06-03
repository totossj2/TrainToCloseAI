import React from "react";

interface Message {
  speaker: "ai" | "user";
  text: string;
}

interface ConversationAreaProps {
  conversation: Message[];
  isRecording: boolean;
  isPaused: boolean;
  transcription: string;
  isLoading: boolean;
}

const ConversationArea: React.FC<ConversationAreaProps> = ({
  conversation,
  isRecording,
  isPaused,
  transcription,
  isLoading,
}) => {
  return (
    <div className="p-6 h-96 overflow-y-auto">
      <div className="space-y-4">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.speaker === "ai" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-xl px-4 py-3 ${
                message.speaker === "ai"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-indigo-600 text-white"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}

        {/* Show transcription while recording */}
        {isRecording && transcription && (
          <div className="flex justify-end">
            <div className="max-w-xs md:max-w-md rounded-xl px-4 py-3 bg-indigo-600/50 text-white">
              <p className="text-sm">{transcription}</p>
            </div>
          </div>
        )}

        {/* Show loading indicator while processing */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md rounded-xl px-4 py-3 bg-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-150"></div>
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Show recording indicator */}
        {isRecording && !isPaused && !transcription && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md rounded-xl px-4 py-3 bg-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></div>
                <span className="text-sm text-gray-500">Listening...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationArea;
