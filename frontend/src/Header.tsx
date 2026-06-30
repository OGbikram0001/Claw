import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing, interpolate,
} from "react-native-reanimated";
import { Ic, CircularProgress, Logo } from "./primitives";
import { T } from "./theme";
import { LinearGradient } from "expo-linear-gradient";

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

export default function Header({ view, onMenu, onBack, activeConvo, overallProgress, onProgressTap, onNewChat, onChatMenu }: Props) {
  const t = useSharedValue(view === "home" ? 0 : 1);
  useEffect(() => {
    t.value = withTiming(view === "home" ? 0 : 1, { duration: 380, easing: Easing.bezier(0.32, 0.72, 0, 1) });
  }, [view]);

  const menuStyle  = useAnimatedStyle(() => ({ opacity: 1 - t.value, transform: [{ scale: 1 - t.value * 0.5 }, { rotate: `${-60 * t.value}deg` }] }));
  const backStyle  = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ scale: 0.5 + t.value * 0.5 }, { rotate: `${60 - 60 * t.value}deg` }] }));
  const logoStyle  = useAnimatedStyle(() => ({ opacity: 1 - t.value, transform: [{ translateY: t.value * 8 }] }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ translateY: (1 - t.value) * 8 }] }));
  const rightStyle = useAnimatedStyle(() => ({ opacity: 1 }));

  const titleText = activeConvo
    ? (activeConvo.name?.length > 22 ? activeConvo.name.substring(0, 22) + "…" : activeConvo.name)
    : "New Session";

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {/* Frosted gradient bg for the bar */}
      <LinearGradient
        colors={[T.bg, T.bg + "E8", "transparent"]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.row}>
        {/* LEFT */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={view === "home" ? onMenu : onBack}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel={view === "home" ? "Open menu" : "Go back"}
        >
          <Animated.View style={[StyleSheet.absoluteFillObject, styles.iconCenter, menuStyle]}>
            <Ic name="menu-outline" size={22} color={T.textPri} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFillObject, styles.iconCenter, backStyle]}>
            <Ic name="chevron-back" size={22} color={T.textPri} />
          </Animated.View>
        </TouchableOpacity>

        {/* CENTER */}
        <View style={styles.titleContainer} pointerEvents="none">
          <Animated.View style={[StyleSheet.absoluteFillObject, styles.iconCenter, logoStyle]}>
            <Logo size={17} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFillObject, styles.iconCenter, titleStyle]}>
            <Text style={styles.titleText} numberOfLines={1}>{titleText}</Text>
          </Animated.View>
        </View>

        {/* RIGHT */}
        <Animated.View style={[{ flexDirection: "row", gap: 6 }, rightStyle]}>
          {view === "home" ? (
            <TouchableOpacity
              onPress={onProgressTap}
              activeOpacity={0.8}
              style={styles.rightPill}
              accessibilityRole="button"
              accessibilityLabel={`Overall progress: ${overallProgress}%`}
            >
              <CircularProgress progress={overallProgress} size={22} stroke={2.5} color={T.amber} />
              <Text style={{ color: T.amber, fontSize: 12, fontWeight: "700", fontFamily: "Courier" }}>{overallProgress}%</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={onNewChat}
                activeOpacity={0.8}
                style={styles.iconBtn}
                accessibilityRole="button"
                accessibilityLabel="New chat"
              >
                <Ic name="create-outline" size={20} color={T.textPri} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onChatMenu}
                activeOpacity={0.8}
                style={styles.iconBtn}
                accessibilityRole="button"
                accessibilityLabel="Chat options"
              >
                <Ic name="ellipsis-horizontal" size={20} color={T.textPri} />
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position:      "absolute",
    top:           0,
    left:          0,
    right:         0,
    zIndex:        50,
    paddingTop:    14,
    paddingBottom: 8,
    paddingHorizontal: 18,
  },
  row: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    height:         44,
  },
  iconBtn: {
    width:  44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  iconCenter: {
    alignItems:     "center",
    justifyContent: "center",
  },
  titleContainer: {
    position:  "absolute",
    left:      52,
    right:     52,
    height:    44,
    alignItems:     "center",
    justifyContent: "center",
  },
  titleText: {
    color:      T.textPri,
    fontSize:   14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  rightPill: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            7,
    paddingHorizontal: 12,
    paddingVertical:   9,
    backgroundColor:   T.card,
    borderRadius:      22,
    borderWidth:       1,
    borderColor:       T.border,
  },
});
