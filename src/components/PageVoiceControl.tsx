'use client';

import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Mic, MicOff, 
  Play, Pause, RotateCcw, Sparkles, 
  MessageSquare, X, Bot, Loader2
} from 'lucide-react';
import styles from './PageVoiceControl.module.css';
import { useVoice } from '@/hooks/useVoice';

interface PageVoiceControlProps {
  contentId: string;
  pageTitle: string;
}

export default function PageVoiceControl({ contentId, pageTitle }: PageVoiceControlProps) {
  const { isRecording, isPlaying, transcript, startRecording, stopRecording, speak, stopSpeaking } = useVoice();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const handleReadPage = async () => {
    if (isPlaying) {
      stopSpeaking();
      return;
    }

    const element = document.getElementById(contentId);
    if (element) {
      const text = element.innerText;
      // We limit to first 2000 chars for a good UX or we could chunk it
      const intro = `Reading ${pageTitle}. `;
      await speak(intro + text.slice(0, 3000));
    }
  };

  const handleVoiceQuery = async () => {
    if (isRecording) {
      const query = await stopRecording();
      if (query) {
        setIsAnswering(true);
        setIsExpanded(true);
        try {
          const res = await fetch('/api/chat/rag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              messages: [
                { role: 'user', content: `Context: This is the ${pageTitle} page. Question: ${query}` }
              ] 
            }),
          });
          const data = await res.json();
          if (data.success) {
            setAnswer(data.answer);
            await speak(data.answer);
          }
        } catch (error) {
          console.error('Query failed:', error);
        } finally {
          setIsAnswering(false);
        }
      }
    } else {
      await startRecording();
    }
  };

  return (
    <div className={`${styles.container} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.controls}>
        <button 
          className={`${styles.btn} ${isPlaying ? styles.active : ''}`}
          onClick={handleReadPage}
          title={isPlaying ? "Stop Reading" : "Read Page Aloud"}
        >
          {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
          <span className={styles.btnLabel}>{isPlaying ? 'Stop' : 'Listen'}</span>
        </button>

        <div className={styles.divider} />

        <button 
          className={`${styles.btn} ${isRecording ? styles.recording : ''}`}
          onClick={handleVoiceQuery}
          title={isRecording ? "Stop & Ask" : "Ask a Question"}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          <span className={styles.btnLabel}>{isRecording ? 'Listening...' : 'Ask AI'}</span>
        </button>

        {isExpanded && (
          <button className={styles.closeBtn} onClick={() => { setIsExpanded(false); setAnswer(null); stopSpeaking(); }}>
            <X size={16} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className={styles.answerArea}>
          <div className={styles.answerHeader}>
            <Bot size={14} />
            <span>EliteBooks AI • {pageTitle} Assistant</span>
          </div>
          <div className={styles.answerContent}>
            {isAnswering ? (
              <div className={styles.loading}>
                <Loader2 size={16} className="animate-spin" />
                <span>Thinking...</span>
              </div>
            ) : (
              <p>{answer || "Ask me anything about this page!"}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
