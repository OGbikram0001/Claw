import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ic } from "./primitives";
import { T } from "./theme";
import Markdown from "./Markdown";

/**
 * A2UI v0.9 Renderer (subset of basic catalog)
 * Spec: https://a2ui.org/specification/v0.9-a2ui/
 *
 * Supported components: Text, Image, Icon, Row, Column, Card, Button,
 * TextField, CheckBox, Divider, List
 *
 * Components are addressed by `id` and reference children by id.
 * This makes the agent's UI declarative + safe (no arbitrary code).
 */

type A2Comp = {
  id: string;
  component: string;
  text?: string;
  variant?: string;
  child?: string;
  children?: string[];
  label?: string;
  value?: any;
  checked?: boolean;
  url?: string;
  name?: string;
  action?: any;
};

type A2Surface = { surfaceId?: string; components: A2Comp[] };

export default function A2UIRenderer({ surface }: { surface: A2Surface }) {
  const map: Record<string, A2Comp> = {};
  for (const c of surface.components) map[c.id] = c;
  const root = surface.components[0];
  if (!root) return null;
  return (
    <View style={{ marginVertical: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: T.surface, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderWidth: 1, borderBottomWidth: 0, borderColor: T.borderMid }}>
        <Ic name="layers-outline" size={14} color={T.violet} />
        <Text style={{ color: T.textSec, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: "500" }}>A2UI Surface</Text>
        <View style={{ marginLeft: "auto", paddingHorizontal: 6, paddingVertical: 2, backgroundColor: T.violet + "22", borderRadius: 6 }}>
          <Text style={{ color: T.violet, fontSize: 9, fontFamily: "Courier" }}>v0.9</Text>
        </View>
      </View>
      <View style={{ borderWidth: 1, borderTopWidth: 0, borderColor: T.borderMid, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, padding: 14, backgroundColor: T.card }}>
        {renderComp(root, map)}
      </View>
    </View>
  );
}

function renderComp(c: A2Comp, map: Record<string, A2Comp>): React.ReactNode {
  if (!c) return null;
  switch (c.component) {
    case "Text":
      return renderText(c);
    case "Row":
      return (
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {(c.children || []).map((id) => <View key={id}>{renderComp(map[id], map)}</View>)}
        </View>
      );
    case "Column":
      return (
        <View style={{ flexDirection: "column", gap: 10 }}>
          {(c.children || []).map((id) => <View key={id}>{renderComp(map[id], map)}</View>)}
        </View>
      );
    case "Card":
      return (
        <View style={{ backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, borderRadius: 12, padding: 12 }}>
          {c.child ? renderComp(map[c.child], map) : (c.children || []).map((id) => <View key={id}>{renderComp(map[id], map)}</View>)}
        </View>
      );
    case "Button":
      return <A2Button comp={c} />;
    case "TextField":
      return <A2TextField comp={c} />;
    case "CheckBox":
      return <A2CheckBox comp={c} />;
    case "Divider":
      return <View style={{ height: 1, backgroundColor: T.border, marginVertical: 4 }} />;
    case "Icon":
      return <Ic name={(c.name as any) || "ellipse-outline"} size={20} color={T.amber} />;
    case "List":
      return (
        <View style={{ gap: 6 }}>
          {(c.children || []).map((id) => (
            <View key={id} style={{ paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: T.border }}>
              {renderComp(map[id], map)}
            </View>
          ))}
        </View>
      );
    default:
      return <Text style={{ color: T.textMut, fontSize: 11, fontFamily: "Courier" }}>[{c.component}]</Text>;
  }
}

function renderText(c: A2Comp) {
  const map: Record<string, any> = {
    h1: { fontSize: 22, fontWeight: "700", color: T.textPri },
    h2: { fontSize: 18, fontWeight: "600", color: T.textPri },
    h3: { fontSize: 15, fontWeight: "600", color: T.textPri },
    body: { fontSize: 13.5, color: T.textPri },
    caption: { fontSize: 11, color: T.textSec },
  };
  const style = map[c.variant || "body"] || map.body;
  if ((c.text || "").includes("**") || (c.text || "").includes("`") || (c.text || "").includes("\n")) {
    return <Markdown text={c.text || ""} color={style.color} size={style.fontSize} />;
  }
  return <Text style={style}>{c.text}</Text>;
}

function A2Button({ comp }: { comp: A2Comp }) {
  const isPrimary = comp.variant === "primary";
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: isPrimary ? T.amber : "transparent",
        borderWidth: 1,
        borderColor: isPrimary ? T.amber : T.borderMid,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <Text style={{ color: isPrimary ? "#1A1208" : T.textPri, fontSize: 13.5, fontWeight: "600" }}>{comp.text}</Text>
      <Ic name="arrow-forward-outline" size={14} color={isPrimary ? "#1A1208" : T.textPri} />
    </TouchableOpacity>
  );
}

function A2TextField({ comp }: { comp: A2Comp }) {
  const [v, setV] = React.useState(typeof comp.value === "string" ? comp.value : "");
  return (
    <View style={{ gap: 6 }}>
      {!!comp.label && <Text style={{ color: T.textSec, fontSize: 11, fontWeight: "500", letterSpacing: 0.5, textTransform: "uppercase" }}>{comp.label}</Text>}
      <TextInput
        value={v}
        onChangeText={setV}
        placeholderTextColor={T.textMut}
        style={{
          backgroundColor: T.bg,
          borderWidth: 1,
          borderColor: T.border,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          color: T.textPri,
          fontSize: 13.5,
          fontFamily: "Courier",
        }}
      />
    </View>
  );
}

function A2CheckBox({ comp }: { comp: A2Comp }) {
  const [c, setC] = React.useState(!!comp.checked);
  return (
    <TouchableOpacity onPress={() => setC(!c)} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={{ width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: c ? T.amber : T.textMut, backgroundColor: c ? T.amber : "transparent", alignItems: "center", justifyContent: "center" }}>
        {c && <Ic name="checkmark" size={12} color="#1A1208" />}
      </View>
      <Text style={{ color: T.textPri, fontSize: 13 }}>{comp.label}</Text>
    </TouchableOpacity>
  );
}
