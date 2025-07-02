import {
  Pyramid,
  Notebook,
  Book,
  Code,
  FlaskConical,
  Brain,
  Cpu,
  Layers,
  LineChart,
  Lightbulb,
  Sparkles,
  Atom,
  CircuitBoard,
  FileText,
  Globe,
  Microscope,
  Rocket,
  Telescope,
  Scroll,
  ShieldCheck,
} from "lucide-react";

export const colors = {
  "Peach Fizz": "#FF6F61", // brighter neon coral
  "Sky Mist": "#3AB0FF", // electric blue
  "Lavender Bloom": "#B366FF", // vivid neon purple
  "Sunshine Glow": "#FFFA65", // neon yellow
  "Mint Whisper": "#00FFD1", // bright neon teal
  "Lemon Cream": "#FFF966", // glowing lemon
  "Blush Petal": "#FF497C", // hot pink neon
  "Icy Blue": "#00BFFF", // bright cyan blue
  Butterlight: "#FFF200", // intense neon gold
  "Seafoam Silk": "#00F5D4", // bright seafoam neon
};

export const icons = {
  Prism: Pyramid,
  Notebook: Notebook,
  Book: Book,
  Code: Code,
  Flask: FlaskConical,
  Brain: Brain,
  Cpu: Cpu,
  Layers: Layers,
  Chart: LineChart,
  Idea: Lightbulb,
  Magic: Sparkles,
  Atom: Atom,
  Circuit: CircuitBoard,
  Document: FileText,
  World: Globe,
  Microscope: Microscope,
  Rocket: Rocket,
  Telescope: Telescope,
  Scroll: Scroll,
  Secure: ShieldCheck,
};

export const qualityIndicators = [
  {
    name: "Very Hard",
    quality: 1,
    icon: "🥵", // intense, struggled
  },
  {
    name: "Hard",
    quality: 2,
    icon: "😓", // difficult recall
  },
  {
    name: "Okay",
    quality: 3,
    icon: "🤔", // unsure but correct
  },
  {
    name: "Good",
    quality: 4,
    icon: "👍", // confident recall
  },
  {
    name: "Easy",
    quality: 5,
    icon: "🧠", // effortless recall
  },
];

export const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1,
};

export const reviewBreakpointColumnsObj = {
  default: 3,
  1024: 3,
  768: 2,
  640: 1,
};

export const DEFAULT_FETCH_LIMIT = 10;
