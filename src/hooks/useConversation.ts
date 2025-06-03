import { useState, useCallback } from "react";
import {
  simulateSalesConversation,
  simulateSalesConversationForUI,
} from "../utils/chatgpt";
import { toast } from "react-hot-toast";

interface Message {
  speaker: "ai" | "user";
  text: string;
}

interface ChatHistoryItem {
  role: "system" | "user" | "assistant";
  content: string;
}

interface UseConversationReturn {
  conversation: Message[];
  chatHistory: ChatHistoryItem[];
  isLoading: boolean;
  currentStep: number;
  handleUserMessage: (message: string) => Promise<void>;
  handleTranscriptionMessage: (
    transcription: string,
    scenarioTitle: string
  ) => Promise<void>;
  simulateAIResponse: () => void;
  resetConversation: (initialPrompt: string) => void;
}

const useConversation = (): UseConversationReturn => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleUserMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      setIsLoading(true);

      // Add user message to conversation
      const newUserMessage = { speaker: "user" as const, text: message };
      setConversation((prev) => [...prev, newUserMessage]);

      try {
        // Get AI response
        const aiResponse = await simulateSalesConversationForUI(
          message,
          "default", // You might want to pass this as a parameter
          chatHistory
        );

        // Update conversation with AI response
        setConversation((prev) => [
          ...prev,
          { speaker: "ai" as const, text: aiResponse },
        ]);

        // Update chat history for context
        setChatHistory((prev) => [
          ...prev,
          { role: "user", content: message },
          { role: "assistant", content: aiResponse },
        ]);

        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        console.error("Error in conversation:", error);
        toast.error("Failed to get AI response. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [chatHistory]
  );

  const handleTranscriptionMessage = useCallback(
    async (transcription: string, scenarioTitle: string) => {
      if (!transcription.trim()) return;

      setIsLoading(true);

      // Add transcription to conversation
      setConversation((prev) => [
        ...prev,
        {
          speaker: "user",
          text: transcription,
        },
      ]);

      try {
        const feedback = await simulateSalesConversation(
          transcription,
          scenarioTitle
        );

        // Add AI response to conversation
        setConversation((prev) => [
          ...prev,
          {
            speaker: "ai",
            text: feedback,
          },
        ]);

        // Update chat history for context
        setChatHistory((prev) => [
          ...prev,
          { role: "user", content: transcription },
          { role: "assistant", content: feedback },
        ]);

        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        console.error("Error getting feedback from ChatGPT:", error);
        toast.error("Failed to get AI response. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const simulateAIResponse = useCallback(() => {
    const aiResponses = [
      "That sounds promising, but I'm still concerned about the total cost of ownership. Can you break down all the fees?",
      "What about training? Will our team need extensive training to use your solution?",
      "I've had bad experiences with similar products in the past. How is yours different?",
      "I need to discuss this with my team. What materials can you provide to help me present this internally?",
    ];

    const randomResponse =
      aiResponses[Math.floor(Math.random() * aiResponses.length)];

    setConversation((prev) => [
      ...prev,
      { speaker: "ai", text: randomResponse },
    ]);
    setCurrentStep((prev) => prev + 1);
  }, []);

  const resetConversation = useCallback((initialPrompt: string) => {
    setConversation([
      {
        speaker: "ai",
        text: initialPrompt,
      },
    ]);
    setChatHistory([]);
    setCurrentStep(0);
  }, []);

  return {
    conversation,
    chatHistory,
    isLoading,
    currentStep,
    handleUserMessage,
    handleTranscriptionMessage,
    simulateAIResponse,
    resetConversation,
  };
};

export default useConversation;
