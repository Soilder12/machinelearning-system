export enum ViewState {
  INTRO = 'INTRO',
  SUPERVISED = 'SUPERVISED',
  UNSUPERVISED = 'UNSUPERVISED',
  REINFORCEMENT = 'REINFORCEMENT',
  GENERATIVE = 'GENERATIVE'
}

export interface DataPoint {
  id: number;
  emoji: string;
  type: 'fruit' | 'animal';
  x: number;
  y: number;
  clusterGroup?: number; // 0, 1, or 2 for unsupervised
}

export interface GridCell {
  x: number;
  y: number;
  type: 'empty' | 'wall' | 'goal' | 'hazard' | 'start';
}