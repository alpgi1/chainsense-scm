import client from './client';
import type { DisruptionResponse, CompareResponse } from '../types/risk.types';

export interface AnalyzeRequest {
  chaosPrompt: string;
  retrievalMode: 'CONTEXT' | 'RAG';
}

export const disruptionsApi = {
  // Backend ChaosPromptRequest uses `prompt` field, not `chaosPrompt`
  analyze: async (req: AnalyzeRequest): Promise<DisruptionResponse> => {
    const { data } = await client.post<DisruptionResponse>('/disruptions/analyze', {
      prompt: req.chaosPrompt,
      retrievalMode: req.retrievalMode,
    });
    return data;
  },

  // Backend paginates — request page 0 size 50 for history
  getAll: async (): Promise<DisruptionResponse[]> => {
    const { data } = await client.get<DisruptionResponse[]>('/disruptions', {
      params: { page: 0, size: 50 },
    });
    return Array.isArray(data) ? data : [];
  },

  getById: async (id: string): Promise<DisruptionResponse> => {
    const { data } = await client.get<DisruptionResponse>(`/disruptions/${id}`);
    return data;
  },

  // Update overall disruption status: PATCH /disruptions/{id}/status
  updateStatus: async (
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'RESOLVED'
  ): Promise<void> => {
    await client.patch(`/disruptions/${id}/status`, { status });
  },

  // Per-action status update: PATCH /disruptions/{disruptionId}/actions/{actionId}
  updateActionStatus: async (
    disruptionId: string,
    actionId: string,
    status: 'APPROVED' | 'REJECTED'
  ): Promise<void> => {
    await client.patch(`/disruptions/${disruptionId}/actions/${actionId}`, { status });
  },

  // Execute approved plan — updates inventory, approves DecisionActions, sets RESOLVED
  execute: async (id: string): Promise<void> => {
    await client.post(`/disruptions/${id}/execute`);
  },

  compare: async (
    promptA: string,
    promptB: string,
    retrievalMode: 'CONTEXT' | 'RAG' = 'CONTEXT',
  ): Promise<CompareResponse> => {
    const { data } = await client.post<CompareResponse>('/disruptions/compare', {
      promptA,
      promptB,
      retrievalMode,
    });
    return data;
  },
};
