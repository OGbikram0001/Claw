import React from "react";
import { Text, View } from "react-native";
import { T } from "./theme";

/**
 * Lightweight Markdown renderer for AI chat.
 * Supports: **bold**, *italic*, `code`, [link](url), - bullets, # headings, > quotes, --- hr, lists
 * Renders entirely with React Native primitives. No WebView.
 */
type Props = { text: string; color?: string; size?: number };

function renderInline(line: string, color: string, size: number, keyPrefix: string) {
  // Split by ** *  ` [text](url) keeping markers
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
      const end = line.indexOf(")", close);
      if (close !== -1 && end !== -1) {
        tokens.push({ kind: "link", value: line.slice(i + 1, close), href: line.slice(close + 2, end) });
        i = end + 1; continue;
      }
    }
    // accumulate plain text up to next special
    const next = Math.min(
      ...["**", "`", "*", "["].map((s) => {
        const ix = line.indexOf(s, i);
        return ix === -1 ? line.length : ix;
      })
    );
    tokens.push({ kind: "t", value: line.slice(i, next) });
    i = next;
  }
  return tokens.map((tk, idx) => {
    const k = `${keyPrefix}-${idx}`;
    if (tk.kind === "b") return <Text key={k} style={{ color, fontSize: size, fontWeight: "700" }}>{tk.value}</Text>;
    if (tk.kind === "i") return <Text key={k} style={{ color, fontSize: size, fontStyle: "italic" }}>{tk.value}</Text>;
    if (tk.kind === "code") return <Text key={k} style={{ color: T.amber, fontSize: size - 1, fontFamily: "Courier", backgroundColor: "rgba(232,146,58,0.08)" }}> {tk.value} </Text>;
    if (tk.kind === "link") return <Text key={k} style={{ color: T.blue, fontSize: size, textDecorationLine: "underline" }}>{tk.value}</Text>;
    return <Text key={k} style={{ color, fontSize: size }}>{tk.value}</Text>;
  });
}

export default function Markdown({ text, color = T.textPri, size = 14.5 }: Props) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <View style={{ gap: 4 }}>
      {lines.map((raw, idx) => {
        const line = raw.trimEnd();
        if (!line.trim()) return <View key={idx} style={{ height: 6 }} />;
        if (line.startsWith("### ")) return <Text key={idx} style={{ color, fontSize: size + 1, fontWeight: "600", marginTop: 4 }}>{line.slice(4)}</Text>;
        if (line.startsWith("## ")) return <Text key={idx} style={{ color, fontSize: size + 3, fontWeight: "700", marginTop: 6 }}>{line.slice(3)}</Text>;
        if (line.startsWith("# ")) return <Text key={idx} style={{ color, fontSize: size + 5, fontWeight: "700", marginTop: 6 }}>{line.slice(2)}</Text>;
        if (line === "---") return <View key={idx} style={{ height: 1, backgroundColor: T.border, marginVertical: 6 }} />;
        if (line.startsWith("> ")) return (
          <View key={idx} style={{ borderLeftWidth: 3, borderLeftColor: T.amber, paddingLeft: 10, marginVertical: 4 }}>
            <Text style={{ color: T.textSec, fontSize: size, fontStyle: "italic", lineHeight: size * 1.5 }}>
              {renderInline(line.slice(2), T.textSec, size, `q${idx}`)}
            </Text>
          </View>
        );
        if (/^\s*[-*]\s/.test(line)) return (
          <View key={idx} style={{ flexDirection: "row", gap: 8, paddingLeft: 4 }}>
            <Text style={{ color: T.amber, fontSize: size }}>•</Text>
            <Text style={{ color, fontSize: size, lineHeight: size * 1.5, flex: 1 }}>
              {renderInline(line.replace(/^\s*[-*]\s/, ""), color, size, `l${idx}`)}
            </Text>
          </View>
        );
        const numMatch = line.match(/^(\d+)\.\s(.*)/);
        if (numMatch) return (
          <View key={idx} style={{ flexDirection: "row", gap: 8, paddingLeft: 4 }}>
            <Text style={{ color: T.amber, fontSize: size, fontWeight: "600" }}>{numMatch[1]}.</Text>
            <Text style={{ color, fontSize: size, lineHeight: size * 1.5, flex: 1 }}>
              {renderInline(numMatch[2], color, size, `n${idx}`)}
            </Text>
          </View>
        );
        return (
          <Text key={idx} style={{ color, fontSize: size, lineHeight: size * 1.5 }}>
            {renderInline(line, color, size, `p${idx}`)}
          </Text>
        );
      })}
    </View>
  );
}
