import type { SortElement } from "./types";

function make(values: number[], labels?: string[]): SortElement[] {
  return values.map((v, i) => ({
    value: v,
    label: labels ? labels[i] : String(v),
    id: labels ? labels[i] : `e${i}`,
    originalIndex: i,
  }));
}

export const DATASETS = {
  random: {
    title: "Random",
    subtitle: "\uBB34\uC791\uC704 \uBC30\uC5F4",
    caseType: "default" as const,
    data: make([12, 5, 15, 3, 9, 7, 14, 1, 10, 6, 13, 2, 11, 8, 16, 4]),
  },
  reversed: {
    title: "Reversed",
    subtitle: "\uC5ED\uC815\uB82C \uBC30\uC5F4",
    caseType: "default" as const,
    data: make([16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]),
  },
  nearlySorted: {
    title: "Nearly Sorted",
    subtitle: "\uAC70\uC758 \uC815\uB82C\uB41C \uBC30\uC5F4",
    caseType: "default" as const,
    data: make([1, 2, 3, 4, 6, 5, 7, 8, 9, 11, 10, 12, 13, 14, 16, 15]),
  },
  stability: {
    title: "Stability Test",
    subtitle: "\uC548\uC815\uC131 \uD14C\uC2A4\uD2B8",
    caseType: "stability" as const,
    data: make(
      [2, 4, 1, 3, 4, 2, 3, 1, 3, 1, 2, 4, 1, 3, 4, 2],
      [
        "2\u2081", "4\u2081", "1\u2081", "3\u2081",
        "4\u2082", "2\u2082", "3\u2082", "1\u2082",
        "3\u2083", "1\u2083", "2\u2083", "4\u2083",
        "1\u2084", "3\u2084", "4\u2084", "2\u2084",
      ],
    ),
  },
};
