import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { GlassPill, Ic } from "./primitives";
import { T } from "./theme";

type Props = {
  activeTab: "chats" | "spaces" | "files";
  setActiveTab: (t: "chats" | "spaces" | "files") => void;
  fabExpanded: boolean;
  setFabExpanded: (b: boolean) => void;
  newChatText: string;
  setNewChatText: (s: string) => void;
  onSubmit: () => void;
};

export default function BottomBar({
  activeTab, setActiveTab, fabExpanded, setFabExpanded, newChatText, setNewChatText, onSubmit,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (fabExpanded) setTimeout(() => inputRef.current?.focus(), 200);
  }, [fabExpanded]);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {!fabExpanded && (
        <View style={{ width: 220, height: 56, flexShrink: 0 }}>
          <GlassPill style={{ width: "100%", height: "100%" }} rounded={28}>
            <View style={styles.navInner}>
              <NavBtn icon="chatbubbles-outline" iconActive="chatbubbles" label="Chats"  active={activeTab === "chats"}  onPress={() => setActiveTab("chats")} />
              <NavBtn icon="apps-outline"        iconActive="apps"        label="Spaces" active={activeTab === "spaces"} onPress={() => setActiveTab("spaces")} />
              <NavBtn icon="folder-outline"      iconActive="folder"      label="Files"  active={activeTab === "files"}  onPress={() => setActiveTab("files")} />
            </View>
          </GlassPill>
        </View>
      )}

      <View style={[styles.fabContainer, fabExpanded ? styles.fabContainerExpanded : null]}>
        <GlassPill style={[{ width: "100%", height: "100%" }, { borderColor: T.amber + "55" }]} rounded={28}>
          {!fabExpanded ? (
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="New Chat" activeOpacity={0.8} onPress={() => setFabExpanded(true)} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Ic name="add" size={28} color={T.amber} />
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row", flex: 1, alignItems: "center", paddingHorizontal: 6, gap: 4 }}>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close" onPress={() => { setFabExpanded(false); setNewChatText(""); }} style={iconBtnStyle}>
                <Ic name="close" size={20} color={T.textSec} />
              </TouchableOpacity>
              <TextInput
                ref={inputRef}
                value={newChatText}
                onChangeText={setNewChatText}
                placeholder="What should I build?"
                placeholderTextColor={T.textMut}
                onSubmitEditing={onSubmit}
                returnKeyType="send"
                style={{ flex: 1, color: T.textPri, fontSize: 15, paddingHorizontal: 6, height: "100%" }}
              />
              {newChatText.length > 0 ? (
                <TouchableOpacity accessibilityRole="button" accessibilityLabel="Send Message" onPress={onSubmit} style={[iconBtnStyle, { backgroundColor: T.amber }]}>
                  <Ic name="send" size={16} color="#1A1208" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity accessibilityRole="button" accessibilityLabel="Voice Input" style={iconBtnStyle}>
                  <Ic name="mic" size={20} color={T.amber} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </GlassPill>
      </View>
    </View>
  );
}

function NavBtn({ icon, iconActive, label, active, onPress }: any) {
  const t = useSharedValue(active ? 1 : 0);
  useEffect(() => { t.value = withTiming(active ? 1 : 0, { duration: 320, easing: Easing.bezier(0.32, 0.72, 0, 1) }); }, [active]);
  const containerStyle = useAnimatedStyle(() => ({
    paddingHorizontal: 10 + t.value * 6,
  }));
  const labelStyle = useAnimatedStyle(() => ({
    width: t.value * 56,
    opacity: t.value,
    marginLeft: t.value * 6,
  }));
  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} activeOpacity={0.85} onPress={onPress}>
      <Animated.View style={[
        {
          flexDirection: "row", alignItems: "center", height: 40,
          borderRadius: 20,
          backgroundColor: active ? "rgba(232,146,58,0.18)" : "transparent",
          borderWidth: 1, borderColor: active ? "rgba(232,146,58,0.35)" : "transparent",
        },
        containerStyle,
      ]}>
        <Ic name={(active ? iconActive : icon) as any} size={20} color={active ? T.amber : T.textSec} />
        <Animated.View style={[{ overflow: "hidden" }, labelStyle]}>
          <Text style={{ color: T.amber, fontSize: 13, fontWeight: "600" }} numberOfLines={1}>{label}</Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const iconBtnStyle = {
  width: 40, height: 40, borderRadius: 20,
  alignItems: "center" as const, justifyContent: "center" as const,
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute", bottom: 24, left: 20, right: 20,
    flexDirection: "row", gap: 12, alignItems: "center", zIndex: 50,
    height: 56,
  },
  navPillContainer: {
    height: 56,
    width: 220,
    flexShrink: 0,
  },
  navInner: {
    flexDirection: "row",
    height: 56,
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 4,
  },
  glassFill: {
    height: "100%",
  },
  fabContainer: {
    width: 56,
    height: 56,
    marginLeft: "auto",
  },
  fabContainerExpanded: {
    flex: 1,
    width: undefined,
    marginLeft: 0,
  },
});
