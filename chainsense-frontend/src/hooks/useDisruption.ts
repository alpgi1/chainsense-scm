import { useState } from 'react';
import { disruptionsApi } from '../api/disruptions';
import type { AnalyzeRequest } from '../api/disruptions';
import type { DisruptionResponse } from '../types/risk.types';
import { MOCK_DISRUPTIONS } from '../data/mockData';

type PipelineStatus = 'idle' | 'step1' | 'step2' | 'done';

interface UseDisruptionReturn {
  result: DisruptionResponse | null;
  loading: boolean;
  pipelineStatus: PipelineStatus;
  error: string | null;
  analyze: (req: AnalyzeRequest) => Promise<void>;
  approve: (id: string) => Promise<void>;
  reject: (id: string) => Promise<void>;
  reset: () => void;
}

export function useDisruption(): UseDisruptionReturn {
  const [result, setResult] = useState<DisruptionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const analyze = async (req: AnalyzeRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setPipelineStatus('step1');

    try {
      // Simulate pipeline steps for UX even when real API responds
      const startTime = Date.now();
      const data = await disruptionsApi.analyze(req);
      const elapsed = Date.now() - startTime;

      // Ensure minimum visual time for each step
      if (elapsed < 1500) {
        await new Promise((r) => setTimeout(r, 1500 - elapsed));
      }
      setPipelineStatus('step2');
      await new Promise((r) => setTimeout(r, 1200));
      setPipelineStatus('done');
      await new Promise((r) => setTimeout(r, 400));
      setResult(data);
    } catch {
      // Fallback to mock
      setPipelineStatus('step2');
      await new Promise((r) => setTimeout(r, 1200));
      setPipelineStatus('done');
      await new Promise((r) => setTimeout(r, 400));

      // Pick mock based on prompt content
      const mockResult = req.chaosPrompt.toLowerCase().includes('hamburg')
        ? MOCK_DISRUPTIONS[0]
        : MOCK_DISRUPTIONS[1];

      const mockWithPrompt: DisruptionResponse = {
        ...mockResult,
        id: `mock-${Date.now()}`,
        chaosPrompt: req.chaosPrompt,
        retrievalMode: req.retrievalMode,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
      };

      setResult(mockWithPrompt);
    } finally {
      setLoading(false);
    }
  };

  // No whole-disruption approve/reject endpoint — update local state only
  const approve = async (id: string) => {
    if (result && result.id === id) {
      setResult({ ...result, status: 'APPROVED' });
    }
  };

  const reject = async (id: string) => {
    if (result && result.id === id) {
      setResult({ ...result, status: 'REJECTED' });
    }
  };

  const reset = () => {
    setResult(null);
    setPipelineStatus('idle');
    setError(null);
    setLoading(false);
  };

  return { result, loading, pipelineStatus, error, analyze, approve, reject, reset };
}
