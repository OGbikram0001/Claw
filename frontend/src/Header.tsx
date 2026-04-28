import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { GlassPill, Ic, CircularProgress, Logo } from "./primitives";
import { T } from "./theme";
import { L } from "./layout";

type Props = {
  view: "home" | "chat";
  onMenu: () => void;
  onBack: () => void;
  activeConvo: any;
  overallProgress: number;
  onProgressTap: () => void;
  onNewChat: () => void;
  onChatMenu: () => void;
};

export default function Header({
  view, onMenu, onBack, activeConvo, overallProgress, onProgressTap, onNewChat, onChatMenu,
}: Props) {
  const t = useSharedValue(view === "home" ? 0 : 1);
  useEffect(() => { t.value = withTiming(view === "home" ? 0 : 1, { duration: 400, easing: Easing.bezier(0.32, 0.72, 0, 1) }); }, [view]);

  // Left button morph
  const menuStyle  = useAnimatedStyle(() => ({ opacity: 1 - t.value, transform: [{ rotate: `${-180 * t.value}deg` }, { scale: 1 - t.value * 0.5 }] }));
  const backStyle  = useAnimatedStyle(() => ({ opacity: t.value,     transform: [{ rotate: `${-180 + 180 * t.value}deg` }, { scale: 0.5 + t.value * 0.5 }] }));

  // Title morph
  const logoStyle  = useAnimatedStyle(() => ({ opacity: 1 - t.value, transform: [{ translateY: t.value * 10 }] }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: t.value,     transform: [{ translateY: (1 - t.value) * 10 }] }));

  // Right pill width morph
  const pillStyle = useAnimatedStyle(() => ({
    width: interpolate(t.value, [0, 1], [84, 94]),
  }));
  const homePillStyle = useAnimatedStyle(() => ({ opacity: 1 - t.value, transform: [{ scale: 1 - t.value * 0.4 }] }));
  const chatPillStyle = useAnimatedStyle(() => ({ opacity: t.value,     transform: [{ scale: 0.6 + t.value * 0.4 }] }));

  const titleText = activeConvo
    ? (activeConvo.name?.length > 18 ? activeConvo.name.substring(0, 18) + "…" : activeConvo.name)
    : "New Session";

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.row}>
        {/* LEFT BUTTON */}
        <TouchableOpacity activeOpacity={0.85} onPress={view === "home" ? onMenu : onBack}>
          <GlassPill style={{ width: 44, height: 44 }} rounded={22}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Animated.View style={[StyleSheet.absoluteFillObject, { alignItems: "center", justifyContent: "center" }, menuStyle]}>
                <Ic name="menu-outline" size={22} color={T.textPri} />
              </Animated.View>
              <Animated.View style={[StyleSheet.absoluteFillObject, { alignItems: "center", justifyContent: "center" }, backStyle]}>
                <Ic name="chevron-back" size={22} color={T.textPri} />
              </Animated.View>
            </View>
          </GlassPill>
        </TouchableOpacity>

        {/* CENTER TITLE */}
        <View style={styles.titleContainer} pointerEvents="none">
          <Animated.View style={[StyleSheet.absoluteFillObject, { alignItems: "center", justifyContent: "center" }, logoStyle]}>
            <Logo size={18} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFillObject, { alignItems: "center", justifyContent: "center" }, titleStyle]}>
            <Text style={{ color: T.textPri, fontSize: 14, fontWeight: "500" }} numberOfLines={1}>{titleText}</Text>
          </Animated.View>
        </View>

        {/* RIGHT PILL */}
        <Animated.View style={[{ height: 44 }, pillStyle]}>
          <GlassPill style={{ height: 44 }} rounded={22}>
            <View style={{ height: 44, position: "relative" }}>
              {/* HOME: progress + label */}
              <Animated.View style={[StyleSheet.absoluteFillObject, homePillStyle]} pointerEvents={view === "home" ? "auto" : "none"}>
                <TouchableOpacity onPress={onProgressTap} activeOpacity={0.85} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 12 }}>
                  <Text style={{ color: T.amber, fontSize: 12, fontWeight: "700", fontFamily: "Courier" }}>{overallProgress}%</Text>
                  <CircularProgress progress={overallProgress} size={26} stroke={3} />
                </TouchableOpacity>
              </Animated.View>
              {/* CHAT: new + menu */}
              <Animated.View style={[StyleSheet.absoluteFillObject, { flexDirection: "row", alignItems: "center" }, chatPillStyle]} pointerEvents={view === "chat" ? "auto" : "none"}>
                <TouchableOpacity onPress={onNewChat} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
                  <Ic name="create-outline" size={20} color={T.textPri} />
                </TouchableOpacity>
                <View style={{ width: 1, height: 22, backgroundColor: "rgba(255,255,255,0.15)" }} />
                <TouchableOpacity onPress={onChatMenu} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
                  <Ic name="ellipsis-horizontal" size={20} color={T.textPri} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </GlassPill>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "absolute", top: L.headerTopOffset, left: L.gutter, right: L.gutter, zIndex: 50 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 56 },
  titleContainer: { position: "absolute", left: 0, right: 0, height: 44, alignItems: "center", justifyContent: "center" },
});
