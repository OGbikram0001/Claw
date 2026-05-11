import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { T, STATUS_COLOR } from "../../src/theme";
import { Ic, BxIcon, StatusDot } from "../../src/primitives";
import { CONVOS } from "../../src/data/mock";

const FILTERS = ["all", "running", "waiting", "done", "error"] as const;
type Filter = typeof FILTERS[number];
const FILTER_LABEL: Record<string, string> = {
  all: "All", running: "Running", waiting: "Waiting", done: "Done", error: "Error",
};

export default function ChatsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = CONVOS.filter(c => {
    const matchStatus = filter === "all" || c.status === filter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={s.header}>
        <Text style={s.title}>Chats</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/chat/new" as any)}
          style={s.newBtn}
        >
          <Ic name="add" size={18} color={T.bg} />
        </TouchableOpacity>
      </View>

      <View style={s.searchWrap}>
        <Ic name="search-outline" size={14} color={T.textSec} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search chats…"
          placeholderTextColor={T.textMut}
          style={s.searchInput}
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")} activeOpacity={0.7}>
            <Ic name="close-circle" size={14} color={T.textMut} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pills}>
        {FILTERS.map(f => {
          const active = filter === f;
          const color  = f === "all" ? T.amber : STATUS_COLOR[f] || T.amber;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
              style={[s.pill, active && { backgroundColor: color + "20", borderColor: color + "55" }]}
            >
              {f !== "all" && (
                <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: active ? color : T.textMut }} />
              )}
              <Text style={[s.pillText, { color: active ? color : T.textSec }]}>{FILTER_LABEL[f]}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={s.count}>{filtered.length} {filtered.length === 1 ? "session" : "sessions"}</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        {filtered.length === 0 && (
          <View style={{ alignItems: "center", paddingTop: 60, gap: 10 }}>
            <Ic name="chatbubbles-outline" size={36} color={T.textMut} />
            <Text style={{ color: T.textSec, fontSize: 14 }}>No chats found</Text>
          </View>
        )}
        {filtered.map((c, i) => (
          <Animated.View key={c.id} entering={FadeInDown.delay(i * 35).duration(240)}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/chat/${c.id}` as any)}
              style={s.row}
            >
              <View style={s.avatar}>
                {c.brand
                  ? <BxIcon name={c.brand} size={18} color={T.amber} fallback="globe-outline" />
                  : <Ic name={c.icon as any} size={18} color={T.amber} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <Text style={s.name} numberOfLines={1}>{c.name}</Text>
                  <Text style={s.time}>{c.time}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <StatusDot status={c.status} size={5} />
                  <Text style={s.preview} numberOfLines={1}>{c.preview}</Text>
                  {c.unread > 0 && (
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{c.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 },
  title:       { color: T.textPri, fontSize: 24, fontWeight: "700", letterSpacing: -0.4 },
  newBtn:      { width: 32, height: 32, borderRadius: 16, backgroundColor: T.amber, alignItems: "center", justifyContent: "center" },
  searchWrap:  { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 16, marginBottom: 10, backgroundColor: T.card, borderRadius: 12, borderWidth: 1, borderColor: T.border, paddingHorizontal: 12, paddingVertical: 9 },
  searchInput: { flex: 1, color: T.textPri, fontSize: 13.5 },
  pills:       { paddingHorizontal: 16, gap: 6, paddingBottom: 10 },
  pill:        { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  pillText:    { fontSize: 12, fontWeight: "600" },
  count:       { color: T.textMut, fontSize: 11, paddingHorizontal: 16, paddingBottom: 6 },
  row:         { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border },
  avatar:      { width: 42, height: 42, borderRadius: 14, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: "center", justifyContent: "center" },
  name:        { color: T.textPri, fontSize: 13.5, fontWeight: "600", flex: 1 },
  time:        { color: T.textMut, fontSize: 10.5 },
  preview:     { color: T.textSec, fontSize: 12, flex: 1 },
  badge:       { minWidth: 18, height: 18, paddingHorizontal: 5, borderRadius: 9, backgroundColor: T.amber, alignItems: "center", justifyContent: "center" },
  badgeText:   { color: T.bg, fontSize: 10, fontWeight: "800" },
});
