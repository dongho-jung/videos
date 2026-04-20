import type { SortElement, SortStep, AlgorithmResult } from "./types";

function clone(arr: SortElement[]): SortElement[] {
  return arr.map((e) => ({ ...e }));
}

function allIdx(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

// ────────────────────────────────────────────
// Bubble Sort  (stable)
// ────────────────────────────────────────────
function bubbleSort(input: SortElement[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];
  const sorted: number[] = [];

  for (let i = a.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (a[j].value > a[j + 1].value) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
      steps.push({ array: clone(a), active: [j, j + 1], sorted: [...sorted] });
    }
    sorted.push(i);
  }
  sorted.push(0);
  steps.push({ array: clone(a), active: [], sorted: allIdx(a.length) });
  return steps;
}

// ────────────────────────────────────────────
// Selection Sort  (unstable)
// ────────────────────────────────────────────
function selectionSort(input: SortElement[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];
  const sorted: number[] = [];

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({
        array: clone(a),
        active: [minIdx, j],
        sorted: [...sorted],
      });
      if (a[j].value < a[minIdx].value) minIdx = j;
    }
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]];
    sorted.push(i);
    steps.push({ array: clone(a), active: [i], sorted: [...sorted] });
  }
  sorted.push(a.length - 1);
  steps.push({ array: clone(a), active: [], sorted: allIdx(a.length) });
  return steps;
}

// ────────────────────────────────────────────
// Insertion Sort  (stable)
// ────────────────────────────────────────────
function insertionSort(input: SortElement[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];

  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1].value > a[j].value) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      steps.push({ array: clone(a), active: [j - 1, j], sorted: [] });
      j--;
    }
    steps.push({ array: clone(a), active: [j], sorted: [] });
  }
  steps.push({ array: clone(a), active: [], sorted: allIdx(a.length) });
  return steps;
}

// ────────────────────────────────────────────
// Shell Sort  (unstable)
// ────────────────────────────────────────────
function shellSort(input: SortElement[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];
  const n = a.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let j = i;
      while (j >= gap && a[j - gap].value > a[j].value) {
        [a[j - gap], a[j]] = [a[j], a[j - gap]];
        steps.push({ array: clone(a), active: [j - gap, j], sorted: [] });
        j -= gap;
      }
    }
  }
  steps.push({ array: clone(a), active: [], sorted: allIdx(a.length) });
  return steps;
}

// ────────────────────────────────────────────
// Merge Sort  (stable)
// ────────────────────────────────────────────
function mergeSort(input: SortElement[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];

  function merge(left: number, mid: number, right: number) {
    const tmp: SortElement[] = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      steps.push({ array: clone(a), active: [i, j], sorted: [] });
      if (a[i].value <= a[j].value) {
        tmp.push({ ...a[i++] });
      } else {
        tmp.push({ ...a[j++] });
      }
    }
    while (i <= mid) tmp.push({ ...a[i++] });
    while (j <= right) tmp.push({ ...a[j++] });

    for (let k = 0; k < tmp.length; k++) a[left + k] = tmp[k];

    const merged = Array.from({ length: right - left + 1 }, (_, k) => left + k);
    steps.push({ array: clone(a), active: merged, sorted: [] });
  }

  function sort(l: number, r: number) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    sort(l, m);
    sort(m + 1, r);
    merge(l, m, r);
  }

  sort(0, a.length - 1);
  steps.push({ array: clone(a), active: [], sorted: allIdx(a.length) });
  return steps;
}

// ────────────────────────────────────────────
// Quick Sort  (unstable)
// ────────────────────────────────────────────
function quickSort(input: SortElement[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];
  const sorted: number[] = [];

  function partition(lo: number, hi: number): number {
    const pv = a[hi].value;
    let i = lo - 1;

    for (let j = lo; j < hi; j++) {
      steps.push({ array: clone(a), active: [j, hi], sorted: [...sorted] });
      if (a[j].value <= pv) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ array: clone(a), active: [i, j], sorted: [...sorted] });
        }
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    sorted.push(i + 1);
    steps.push({ array: clone(a), active: [i + 1], sorted: [...sorted] });
    return i + 1;
  }

  function sort(lo: number, hi: number) {
    if (lo < hi) {
      const pi = partition(lo, hi);
      sort(lo, pi - 1);
      sort(pi + 1, hi);
    } else if (lo === hi && !sorted.includes(lo)) {
      sorted.push(lo);
    }
  }

  sort(0, a.length - 1);
  steps.push({ array: clone(a), active: [], sorted: allIdx(a.length) });
  return steps;
}

// ────────────────────────────────────────────
// Heap Sort  (unstable)
// ────────────────────────────────────────────
function heapSort(input: SortElement[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];
  const sorted: number[] = [];

  function heapify(size: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < size && a[l].value > a[largest].value) largest = l;
    if (r < size && a[r].value > a[largest].value) largest = r;

    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      steps.push({
        array: clone(a),
        active: [i, largest],
        sorted: [...sorted],
      });
      heapify(size, largest);
    }
  }

  // Build max-heap
  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {
    heapify(a.length, i);
  }
  steps.push({ array: clone(a), active: allIdx(a.length), sorted: [] });

  // Extract
  for (let i = a.length - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.push(i);
    steps.push({ array: clone(a), active: [0, i], sorted: [...sorted] });
    heapify(i, 0);
  }
  sorted.push(0);
  steps.push({ array: clone(a), active: [], sorted: allIdx(a.length) });
  return steps;
}

// ────────────────────────────────────────────
// Bogo Sort  (unstable, hilariously bad)
// ────────────────────────────────────────────
function bogoSort(input: SortElement[], maxSteps = 500): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];

  // Seeded PRNG for deterministic video
  let seed = 42;
  function rand() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  function isSorted(): boolean {
    for (let i = 1; i < a.length; i++) {
      if (a[i - 1].value > a[i].value) return false;
    }
    return true;
  }

  if (isSorted()) {
    steps.push({ array: clone(a), active: [], sorted: allIdx(a.length) });
    return steps;
  }

  for (let c = 0; c < maxSteps; c++) {
    // Fisher-Yates shuffle
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (isSorted()) {
      steps.push({ array: clone(a), active: [], sorted: allIdx(a.length) });
      return steps;
    }
    steps.push({ array: clone(a), active: allIdx(a.length), sorted: [] });
  }

  return steps;
}

// ────────────────────────────────────────────
// Runner
// ────────────────────────────────────────────
export function runAlgorithms(data: SortElement[]): AlgorithmResult[] {
  const initial: SortStep = { array: clone(data), active: [], sorted: [] };

  const results: AlgorithmResult[] = [
    {
      name: "Bubble Sort",
      stable: true,
      timeComplexity: "O(n\u00B2)",
      steps: bubbleSort(data),
    },
    {
      name: "Selection Sort",
      stable: false,
      timeComplexity: "O(n\u00B2)",
      steps: selectionSort(data),
    },
    {
      name: "Insertion Sort",
      stable: true,
      timeComplexity: "O(n\u00B2)",
      steps: insertionSort(data),
    },
    {
      name: "Shell Sort",
      stable: false,
      timeComplexity: "O(n log\u00B2n)",
      steps: shellSort(data),
    },
    {
      name: "Merge Sort",
      stable: true,
      timeComplexity: "O(n log n)",
      steps: mergeSort(data),
    },
    {
      name: "Quick Sort",
      stable: false,
      timeComplexity: "O(n log n)",
      steps: quickSort(data),
    },
    {
      name: "Heap Sort",
      stable: false,
      timeComplexity: "O(n log n)",
      steps: heapSort(data),
    },
    {
      name: "Bogo Sort",
      stable: false,
      timeComplexity: "O((n+1)!)",
      steps: bogoSort(data),
    },
  ];

  // Prepend initial unsorted state to every trace
  for (const r of results) {
    r.steps.unshift({ ...initial, array: clone(data) });
  }

  return results;
}
