'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Mic, Send, X, Volume2, VolumeX, Bot, Sparkles, Loader2, Trash2 } from 'lucide-react';
import styles from './AIAssistant.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [predictedQuestions, setPredictedQuestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Load messages from localStorage on mount
    const saved = localStorage.getItem('elite_chat_history');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'assistant', content: 'Hello! I am your EliteBooks assistant. How can I help you with your accounting today?' }]);
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage on change
    if (messages.length > 0) {
      localStorage.setItem('elite_chat_history', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', content: text } as Message];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        setPredictedQuestions(data.predictedQuestions || []);
        if (autoRead) {
          playTTS(data.answer);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to the assistant.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        sendAudioToSTT(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      alert('Could not access microphone.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const sendAudioToSTT = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'voice.mp3');

    try {
      setIsTyping(true);
      const response = await fetch('/api/voice', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.text) {
        handleSend(data.text);
      }
    } catch (error) {
      console.error('STT error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const playTTS = async (text: string) => {
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  const clearHistory = () => {
    const initial = [{ role: 'assistant', content: 'Hello! I am your EliteBooks assistant. How can I help you with your accounting today?' } as Message];
    setMessages(initial);
    localStorage.removeItem('elite_chat_history');
    setPredictedQuestions([]);
  };

  return (
    <div className={styles.assistantContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <Sparkles size={16} className="text-gradient" />
              <span>EliteBooks AI</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={styles.iconBtn} 
                onClick={clearHistory}
                title="Clear History"
              >
                <Trash2 size={18} />
              </button>
              <button 
                className={styles.iconBtn} 
                onClick={() => setAutoRead(!autoRead)}
                title={autoRead ? "Disable Auto-read" : "Enable Auto-read"}
              >
                {autoRead ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button className={styles.iconBtn} onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>
          
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.message} ${styles.aiMessage}`}>
                <Loader2 size={16} className="animate-spin" />
              </div>
            )}
            {!isTyping && predictedQuestions.length > 0 && (
              <div className={styles.predictions}>
                {predictedQuestions.map((q, i) => (
                  <button key={i} className={styles.predictionChip} onClick={() => handleSend(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form 
            className={styles.inputArea} 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <button 
              type="button" 
              className={`${styles.iconBtn} ${isRecording ? styles.recording : ''}`}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
            >
              <Mic size={20} />
            </button>
            <input 
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
            />
            <button type="submit" className={styles.iconBtn}>
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : (
          <>
            <MessageSquare size={28} />
            {!isOpen && <span className={styles.triggerLabel}>Ask about EliteBooks</span>}
          </>
        )}
      </button>
    </div>
  );
}
