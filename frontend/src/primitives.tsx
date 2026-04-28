import React, { useEffect } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Svg, { Circle, Path, Ellipse } from "react-native-svg";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import { T, STATUS_COLOR } from "./theme";

/* ─── LOGO ─── */
export function Logo({ size = 18 }: { size?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 2C8 2 5 5 5 9c0 2 .8 3.8 2 5l-2 4h14l-2-4c1.2-1.2 2-3 2-5 0-4-3-7-7-7z" fill={T.amber} opacity={0.9} />
        <Path d="M8 6 L6 2 L10 5Z" fill={T.amber} />
        <Path d="M16 6 L18 2 L14 5Z" fill={T.amber} />
        <Ellipse cx={9.5} cy={9} rx={1.2} ry={1.4} fill="#0C0A08" />
        <Ellipse cx={14.5} cy={9} rx={1.2} ry={1.4} fill="#0C0A08" />
      </Svg>
      <Text style={{ fontFamily: "serif", fontStyle: "italic", fontWeight: "500", fontSize: size, color: T.textPri, letterSpacing: -0.4 }}>
        kittyclaw
      </Text>
    </View>
  );
}

/* ─── CIRCULAR PROGRESS ─── */
export function CircularProgress({
  progress,
  size = 28,
  stroke = 3.5,
  color = T.amber,
}: { progress: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2;
  const circ = radius * 2 * Math.PI;
  const offset = circ - (progress / 100) * circ;
  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} fill="none" />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* ─── STATUS DOT ─── */
export function StatusDot({ status, size = 8 }: { status: string; size?: number }) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (status === "running") {
      pulse.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false);
    }
  }, [status]);
  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.4 * (1 - pulse.value),
    transform: [{ scale: 1 + pulse.value * 1.6 }],
  }));
  const color = STATUS_COLOR[status] || T.textMut;
  return (
    <View style={{ width: size + 6, height: size + 6, alignItems: "center", justifyContent: "center" }}>
      {status === "running" && (
        <Animated.View
          style={[
            { position: "absolute", width: size, height: size, borderRadius: size / 2, backgroundColor: color },
            ringStyle,
          ]}
        />
      )}
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
}

/* ─── GLASS PILL ─── */
export function GlassPill({
  children,
  style,
  intensity = 30,
  rounded = 22,
  bordered = true,
}: {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
  rounded?: number;
  bordered?: boolean;
}) {
  return (
    <View style={[{ borderRadius: rounded, overflow: "hidden", backgroundColor: "rgba(35,30,24,0.88)" }, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.02)"]}
        style={StyleSheet.absoluteFill}
      />
      {bordered && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius: rounded,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            borderTopColor: "rgba(255,255,255,0.18)",
          }}
          pointerEvents="none"
        />
      )}
      {children}
    </View>
  );
}

/* ─── TYPING DOT (single) ─── */
function Dot({ delay }: { delay: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(delay, withRepeat(withTiming(1, { duration: 600 }), -1, true));
  }, [delay]);
  const s = useAnimatedStyle(() => ({
    transform: [{ translateY: -4 * v.value }],
    opacity: 0.4 + 0.6 * v.value,
  }));
  return <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: T.amber }, s]} />;
}

export function TypingDots() {
  return (
    <View style={{ flexDirection: "row", gap: 4, paddingHorizontal: 14, paddingVertical: 12, alignItems: "center" }}>
      <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
    </View>
  );
}

/* ─── BLINKING CURSOR ─── */
export function BlinkingCursor({ color = T.sage }: { color?: string }) {
  const op = useSharedValue(1);
  useEffect(() => {
    op.value = withRepeat(withTiming(0, { duration: 500 }), -1, true);
  }, []);
  const s = useAnimatedStyle(() => ({ opacity: op.value }));
  return <Animated.Text style={[{ color, fontFamily: "Courier", fontSize: 11.5 }, s]}>_</Animated.Text>;
}

/* ─── ICON SHIM ─── */
export function Ic({ name, size = 18, color = T.textPri }: { name: any; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}

/* ─── AMBIENT BREATHING BLOB ─── */
export function AmbientBlob({ style, color, delay = 0 }: { style: any; color: string; delay?: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(delay, withRepeat(withTiming(1, { duration: 8000 }), -1, true));
  }, [delay]);
  const s = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + v.value * 0.05 }],
    opacity: 0.6 + v.value * 0.3,
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: "absolute", borderRadius: 9999, backgroundColor: color },
        style,
        s,
      ]}
    />
  );
}
