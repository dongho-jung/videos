export interface SortElement {
  value: number;
  label: string;
  id: string;
  originalIndex: number;
}

export interface SortStep {
  array: SortElement[];
  active: number[];
  sorted: number[];
}

export interface AlgorithmResult {
  name: string;
  stable: boolean;
  timeComplexity: string;
  steps: SortStep[];
}

export interface SceneData {
  caseTitle: string;
  caseSubtitle: string;
  caseType: "default" | "stability";
  algorithms: AlgorithmResult[];
  maxSteps: number;
}
