// Research-related TypeScript types for stronger type safety

export type ResearchPhase = 'understanding' | 'planning' | 'searching' | 'analyzing' | 'synthesizing' | 'complete';

export type StatusColor = 'green' | 'orange' | 'gray';

export type ResearchStatusType = 'complete' | 'active' | 'idle';

export interface ResearchStatus {
  status: ResearchStatusType;
  label: string;
  color: StatusColor;
}

export const PHASE_LABELS: Record<ResearchPhase, string> = {
  understanding: 'Understanding',
  planning: 'Planning',
  searching: 'Searching',
  analyzing: 'Analyzing',
  synthesizing: 'Synthesizing',
  complete: 'Complete'
} as const;

export const RESEARCH_PHASES: readonly ResearchPhase[] = [
  'understanding',
  'planning',
  'searching',
  'analyzing',
  'synthesizing',
  'complete'
] as const;
