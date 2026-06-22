import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { T } from "../../src/theme";
import { Ic, DiIcon, ProgressBar } from "../../src/primitives";
import { FILES, FOLDERS, DEVICON_MAP, FILE_FALLBACK_ICON } from "../../src/data/mock";

function FileTypeIcon({ ext, color }: { ext: string; color: string }) {
  const dc = DEVICON_MAP[ext];
  const fb = (FILE_FALLBACK_ICON[ext] || "document-outline") as any;
  if (dc) return <DiIcon name={dc} size={20} color={color} fallback={fb} />;
  return <Ic name={fb} size={20} color={color} />;
}

export default function FilesScreen() {
  const usedGB = 45, totalGB = 100;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={s.header}>
        <Text style={s.title}>Files</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity activeOpacity={0.8} style={s.iconBtn} accessibilityRole="button" accessibilityLabel="Search files">
            <Ic name="search-outline" size={16} color={T.textSec} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={[s.iconBtn, { backgroundColor: T.amber, borderColor: T.amber }]} accessibilityRole="button" accessibilityLabel="Upload file">
            <Ic name="cloud-upload-outline" size={16} color={T.bg} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Storage */}
        <View style={s.storageCard}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <View>
              <Text style={s.storageTitle}>Cloud Storage</Text>
              <Text style={s.storageSub}>{totalGB - usedGB} GB free</Text>
            </View>
            <Text style={s.storageNum}>
              <Text style={{ color: T.blue, fontWeight: "700" }}>{usedGB}</Text>
              <Text style={{ color: T.textSec }}> / {totalGB} GB</Text>
            </Text>
          </View>
          <ProgressBar progress={(usedGB / totalGB) * 100} color={T.blue} height={4} />
          <View style={{ flexDirection: "row", gap: 14, marginTop: 10 }}>
            {[
              { label: "Code",   color: T.violet, gb: 18 },
              { label: "Assets", color: T.amber,  gb: 15 },
              { label: "Other",  color: T.teal,   gb: 12 },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: item.color }} />
                <Text style={{ color: T.textSec, fontSize: 11 }}>{item.label} · {item.gb}GB</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Folders */}
        <Text style={s.sectionLabel}>Folders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: 4, marginBottom: 16 }}>
          {FOLDERS.map((f, i) => (
            <Animated.View key={f.id} entering={FadeInDown.delay(i * 40).duration(240)}>
              <TouchableOpacity activeOpacity={0.7} style={s.folderCard}>
                <View style={[s.folderIcon, { backgroundColor: f.color + "18" }]}>
                  <Ic name="folder" size={18} color={f.color} />
                </View>
                <Text style={s.folderName} numberOfLines={1}>{f.name}</Text>
                <Text style={s.folderCount}>{f.count} files</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
          <TouchableOpacity activeOpacity={0.7} style={[s.folderCard, { borderStyle: "dashed", backgroundColor: "transparent" }]}>
            <View style={s.folderIcon}>
              <Ic name="add" size={18} color={T.textMut} />
            </View>
            <Text style={[s.folderName, { color: T.textMut }]}>New</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Files */}
        <Text style={s.sectionLabel}>Recent Files</Text>
        <View style={{ gap: 6 }}>
          {FILES.map((f, i) => (
            <Animated.View key={f.id} entering={FadeInDown.delay(i * 35).duration(240)}>
              <TouchableOpacity activeOpacity={0.7} style={s.fileRow}>
                <View style={[s.fileIcon, { backgroundColor: f.color + "12", borderColor: f.color + "25" }]}>
                  <FileTypeIcon ext={f.ext} color={f.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.fileName} numberOfLines={1}>{f.name}</Text>
                  <Text style={s.fileMeta}>{f.size} · {f.date}</Text>
                </View>
                <View style={[s.extBadge, { backgroundColor: f.color + "14" }]}>
                  <Text style={[s.extText, { color: f.color }]}>{f.ext}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={{ padding: 4 }} accessibilityRole="button" accessibilityLabel={`File options for ${f.name}`}>
                  <Ic name="ellipsis-vertical" size={14} color={T.textMut} />
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
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 },
  title:        { color: T.textPri, fontSize: 24, fontWeight: "700", letterSpacing: -0.4 },
  iconBtn:      { width: 34, height: 34, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: "center", justifyContent: "center" },
  scroll:       { paddingHorizontal: 16, paddingBottom: 90 },
  storageCard:  { backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, padding: 14, marginBottom: 18 },
  storageTitle: { color: T.textPri, fontSize: 13.5, fontWeight: "600" },
  storageSub:   { color: T.textSec, fontSize: 11, marginTop: 1 },
  storageNum:   { fontSize: 13 },
  sectionLabel: { color: T.textSec, fontSize: 10.5, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 },
  folderCard:   { width: 110, backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, padding: 12, gap: 4 },
  folderIcon:   { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  folderName:   { color: T.textPri, fontSize: 12.5, fontWeight: "600" },
  folderCount:  { color: T.textSec, fontSize: 10.5 },
  fileRow:      { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: T.card, borderRadius: 13, borderWidth: 1, borderColor: T.border, padding: 10 },
  fileIcon:     { width: 40, height: 40, borderRadius: 11, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  fileName:     { color: T.textPri, fontSize: 13, fontWeight: "500", marginBottom: 1 },
  fileMeta:     { color: T.textMut, fontSize: 11 },
  extBadge:     { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 },
  extText:      { fontSize: 9.5, fontFamily: "Courier", fontWeight: "700" },
});
