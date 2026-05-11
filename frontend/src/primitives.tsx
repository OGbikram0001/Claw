import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Svg, { Circle, Path, Ellipse, G, Defs, RadialGradient, Stop } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { T, STATUS_COLOR } from "./theme";

/* ─── IONICONS SHIM ─── */
export function Ic({ name, size = 18, color = T.textPri }: { name: any; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}

/* ─── BOX ICONS (web only, falls back to ionicons) ─── */
export function BxIcon({ name, size = 18, color = T.textPri, fallback = "square-outline" }: {
  name: string; size?: number; color?: string; fallback?: any;
}) {
  if (Platform.OS === "web") {
    // @ts-ignore
    return <i className={`bx ${name}`} style={{ fontSize: size, color, lineHeight: 1, display: "inline-flex", alignItems: "center" }} />;
  }
  return <Ionicons name={fallback} size={size} color={color} />;
}

/* ─── DEVICONS (web only, falls back to ionicons) ─── */
export function DiIcon({ name, size = 18, color = T.textPri, fallback = "code-slash-outline" }: {
  name: string; size?: number; color?: string; fallback?: any;
}) {
  if (Platform.OS === "web") {
    // @ts-ignore
    return <i className={name} style={{ fontSize: size, lineHeight: 1, display: "inline-flex", alignItems: "center", color }} />;
  }
  return <Ionicons name={fallback} size={size} color={color} />;
}

/* ─── LOGO ─── */
export function Logo({ size = 18 }: { size?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 2C8 2 5 5 5 9c0 2 .8 3.8 2 5l-2 4h14l-2-4c1.2-1.2 2-3 2-5 0-4-3-7-7-7z" fill={T.amber} opacity={0.9} />
        <Path d="M8 6 L6 2 L10 5Z" fill={T.amber} />
        <Path d="M16 6 L18 2 L14 5Z" fill={T.amber} />
        <Ellipse cx={9.5} cy={9} rx={1.2} ry={1.4} fill="#0C0B09" />
        <Ellipse cx={14.5} cy={9} rx={1.2} ry={1.4} fill="#0C0B09" />
      </Svg>
      <Text style={{ fontFamily: "serif", fontStyle: "italic", fontWeight: "500", fontSize: size, color: T.textPri, letterSpacing: -0.4 }}>
        kittyclaw
      </Text>
    </View>
  );
}

/* ─── ANIMATED AI GLYPH (home hero) ─── */
export function AnimatedGlyph({ size = 90 }: { size?: number }) {
  const pulse   = useSharedValue(0);
  const orbit   = useSharedValue(0);
  const breathe = useSharedValue(0);

  useEffect(() => {
    pulse.value   = withRepeat(withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    orbit.value   = withRepeat(withTiming(1, { duration: 6000, easing: Easing.linear }), -1, false);
    breathe.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const glowStyle  = useAnimatedStyle(() => ({
    opacity:    0.3 + pulse.value * 0.4,
    transform: [{ scale: 0.9 + pulse.value * 0.15 }],
  }));
  const glyphStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.96 + breathe.value * 0.04 }],
  }));
  const dotStyle1  = useAnimatedStyle(() => {
    const angle = orbit.value * Math.PI * 2;
    return { transform: [{ translateX: Math.cos(angle) * (size * 0.56) }, { translateY: Math.sin(angle) * (size * 0.56) }] };
  });
  const dotStyle2  = useAnimatedStyle(() => {
    const angle = orbit.value * Math.PI * 2 + Math.PI * 0.7;
    return { transform: [{ translateX: Math.cos(angle) * (size * 0.56) }, { translateY: Math.sin(angle) * (size * 0.56) }] };
  });
  const dotStyle3  = useAnimatedStyle(() => {
    const angle = orbit.value * Math.PI * 2 + Math.PI * 1.4;
    return { transform: [{ translateX: Math.cos(angle) * (size * 0.56) }, { translateY: Math.sin(angle) * (size * 0.56) }] };
  });

  const w = size * 1.4;
  return (
    <View style={{ width: w, height: w, alignItems: "center", justifyContent: "center" }}>
      {/* Glow */}
      <Animated.View style={[StyleSheet.absoluteFillObject, { borderRadius: w / 2, backgroundColor: T.amber, opacity: 0 }, glowStyle]}
        pointerEvents="none" />
      {/* Orbit dots */}
      <Animated.View style={[{ position: "absolute" }, dotStyle1]}>
        <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: T.amber, opacity: 0.8 }} />
      </Animated.View>
      <Animated.View style={[{ position: "absolute" }, dotStyle2]}>
        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: T.violet, opacity: 0.7 }} />
      </Animated.View>
      <Animated.View style={[{ position: "absolute" }, dotStyle3]}>
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: T.sage, opacity: 0.6 }} />
      </Animated.View>
      {/* Glyph */}
      <Animated.View style={glyphStyle}>
        <View style={{ width: size, height: size, borderRadius: size * 0.28, backgroundColor: T.card, borderWidth: 1.5, borderColor: T.amber + "55", alignItems: "center", justifyContent: "center" }}>
          <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
            <Path d="M12 2C8 2 5 5 5 9c0 2 .8 3.8 2 5l-2 4h14l-2-4c1.2-1.2 2-3 2-5 0-4-3-7-7-7z" fill={T.amber} opacity={0.95} />
            <Path d="M8 6 L6 2 L10 5Z" fill={T.amber} />
            <Path d="M16 6 L18 2 L14 5Z" fill={T.amber} />
            <Ellipse cx={9.5} cy={9} rx={1.3} ry={1.5} fill="#0C0B09" />
            <Ellipse cx={14.5} cy={9} rx={1.3} ry={1.5} fill="#0C0B09" />
          </Svg>
        </View>
      </Animated.View>
    </View>
  );
}

/* ─── ACTIVITY RINGS (Apple Watch style) ─── */
export function ActivityRings({
  rings,
  size = 80,
}: {
  rings: { progress: number; color: string; label: string }[];
  size?: number;
}) {
  const strokeW = size * 0.08;
  const gap     = strokeW * 0.7;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {rings.map((ring, i) => {
        const r = (size / 2) - strokeW / 2 - i * (strokeW + gap);
        return <AnimatedRing key={i} radius={r} progress={ring.progress} color={ring.color} stroke={strokeW} size={size} />;
      })}
    </View>
  );
}

function AnimatedRing({ radius, progress, color, stroke, size }: {
  radius: number; progress: number; color: string; stroke: number; size: number;
}) {
  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = withDelay(200, withTiming(progress / 100, { duration: 1200, easing: Easing.out(Easing.cubic) }));
  }, [progress]);

  const circ   = radius * 2 * Math.PI;
  const offset = useSharedValue(circ);

  // Drive offset from anim via derived value
  const trackRef = React.useRef<any>(null);
  useEffect(() => {
    const id = setInterval(() => {
      if (trackRef.current) {
        const val = progress / 100;
        const off = circ - val * circ;
        try { trackRef.current.setNativeProps({ strokeDashoffset: off }); } catch {}
      }
    }, 16);
    setTimeout(() => clearInterval(id), 1400);
    return () => clearInterval(id);
  }, [progress]);

  const cx = size / 2;
  const cy = size / 2;
  const dash = `${circ} ${circ}`;
  const dashOffset = circ - (progress / 100) * circ;

  return (
    <Svg width={size} height={size} style={{ position: "absolute" }}>
      <Circle cx={cx} cy={cy} r={radius} stroke={color + "22"} strokeWidth={stroke} fill="none" />
      <Circle
        cx={cx} cy={cy} r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={dash}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </Svg>
  );
}

/* ─── CIRCULAR PROGRESS ─── */
export function CircularProgress({
  progress, size = 28, stroke = 3.5, color = T.amber,
}: { progress: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2;
  const circ   = radius * 2 * Math.PI;
  const offset = circ - (progress / 100) * circ;
  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset} strokeLinecap="round" />
    </Svg>
  );
}

/* ─── LINEAR PROGRESS BAR ─── */
export function ProgressBar({ progress, color = T.amber, height = 3 }: { progress: number; color?: string; height?: number }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(progress, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [progress]);
  const bar = useAnimatedStyle(() => ({ width: `${w.value}%` as any }));
  return (
    <View style={{ height, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: height / 2, overflow: "hidden" }}>
      <Animated.View style={[{ height, backgroundColor: color, borderRadius: height / 2 }, bar]} />
    </View>
  );
}

/* ─── STATUS DOT ─── */
export function StatusDot({ status, size = 8 }: { status: string; size?: number }) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (status === "running") {
      pulse.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }), -1, false);
    }
  }, [status]);
  const ringStyle = useAnimatedStyle(() => ({
    opacity:   0.5 * (1 - pulse.value),
    transform: [{ scale: 1 + pulse.value * 1.8 }],
  }));
  const color = STATUS_COLOR[status] || T.textMut;
  return (
    <View style={{ width: size + 8, height: size + 8, alignItems: "center", justifyContent: "center" }}>
      {status === "running" && (
        <Animated.View style={[{ position: "absolute", width: size, height: size, borderRadius: size / 2, backgroundColor: color }, ringStyle]} />
      )}
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
}

/* ─── TYPING DOTS ─── */
function Dot({ delay }: { delay: number }) {
  const v = useSharedValue(0);
  useEffect(() => { v.value = withDelay(delay, withRepeat(withTiming(1, { duration: 550 }), -1, true)); }, [delay]);
  const s = useAnimatedStyle(() => ({ transform: [{ translateY: -5 * v.value }], opacity: 0.35 + 0.65 * v.value }));
  return <Animated.View style={[{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: T.amber }, s]} />;
}
export function TypingDots() {
  return (
    <View style={{ flexDirection: "row", gap: 5, paddingHorizontal: 4, paddingVertical: 6, alignItems: "center" }}>
      <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
    </View>
  );
}

/* ─── BLINKING CURSOR ─── */
export function BlinkingCursor({ color = T.sage }: { color?: string }) {
  const op = useSharedValue(1);
  useEffect(() => { op.value = withRepeat(withTiming(0, { duration: 480 }), -1, true); }, []);
  const s = useAnimatedStyle(() => ({ opacity: op.value }));
  return <Animated.Text style={[{ color, fontFamily: "Courier", fontSize: 11 }, s]}>▋</Animated.Text>;
}

/* ─── AMBIENT BLOB (subtle glow) ─── */
export function AmbientBlob({ style, color, delay = 0 }: { style: any; color: string; delay?: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(delay, withRepeat(withTiming(1, { duration: 7000 }), -1, true));
  }, [delay]);
  const s = useAnimatedStyle(() => ({ transform: [{ scale: 1 + v.value * 0.06 }], opacity: 0.5 + v.value * 0.25 }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", borderRadius: 9999, backgroundColor: color }, style, s]} />
  );
}

/* ─── SCROLL FADE OVERLAY ─── */
export function ScrollFade({ position }: { position: "top" | "bottom" }) {
  const { LinearGradient } = require("expo-linear-gradient");
  const colors = position === "top"
    ? [T.bg, T.bg + "CC", "transparent"] as const
    : ["transparent", T.bg + "CC", T.bg] as const;
  return (
    <LinearGradient
      colors={colors}
      pointerEvents="none"
      style={{
        position: "absolute",
        [position]: 0,
        left: 0, right: 0,
        height: position === "top" ? 72 : 96,
        zIndex: 20,
      }}
    />
  );
}

const StyleSheet2 = StyleSheet;
