'use client';

/**
 * VoiceAITrigger — Additive Voice + AI Action Component
 *
 * A reusable component that provides a "Create with AI" / "Log with AI"
 * button with integrated Whisper STT voice input and Nova TTS output.
 *
 * This is a NEW additive component — it does NOT modify any existing
 * EliteBooks components, agents, or workflows.
 */

import React, { useState } from 'react';
import {
  Mic, MicOff, Sparkles, X, Bot, Loader2,
  Volume2, Square, Send,
} from 'lucide-react';
import styles from './VoiceAITrigger.module.css';
import { useVoice } from '@/hooks/useVoice';
import { useAgent } from '@/hooks/useAgent';
import { useAuth } from '@/hooks/useAuth';

interface VoiceAITriggerProps {
  /** Text for the trigger button (e.g. "Create with AI") */
  label: string;
  /** Icon to use on the trigger button */
  icon?: React.ReactNode;
  /** Module context label shown in the panel header */
  moduleLabel: string;
  /** Placeholder text for the prompt input */
  placeholder?: string;
  /** Example prompts shown as hint text */
  examplePrompts?: string[];
  /** Accent color for the trigger button border */
  accentColor?: string;
  /** Optional callback when the agent responds — parent pages can use this to refresh data */
  onAgentResponse?: (response: any) => void;
}

export default function VoiceAITrigger({
  label,
  icon,
  moduleLabel,
  placeholder = 'Describe what you need in plain English or use your voice...',
  examplePrompts = [],
  accentColor,
  onAgentResponse,
}: VoiceAITriggerProps) {
  const { user } = useAuth();
  const {
    isRecording,
    isPlaying,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
  } = useVoice();
  const { sendMessage, isLoading, response, error, clearResponse } = useAgent();

  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleVoiceToggle = async () => {
    if (isRecording) {
      const transcription = await stopRecording();
      if (transcription && transcription.trim()) {
        setPrompt(transcription);
      }
    } else {
      await startRecording();
    }
  };

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;
    const contextMessage = `[${moduleLabel} Context] ${prompt}`;
    const res = await sendMessage(contextMessage);
    if (onAgentResponse && res) {
      onAgentResponse(res);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSpeakResponse = async () => {
    if (response?.message) {
      await speak(response.message.slice(0, 4000), 'nova');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setPrompt('');
    clearResponse();
    stopSpeaking();
  };

  const triggerStyle = accentColor
    ? { borderColor: `${accentColor}66`, background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}10)`, color: accentColor }
    : undefined;

  return (
    <>
      {/* Trigger Button — sits alongside existing manual buttons */}
      <button
        className={styles.triggerBtn}
        onClick={() => setIsOpen(true)}
        style={triggerStyle}
      >
        {icon || <Sparkles size={14} />}
        {label}
      </button>

      {/* Voice + AI Panel Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div
            className={`${styles.panel} glass-card animate-scale-in`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.headerIcon}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className={styles.headerTitle}>{label}</h3>
                    <span className={styles.headerBadge}>
                      <Bot size={12} /> {moduleLabel}
                    </span>
                  </div>
                  <p className={styles.headerSubtitle}>
                    Speak or type your request — AI will assist alongside your manual workflow
                  </p>
                </div>
              </div>
              <button className="btn-icon btn-ghost" onClick={handleClose} style={{ cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Prompt Input + Voice */}
            <div className={styles.promptArea}>
              <span className={styles.promptLabel}>
                <Sparkles size={13} /> Natural Language + Voice Input
              </span>
              <div className={styles.promptRow}>
                <input
                  type="text"
                  className={styles.promptInput}
                  placeholder={placeholder}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <button
                  className={`${styles.voiceBtn} ${isRecording ? styles.voiceBtnRecording : ''}`}
                  onClick={handleVoiceToggle}
                  title={isRecording ? 'Stop & Transcribe' : 'Speak (Whisper STT)'}
                  type="button"
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  {isRecording ? 'Stop' : 'Voice'}
                </button>
              </div>

              {/* Example Prompts */}
              {examplePrompts.length > 0 && !prompt && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {examplePrompts.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPrompt(ex)}
                      style={{
                        fontSize: '11px',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        background: 'rgba(139, 92, 246, 0.08)',
                        color: '#a78bfa',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Send Button */}
            <div className={styles.submitRow}>
              <button
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={!prompt.trim() || isLoading}
                type="button"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing with Agent...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send to AI Agent</span>
                  </>
                )}
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className={styles.loadingRow}>
                <Loader2 size={16} className="animate-spin" />
                <span>Agent is reasoning over your request...</span>
              </div>
            )}

            {/* Agent Response */}
            {response && (
              <div className={styles.responseArea}>
                <div className={styles.responseHeader}>
                  <Bot size={14} />
                  <span>
                    {response.agentUsed || moduleLabel} Agent Response
                  </span>
                </div>
                <div className={styles.responseText}>
                  {response.message}
                </div>
                <div className={styles.ttsRow}>
                  {!isPlaying ? (
                    <button
                      className={styles.ttsBtn}
                      onClick={handleSpeakResponse}
                      type="button"
                    >
                      <Volume2 size={12} /> Listen (Nova)
                    </button>
                  ) : (
                    <button
                      className={styles.ttsBtn}
                      onClick={stopSpeaking}
                      type="button"
                    >
                      <Square size={12} /> Stop
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: '8px',
                  color: '#f43f5e',
                  fontSize: '13px',
                }}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
