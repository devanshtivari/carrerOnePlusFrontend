import api from '@/lib/api';

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiChatResponse {
  reply: string;
  usage?: { promptTokens?: number; completionTokens?: number };
}

export const aiChatService = {
  send: async (payload: {
    messages: AiChatMessage[];
    context?: string;
    contextType?: string;
    contextId?: string;
  }): Promise<AiChatResponse> => {
    const { data } = await api.post<AiChatResponse>('/ai-chat', payload);
    return data;
  },
};
