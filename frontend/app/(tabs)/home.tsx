import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { T, STATUS_COLOR } from "../../src/theme";
import { Ic, ActivityRings, ProgressBar, StatusDot } from "../../src/primitives";
import { INITIAL_BG_TASKS, BgTask, CONVOS } from "../../src/data/mock";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const QUICK_ACTIONS = [
  { icon: "add-outline",          label: "New Chat",  color: T.amber,  route: "/chat/new" },
  { icon: "apps-outline",         label: "Spaces",    color: T.violet, route: null        },
  { icon: "search-outline",       label: "Research",  color: T.teal,   route: "/chat/new" },
  { icon: "cloud-upload-outline", label: "Upload",    color: T.blue,   route: null        },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<BgTask[]>(INITIAL_BG_TASKS);

  useEffect(() => {
    const id = setInterval(() => {
      setTasks(p => p.map(t => ({
        ...t,
        progress: Math.min(100, t.progress + (Math.random() > 0.6 ? 1 : 0)),
      })));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const rings = [
    { progress: tasks[0]?.progress ?? 65, color: T.amber,  label: "Model"   },
    { progress: tasks[1]?.progress ?? 30, color: T.violet, label: "Sync"    },
    { progress: tasks[2]?.progress ?? 85, color: T.teal,   label: "Scraper" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* HEADER */}
        <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
          <View>
            <Text style={s.greet}>{greeting()}, kc</Text>
            <Text style={s.greetSub}>
              {tasks.filter(t => t.progress < 100).length} active ·{" "}
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={s.avatar}>
            <Ic name="person-outline" size={16} color={T.amber} />
          </TouchableOpacity>
        </Animated.View>

        {/* STATS ROW */}
        <Animated.View entering={FadeInDown.delay(40).duration(260)} style={s.statsRow}>
          {[
            { label: "Active",  value: "3",   color: T.amber,  icon: "flash-outline"        },
            { label: "Agents",  value: "12",  color: T.violet, icon: "hardware-chip-outline" },
            { label: "Tokens",  value: "42k", color: T.teal,   icon: "stats-chart-outline"  },
          ].map((item, i) => (
            <View key={i} style={s.statCard}>
              <View style={[s.statIconBox, { backgroundColor: item.color + "15" }]}>
                <Ic name={item.icon as any} size={13} color={item.color} />
              </View>
              <Text style={s.statVal}>{item.value}</Text>
              <Text style={s.statLabel}>{item.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* QUICK ACTIONS */}
        <Animated.View entering={FadeInDown.delay(80).duration(260)} style={s.section}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.actionsRow}>
            {QUICK_ACTIONS.map((a, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => a.route ? router.push(a.route as any) : undefined}
                style={s.actionBtn}
              >
                <View style={[s.actionIcon, { backgroundColor: a.color + "15" }]}>
                  <Ic name={a.icon as any} size={18} color={a.color} />
                </View>
                <Text style={s.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* SYSTEM HEALTH */}
        <Animated.View entering={FadeInDown.delay(120).duration(260)} style={s.section}>
          <Text style={s.sectionTitle}>System Health</Text>
          <View style={s.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <ActivityRings rings={rings} size={80} />
              <View style={{ flex: 1, gap: 8 }}>
                {rings.map((r, i) => (
                  <View key={i} style={{ gap: 3 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={s.ringLabel}>{r.label}</Text>
                      <Text style={[s.ringPct, { color: r.color }]}>{r.progress}%</Text>
                    </View>
                    <ProgressBar progress={r.progress} color={r.color} height={2} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* RUNNING TASKS */}
        <Animated.View entering={FadeInDown.delay(160).duration(260)} style={s.section}>
          <Text style={s.sectionTitle}>Running Tasks</Text>
          <View style={s.card}>
            {tasks.map((t, i) => (
              <View key={t.id}>
                <View style={s.taskRow}>
                  <View style={[s.taskIcon, { backgroundColor: t.color + "12" }]}>
                    <Ic name={t.icon as any} size={14} color={t.color} />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={s.taskName} numberOfLines={1}>{t.name}</Text>
                      <Text style={[s.taskPct, { color: t.color }]}>{t.progress}%</Text>
                    </View>
                    <ProgressBar progress={t.progress} color={t.color} height={2} />
                  </View>
                </View>
                {i < tasks.length - 1 && <View style={s.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* RECENT CHATS */}
        <Animated.View entering={FadeInDown.delay(200).duration(260)} style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Recent Chats</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/chats" as any)} activeOpacity={0.7}>
              <Text style={s.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={s.card}>
            {CONVOS.slice(0, 3).map((c, i) => (
              <View key={c.id}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push(`/chat/${c.id}` as any)}
                  style={s.convoRow}
                >
                  <View style={[s.convoAvatar, { backgroundColor: T.amber + "12" }]}>
                    <Ic name={c.icon as any} size={14} color={T.amber} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.convoName} numberOfLines={1}>{c.name}</Text>
                    <Text style={s.convoPreview} numberOfLines={1}>{c.preview}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 4 }}>
                    <Text style={s.convoTime}>{c.time}</Text>
                    <StatusDot status={c.status} size={5} />
                  </View>
                </TouchableOpacity>
                {i < 2 && <View style={s.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  scroll:       { paddingTop: 56, paddingBottom: 90, paddingHorizontal: 16 },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  greet:        { color: T.textPri, fontSize: 22, fontWeight: "700", letterSpacing: -0.4 },
  greetSub:     { color: T.textSec, fontSize: 12, marginTop: 2 },
  avatar:       { width: 34, height: 34, borderRadius: 17, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: "center", justifyContent: "center" },

  statsRow:     { flexDirection: "row", gap: 8, marginBottom: 16 },
  statCard:     { flex: 1, backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, padding: 12, gap: 2 },
  statIconBox:  { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  statVal:      { color: T.textPri, fontSize: 18, fontWeight: "700", letterSpacing: -0.3 },
  statLabel:    { color: T.textSec, fontSize: 10.5, fontWeight: "500" },

  section:      { marginBottom: 16 },
  sectionHeader:{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionTitle: { color: T.textSec, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 },
  seeAll:       { color: T.amber, fontSize: 12, fontWeight: "500" },

  actionsRow:   { flexDirection: "row", gap: 8 },
  actionBtn:    { flex: 1, alignItems: "center", gap: 6, backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, paddingVertical: 12 },
  actionIcon:   { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  actionLabel:  { color: T.textSec, fontSize: 10.5, fontWeight: "600" },

  card:         { backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, padding: 12 },
  ringLabel:    { color: T.textSec, fontSize: 11 },
  ringPct:      { fontSize: 11, fontWeight: "700" },

  taskRow:      { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  taskIcon:     { width: 30, height: 30, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  taskName:     { color: T.textPri, fontSize: 12.5, fontWeight: "500", flex: 1 },
  taskPct:      { fontSize: 11, fontWeight: "700" },
  divider:      { height: 1, backgroundColor: T.border },

  convoRow:     { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  convoAvatar:  { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  convoName:    { color: T.textPri, fontSize: 13, fontWeight: "500", marginBottom: 1 },
  convoPreview: { color: T.textSec, fontSize: 11.5 },
  convoTime:    { color: T.textMut, fontSize: 10 },
});
