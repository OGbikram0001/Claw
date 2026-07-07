import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn, FadeInDown, SlideInLeft, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ic, BxIcon, DiIcon, Logo, CircularProgress, StatusDot, ActivityRings, AnimatedGlyph, ProgressBar, ScrollFade } from "./primitives";
import { T, STATUS_COLOR } from "./theme";
import { CONVOS, SPACES, FOLDERS, FILES, BgTask, DEVICON_MAP, FILE_FALLBACK_ICON } from "./data/mock";

const { width: SW } = Dimensions.get("window");
const PHONE_W = Math.min(SW, 520);

/* ─── GLASS DROPDOWN ─── */
export function GlassDropdown({ children }: { children: React.ReactNode }) {
  return (
    <Animated.View entering={FadeIn.duration(180)} style={dd.wrap}>
      <View style={dd.box}>
        <LinearGradient colors={["rgba(30,28,22,0.97)", "rgba(18,16,12,0.99)"]} style={StyleSheet.absoluteFill} />
        <View style={{ padding: 14 }}>{children}</View>
      </View>
    </Animated.View>
  );
}
const dd = StyleSheet.create({
  wrap: { position: "absolute", top: 62, right: 0, width: 256, zIndex: 200 },
  box:  { borderRadius: 18, borderWidth: 1, borderColor: T.borderMid, overflow: "hidden" },
});

/* ─── SIDEBAR ─── */
export function Sidebar({ onClose }: { onClose: () => void }) {
  const items = [
    { icon: "apps-outline",        label: "Integrations",  badge: "8" },
    { icon: "key-outline",         label: "API Keys" },
    { icon: "stats-chart-outline", label: "Usage & Billing" },
    { icon: "shield-outline",      label: "Security" },
    { icon: "settings-outline",    label: "Settings" },
  ];
  const brands = [
    { name: "bxl-slack",      label: "Slack",     connected: true  },
    { name: "bxl-github",     label: "GitHub",    connected: true  },
    { name: "bxl-stripe",     label: "Stripe",    connected: true  },
    { name: "bxl-notion",     label: "Notion",    connected: false },
  ];
  return (
    <>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFillObject}>
        <Animated.View entering={FadeIn.duration(180)} style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.55)" }]} />
      </Pressable>
      <Animated.View entering={SlideInLeft.duration(340)} style={side.drawer}>
        <LinearGradient colors={["rgba(22,20,16,0.98)", "rgba(14,12,10,0.99)"]} style={StyleSheet.absoluteFill} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 22, gap: 0 }}>
          {/* Logo */}
          <View style={{ marginTop: 20, marginBottom: 28 }}>
            <Logo size={20} />
            <Text style={{ color: T.textMut, fontSize: 11, marginTop: 6 }}>Workspace · Pro Plan</Text>
          </View>

          {/* Nav items */}
          <Text style={side.label}>Navigation</Text>
          <View style={{ gap: 3, marginBottom: 22 }}>
            {items.map((it, i) => (
              <TouchableOpacity key={i} style={side.item} activeOpacity={0.7}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: T.card, alignItems: "center", justifyContent: "center" }}>
                  <Ic name={it.icon as any} size={16} color={T.amber} />
                </View>
                <Text style={{ color: T.textPri, fontSize: 14, flex: 1 }}>{it.label}</Text>
                {it.badge && (
                  <View style={{ paddingHorizontal: 7, paddingVertical: 2, backgroundColor: T.amber + "22", borderRadius: 8 }}>
                    <Text style={{ color: T.amber, fontSize: 11, fontWeight: "700" }}>{it.badge}</Text>
                  </View>
                )}
                <Ic name="chevron-forward" size={13} color={T.textMut} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Connected services */}
          <Text style={side.label}>Connected Services</Text>
          <View style={{ gap: 6, marginBottom: 24 }}>
            {brands.map((b, i) => (
              <View key={i} style={side.brandRow}>
                <BxIcon name={b.name} size={18} color={b.connected ? T.textPri : T.textMut} />
                <Text style={{ color: b.connected ? T.textPri : T.textMut, fontSize: 13, flex: 1 }}>{b.label}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: b.connected ? T.sage : T.textMut }} />
                  <Text style={{ color: b.connected ? T.sage : T.textMut, fontSize: 11 }}>{b.connected ? "Live" : "Off"}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Profile footer */}
        <View style={side.footer}>
          <LinearGradient colors={["transparent", "rgba(14,12,10,0.99)"]} style={StyleSheet.absoluteFill} />
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center", padding: 20 }}>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: T.amber + "2A", alignItems: "center", justifyContent: "center" }}>
              <Ic name="person" size={18} color={T.amber} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.textPri, fontSize: 13.5, fontWeight: "600" }}>kc · Pro</Text>
              <Text style={{ color: T.textSec, fontSize: 11 }}>3,420 / 10k credits used</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Ic name="log-out-outline" size={18} color={T.textMut} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
}
const side = StyleSheet.create({
  drawer:   { position: "absolute", top: 0, bottom: 0, left: 0, width: 300, borderRightWidth: 1, borderRightColor: T.border, zIndex: 201, overflow: "hidden" },
  label:    { color: T.textMut, fontSize: 10.5, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10 },
  item:     { flexDirection: "row", alignItems: "center", gap: 12, padding: 10, borderRadius: 12 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: T.border },
  footer:   { borderTopWidth: 1, borderTopColor: T.border },
});

/* ─── HOME VIEW — BENTO GRID ─── */
export function HomeView({ bgTasks, overallProgress, onOpenChat }: {
  bgTasks: any[];
  overallProgress: number;
  onOpenChat: (c: any) => void;
}) {
  const rings = [
    { progress: overallProgress,    color: T.amber,  label: "Tasks"  },
    { progress: 72,                  color: T.violet, label: "Research"},
    { progress: 58,                  color: T.sage,   label: "Agents" },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 76, paddingBottom: 110, paddingHorizontal: 16, gap: 10 }}
    >
      {/* Row 1: Glyph hero + Rings */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {/* Glyph card */}
        <View style={[bento.card, { flex: 1.6, minHeight: 170, overflow: "hidden" }]}>
          <LinearGradient colors={[T.card, T.surface]} style={StyleSheet.absoluteFill} />
          <View style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.06 }}>
            <AnimatedGlyph size={130} />
          </View>
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Logo size={15} />
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: T.sage + "20", borderRadius: 8, borderWidth: 1, borderColor: T.sage + "40" }}>
                <Text style={{ color: T.sage, fontSize: 10, fontWeight: "700" }}>● ONLINE</Text>
              </View>
            </View>
            <View>
              <Text style={{ color: T.textMut, fontSize: 10.5, fontWeight: "600", letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 6 }}>AI Agent Platform</Text>
              <Text style={{ color: T.textPri, fontSize: 20, fontWeight: "700", lineHeight: 24 }}>kittyclaw</Text>
              <Text style={{ color: T.textSec, fontSize: 12, marginTop: 4 }}>{bgTasks.length} tasks running</Text>
            </View>
          </View>
        </View>

        {/* Activity rings card */}
        <View style={[bento.card, { flex: 1, minHeight: 170, alignItems: "center", justifyContent: "center", gap: 12 }]}>
          <ActivityRings rings={rings} size={88} />
          <View style={{ gap: 4, alignItems: "center" }}>
            {rings.map((r, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: r.color }} />
                <Text style={{ color: T.textSec, fontSize: 10 }}>{r.label} {r.progress}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Row 2: Task bento tiles */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {bgTasks.slice(0, 2).map((task, i) => (
          <Animated.View key={task.id} entering={FadeInDown.delay(i * 80)} style={[bento.card, { flex: 1, minHeight: 110 }]}>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: task.color + "18", alignItems: "center", justifyContent: "center" }}>
                  <Ic name={task.icon as any} size={15} color={task.color} />
                </View>
                <View style={{ width: 28, height: 28 }}>
                  <CircularProgress progress={task.progress} size={28} stroke={3} color={task.color} />
                </View>
              </View>
              <View>
                <Text style={{ color: T.textPri, fontSize: 12.5, fontWeight: "600", lineHeight: 16 }} numberOfLines={2}>{task.name}</Text>
                <ProgressBar progress={task.progress} color={task.color} height={2} />
                <Text style={{ color: task.color, fontSize: 10, fontFamily: "Courier", fontWeight: "700", marginTop: 4 }}>{task.progress}%</Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Row 3: Wide task / quick access */}
      {bgTasks[2] && (
        <Animated.View entering={FadeInDown.delay(200)} style={[bento.card, { flexDirection: "row", alignItems: "center", gap: 14 }]}>
          <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: bgTasks[2].color + "18", alignItems: "center", justifyContent: "center" }}>
            <Ic name={bgTasks[2].icon as any} size={20} color={bgTasks[2].color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: T.textPri, fontSize: 14, fontWeight: "600", marginBottom: 6 }}>{bgTasks[2].name}</Text>
            <ProgressBar progress={bgTasks[2].progress} color={bgTasks[2].color} height={3} />
          </View>
          <Text style={{ color: bgTasks[2].color, fontSize: 15, fontWeight: "700", fontFamily: "Courier" }}>{bgTasks[2].progress}%</Text>
        </Animated.View>
      )}

      {/* Row 4: Recent chats quick access */}
      <Text style={bento.sectionLabel}>Recent Chats</Text>
      {CONVOS.slice(0, 3).map((c, i) => (
        <Animated.View key={c.id} entering={FadeInDown.delay(i * 60)}>
          <TouchableOpacity onPress={() => onOpenChat(c)} activeOpacity={0.7} style={bento.chatRow}>
            <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: "center", justifyContent: "center" }}>
              {c.brand
                ? <BxIcon name={c.brand} size={16} color={T.amber} fallback="globe-outline" />
                : <Ic name={c.icon as any} size={16} color={T.amber} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.textPri, fontSize: 13.5, fontWeight: "500" }} numberOfLines={1}>{c.name}</Text>
              <Text style={{ color: T.textSec, fontSize: 11.5, marginTop: 2 }} numberOfLines={1}>{c.preview}</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <StatusDot status={c.status} size={6} />
              <Text style={{ color: T.textMut, fontSize: 11 }}>{c.time}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const bento = StyleSheet.create({
  card:         { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 14 },
  sectionLabel: { color: T.textMut, fontSize: 10.5, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", marginTop: 6, marginBottom: 4, paddingHorizontal: 2 },
  chatRow:      { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: T.surface, borderRadius: 14, borderWidth: 1, borderColor: T.border, marginBottom: 2 },
});

/* ─── CHATS VIEW ─── */
export function ChatsView({ onOpen }: { onOpen: (c: any) => void }) {
  const [filter, setFilter] = useState<string>("all");
  const filters = ["all", "running", "waiting", "done"];
  const filtered = filter === "all" ? CONVOS : CONVOS.filter(c => c.status === filter);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 74, paddingBottom: 110 }}>
        {/* Filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
          {filters.map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} activeOpacity={0.75}
              style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16,
                backgroundColor: filter === f ? T.amber : T.card,
                borderWidth: 1, borderColor: filter === f ? T.amber : T.border }}>
              <Text style={{ color: filter === f ? T.bg : T.textSec, fontSize: 12.5, fontWeight: "600", textTransform: "capitalize" }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map((c, i) => (
          <Animated.View key={c.id} entering={FadeInDown.delay(i * 55)}>
            <TouchableOpacity activeOpacity={0.72} onPress={() => onOpen(c)} style={ch.row}>
              <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: T.card, borderWidth: 1, borderColor: T.borderMid, alignItems: "center", justifyContent: "center" }}>
                {c.brand
                  ? <BxIcon name={c.brand} size={20} color={T.amber} fallback="globe-outline" />
                  : <Ic name={c.icon as any} size={20} color={T.amber} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <Text style={{ color: T.textPri, fontSize: 14.5, fontWeight: "500", flex: 1, marginRight: 8 }} numberOfLines={1}>{c.name}</Text>
                  <Text style={{ color: T.textMut, fontSize: 11 }}>{c.time}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                  <StatusDot status={c.status} size={6} />
                  <Text style={{ color: c.unread ? T.textSec : T.textSec, fontSize: 12.5, flex: 1 }} numberOfLines={1}>{c.preview}</Text>
                  {c.unread > 0 && (
                    <View style={{ minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: T.amber, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: T.bg, fontSize: 11, fontWeight: "800" }}>{c.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
      <ScrollFade position="top" />
      <ScrollFade position="bottom" />
    </View>
  );
}
const ch = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: T.border },
});

/* ─── SPACES VIEW — Pinterest style ─── */
export function SpacesView() {
  const col1 = SPACES.filter((_, i) => i % 2 === 0);
  const col2 = SPACES.filter((_, i) => i % 2 === 1);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 74, paddingBottom: 110, paddingHorizontal: 12 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 4, paddingBottom: 10 }}>
          <Text style={{ color: T.textPri, fontSize: 18, fontWeight: "700" }}>Spaces</Text>
          <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: T.card, borderRadius: 20, borderWidth: 1, borderColor: T.border }}>
            <Ic name="add" size={16} color={T.amber} />
            <Text style={{ color: T.amber, fontSize: 13, fontWeight: "600" }}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Masonry 2-col */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1, gap: 10 }}>
            {col1.map((space, i) => <SpaceCard key={space.id} space={space} idx={i * 2} />)}
          </View>
          <View style={{ flex: 1, gap: 10 }}>
            {/* Create new card */}
            <TouchableOpacity activeOpacity={0.75} style={[sp.card, { minHeight: 120, alignItems: "center", justifyContent: "center", borderStyle: "dashed", borderColor: "rgba(255,255,255,0.12)", backgroundColor: "transparent" }]}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Ic name="add" size={22} color={T.textSec} />
              </View>
              <Text style={{ color: T.textSec, fontSize: 14, fontWeight: "600" }}>New Space</Text>
              <Text style={{ color: T.textMut, fontSize: 11, marginTop: 4 }}>Blank or template</Text>
            </TouchableOpacity>
            {col2.map((space, i) => <SpaceCard key={space.id} space={space} idx={i * 2 + 1} />)}
          </View>
        </View>
      </ScrollView>
      <ScrollFade position="top" />
      <ScrollFade position="bottom" />
    </View>
  );
}
const sp = StyleSheet.create({
  card: { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 14 },
});

// BOLT OPTIMIZATION: Extracted SpaceCard outside of SpacesView and wrapped with React.memo()
// This prevents expensive unmounting/remounting of child components on every parent render
const SpaceCard = React.memo(function SpaceCard({ space, idx }: { space: typeof SPACES[number]; idx: number }) {
  const cardHeight = space.size === "lg" ? 210 : space.size === "sm" ? 140 : 170;
  return (
    <Animated.View entering={FadeInDown.delay(idx * 70)}>
      <TouchableOpacity activeOpacity={0.8} style={[sp.card, { minHeight: cardHeight, overflow: "hidden" }]}>
        {/* Background tint */}
        <LinearGradient
          colors={[space.color + "14", "transparent"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
        {/* Status dot */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: space.color + "1A", borderWidth: 1, borderColor: space.color + "44", alignItems: "center", justifyContent: "center" }}>
            <Ic name={space.icon as any} size={18} color={space.color} />
          </View>
          <StatusDot status={space.status} size={7} />
        </View>

        {/* Content */}
        <Text style={{ color: T.textPri, fontSize: 15, fontWeight: "700", lineHeight: 19, marginBottom: 5 }}>{space.name}</Text>
        <Text style={{ color: T.textSec, fontSize: 11.5, lineHeight: 16, flex: 1 }}>{space.desc}</Text>

        {/* Tags */}
        {space.tags && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
            {space.tags.map((tag, t) => (
              <View key={t} style={{ paddingHorizontal: 7, paddingVertical: 3, backgroundColor: space.color + "18", borderRadius: 6 }}>
                <Text style={{ color: space.color, fontSize: 10, fontWeight: "600" }}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <View style={{ flexDirection: "row" }}>
            {space.agents.slice(0, 3).map((ac, k) => (
              <View key={k} style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: ac + "2A",
                borderWidth: 2, borderColor: T.card,
                alignItems: "center", justifyContent: "center", marginLeft: k === 0 ? 0 : -7 }}>
                <Ic name="hardware-chip-outline" size={10} color={ac} />
              </View>
            ))}
            {space.agents.length > 3 && (
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: T.card, borderWidth: 2, borderColor: T.card, alignItems: "center", justifyContent: "center", marginLeft: -7 }}>
                <Text style={{ color: T.textMut, fontSize: 9 }}>+{space.agents.length - 3}</Text>
              </View>
            )}
          </View>
          <Text style={{ color: T.textMut, fontSize: 10 }}>{space.lastActive}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// BOLT OPTIMIZATION: Extracted FileIcon outside of FilesView and wrapped with React.memo()
// This prevents expensive unmounting/remounting of child components on every parent render
const FileIcon = React.memo(function FileIcon({ ext, color }: { ext: string; color: string }) {
  const devicon = DEVICON_MAP[ext];
  const fallback = FILE_FALLBACK_ICON[ext] || "document-outline";
  if (devicon) return <DiIcon name={devicon} size={22} color={color} fallback={fallback as any} />;
  return <Ic name={fallback as any} size={22} color={color} />;
});

/* ─── FILES VIEW ─── */
export function FilesView() {
  const [view, setView] = useState<"grid" | "list">("list");
  const totalGB = 45, maxGB = 100;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 74, paddingBottom: 110 }}>
        {/* Storage bar */}
        <View style={{ margin: 16, padding: 16, backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: T.textPri, fontSize: 15, fontWeight: "600" }}>Cloud Storage</Text>
            <Text style={{ color: T.textSec, fontSize: 13 }}>
              <Text style={{ color: T.textPri, fontWeight: "600" }}>{totalGB} GB</Text> / {maxGB} GB
            </Text>
          </View>
          <ProgressBar progress={(totalGB / maxGB) * 100} color={T.blue} height={4} />
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.violet }} />
              <Text style={{ color: T.textSec, fontSize: 11 }}>Code  18 GB</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.amber }} />
              <Text style={{ color: T.textSec, fontSize: 11 }}>Assets  15 GB</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.sage }} />
              <Text style={{ color: T.textSec, fontSize: 11 }}>Other  12 GB</Text>
            </View>
          </View>
        </View>

        {/* Folders */}
        <View style={{ paddingHorizontal: 16, marginBottom: 6 }}>
          <Text style={fl.label}>Folders</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}>
          {FOLDERS.map((f, i) => (
            <Animated.View key={f.id} entering={FadeInDown.delay(i * 60)}>
              <TouchableOpacity activeOpacity={0.75} style={fl.folderCard}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: f.color + "18", alignItems: "center", justifyContent: "center" }}>
                    <Ic name="folder" size={20} color={f.color} />
                  </View>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Ic name="ellipsis-horizontal" size={16} color={T.textMut} />
                  </TouchableOpacity>
                </View>
                <Text style={{ color: T.textPri, fontSize: 13.5, fontWeight: "600", marginBottom: 2 }}>{f.name}</Text>
                <Text style={{ color: T.textMut, fontSize: 11 }}>{f.count} items</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Files header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }}>
          <Text style={fl.label}>Recent Files</Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <TouchableOpacity onPress={() => setView("list")} activeOpacity={0.7}
              style={{ padding: 7, borderRadius: 8, backgroundColor: view === "list" ? T.amber + "22" : "transparent" }}>
              <Ic name="list-outline" size={16} color={view === "list" ? T.amber : T.textMut} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setView("grid")} activeOpacity={0.7}
              style={{ padding: 7, borderRadius: 8, backgroundColor: view === "grid" ? T.amber + "22" : "transparent" }}>
              <Ic name="grid-outline" size={16} color={view === "grid" ? T.amber : T.textMut} />
            </TouchableOpacity>
          </View>
        </View>

        {/* File list */}
        <View style={{ paddingHorizontal: 16, gap: 4 }}>
          {FILES.map((f, i) => (
            <Animated.View key={f.id} entering={FadeInDown.delay(i * 45)}>
              <TouchableOpacity activeOpacity={0.72} style={fl.fileRow}>
                <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: f.color + "14",
                  borderWidth: 1, borderColor: f.color + "30", alignItems: "center", justifyContent: "center" }}>
                  <FileIcon ext={f.ext} color={f.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: T.textPri, fontSize: 13.5, fontWeight: "500", marginBottom: 3 }} numberOfLines={1}>{f.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: T.textMut, fontSize: 11 }}>{f.size}</Text>
                    <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: T.textMut }} />
                    <Text style={{ color: T.textMut, fontSize: 11 }}>{f.date}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={{ paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, backgroundColor: f.color + "14" }}>
                    <Text style={{ color: f.color, fontSize: 10, fontFamily: "Courier", fontWeight: "700" }}>{f.ext}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Ic name="ellipsis-vertical" size={16} color={T.textMut} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <ScrollFade position="top" />
      <ScrollFade position="bottom" />
    </View>
  );
}
const fl = StyleSheet.create({
  label:      { color: T.textMut, fontSize: 10.5, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase" },
  folderCard: { width: 140, padding: 14, backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.border },
  fileRow:    { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 11, paddingHorizontal: 12, backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border },
});

/* ─── PROCESSES POPOVER ─── */
export function ProcessesPopover({ tasks }: { tasks: BgTask[] }) {
  return (
    <GlassDropdown>
      <Text style={{ color: T.textMut, fontSize: 10.5, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>Running Tasks</Text>
      <View style={{ gap: 14 }}>
        {tasks.map((t) => (
          <View key={t.id} style={{ gap: 7 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <CircularProgress progress={t.progress} size={22} color={t.color} stroke={2.5} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: T.textPri, fontSize: 12.5, fontWeight: "500" }}>{t.name}</Text>
              </View>
              <Text style={{ color: t.color, fontSize: 11, fontFamily: "Courier", fontWeight: "700" }}>{t.progress}%</Text>
            </View>
            <ProgressBar progress={t.progress} color={t.color} height={2} />
          </View>
        ))}
      </View>
    </GlassDropdown>
  );
}

/* ─── CHAT MENU POPOVER ─── */
export function ChatMenuPopover({ onNewChat }: { onNewChat: () => void }) {
  const items = [
    { icon: "pin-outline",          label: "Pin Session",       color: T.amber,  onPress: () => {} },
    { icon: "share-social-outline", label: "Share Transcript",  color: T.blue,   onPress: () => {} },
    { icon: "refresh-outline",      label: "Clear Context",     color: T.sage,   onPress: () => {} },
    { icon: "create-outline",       label: "New Chat",          color: T.violet, onPress: onNewChat },
    { divider: true } as any,
    { icon: "trash-outline",        label: "Delete Chat",       color: T.red,    onPress: () => {} },
  ];
  return (
    <GlassDropdown>
      <View style={{ gap: 2 }}>
        {items.map((it: any, i) =>
          it.divider
            ? <View key={i} style={{ height: 1, backgroundColor: "rgba(255,255,255,0.07)", marginVertical: 4 }} />
            : (
              <TouchableOpacity key={i} onPress={it.onPress} activeOpacity={0.75}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 10, borderRadius: 10 }}>
                <View style={{ width: 28, height: 28, borderRadius: 9, backgroundColor: it.color + "18", alignItems: "center", justifyContent: "center" }}>
                  <Ic name={it.icon} size={15} color={it.color} />
                </View>
                <Text style={{ color: it.label === "Delete Chat" ? T.red : T.textPri, fontSize: 13.5 }}>{it.label}</Text>
              </TouchableOpacity>
            )
        )}
      </View>
    </GlassDropdown>
  );
}
