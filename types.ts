
export type Verdict = 'Truthful' | 'Sounds Suspicious' | 'Probably a Lie';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'friend';
  text: string;
  verdict?: Verdict;
  reason?: string;
  timestamp: number;
}

export interface AnalysisResponse {
  verdict: Verdict;
  reason: string;
}
