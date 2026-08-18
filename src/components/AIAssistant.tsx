'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Mic, Send, X, Volume2, VolumeX, Bot, Sparkles, Loader2, Trash2, Copy, Check, Zap } from 'lucide-react';
import styles from './AIAssistant.module.css';
import { useAuth } from '@/hooks/useAuth';
import GraphRAGTopologyCard from './GraphRAGTopologyCard';
import RichMessageContent from './RichMessageContent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function AIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [predictedQuestions, setPredictedQuestions] = useState<string[]>([]);
  const [copiedMsgIdx, setCopiedMsgIdx] = useState<number | null>(null);
  
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
      setMessages([{ 
        role: 'assistant', 
        content: 'Hello! I am your **EliteBooks Autonomous Finance Co-Pilot** powered by **GPT-5.6-Terra**. How can I assist with your general ledger, double-entry reconciliations, or strategic tax planning today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage on change
    if (messages.length > 0) {
      localStorage.setItem('elite_chat_history', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Predict next questions when user receives response
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      predictFollowUps(messages[messages.length - 1].content);
    }
  }, [messages]);

  const predictFollowUps = async (lastResponse: string) => {
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: lastResponse })
      });
      const data = await res.json();
      if (data.questions) {
        setPredictedQuestions(data.questions);
      }
    } catch (e) {
      setPredictedQuestions([
        'Explain this in detail',
        'Show ledger balance impact',
        'Forecast 90-day cash flow'
      ]);
    }
  };

  const handleCopyMessage = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgIdx(idx);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { role: 'user', content: text, timestamp: timeStr };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);
    setPredictedQuestions([]);

    try {
      const token = user ? await user.getIdToken() : '';
      const res = await fetch('/api/chat/rag', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message: text,
          messages: messages.slice(-5)
        })
      });
      
      const data = await res.json();
      const aiResponse = data.message || "I apologize, but I couldn't process that request at this moment.";
      
      const aiMsg: Message = { 
        role: 'assistant', 
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      
      if (autoRead) {
        speakResponse(aiResponse);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'Error communicating with agent. Please verify connection and retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToWhisper(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToWhisper = async (audioBlob: Blob) => {
    setIsTyping(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.text) {
        handleSend(data.text);
      }
    } catch (e) {
      console.error('Transcription error:', e);
    } finally {
      setIsTyping(false);
    }
  };

  const speakResponse = async (text: string) => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  const clearHistory = () => {
    const initial: Message[] = [{ 
      role: 'assistant', 
      content: 'Hello! I am your **EliteBooks Autonomous Finance Co-Pilot** powered by **GPT-5.6-Terra**. How can I assist with your general ledger, double-entry reconciliations, or strategic tax planning today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
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
              <div className={styles.agentAvatar}>
                <Bot size={18} />
              </div>
              <div className={styles.headerText}>
                <div className={styles.headerName}>
                  <span>EliteBooks AI Co-Pilot</span>
                  <span className={styles.statusDot} />
                </div>
                <div className={styles.headerSubtitle}>
                  <Zap size={10} style={{ color: '#60a5fa' }} />
                  <span>GPT-5.6-Terra • Active RAG Grounded</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                className={styles.iconBtn} 
                onClick={clearHistory}
                title="Clear Chat History"
              >
                <Trash2 size={16} />
              </button>
              <button 
                className={styles.iconBtn} 
                onClick={() => setAutoRead(!autoRead)}
                title={autoRead ? "Disable Auto-read" : "Enable Auto-read"}
              >
                {autoRead ? <Volume2 size={16} style={{ color: '#3b82f6' }} /> : <VolumeX size={16} />}
              </button>
              <button className={styles.iconBtn} onClick={() => setIsOpen(false)} title="Close Chat">
                <X size={18} />
              </button>
            </div>
          </div>
          
          <div className={styles.messages}>
            {messages.map((msg, i) => {
              const isGraphRAG = msg.role === 'assistant' && (
                msg.content.includes('GRAPHRAG') || 
                msg.content.includes('KNOWLEDGE GRAPH') ||
                msg.content.includes('Active Entity Nodes Indexed')
              );

              if (isGraphRAG) {
                return (
                  <div key={i} style={{ width: '100%', margin: '4px 0' }}>
                    <GraphRAGTopologyCard rawText={msg.content} />
                  </div>
                );
              }

              if (msg.role === 'user') {
                return (
                  <div key={i} className={styles.userMessageWrapper}>
                    <div className={styles.userBubble}>
                      {msg.content}
                    </div>
                    {msg.timestamp && <span className={styles.messageTime}>{msg.timestamp}</span>}
                  </div>
                );
              }

              return (
                <div key={i} className={styles.aiMessageWrapper}>
                  <div className={styles.aiHeader}>
                    <span className={styles.aiBadge}>
                      <Sparkles size={10} /> GPT-5.6-Terra
                    </span>
                    {msg.timestamp && <span className={styles.messageTime}>{msg.timestamp}</span>}
                  </div>
                  <div className={styles.aiBubble}>
                    <RichMessageContent content={msg.content} />
                    <div className={styles.aiBubbleFooter}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => handleCopyMessage(msg.content, i)}
                        title="Copy response"
                      >
                        {copiedMsgIdx === i ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                        <span>{copiedMsgIdx === i ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => speakResponse(msg.content)}
                        title="Read aloud"
                      >
                        <Volume2 size={12} />
                        <span>Speak</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className={styles.aiMessageWrapper}>
                <div className={styles.aiHeader}>
                  <span className={styles.aiBadge}>
                    <Sparkles size={10} /> GPT-5.6-Terra
                  </span>
                </div>
                <div className={styles.typingBubble}>
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                  <span style={{ marginLeft: '4px' }}>Synthesizing multi-agent response...</span>
                </div>
              </div>
            )}

            {!isTyping && predictedQuestions.length > 0 && (
              <div className={styles.predictions}>
                <span className={styles.predictionsLabel}>Recommended Follow-Ups</span>
                <div className={styles.predictionChipsWrapper}>
                  {predictedQuestions.map((q, i) => (
                    <button key={i} className={styles.predictionChip} onClick={() => handleSend(q)}>
                      <span>{q}</span>
                      <Sparkles size={10} style={{ color: '#60a5fa' }} />
                    </button>
                  ))}
                </div>
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
              title={isRecording ? 'Listening...' : 'Hold to Speak'}
            >
              <Mic size={18} />
            </button>
            <div className={styles.inputContainer}>
              <input 
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask GPT-5.6-Terra about your finances..."
              />
            </div>
            <button type="submit" className={styles.sendBtn} title="Send Message" disabled={!input.trim() && !isRecording}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)} title="Open AI Financial Co-Pilot">
        <div className={styles.triggerPulse} />
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
        {!isOpen && <span className={styles.triggerLabel}>Ask GPT-5.6-Terra</span>}
      </button>
    </div>
  );
}
