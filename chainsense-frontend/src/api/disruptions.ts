import client from './client';
import type { DisruptionResponse, CompareResponse } from '../types/risk.types';

export interface AnalyzeRequest {
  chaosPrompt: string;
  retrievalMode: 'CONTEXT' | 'RAG';
}

export const disruptionsApi = {
  analyze: async (req: AnalyzeRequest): Promise<DisruptionResponse> => {
    const { data } = await client.post<DisruptionResponse>('/disruptions/analyze', req);
    return data;
  },

  getAll: async (): Promise<DisruptionResponse[]> => {
    const { data } = await client.get<DisruptionResponse[]>('/disruptions');
    return data;
  },

  getById: async (id: string): Promise<DisruptionResponse> => {
    const { data } = await client.get<DisruptionResponse>(`/disruptions/${id}`);
    return data;
  },

  approve: async (id: string): Promise<DisruptionResponse> => {
    const { data } = await client.post<DisruptionResponse>(`/disruptions/${id}/approve`);
    return data;
  },

  reject: async (id: string): Promise<DisruptionResponse> => {
    const { data } = await client.post<DisruptionResponse>(`/disruptions/${id}/reject`);
    return data;
  },

  compare: async (
    promptA: string,
    promptB: string,
    retrievalMode: 'CONTEXT' | 'RAG',
  ): Promise<CompareResponse> => {
    const { data } = await client.post<CompareResponse>('/disruptions/compare', {
      promptA,
      promptB,
      retrievalMode,
    });
    return data;
  },
};
