import { useState, useRef, useCallback } from "react";

interface UseAudioRecordingReturn {
  isRecording: boolean;
  audioUrl: string | null;
  audioChunks: Blob[];
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  playRecording: () => void;
  error: string | null;
}

const useAudioRecording = (): UseAudioRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setError(null);
      setAudioChunks([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start recording"
      );
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && audioStreamRef.current) {
      return new Promise<void>((resolve) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, {
              type: "audio/webm;codecs=opus",
            });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            resolve();
          };

          mediaRecorderRef.current.stop();
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          setIsRecording(false);
        } else {
          resolve();
        }
      });
    }
    return Promise.resolve();
  }, [audioChunks]);

  const playRecording = useCallback(() => {
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      } else {
        audioRef.current.src = audioUrl;
      }
      audioRef.current.play();
    }
  }, [audioUrl]);

  return {
    isRecording,
    audioUrl,
    audioChunks,
    startRecording,
    stopRecording,
    playRecording,
    error,
  };
};

export default useAudioRecording;
