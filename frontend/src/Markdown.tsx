import React from "react";
import { Text, View } from "react-native";
import { T } from "./theme";

type Props = { text: string; color?: string; size?: number };

function renderInline(line: string, color: string, size: number, key: string) {
  const tokens: { kind: string; value: string; href?: string }[] = [];
  let i = 0;
  while (i < line.length) {
    if (line.startsWith("**", i)) {
      const end = line.indexOf("**", i + 2);
      if (end !== -1) { tokens.push({ kind: "b", value: line.slice(i + 2, end) }); i = end + 2; continue; }
    }
    if (line[i] === "`") {
      const end = line.indexOf("`", i + 1);
      if (end !== -1) { tokens.push({ kind: "code", value: line.slice(i + 1, end) }); i = end + 1; continue; }
    }
    if (line[i] === "*" && line[i + 1] !== "*") {
      const end = line.indexOf("*", i + 1);
      if (end !== -1) { tokens.push({ kind: "i", value: line.slice(i + 1, end) }); i = end + 1; continue; }
    }
    if (line[i] === "[") {
      const close = line.indexOf("](", i);
      const end   = line.indexOf(")", close);
      if (close !== -1 && end !== -1) {
        tokens.push({ kind: "link", value: line.slice(i + 1, close), href: line.slice(close + 2, end) });
        i = end + 1; continue;
      }
    }
    const next = Math.min(
      ...["**", "`", "*", "["].map((s) => { const ix = line.indexOf(s, i); return ix === -1 ? line.length : ix; })
    );
    tokens.push({ kind: "t", value: line.slice(i, next) });
    i = next;
  }
  return tokens.map((tk, idx) => {
    const k = `${key}-${idx}`;
    if (tk.kind === "b")    return <Text key={k} style={{ color, fontSize: size, fontWeight: "700" }}>{tk.value}</Text>;
    if (tk.kind === "i")    return <Text key={k} style={{ color, fontSize: size, fontStyle: "italic" }}>{tk.value}</Text>;
    if (tk.kind === "code") return (
      <Text key={k} style={{ color: T.amber, fontSize: size - 0.5, fontFamily: "Courier", backgroundColor: T.amber + "14", borderRadius: 4, paddingHorizontal: 4 }}>{` ${tk.value} `}</Text>
    );
    if (tk.kind === "link") return <Text key={k} style={{ color: T.blue, fontSize: size, textDecorationLine: "underline" }}>{tk.value}</Text>;
    return <Text key={k} style={{ color, fontSize: size }}>{tk.value}</Text>;
  });
}

export default function Markdown({ text, color = T.textPri, size = 14.5 }: Props) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <View style={{ gap: 3 }}>
      {lines.map((raw, idx) => {
        const line = raw.trimEnd();
        if (!line.trim()) return <View key={idx} style={{ height: 8 }} />;
        if (line.startsWith("### ")) return (
          <Text key={idx} style={{ color, fontSize: size + 1, fontWeight: "700", marginTop: 8, marginBottom: 2 }}>{line.slice(4)}</Text>
        );
        if (line.startsWith("## ")) return (
          <Text key={idx} style={{ color, fontSize: size + 3, fontWeight: "700", marginTop: 10, marginBottom: 3 }}>{line.slice(3)}</Text>
        );
        if (line.startsWith("# ")) return (
          <Text key={idx} style={{ color, fontSize: size + 5, fontWeight: "800", marginTop: 12, marginBottom: 4 }}>{line.slice(2)}</Text>
        );
        if (line === "---") return (
          <View key={idx} style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginVertical: 8 }} />
        );
        if (line.startsWith("> ")) return (
          <View key={idx} style={{ borderLeftWidth: 2.5, borderLeftColor: T.amber + "88", paddingLeft: 12, marginVertical: 3 }}>
            <Text style={{ color: T.textSec, fontSize: size, fontStyle: "italic", lineHeight: size * 1.6 }}>
              {renderInline(line.slice(2), T.textSec, size, `q${idx}`)}
            </Text>
          </View>
        );
        if (/^\s*[-*]\s/.test(line)) return (
          <View key={idx} style={{ flexDirection: "row", gap: 10, paddingLeft: 2, alignItems: "flex-start" }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: T.amber, marginTop: size * 0.6 }} />
            <Text style={{ color, fontSize: size, lineHeight: size * 1.6, flex: 1 }}>
              {renderInline(line.replace(/^\s*[-*]\s/, ""), color, size, `l${idx}`)}
            </Text>
          </View>
        );
        const numMatch = line.match(/^(\d+)\.\s(.*)/);
        if (numMatch) return (
          <View key={idx} style={{ flexDirection: "row", gap: 10, paddingLeft: 2, alignItems: "flex-start" }}>
            <Text style={{ color: T.amber, fontSize: size - 1, fontWeight: "700", fontFamily: "Courier", minWidth: 18, textAlign: "right", marginTop: size * 0.15 }}>{numMatch[1]}.</Text>
            <Text style={{ color, fontSize: size, lineHeight: size * 1.6, flex: 1 }}>
              {renderInline(numMatch[2], color, size, `n${idx}`)}
            </Text>
          </View>
        );
        return (
          <Text key={idx} style={{ color, fontSize: size, lineHeight: size * 1.65 }}>
            {renderInline(line, color, size, `p${idx}`)}
          </Text>
        );
      })}
    </View>
  );
}
