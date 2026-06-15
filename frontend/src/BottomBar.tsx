import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from "react-native-reanimated";
import { Ic } from "./primitives";
import { T } from "./theme";
import { LinearGradient } from "expo-linear-gradient";

type Tab = "home" | "chats" | "spaces" | "files";

type Props = {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  fabExpanded: boolean;
  setFabExpanded: (b: boolean) => void;
  newChatText: string;
  setNewChatText: (s: string) => void;
  onSubmit: () => void;
  view: "home" | "chat";
};

const TABS = [
  { id: "home",   icon: "home-outline",        iconActive: "home",        label: "Home"   },
  { id: "chats",  icon: "chatbubbles-outline",  iconActive: "chatbubbles", label: "Chats"  },
  { id: "spaces", icon: "apps-outline",         iconActive: "apps",        label: "Spaces" },
  { id: "files",  icon: "folder-outline",       iconActive: "folder",      label: "Files"  },
] as const;

export default function BottomBar({ activeTab, setActiveTab, fabExpanded, setFabExpanded, newChatText, setNewChatText, onSubmit, view }: Props) {
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (fabExpanded) setTimeout(() => inputRef.current?.focus(), 180);
  }, [fabExpanded]);

  if (view === "chat") {
    return (
      <View style={chatStyles.wrapper} pointerEvents="box-none">
        <LinearGradient colors={["transparent", T.bg + "F0", T.bg]} style={StyleSheet.absoluteFill} pointerEvents="none" />
        <ChatInput newChatText={newChatText} setNewChatText={setNewChatText} onSubmit={onSubmit} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <LinearGradient colors={["transparent", T.bg + "EE", T.bg]} style={StyleSheet.absoluteFill} pointerEvents="none" />

      {fabExpanded ? (
        <View style={{ flex: 1 }}>
          <ChatInput newChatText={newChatText} setNewChatText={setNewChatText} onSubmit={onSubmit}
            onClose={() => { setFabExpanded(false); setNewChatText(""); }} showClose />
        </View>
      ) : (
        <View style={styles.inner}>
          {/* NAV TABS */}
          <View style={styles.navRow}>
            {TABS.map((tab) => (
              <NavTab key={tab.id} tab={tab} active={activeTab === tab.id} onPress={() => setActiveTab(tab.id)} />
            ))}
          </View>

          {/* FAB */}
          <TouchableOpacity onPress={() => setFabExpanded(true)} activeOpacity={0.85} style={styles.fab} accessibilityRole="button" accessibilityLabel="Add chat">
            <View style={styles.fabInner}>
              <Ic name="add" size={24} color={T.bg} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function NavTab({ tab, active, onPress }: { tab: typeof TABS[number]; active: boolean; onPress: () => void }) {
  const t = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    t.value = withTiming(active ? 1 : 0, { duration: 280, easing: Easing.bezier(0.32, 0.72, 0, 1) });
  }, [active]);
  const dot = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ scale: t.value }] }));
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.navTab} accessibilityRole="button" accessibilityLabel={tab.label}>
      <Ic name={(active ? tab.iconActive : tab.icon) as any} size={22} color={active ? T.amber : T.textSec} />
      <Animated.View style={[styles.activeDot, { backgroundColor: T.amber }, dot]} />
    </TouchableOpacity>
  );
}

function ChatInput({ newChatText, setNewChatText, onSubmit, onClose, showClose }: {
  newChatText: string;
  setNewChatText: (s: string) => void;
  onSubmit: () => void;
  onClose?: () => void;
  showClose?: boolean;
}) {
  return (
    <View style={inputStyles.row}>
      {showClose && (
        <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={inputStyles.sideBtn} accessibilityRole="button" accessibilityLabel="Close">
          <Ic name="close" size={20} color={T.textSec} />
        </TouchableOpacity>
      )}
      <View style={inputStyles.box}>
        <TouchableOpacity activeOpacity={0.7} style={inputStyles.attach} accessibilityRole="button" accessibilityLabel="Attach file">
          <Ic name="attach-outline" size={18} color={T.textSec} />
        </TouchableOpacity>
        <TextInput
          value={newChatText}
          onChangeText={setNewChatText}
          placeholder="Message kittyclaw…"
          placeholderTextColor={T.textMut}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
          multiline
          style={inputStyles.input}
        />
        <TouchableOpacity onPress={onSubmit} activeOpacity={0.8}
          style={[inputStyles.sendBtn, { backgroundColor: newChatText.trim() ? T.amber : T.card }]} accessibilityRole="button" accessibilityLabel={newChatText.trim() ? "Send message" : "Voice message"}>
          <Ic name={newChatText.trim() ? "arrow-up" : "mic-outline"} size={16} color={newChatText.trim() ? T.bg : T.textSec} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom:   0,
    left:     0,
    right:    0,
    paddingTop:    24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    zIndex:   50,
  },
  inner: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            14,
    justifyContent: "space-between",
  },
  navRow: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            0,
    backgroundColor: T.card,
    borderRadius:   24,
    borderWidth:    1,
    borderColor:    T.border,
    paddingHorizontal: 8,
    paddingVertical:   6,
    flex:           1,
    justifyContent: "space-around",
  },
  navTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 4,
    position: "relative",
  },
  activeDot: {
    position: "absolute",
    bottom:   -2,
    width:    4,
    height:   4,
    borderRadius: 2,
  },
  fab: {
    width:  52,
    height: 52,
    borderRadius: 26,
  },
  fabInner: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: T.amber,
    alignItems: "center", justifyContent: "center",
    shadowColor: T.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

const chatStyles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom:   0,
    left:     0,
    right:    0,
    paddingTop:    28,
    paddingBottom: 24,
    paddingHorizontal: 16,
    zIndex:   50,
  },
});

const inputStyles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    alignItems:     "flex-end",
    gap:            10,
  },
  sideBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: T.card,
    borderWidth: 1, borderColor: T.border,
    alignItems: "center", justifyContent: "center",
    marginBottom: 2,
  },
  box: {
    flex:           1,
    flexDirection:  "row",
    alignItems:     "flex-end",
    backgroundColor: T.card,
    borderWidth:    1,
    borderColor:    T.borderMid,
    borderRadius:   22,
    paddingHorizontal: 6,
    paddingVertical:   6,
    gap:            4,
    minHeight:      48,
  },
  attach: {
    width: 36, height: 36,
    alignItems: "center", justifyContent: "center",
    borderRadius: 18,
  },
  input: {
    flex:     1,
    color:    T.textPri,
    fontSize: 15,
    paddingHorizontal: 4,
    paddingVertical: 6,
    maxHeight: 120,
    lineHeight: 20,
  },
  sendBtn: {
    width:  36,
    height: 36,
    borderRadius: 18,
    alignItems:     "center",
    justifyContent: "center",
  },
});
