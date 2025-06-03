import { useState, useRef, useCallback } from "react";

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

const useSpeechRecognition = (language: string = "es-ES") => {
  const [transcription, setTranscription] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const initializeSpeechRecognition = useCallback(() => {
    try {
      const SpeechRecognitionAPI = window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        throw new Error(
          "webkitSpeechRecognition is not supported in this browser"
        );
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Restart if we're still supposed to be listening
        if (recognitionRef.current === recognition) {
          recognition.start();
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscription((prev) => {
            const newTranscription = prev
              ? `${prev} ${finalTranscript}`
              : finalTranscript;
            return newTranscription;
          });
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error);
        setIsListening(false);
      };

      return recognition;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to initialize speech recognition"
      );
      return null;
    }
  }, [language]);

  const startListening = useCallback(() => {
    const recognition = initializeSpeechRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
      setTranscription("");
    }
  }, [initializeSpeechRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const resetTranscription = useCallback(() => {
    setTranscription("");
  }, []);

  return {
    transcription,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscription,
  };
};

export default useSpeechRecognition;
