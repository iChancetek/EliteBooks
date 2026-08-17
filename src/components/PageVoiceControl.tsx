'use client';

import React, { useState } from 'react';
import { 
  Volume2, VolumeX, Mic, MicOff, 
  Play, Pause, Square, Sparkles, 
  Globe, X, Bot, Loader2, Radio
} from 'lucide-react';
import styles from './PageVoiceControl.module.css';
import { useVoice, SUPPORTED_LANGUAGES } from '@/hooks/useVoice';
import { useAuth } from '@/hooks/useAuth';

interface PageVoiceControlProps {
  contentId: string;
  pageTitle: string;
}

export default function PageVoiceControl({ contentId, pageTitle }: PageVoiceControlProps) {
  const { user } = useAuth();
  const { 
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
  } = useVoice();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleTogglePlay = async () => {
    if (isPlaying && !isPaused) {
      pauseSpeaking();
      return;
    }

    if (isPlaying && isPaused) {
      await resumeSpeaking();
      return;
    }

    // Start speaking from scratch
    const element = document.getElementById(contentId);
    if (element) {
      const text = element.innerText;
      const intro = `Welcome to the ${pageTitle} masterclass. `;
      await speak(intro + text.slice(0, 4000), 'nova');
    }
  };

  const handleStopAudio = () => {
    stopSpeaking();
  };

  const handleVoiceQuery = async () => {
    if (isRecording) {
      const query = await stopRecording();
      if (query && query.trim()) {
        setIsAnswering(true);
        setIsExpanded(true);
        try {
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (user) {
            const token = await user.getIdToken();
            headers['Authorization'] = `Bearer ${token}`;
          }

          const res = await fetch('/api/chat/rag', {
            method: 'POST',
            headers,
            body: JSON.stringify({ 
              messages: [
                { role: 'user', content: `Context: This is the ${pageTitle} page. Language: ${language}. Question: ${query}` }
              ] 
            }),
          });
          const data = await res.json();
          if (data.success) {
            setAnswer(data.answer);
            await speak(data.answer, 'nova');
          }
        } catch (error) {
          console.error('Voice query failed:', error);
        } finally {
          setIsAnswering(false);
        }
      }
    } else {
      await startRecording();
    }
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className={`${styles.container} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.controls}>
        {/* Play / Pause / Resume Button */}
        <button 
          className={`${styles.btn} ${isPlaying && !isPaused ? styles.active : ''}`}
          onClick={handleTogglePlay}
          title={isPlaying ? (isPaused ? "Resume Reading" : "Pause Reading") : "Listen (Nova AI Voice)"}
        >
          {isPlaying && !isPaused ? (
            <Pause size={18} />
          ) : (
            <Play size={18} />
          )}
          <span className={styles.btnLabel}>
            {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Listen (Nova)'}
          </span>
        </button>

        {/* Stop Button (visible while playing or paused) */}
        {isPlaying && (
          <button 
            className={`${styles.btn} ${styles.stopBtn}`}
            onClick={handleStopAudio}
            title="Stop Audio"
          >
            <Square size={14} />
            <span className={styles.btnLabel}>Stop</span>
          </button>
        )}

        <div className={styles.divider} />

        {/* Language Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className={styles.btn}
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            title="Switch Language (Whisper STT)"
            style={{ padding: '6px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Globe size={14} />
            <span style={{ fontWeight: 700 }}>{currentLangObj.code.toUpperCase()}</span>
          </button>

          {showLanguageMenu && (
            <div 
              style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: '8px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                minWidth: '160px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 1100,
              }}
            >
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', padding: '4px 8px', fontWeight: 700, textTransform: 'uppercase' }}>
                Whisper STT Languages
              </div>
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLanguageMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: language === lang.code ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
                    color: language === lang.code ? '#60a5fa' : '#e2e8f0',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <span>{lang.nativeName}</span>
                  <span style={{ fontSize: '10px', opacity: 0.6, textTransform: 'uppercase' }}>{lang.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.divider} />

        {/* Whisper STT Ask AI button */}
        <button 
          className={`${styles.btn} ${isRecording ? styles.recording : ''}`}
          onClick={handleVoiceQuery}
          title={isRecording ? "Stop & Transcribe" : `Ask with Voice (${currentLangObj.name})`}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
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
            <span>EliteBooks AI • {pageTitle} Assistant ({currentLangObj.name})</span>
          </div>
          <div className={styles.answerContent}>
            {isAnswering ? (
              <div className={styles.loading}>
                <Loader2 size={16} className="animate-spin" />
                <span>Transcribing Whisper audio & synthesizing answer...</span>
              </div>
            ) : (
              <p>{answer || `Ask any question in ${currentLangObj.name} using Whisper speech recognition!`}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
