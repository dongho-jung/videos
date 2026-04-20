import {
	AbsoluteFill,
	useCurrentFrame,
	interpolate,
	Easing,
} from "remotion";
import {
	INITIAL_ARRAY,
	STEPS,
	FRAMES_PER_STEP,
	INTRO_FRAMES,
} from "./steps";

const BAR_WIDTH = 100;
const BAR_GAP = 16;
const MAX_BAR_HEIGHT = 500;
const BAR_AREA_WIDTH =
	INITIAL_ARRAY.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
const MAX_VALUE = Math.max(...INITIAL_ARRAY);

const COLORS = {
	default: "#4A90D9",
	comparing: "#FFD700",
	sorted: "#50C878",
	bg: "#0D1117",
	text: "#E6EDF3",
};

function clamp(v: number, min: number, max: number) {
	return Math.max(min, Math.min(max, v));
}

export const Main: React.FC = () => {
	const frame = useCurrentFrame();

	// Map frame to sort step
	const sortFrame = frame - INTRO_FRAMES;
	const rawStepIdx = sortFrame / FRAMES_PER_STEP;
	const stepIdx = clamp(Math.floor(rawStepIdx), 0, STEPS.length - 1);
	const prevIdx = clamp(stepIdx - 1, 0, STEPS.length - 1);
	const progress = clamp(
		sortFrame <= 0 ? 0 : rawStepIdx - stepIdx,
		0,
		1,
	);

	const cur = STEPS[stepIdx];
	const prev = sortFrame <= 0 ? cur : STEPS[prevIdx];
	const isOutro = sortFrame >= STEPS.length * FRAMES_PER_STEP;
	const isDone = stepIdx === STEPS.length - 1;

	const eased = interpolate(progress, [0, 1], [0, 1], {
		easing: Easing.inOut(Easing.cubic),
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: COLORS.bg,
				fontFamily: "'Inter', 'SF Pro Display', sans-serif",
			}}
		>
			{/* Title */}
			<div
				style={{
					position: "absolute",
					top: 80,
					width: "100%",
					textAlign: "center",
					opacity: interpolate(frame, [0, 20], [0, 1], {
						extrapolateRight: "clamp",
					}),
				}}
			>
				<span
					style={{
						color: COLORS.text,
						fontSize: 72,
						fontWeight: 700,
						letterSpacing: -2,
					}}
				>
					Bubble Sort
				</span>
			</div>

			{/* Bar area */}
			<div
				style={{
					position: "absolute",
					bottom: 200,
					left: (1920 - BAR_AREA_WIDTH) / 2,
					width: BAR_AREA_WIDTH,
					height: MAX_BAR_HEIGHT + 50,
				}}
			>
				{INITIAL_ARRAY.map((value) => {
					const curIdx = cur.array.indexOf(value);
					const prevPos = prev.array.indexOf(value);

					// Smoothly interpolate x position during swaps
					const x = interpolate(
						eased,
						[0, 1],
						[
							prevPos * (BAR_WIDTH + BAR_GAP),
							curIdx * (BAR_WIDTH + BAR_GAP),
						],
					);

					const barH = (value / MAX_VALUE) * MAX_BAR_HEIGHT;

					// Staggered intro: bars grow up from bottom
					const initPos = INITIAL_ARRAY.indexOf(value);
					const introDelay = initPos * 3;
					const introProgress = interpolate(
						frame,
						[introDelay, introDelay + 15],
						[0, 1],
						{
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
							easing: Easing.out(Easing.back(1.4)),
						},
					);

					// Color
					let color = COLORS.default;
					if (isDone || isOutro || curIdx >= cur.sortedFrom) {
						color = COLORS.sorted;
					} else if (
						cur.comparing &&
						(curIdx === cur.comparing[0] ||
							curIdx === cur.comparing[1])
					) {
						color = COLORS.comparing;
					}

					// Outro pulse
					const outroFrame =
						sortFrame - STEPS.length * FRAMES_PER_STEP;
					const scaleY =
						isOutro
							? interpolate(
									outroFrame,
									[0, 12, 24],
									[1, 1.06, 1],
									{ extrapolateRight: "clamp" },
								)
							: 1;

					return (
						<div
							key={value}
							style={{
								position: "absolute",
								bottom: 50,
								left: x,
								width: BAR_WIDTH,
								height: barH * introProgress,
								backgroundColor: color,
								borderRadius: "8px 8px 4px 4px",
								transform: `scaleY(${scaleY})`,
								transformOrigin: "bottom",
								display: "flex",
								justifyContent: "center",
								alignItems: "flex-start",
								paddingTop: 14,
								boxShadow: `0 0 ${color === COLORS.comparing ? 20 : 0}px ${color === COLORS.comparing ? "rgba(255,215,0,0.4)" : "transparent"}`,
							}}
						>
							<span
								style={{
									color:
										color === COLORS.comparing
											? "#000"
											: "#fff",
									fontSize: 30,
									fontWeight: 700,
								}}
							>
								{value}
							</span>
						</div>
					);
				})}

				{/* Comparison arrows */}
				{cur.comparing && sortFrame >= 0 && !isOutro && (
					<>
						{cur.comparing.map((idx) => (
							<div
								key={idx}
								style={{
									position: "absolute",
									bottom: 10,
									left:
										idx * (BAR_WIDTH + BAR_GAP) +
										BAR_WIDTH / 2 -
										10,
									width: 0,
									height: 0,
									borderLeft: "10px solid transparent",
									borderRight: "10px solid transparent",
									borderBottom: `14px solid ${COLORS.comparing}`,
								}}
							/>
						))}
					</>
				)}
			</div>
		</AbsoluteFill>
	);
};
