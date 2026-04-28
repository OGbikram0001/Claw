// Design tokens shared across the entire app
export const T = {
  bg:        "#0C0A08",
  surface:   "#161310",
  card:      "#1D1A16",
  cardHover: "#232019",
  border:    "rgba(232,146,58,0.09)",
  borderMid: "rgba(232,146,58,0.16)",
  amber:     "#E8923A",
  amberDim:  "#A05E1C",
  violet:    "#9E7FC5",
  sage:      "#6DB88C",
  red:       "#C96B5C",
  blue:      "#5C8EC9",
  textPri:   "#EDE5D8",
  textSec:   "#8A7D6E",
  textMut:   "#4A4238",
  userBub:   "#2A2219",
  agentBub:  "#1A1712",
  glass:     "rgba(255,255,255,0.08)",
  glassHi:   "rgba(255,255,255,0.15)",
  glassBd:   "rgba(255,255,255,0.1)",
  glassTop:  "rgba(255,255,255,0.3)",
};

export const STATUS_COLOR: Record<string, string> = {
  done: T.sage,
  running: T.amber,
  waiting: T.violet,
  error: T.red,
};

export const FONT = {
  serif: "serif",
  sans: "System",
  mono: "Courier",
};
