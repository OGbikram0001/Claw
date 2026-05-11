import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { T, STATUS_COLOR } from "../../src/theme";
import { Ic, StatusDot } from "../../src/primitives";
import { SPACES } from "../../src/data/mock";

function SpaceCard({ space, idx }: { space: typeof SPACES[number]; idx: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(idx * 45).duration(260)}>
      <TouchableOpacity activeOpacity={0.75} style={s.card}>
        <LinearGradient
          colors={[space.color + "14", space.color + "03"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
        <View style={s.cardTop}>
          <View style={[s.cardIcon, { backgroundColor: space.color + "18", borderColor: space.color + "35" }]}>
            <Ic name={space.icon as any} size={16} color={space.color} />
          </View>
          <StatusDot status={space.status} size={6} />
        </View>
        <Text style={s.cardName} numberOfLines={2}>{space.name}</Text>
        <Text style={s.cardDesc} numberOfLines={3}>{space.desc}</Text>
        {space.tags && space.tags.length > 0 && (
          <View style={s.tagRow}>
            {space.tags.slice(0, 2).map((tag, t) => (
              <View key={t} style={[s.tag, { backgroundColor: space.color + "15" }]}>
                <Text style={[s.tagText, { color: space.color }]}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={s.cardFooter}>
          <Text style={s.cardTime}>{space.lastActive}</Text>
          <View style={{ flexDirection: "row" }}>
            {space.agents.slice(0, 3).map((ac, k) => (
              <View key={k} style={[s.agentDot, { backgroundColor: ac + "25", marginLeft: k === 0 ? 0 : -5 }]}>
                <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: ac }} />
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function SpacesScreen() {
  const col1 = SPACES.filter((_, i) => i % 2 === 0);
  const col2 = SPACES.filter((_, i) => i % 2 === 1);

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Spaces</Text>
          <Text style={s.sub}>{SPACES.filter(sp => sp.status === "running").length} running</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={s.newBtn}>
          <Ic name="add" size={18} color={T.bg} />
          <Text style={{ color: T.bg, fontSize: 12, fontWeight: "700" }}>New</Text>
        </TouchableOpacity>
      </View>

      <View style={s.statusRow}>
        {(["running", "waiting", "done", "error"] as const).map(st => {
          const count = SPACES.filter(sp => sp.status === st).length;
          return (
            <View key={st} style={s.statusChip}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: STATUS_COLOR[st] }} />
              <Text style={[s.statusCount, { color: STATUS_COLOR[st] }]}>{count}</Text>
              <Text style={s.statusLabel}>{st}</Text>
            </View>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1, gap: 10 }}>
            {col1.map((sp, i) => <SpaceCard key={sp.id} space={sp} idx={i * 2} />)}
          </View>
          <View style={{ flex: 1, gap: 10 }}>
            <TouchableOpacity activeOpacity={0.7} style={s.newCard}>
              <Ic name="add" size={22} color={T.textSec} />
              <Text style={s.newCardLabel}>New Space</Text>
            </TouchableOpacity>
            {col2.map((sp, i) => <SpaceCard key={sp.id} space={sp} idx={i * 2 + 1} />)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 10 },
  title:       { color: T.textPri, fontSize: 24, fontWeight: "700", letterSpacing: -0.4 },
  sub:         { color: T.textSec, fontSize: 12, marginTop: 1 },
  newBtn:      { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: T.amber, borderRadius: 18 },
  statusRow:   { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  statusChip:  { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: T.card, borderRadius: 10, borderWidth: 1, borderColor: T.border },
  statusCount: { fontSize: 12, fontWeight: "700" },
  statusLabel: { color: T.textSec, fontSize: 10.5, textTransform: "capitalize" },
  scroll:      { paddingHorizontal: 16, paddingBottom: 90 },
  card:        { backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.border, padding: 12, overflow: "hidden", gap: 5 },
  cardTop:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  cardIcon:    { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  cardName:    { color: T.textPri, fontSize: 13.5, fontWeight: "700", lineHeight: 18 },
  cardDesc:    { color: T.textSec, fontSize: 11, lineHeight: 15 },
  tagRow:      { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  tag:         { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  tagText:     { fontSize: 9.5, fontWeight: "600" },
  cardFooter:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  agentDot:    { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: T.card, alignItems: "center", justifyContent: "center" },
  cardTime:    { color: T.textMut, fontSize: 9.5 },
  newCard:     { height: 110, backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)", borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 5 },
  newCardLabel:{ color: T.textSec, fontSize: 12, fontWeight: "600" },
});
