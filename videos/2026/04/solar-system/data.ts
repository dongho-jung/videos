export interface PlanetData {
  name: string;
  order: number;
  tagline: string;
  /** Exactly 2 captions — each pairs with an animated feature demo */
  features: [string, string];
  colors: {
    primary: string;
    secondary: string;
    highlight: string;
    atmosphere: string;
  };
  visualRadius: number;
  type: "rocky" | "gas" | "ice";
  tilt: number; // axial tilt in degrees (visual)
  rotationSpeed: number; // surface scroll px/frame (negative = retrograde)
}

export const PLANETS: PlanetData[] = [
  {
    name: "Mercury",
    order: 1,
    tagline: "The Swift Messenger",
    features: [
      "Temperature swings of 600 °C — the most extreme in the solar system",
      "Ice hides in permanently shadowed craters, despite being closest to the Sun",
    ],
    colors: {
      primary: "#8c7e6d",
      secondary: "#3d3830",
      highlight: "#bfb5a3",
      atmosphere: "#6b6155",
    },
    visualRadius: 120,
    type: "rocky",
    tilt: 0.03,
    rotationSpeed: 0.15,
  },
  {
    name: "Venus",
    order: 2,
    tagline: "The Scorching Twin",
    features: [
      "Spins backwards — the Sun rises in the west",
      "A day (243 d) is longer than its year (225 d)",
    ],
    colors: {
      primary: "#d4a84b",
      secondary: "#8a5a1e",
      highlight: "#f0d080",
      atmosphere: "#c89030",
    },
    visualRadius: 155,
    type: "rocky",
    tilt: 3,
    rotationSpeed: -0.12,
  },
  {
    name: "Earth",
    order: 3,
    tagline: "The Blue Marble",
    features: [
      "Its magnetic field deflects lethal solar radiation",
      "71 % of the surface is covered in ocean",
    ],
    colors: {
      primary: "#2266bb",
      secondary: "#0a1a40",
      highlight: "#55aaee",
      atmosphere: "#4488cc",
    },
    visualRadius: 160,
    type: "rocky",
    tilt: 23.4,
    rotationSpeed: 0.5,
  },
  {
    name: "Mars",
    order: 4,
    tagline: "The Red Planet",
    features: [
      "Olympus Mons — tallest volcano at 21.9 km",
      "Sunsets are blue, not red",
    ],
    colors: {
      primary: "#c44415",
      secondary: "#5a2008",
      highlight: "#e87040",
      atmosphere: "#a83810",
    },
    visualRadius: 135,
    type: "rocky",
    tilt: 25.2,
    rotationSpeed: 0.48,
  },
  {
    name: "Jupiter",
    order: 5,
    tagline: "The Gas Giant King",
    features: [
      "1 321 Earths could fit inside",
      "The Great Red Spot — a storm larger than Earth, raging for centuries",
    ],
    colors: {
      primary: "#c08030",
      secondary: "#6a4018",
      highlight: "#e8c070",
      atmosphere: "#d09040",
    },
    visualRadius: 200,
    type: "gas",
    tilt: 3.1,
    rotationSpeed: 1.5,
  },
  {
    name: "Saturn",
    order: 6,
    tagline: "The Ringed Wonder",
    features: [
      "Would float in water — density just 687 kg/m³",
      "Diamond rain may fall through its atmosphere",
    ],
    colors: {
      primary: "#c8a040",
      secondary: "#705820",
      highlight: "#e8d080",
      atmosphere: "#b09030",
    },
    visualRadius: 185,
    type: "gas",
    tilt: 26.7,
    rotationSpeed: 1.3,
  },
  {
    name: "Uranus",
    order: 7,
    tagline: "The Tilted Ice Giant",
    features: [
      "Tilted 98° — orbits rolling on its side",
      "Coldest planetary atmosphere at −224 °C",
    ],
    colors: {
      primary: "#60b0b8",
      secondary: "#285860",
      highlight: "#a0e0e8",
      atmosphere: "#50a0a8",
    },
    visualRadius: 165,
    type: "ice",
    tilt: 97.8,
    rotationSpeed: 0.8,
  },
  {
    name: "Neptune",
    order: 8,
    tagline: "The Windswept World",
    features: [
      "Winds reach 580 m/s — faster than the speed of sound",
      "Takes 165 Earth years to orbit the Sun once",
    ],
    colors: {
      primary: "#3050b0",
      secondary: "#101840",
      highlight: "#6080e0",
      atmosphere: "#3060c0",
    },
    visualRadius: 160,
    type: "ice",
    tilt: 28.3,
    rotationSpeed: 0.9,
  },
];
