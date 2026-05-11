import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { T } from "../../src/theme";
import { Ic, DiIcon, ProgressBar } from "../../src/primitives";
import { FILES, FOLDERS, DEVICON_MAP, FILE_FALLBACK_ICON } from "../../src/data/mock";

function FileTypeIcon({ ext, color }: { ext: string; color: string }) {
  const dc = DEVICON_MAP[ext];
  const fb = (FILE_FALLBACK_ICON[ext] || "document-outline") as any;
  if (dc) return <DiIcon name={dc} size={22} color={color} fallback={fb} />;
  return <Ic name={fb} size={22} color={color} />;
}

export default function FilesScreen() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const usedGB = 45, totalGB = 100;
  const pct = (usedGB / totalGB) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Files</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity activeOpacity={0.8} style={s.iconBtn}>
            <Ic name="search-outline" size={18} color={T.textSec} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={[s.iconBtn, { backgroundColor: T.amber }]}>
            <Ic name="cloud-upload-outline" size={18} color={T.bg} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Storage summary */}
        <View style={s.storageCard}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
            <View>
              <Text style={s.storageTitle}>Cloud Storage</Text>
              <Text style={s.storageSub}>{100 - usedGB} GB remaining</Text>
            </View>
            <Text style={{ color: T.textPri, fontSize: 13, fontWeight: "600" }}>
              <Text style={{ color: T.blue, fontSize: 20, fontWeight: "800" }}>{usedGB}</Text>
              <Text style={{ color: T.textSec }}> / {totalGB} GB</Text>
            </Text>
          </View>
          <ProgressBar progress={pct} color={T.blue} height={5} />
          <View style={{ flexDirection: "row", gap: 16, marginTop: 12 }}>
            {[
              { label: "Code",   color: T.violet, gb: 18 },
              { label: "Assets", color: T.amber,  gb: 15 },
              { label: "Other",  color: T.teal,   gb: 12 },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
                <Text style={{ color: T.textSec, fontSize: 11.5 }}>{item.label} · {item.gb} GB</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Folders */}
        <Text style={s.sectionLabel}>Folders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
          {FOLDERS.map((f, i) => (
            <Animated.View key={f.id} entering={FadeInDown.delay(i * 50).duration(280)}>
              <TouchableOpacity activeOpacity={0.75} style={s.folderCard}>
                <View style={[s.folderIcon, { backgroundColor: f.color + "1A" }]}>
                  <Ic name="folder" size={22} color={f.color} />
                </View>
                <Text style={s.folderName} numberOfLines={1}>{f.name}</Text>
                <Text style={s.folderCount}>{f.count} files</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
          {/* New folder */}
          <TouchableOpacity activeOpacity={0.75} style={[s.folderCard, { borderStyle: "dashed", backgroundColor: "transparent" }]}>
            <View style={s.folderIcon}>
              <Ic name="add" size={22} color={T.textMut} />
            </View>
            <Text style={[s.folderName, { color: T.textMut }]}>New</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Files header */}
        <View style={s.filesHeader}>
          <Text style={s.sectionLabel}>Recent Files</Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <TouchableOpacity onPress={() => setViewMode("list")} activeOpacity={0.7}
              style={[s.viewBtn, viewMode === "list" && { backgroundColor: T.amber + "1A", borderColor: T.amber + "44" }]}>
              <Ic name="list-outline" size={15} color={viewMode === "list" ? T.amber : T.textSec} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewMode("grid")} activeOpacity={0.7}
              style={[s.viewBtn, viewMode === "grid" && { backgroundColor: T.amber + "1A", borderColor: T.amber + "44" }]}>
              <Ic name="grid-outline" size={15} color={viewMode === "grid" ? T.amber : T.textSec} />
            </TouchableOpacity>
          </View>
        </View>

        {/* File list */}
        <View style={{ gap: 6 }}>
          {FILES.map((f, i) => (
            <Animated.View key={f.id} entering={FadeInDown.delay(i * 40).duration(280)}>
              <TouchableOpacity activeOpacity={0.75} style={s.fileRow}>
                <View style={[s.fileIcon, { backgroundColor: f.color + "14", borderColor: f.color + "30" }]}>
                  <FileTypeIcon ext={f.ext} color={f.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.fileName} numberOfLines={1}>{f.name}</Text>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 3 }}>
                    <Text style={s.fileMeta}>{f.size}</Text>
                    <Text style={s.fileDot}>·</Text>
                    <Text style={s.fileMeta}>{f.date}</Text>
                  </View>
                </View>
                <View style={[s.extBadge, { backgroundColor: f.color + "16" }]}>
                  <Text style={[s.extText, { color: f.color }]}>{f.ext}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={{ padding: 6 }}>
                  <Ic name="ellipsis-vertical" size={16} color={T.textMut} />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 18, paddingTop: 62, paddingBottom: 16 },
  title:        { color: T.textPri, fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  iconBtn:      { width: 38, height: 38, borderRadius: 12, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: "center", justifyContent: "center" },
  scroll:       { paddingHorizontal: 18, paddingBottom: 110 },
  storageCard:  { backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 16, marginBottom: 22 },
  storageTitle: { color: T.textPri, fontSize: 15, fontWeight: "600" },
  storageSub:   { color: T.textSec, fontSize: 12, marginTop: 2 },
  sectionLabel: { color: T.textSec, fontSize: 11, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 12 },
  folderCard:   { width: 130, backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 14, gap: 6 },
  folderIcon:   { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  folderName:   { color: T.textPri, fontSize: 13, fontWeight: "600" },
  folderCount:  { color: T.textSec, fontSize: 11 },
  filesHeader:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16, marginBottom: 12 },
  viewBtn:      { width: 32, height: 32, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: "center", justifyContent: "center" },
  fileRow:      { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.border, padding: 12 },
  fileIcon:     { width: 46, height: 46, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  fileName:     { color: T.textPri, fontSize: 14, fontWeight: "500" },
  fileMeta:     { color: T.textMut, fontSize: 11.5 },
  fileDot:      { color: T.textMut, fontSize: 11.5 },
  extBadge:     { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  extText:      { fontSize: 10, fontFamily: "Courier", fontWeight: "700" },
});
