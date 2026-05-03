'use client';

import { useState, useCallback, useRef } from 'react';

interface UseVoiceReturn {
  isRecording: boolean;
  isPlaying: boolean;
  transcript: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
}

export function useVoice(): UseVoiceReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // Send to Whisper API
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const res = await fetch('/api/voice', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          setTranscript(data.text);
          resolve(data.text);
        } catch (error) {
          reject(error);
        }

        // Stop all tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.stop();
    });
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      setIsPlaying(true);

      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'nova' }),
      });

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('TTS failed:', error);
      setIsPlaying(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return { isRecording, isPlaying, transcript, startRecording, stopRecording, speak, stopSpeaking };
}
