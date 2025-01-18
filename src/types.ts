export interface ActivationData {
  date?: string;
  empId: string;
  agentName: string;
  silver: number;
  gold: number;
  platinum: number;
  standard: number;
  total: number;
  target: number;
  achieved: number;
  remaining: number;
}

export interface SheetInfo {
  name: string;
  date: string;
}

export interface SheetData {
  date: string;
  activations: ActivationData[];
  totals: {
    silver: number;
    gold: number;
    platinum: number;
    standard: number;
    total: number;
  };
}