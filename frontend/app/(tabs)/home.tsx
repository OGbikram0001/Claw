import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { T, STATUS_COLOR } from "../../src/theme";
import { Ic, CircularProgress, ActivityRings, ProgressBar, StatusDot } from "../../src/primitives";
import { INITIAL_BG_TASKS, BgTask, CONVOS } from "../../src/data/mock";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function StatCard({ label, value, sub, color, icon }: {
  label: string; value: string; sub: string; color: string; icon: any;
}) {
  return (
    <View style={s.statCard}>
      <View style={[s.statIcon, { backgroundColor: color + "18" }]}>
        <Ic name={icon} size={16} color={color} />
      </View>
      <Text style={s.statVal}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statSub}>{sub}</Text>
    </View>
  );
}

const QUICK_ACTIONS = [
  { icon: "add-circle-outline",   label: "New Chat",  color: T.amber,  route: "/chat/new" },
  { icon: "apps-outline",          label: "New Space", color: T.violet, route: null        },
  { icon: "search-outline",        label: "Research",  color: T.teal,   route: "/chat/new" },
  { icon: "cloud-upload-outline",  label: "Upload",    color: T.blue,   route: null        },
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

        {/* GREETING */}
        <Animated.View entering={FadeInDown.duration(320)} style={s.greetRow}>
          <View>
            <Text style={s.greet}>{greeting()}, kc</Text>
            <Text style={s.greetSub}>
              {tasks.filter(t => t.progress < 100).length} active · {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={s.avatarBtn}>
            <Ic name="person-outline" size={18} color={T.amber} />
          </TouchableOpacity>
        </Animated.View>

        {/* STAT CARDS */}
        <Animated.View entering={FadeInDown.delay(50).duration(300)} style={s.statsRow}>
          <StatCard label="Active"  value="3"   sub="Tasks running" color={T.amber}  icon="flash-outline"          />
          <StatCard label="Agents"  value="12"  sub="Online now"    color={T.violet} icon="hardware-chip-outline"   />
          <StatCard label="Tokens"  value="42k" sub="Used today"    color={T.teal}   icon="stats-chart-outline"     />
        </Animated.View>

        {/* SYSTEM HEALTH */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={s.card}>
          <Text style={s.cardTitle}>System Health</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <ActivityRings rings={rings} size={96} />
            <View style={{ flex: 1, gap: 10 }}>
              {rings.map((r, i) => (
                <View key={i} style={{ gap: 5 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={s.ringLabel}>{r.label}</Text>
                    <Text style={[s.ringPct, { color: r.color }]}>{r.progress}%</Text>
                  </View>
                  <ProgressBar progress={r.progress} color={r.color} height={3} />
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* QUICK ACTIONS */}
        <Animated.View entering={FadeInDown.delay(150).duration(300)}>
          <Text style={s.sectionLabel}>Quick Actions</Text>
          <View style={s.actionsRow}>
            {QUICK_ACTIONS.map((a, i) => (
              <TouchableOpacity key={i} activeOpacity={0.75}
                onPress={() => a.route ? router.push(a.route as any) : undefined}
                style={s.actionBtn}>
                <View style={[s.actionIcon, { backgroundColor: a.color + "18" }]}>
                  <Ic name={a.icon as any} size={22} color={a.color} />
                </View>
                <Text style={s.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* RUNNING TASKS */}
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <Text style={s.sectionLabel}>Running Tasks</Text>
          <View style={s.card}>
            {tasks.map((t, i) => (
              <View key={t.id}>
                <View style={s.taskRow}>
                  <View style={[s.taskIcon, { backgroundColor: t.color + "14" }]}>
                    <Ic name={t.icon as any} size={16} color={t.color} />
                  </View>
                  <View style={{ flex: 1, gap: 6 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={s.taskName} numberOfLines={1}>{t.name}</Text>
                      <Text style={[s.taskPct, { color: t.color }]}>{t.progress}%</Text>
                    </View>
                    <ProgressBar progress={t.progress} color={t.color} height={3} />
                  </View>
                </View>
                {i < tasks.length - 1 && <View style={s.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* RECENT CHATS */}
        <Animated.View entering={FadeInDown.delay(250).duration(300)}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={s.sectionLabel}>Recent Chats</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/chats" as any)} activeOpacity={0.7}>
              <Text style={{ color: T.amber, fontSize: 12.5 }}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={s.card}>
            {CONVOS.slice(0, 3).map((c, i) => (
              <View key={c.id}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => router.push(`/chat/${c.id}` as any)}
                  style={s.convoRow}
                >
                  <View style={[s.convoAvatar, { backgroundColor: T.amber + "14" }]}>
                    <Ic name={c.icon as any} size={17} color={T.amber} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.convoName} numberOfLines={1}>{c.name}</Text>
                    <Text style={s.convoPreview} numberOfLines={1}>{c.preview}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 5 }}>
                    <StatusDot status={c.status} size={6} />
                    <Text style={s.convoTime}>{c.time}</Text>
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
  scroll:      { paddingTop: 64, paddingBottom: 110, paddingHorizontal: 18, gap: 4 },
  greetRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  greet:       { color: T.textPri, fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  greetSub:    { color: T.textSec, fontSize: 13, marginTop: 4 },
  avatarBtn:   { width: 40, height: 40, borderRadius: 20, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: "center", justifyContent: "center" },
  statsRow:    { flexDirection: "row", gap: 10, marginBottom: 12 },
  statCard:    { flex: 1, backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 14, gap: 3 },
  statIcon:    { width: 32, height: 32, borderRadius: 11, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  statVal:     { color: T.textPri, fontSize: 22, fontWeight: "700", letterSpacing: -0.5 },
  statLabel:   { color: T.textSec, fontSize: 11.5, fontWeight: "600" },
  statSub:     { color: T.textMut, fontSize: 10 },
  card:        { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 16 },
  cardTitle:   { color: T.textPri, fontSize: 14, fontWeight: "700", marginBottom: 14 },
  ringLabel:   { color: T.textSec, fontSize: 11.5 },
  ringPct:     { fontSize: 11.5, fontWeight: "700", fontFamily: "Courier" },
  sectionLabel:{ color: T.textSec, fontSize: 11, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10, marginTop: 4 },
  actionsRow:  { flexDirection: "row", gap: 10, marginBottom: 16 },
  actionBtn:   { flex: 1, alignItems: "center", gap: 8, backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, paddingVertical: 16 },
  actionIcon:  { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  actionLabel: { color: T.textSec, fontSize: 11, fontWeight: "600" },
  taskRow:     { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  taskIcon:    { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  taskName:    { color: T.textPri, fontSize: 13, fontWeight: "500", flex: 1 },
  taskPct:     { fontSize: 12, fontFamily: "Courier", fontWeight: "700" },
  divider:     { height: 1, backgroundColor: T.border, marginVertical: 4 },
  convoRow:    { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  convoAvatar: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  convoName:   { color: T.textPri, fontSize: 13.5, fontWeight: "500", marginBottom: 3 },
  convoPreview:{ color: T.textSec, fontSize: 12 },
  convoTime:   { color: T.textMut, fontSize: 10.5 },
});
