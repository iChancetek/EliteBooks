'use client';

import { useState, useCallback, useRef } from 'react';

export interface SupportedVoiceLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: SupportedVoiceLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English (US)' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: '中文 (Mandarin)' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

interface UseVoiceReturn {
  isRecording: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  transcript: string | null;
  language: string;
  setLanguage: (lang: string) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
  speak: (text: string, voice?: string) => Promise<void>;
  pauseSpeaking: () => void;
  resumeSpeaking: () => Promise<void>;
  stopSpeaking: () => void;
}

export function useVoice(): UseVoiceReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);

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

        // Send to Whisper API with selected language
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('language', language);

        try {
          const res = await fetch('/api/voice', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          setTranscript(data.text);
          resolve(data.text || '');
        } catch (error) {
          reject(error);
        }

        // Stop all tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.stop();
    });
  }, [language]);

  const speak = useCallback(async (text: string, voice: string = 'nova') => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
        currentAudioUrlRef.current = null;
      }

      setIsPlaying(true);
      setIsPaused(false);

      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudioUrlRef.current = audioUrl;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        if (currentAudioUrlRef.current) {
          URL.revokeObjectURL(currentAudioUrlRef.current);
          currentAudioUrlRef.current = null;
        }
      };

      await audio.play();
    } catch (error) {
      console.error('TTS failed:', error);
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, []);

  const pauseSpeaking = useCallback(() => {
    if (audioRef.current && isPlaying && !isPaused) {
      audioRef.current.pause();
      setIsPaused(true);
    }
  }, [isPlaying, isPaused]);

  const resumeSpeaking = useCallback(async () => {
    if (audioRef.current && isPlaying && isPaused) {
      try {
        await audioRef.current.play();
        setIsPaused(false);
      } catch (error) {
        console.error('Resume audio playback error:', error);
      }
    }
  }, [isPlaying, isPaused]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  return { 
    isRecording, 
    isPlaying, 
    isPaused, 
    transcript, 
    language, 
    setLanguage, 
    startRecording, 
    stopRecording, 
    speak, 
    pauseSpeaking, 
    resumeSpeaking, 
    stopSpeaking 
  };
}
