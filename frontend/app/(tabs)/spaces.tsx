import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { T, STATUS_COLOR } from "../../src/theme";
import { Ic, StatusDot } from "../../src/primitives";
import { SPACES } from "../../src/data/mock";

const CARD_HEIGHT: Record<string, number> = { lg: 230, md: 185, sm: 150 };

function SpaceCard({ space, idx }: { space: typeof SPACES[number]; idx: number }) {
  const h = CARD_HEIGHT[space.size || "md"];
  return (
    <Animated.View entering={FadeInDown.delay(idx * 55).duration(300)}>
      <TouchableOpacity activeOpacity={0.8} style={[s.card, { minHeight: h }]}>
        <LinearGradient
          colors={[space.color + "16", space.color + "04"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />

        {/* Top row: icon + status */}
        <View style={s.cardTop}>
          <View style={[s.cardIcon, { backgroundColor: space.color + "1A", borderColor: space.color + "44" }]}>
            <Ic name={space.icon as any} size={18} color={space.color} />
          </View>
          <StatusDot status={space.status} size={7} />
        </View>

        {/* Name + desc */}
        <Text style={s.cardName}>{space.name}</Text>
        <Text style={s.cardDesc} numberOfLines={3}>{space.desc}</Text>

        {/* Tags */}
        {space.tags && space.tags.length > 0 && (
          <View style={s.tagRow}>
            {space.tags.map((tag, t) => (
              <View key={t} style={[s.tag, { backgroundColor: space.color + "18" }]}>
                <Text style={[s.tagText, { color: space.color }]}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer: agents + time */}
        <View style={s.cardFooter}>
          <View style={{ flexDirection: "row" }}>
            {space.agents.slice(0, 4).map((ac, k) => (
              <View key={k} style={[s.agentDot, { backgroundColor: ac + "28", marginLeft: k === 0 ? 0 : -6 }]}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: ac }} />
              </View>
            ))}
            {space.agents.length > 4 && (
              <View style={[s.agentDot, { backgroundColor: T.card, marginLeft: -6 }]}>
                <Text style={{ color: T.textMut, fontSize: 8 }}>+{space.agents.length - 4}</Text>
              </View>
            )}
          </View>
          <Text style={s.cardTime}>{space.lastActive}</Text>
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
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Spaces</Text>
          <Text style={s.sub}>{SPACES.filter(sp => sp.status === "running").length} running</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={s.newBtn}>
          <Ic name="add" size={20} color={T.bg} />
          <Text style={{ color: T.bg, fontSize: 13, fontWeight: "700" }}>New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Status summary */}
        <View style={s.summaryRow}>
          {(["running", "waiting", "done", "error"] as const).map(st => {
            const count = SPACES.filter(sp => sp.status === st).length;
            return (
              <View key={st} style={s.summaryCard}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: STATUS_COLOR[st], marginBottom: 6 }} />
                <Text style={[s.summaryCount, { color: STATUS_COLOR[st] }]}>{count}</Text>
                <Text style={s.summaryLabel}>{st}</Text>
              </View>
            );
          })}
        </View>

        {/* Masonry */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1, gap: 12 }}>
            {col1.map((sp, i) => <SpaceCard key={sp.id} space={sp} idx={i * 2} />)}
          </View>
          <View style={{ flex: 1, gap: 12 }}>
            {/* New space placeholder */}
            <TouchableOpacity activeOpacity={0.75} style={s.newCard}>
              <View style={s.newCardIcon}>
                <Ic name="add" size={24} color={T.textSec} />
              </View>
              <Text style={s.newCardLabel}>New Space</Text>
              <Text style={s.newCardSub}>Blank or template</Text>
            </TouchableOpacity>
            {col2.map((sp, i) => <SpaceCard key={sp.id} space={sp} idx={i * 2 + 1} />)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 18, paddingTop: 62, paddingBottom: 16 },
  title:        { color: T.textPri, fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  sub:          { color: T.textSec, fontSize: 13, marginTop: 3 },
  newBtn:       { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: T.amber, borderRadius: 20 },
  scroll:       { paddingHorizontal: 18, paddingBottom: 110 },
  summaryRow:   { flexDirection: "row", gap: 10, marginBottom: 18 },
  summaryCard:  { flex: 1, backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, padding: 12, alignItems: "center" },
  summaryCount: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  summaryLabel: { color: T.textSec, fontSize: 10, fontWeight: "600", textTransform: "capitalize", marginTop: 2 },
  card:         { backgroundColor: T.card, borderRadius: 20, borderWidth: 1, borderColor: T.border, padding: 14, overflow: "hidden", gap: 6 },
  cardTop:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  cardIcon:     { width: 40, height: 40, borderRadius: 13, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  cardName:     { color: T.textPri, fontSize: 15, fontWeight: "700", lineHeight: 19 },
  cardDesc:     { color: T.textSec, fontSize: 11.5, lineHeight: 16, flex: 1 },
  tagRow:       { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 4 },
  tag:          { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  tagText:      { fontSize: 10, fontWeight: "600" },
  cardFooter:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  agentDot:     { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: T.card, alignItems: "center", justifyContent: "center" },
  cardTime:     { color: T.textMut, fontSize: 10 },
  newCard:      { minHeight: 130, backgroundColor: T.card, borderRadius: 20, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)", borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 6 },
  newCardIcon:  { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" },
  newCardLabel: { color: T.textSec, fontSize: 13.5, fontWeight: "600" },
  newCardSub:   { color: T.textMut, fontSize: 11 },
});
