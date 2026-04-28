import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeInDown, SlideInLeft } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { GlassPill, Ic, Logo, CircularProgress, StatusDot } from "./primitives";
import { T } from "./theme";
import { CONVOS, SPACES, FOLDERS, FILES, BgTask } from "./data/mock";

/* ─── DROPDOWN POPOVER (glass) ─── */
export function GlassDropdown({ children }: { children: React.ReactNode }) {
  return (
    <Animated.View entering={FadeIn.duration(200)} style={dropStyles.wrap}>
      <GlassPill rounded={20} intensity={50} style={dropStyles.inner}>
        <View style={{ padding: 14 }}>{children}</View>
      </GlassPill>
    </Animated.View>
  );
}
const dropStyles = StyleSheet.create({
  wrap: { position: "absolute", top: 60, right: 0, width: 250, zIndex: 100 },
  inner: { backgroundColor: "rgba(16,14,12,0.85)" },
});

/* ─── SIDEBAR DRAWER ─── */
export function Sidebar({ onClose }: { onClose: () => void }) {
  const items = [
    { icon: "apps-outline",       label: "Integrations" },
    { icon: "key-outline",        label: "API Keys" },
    { icon: "stats-chart-outline",label: "Usage Logs" },
    { icon: "settings-outline",   label: "Settings" },
  ];
  return (
    <>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFillObject}>
        <Animated.View entering={FadeIn.duration(200)} style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.6)" }]} />
      </Pressable>
      <Animated.View entering={SlideInLeft.duration(360)} style={sideStyles.drawer}>
        <LinearGradient colors={["rgba(26,23,20,0.96)", "rgba(16,14,12,0.99)"]} style={StyleSheet.absoluteFill} />
        <View style={{ flex: 1, padding: 24, gap: 20 }}>
          <View style={{ marginTop: 16 }}>
            <Logo size={22} />
          </View>
          <Text style={{ color: T.textSec, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: "500", marginTop: 12 }}>Workspace</Text>
          <View style={{ gap: 8 }}>
            {items.map((it, i) => (
              <TouchableOpacity key={i} style={sideStyles.item}>
                <Ic name={it.icon as any} size={18} color={T.amber} />
                <Text style={{ color: T.textPri, fontSize: 14.5, flex: 1 }}>{it.label}</Text>
                <Ic name="chevron-forward" size={14} color={T.textMut} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: "row", gap: 10, padding: 12, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 14, borderWidth: 1, borderColor: T.border }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: T.amber + "33", alignItems: "center", justifyContent: "center" }}>
              <Ic name="person" size={18} color={T.amber} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.textPri, fontSize: 13, fontWeight: "600" }}>kc · Pro</Text>
              <Text style={{ color: T.textSec, fontSize: 11 }}>3,420 / 10k credits</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  );
}
const sideStyles = StyleSheet.create({
  drawer: { position: "absolute", top: 0, bottom: 0, left: 0, width: 290, borderRightWidth: 1, borderRightColor: T.border, zIndex: 201, overflow: "hidden" },
  item: { flexDirection: "row", alignItems: "center", gap: 12, padding: 13, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 12 },
});

/* ─── CHATS TAB ─── */
export function ChatsView({ onOpen }: { onOpen: (c: any) => void }) {
  return (
    <ScrollView contentContainerStyle={{ paddingTop: 90, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <Text style={common.sectionLabel}>Active Agents</Text>
      {CONVOS.map((c, i) => (
        <Animated.View key={c.id} entering={FadeInDown.delay(i * 60)}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onOpen(c)} style={common.convoRow}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: T.surface, borderWidth: 1, borderColor: T.borderMid, alignItems: "center", justifyContent: "center" }}>
              <Ic name={c.icon as any} size={20} color={T.amber} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ color: T.textPri, fontSize: 15, fontWeight: "500", flex: 1 }} numberOfLines={1}>{c.name}</Text>
                <Text style={{ color: T.textMut, fontSize: 12 }}>{c.time}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <StatusDot status={c.status} size={7} />
                <Text style={{ color: c.unread ? T.textPri : T.textSec, fontSize: 13, flex: 1 }} numberOfLines={1}>{c.preview}</Text>
                {c.unread > 0 && (
                  <View style={{ minWidth: 18, height: 18, paddingHorizontal: 6, borderRadius: 9, backgroundColor: T.amber, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#1A1208", fontSize: 11, fontWeight: "700" }}>{c.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

/* ─── SPACES TAB ─── */
export function SpacesView() {
  return (
    <ScrollView contentContainerStyle={{ paddingTop: 90, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <Text style={common.sectionLabel}>Your Spaces</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, gap: 14 }}>
        {/* Create card */}
        <View style={[spaceStyles.card, { borderStyle: "dashed", borderColor: "rgba(255,255,255,0.15)", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }]}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Ic name="add" size={22} color={T.textPri} />
          </View>
          <Text style={{ color: T.textPri, fontSize: 15, fontWeight: "600" }}>New Space</Text>
          <Text style={{ color: T.textSec, fontSize: 11, marginTop: 4 }}>Blank or template</Text>
        </View>

        {SPACES.map((s, i) => (
          <Animated.View key={s.id} entering={FadeInDown.delay(i * 80)} style={spaceStyles.card}>
            <LinearGradient
              colors={["rgba(26,23,20,0.8)", "rgba(16,14,12,0.9)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <LinearGradient colors={[s.color + "33", s.color + "11"]} style={{ width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: s.color + "44" }}>
                <Ic name={s.icon as any} size={20} color={s.color} />
              </LinearGradient>
              <StatusDot status={s.status} size={7} />
            </View>
            <View style={{ marginTop: 18, gap: 4 }}>
              <Text style={{ color: T.textPri, fontSize: 15, fontWeight: "600", lineHeight: 18 }}>{s.name}</Text>
              <Text style={{ color: T.textSec, fontSize: 11 }}>{s.desc}</Text>
            </View>
            <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row" }}>
                {s.agents.slice(0, 3).map((ac, k) => (
                  <View key={k} style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: ac + "33", borderWidth: 2, borderColor: "#1A1714", alignItems: "center", justifyContent: "center", marginLeft: k === 0 ? 0 : -7 }}>
                    <Ic name="hardware-chip-outline" size={11} color={ac} />
                  </View>
                ))}
              </View>
              <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: s.status === "running" ? T.amber + "1A" : "transparent" }}>
                <Text style={{ color: s.status === "running" ? T.amber : T.textMut, fontSize: 10, fontWeight: "700" }}>{s.agents.length} ACT</Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}
const spaceStyles = StyleSheet.create({
  card: {
    width: "47%", padding: 14, borderRadius: 18,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(26,23,20,0.6)",
    overflow: "hidden",
    minHeight: 150,
  },
});

/* ─── FILES TAB ─── */
export function FilesView() {
  return (
    <ScrollView contentContainerStyle={{ paddingTop: 90, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 14 }}>
        <CircularProgress progress={45} size={50} stroke={4} color={T.blue} />
        <View>
          <Text style={{ color: T.textPri, fontSize: 16, fontWeight: "600" }}>
            45 GB <Text style={{ color: T.textMut, fontSize: 12, fontWeight: "400" }}>/ 100 GB</Text>
          </Text>
          <Text style={{ color: T.textSec, fontSize: 12 }}>Cloud storage used</Text>
        </View>
      </View>
      <Text style={common.sectionLabel}>Folders</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 16 }}>
        {FOLDERS.map((f) => (
          <View key={f.id} style={fileStyles.folder}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: f.color + "1A", alignItems: "center", justifyContent: "center" }}>
                <Ic name="folder-open" size={20} color={f.color} />
              </View>
              <Ic name="ellipsis-horizontal" size={18} color={T.textMut} />
            </View>
            <Text style={{ color: T.textPri, fontSize: 14, fontWeight: "500", marginBottom: 2 }}>{f.name}</Text>
            <Text style={{ color: T.textSec, fontSize: 11 }}>{f.count} items</Text>
          </View>
        ))}
      </ScrollView>
      <Text style={common.sectionLabel}>Recent Files</Text>
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {FILES.map((f, i) => (
          <Animated.View key={f.id} entering={FadeInDown.delay(i * 50)}>
            <TouchableOpacity activeOpacity={0.7} style={fileStyles.row}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: f.color + "1A", borderWidth: 1, borderColor: f.color + "33", alignItems: "center", justifyContent: "center" }}>
                <Ic name={f.icon as any} size={20} color={f.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: T.textPri, fontSize: 14, fontWeight: "500", marginBottom: 4 }} numberOfLines={1}>{f.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ color: T.textSec, fontSize: 11 }}>{f.size}</Text>
                  <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: T.borderMid }} />
                  <Text style={{ color: T.textSec, fontSize: 11 }}>{f.date}</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.03)" }}>
                <Text style={{ color: T.textMut, fontSize: 10, fontFamily: "Courier", fontWeight: "600" }}>{f.ext}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}
const fileStyles = StyleSheet.create({
  folder: { width: 130, padding: 14, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  row: { flexDirection: "row", alignItems: "center", gap: 14, padding: 12, backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" },
});

/* ─── PROCESSES POPOVER (background tasks) ─── */
export function ProcessesPopover({ tasks }: { tasks: BgTask[] }) {
  return (
    <GlassDropdown>
      <Text style={{ color: T.textSec, fontSize: 11, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>Running Tasks</Text>
      <View style={{ gap: 14 }}>
        {tasks.map((t) => (
          <View key={t.id} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <CircularProgress progress={t.progress} size={24} color={t.color} stroke={3} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.textPri, fontSize: 13, fontWeight: "500", marginBottom: 2 }}>{t.name}</Text>
              <Text style={{ color: t.color, fontSize: 10, fontFamily: "Courier" }}>{t.progress}%</Text>
            </View>
          </View>
        ))}
      </View>
    </GlassDropdown>
  );
}

/* ─── CHAT MENU POPOVER ─── */
export function ChatMenuPopover() {
  const items = [
    { icon: "pin-outline",          label: "Pin Session",       color: T.amber },
    { icon: "share-social-outline", label: "Share Transcript",  color: T.blue  },
    { icon: "refresh-outline",      label: "Clear Context",     color: T.sage  },
    { divider: true } as any,
    { icon: "trash-outline",        label: "Delete Chat",       color: T.red   },
  ];
  return (
    <GlassDropdown>
      <View style={{ gap: 4 }}>
        {items.map((it: any, i) => it.divider ? (
          <View key={i} style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginVertical: 4 }} />
        ) : (
          <TouchableOpacity key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 10, borderRadius: 10 }}>
            <Ic name={it.icon as any} size={18} color={it.color} />
            <Text style={{ color: it.label === "Delete Chat" ? T.red : T.textPri, fontSize: 14 }}>{it.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </GlassDropdown>
  );
}

const common = StyleSheet.create({
  sectionLabel: { paddingHorizontal: 20, paddingVertical: 14, fontSize: 12, color: T.textSec, fontWeight: "600", letterSpacing: 1.4, textTransform: "uppercase" },
  convoRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: T.border },
});
