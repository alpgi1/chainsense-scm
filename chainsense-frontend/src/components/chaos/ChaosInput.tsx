import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Database, Brain, Send, RotateCcw } from 'lucide-react';
import { CHAOS_PRESETS } from '../../data/mockData';
import { useRetrievalMode } from '../../hooks/useRetrievalMode';
import type { RetrievalMode } from '../../types/risk.types';
import * as Switch from '@radix-ui/react-switch';

interface ChaosInputProps {
  onSubmit: (prompt: string, mode: RetrievalMode) => void;
  loading: boolean;
  onReset?: () => void;
  hasResult?: boolean;
}

export function ChaosInput({ onSubmit, loading, onReset, hasResult }: ChaosInputProps) {
  const { mode, setMode } = useRetrievalMode();
  const [prompt, setPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePreset = (index: number) => {
    setSelectedPreset(index);
    setPrompt(CHAOS_PRESETS[index].prompt);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    onSubmit(prompt.trim(), mode);
  };

  const handleReset = () => {
    setPrompt('');
    setSelectedPreset(null);
    onReset?.();
  };

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--accent-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap size={15} color="var(--accent)" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            Chaos Scenario Input
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            Describe a disruption event to trigger AI analysis
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: 20 }}>
        {/* Preset buttons */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              marginBottom: 8,
            }}
          >
            Quick Scenarios
          </div>
          <div
            style={{
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              paddingBottom: 4,
            }}
          >
            {CHAOS_PRESETS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePreset(i)}
                style={{
                  flexShrink: 0,
                  padding: '6px 12px',
                  borderRadius: 7,
                  border: `1px solid ${selectedPreset === i ? 'var(--border-accent)' : 'var(--border)'}`,
                  background: selectedPreset === i ? 'var(--accent-muted)' : 'var(--bg-elevated)',
                  color: selectedPreset === i ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: selectedPreset === i ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div style={{ marginBottom: 16 }}>
          <textarea
            ref={textareaRef}
            className="cs-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the disruption event in detail. E.g. 'A 7.2 magnitude earthquake struck Taiwan, shutting down semiconductor fabs for an estimated 30-45 days...'"
            rows={5}
            disabled={loading}
            style={{ minHeight: 130 }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 4,
              fontSize: 11,
              color: 'var(--text-tertiary)',
            }}
          >
            {prompt.length} chars
          </div>
        </div>

        {/* Mode toggle row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            padding: '12px 14px',
            borderRadius: 8,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {mode === 'RAG' ? (
              <Brain size={15} color="var(--accent)" />
            ) : (
              <Database size={15} color="var(--text-tertiary)" />
            )}
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: mode === 'RAG' ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                {mode === 'RAG' ? 'Enterprise RAG Mode' : 'Context Mode'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                {mode === 'RAG'
                  ? 'Semantic vector retrieval from knowledge base'
                  : 'Direct product and supplier context injection'}
              </div>
            </div>
          </div>
          <Switch.Root
            checked={mode === 'RAG'}
            onCheckedChange={(checked) => setMode(checked ? 'RAG' : 'CONTEXT')}
            style={{
              width: 38,
              height: 22,
              background: mode === 'RAG' ? 'var(--accent)' : 'var(--bg-overlay)',
              borderRadius: 99,
              border: '1px solid var(--border)',
              cursor: 'pointer',
              position: 'relative',
              outline: 'none',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <Switch.Thumb
              style={{
                display: 'block',
                width: 16,
                height: 16,
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: 2,
                left: mode === 'RAG' ? 18 : 2,
                transition: 'left 0.2s',
              }}
            />
          </Switch.Root>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={!prompt.trim() || loading}
            style={{ flex: 1, justifyContent: 'center', padding: '11px 20px' }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap size={15} />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <Send size={15} />
                Run Analysis
              </>
            )}
          </button>

          {(hasResult || prompt) && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              disabled={loading}
              style={{ padding: '11px 14px' }}
              title="Reset"
            >
              <RotateCcw size={15} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
