import React from "react";
import { Clock } from "lucide-react";

interface SessionHeaderProps {
  title: string;
  description: string;
  userRole: string;
  aiRole: string;
  sessionTime: number;
  onEndSession: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const SessionHeader: React.FC<SessionHeaderProps> = ({
  title,
  description,
  userRole,
  aiRole,
  sessionTime,
  onEndSession,
}) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex items-center">
          <div className="flex items-center text-sm text-gray-500 mr-4">
            <Clock size={16} className="mr-1" />
            <span>{formatTime(sessionTime)}</span>
          </div>
          <button
            onClick={onEndSession}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-md transition-colors duration-200"
          >
            End Session
          </button>
        </div>
      </div>
      <div className="flex items-center text-sm">
        <span className="text-gray-700 mr-2">Your role:</span>
        <span className="font-medium text-indigo-700">{userRole}</span>
        <span className="mx-2 text-gray-400">|</span>
        <span className="text-gray-700 mr-2">AI role:</span>
        <span className="font-medium text-teal-700">{aiRole}</span>
      </div>
    </div>
  );
};

export default SessionHeader;
