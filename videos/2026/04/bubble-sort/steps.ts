export type SortStep = {
	array: number[];
	comparing: [number, number] | null;
	sortedFrom: number; // indices >= this are in final position
};

export const INITIAL_ARRAY = [7, 4, 10, 8, 2, 9, 1, 6, 3, 5];
export const FRAMES_PER_STEP = 10;
export const INTRO_FRAMES = 30;
export const OUTRO_FRAMES = 60;

function computeSteps(initial: number[]): SortStep[] {
	const arr = [...initial];
	const n = arr.length;
	const steps: SortStep[] = [];

	// Initial idle state
	steps.push({ array: [...arr], comparing: null, sortedFrom: n });

	for (let i = 0; i < n - 1; i++) {
		let swapped = false;
		for (let j = 0; j < n - 1 - i; j++) {
			// Show comparison
			steps.push({
				array: [...arr],
				comparing: [j, j + 1],
				sortedFrom: n - i,
			});

			if (arr[j] > arr[j + 1]) {
				[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
				// Show result after swap
				steps.push({
					array: [...arr],
					comparing: [j, j + 1],
					sortedFrom: n - i,
				});
				swapped = true;
			}
		}
		if (!swapped) break;
	}

	// Final sorted state
	steps.push({ array: [...arr], comparing: null, sortedFrom: 0 });

	return steps;
}

export const STEPS = computeSteps(INITIAL_ARRAY);
export const TOTAL_FRAMES =
	INTRO_FRAMES + STEPS.length * FRAMES_PER_STEP + OUTRO_FRAMES;
