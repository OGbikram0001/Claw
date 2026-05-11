import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { T, STATUS_COLOR } from "../../src/theme";
import { Ic, BxIcon, StatusDot } from "../../src/primitives";
import { CONVOS } from "../../src/data/mock";

const STATUS_FILTERS = ["all", "running", "waiting", "done", "error"] as const;
type Filter = typeof STATUS_FILTERS[number];

const STATUS_LABEL: Record<string, string> = {
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
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Chats</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/chat/new" as any)}
          style={s.newBtn}
        >
          <Ic name="add" size={20} color={T.bg} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ic name="search-outline" size={16} color={T.textSec} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search chats…"
          placeholderTextColor={T.textMut}
          style={s.searchInput}
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")} activeOpacity={0.7}>
            <Ic name="close-circle" size={16} color={T.textMut} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.pills}
      >
        {STATUS_FILTERS.map(f => {
          const active = filter === f;
          const color  = f === "all" ? T.amber : STATUS_COLOR[f] || T.amber;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              activeOpacity={0.75}
              style={[s.pill, active && { backgroundColor: color + "22", borderColor: color + "66" }]}
            >
              {f !== "all" && (
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: active ? color : T.textMut }} />
              )}
              <Text style={[s.pillText, { color: active ? color : T.textSec }]}>{STATUS_LABEL[f]}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Results count */}
      <View style={{ paddingHorizontal: 18, paddingBottom: 8 }}>
        <Text style={s.count}>{filtered.length} {filtered.length === 1 ? "session" : "sessions"}</Text>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {filtered.length === 0 && (
          <View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
            <Ic name="chatbubbles-outline" size={40} color={T.textMut} />
            <Text style={{ color: T.textSec, fontSize: 15 }}>No chats found</Text>
          </View>
        )}
        {filtered.map((c, i) => (
          <Animated.View key={c.id} entering={FadeInDown.delay(i * 40).duration(280)}>
            <TouchableOpacity
              activeOpacity={0.72}
              onPress={() => router.push(`/chat/${c.id}` as any)}
              style={s.row}
            >
              {/* Avatar */}
              <View style={s.avatar}>
                {c.brand
                  ? <BxIcon name={c.brand} size={20} color={T.amber} fallback="globe-outline" />
                  : <Ic name={c.icon as any} size={20} color={T.amber} />}
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Text style={s.name} numberOfLines={1}>{c.name}</Text>
                  <Text style={s.time}>{c.time}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <StatusDot status={c.status} size={5} />
                  <Text style={s.preview} numberOfLines={1}>{c.preview}</Text>
                  {c.unread > 0 && (
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{c.unread}</Text>
                    </View>
                  )}
                </View>
              </View>

              <Ic name="chevron-forward" size={14} color={T.textMut} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 18, paddingTop: 62, paddingBottom: 16 },
  title:       { color: T.textPri, fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  newBtn:      { width: 38, height: 38, borderRadius: 19, backgroundColor: T.amber, alignItems: "center", justifyContent: "center" },
  searchWrap:  { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 18, marginBottom: 14, backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, paddingHorizontal: 14, paddingVertical: 11 },
  searchInput: { flex: 1, color: T.textPri, fontSize: 14 },
  pills:       { paddingHorizontal: 18, gap: 8, paddingBottom: 12 },
  pill:        { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  pillText:    { fontSize: 12.5, fontWeight: "600" },
  count:       { color: T.textMut, fontSize: 11.5 },
  row:         { flexDirection: "row", alignItems: "center", gap: 13, paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: T.border },
  avatar:      { width: 48, height: 48, borderRadius: 16, backgroundColor: T.card, borderWidth: 1, borderColor: T.borderMid, alignItems: "center", justifyContent: "center" },
  name:        { color: T.textPri, fontSize: 14.5, fontWeight: "500", flex: 1 },
  time:        { color: T.textMut, fontSize: 11 },
  preview:     { color: T.textSec, fontSize: 12.5, flex: 1 },
  badge:       { minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: T.amber, alignItems: "center", justifyContent: "center" },
  badgeText:   { color: T.bg, fontSize: 10.5, fontWeight: "800" },
});
