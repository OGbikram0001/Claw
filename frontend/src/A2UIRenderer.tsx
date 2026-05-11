import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ic } from "./primitives";
import { T } from "./theme";
import Markdown from "./Markdown";

type A2Comp = {
  id: string; component: string; text?: string; variant?: string;
  child?: string; children?: string[]; label?: string;
  value?: any; checked?: boolean; url?: string; name?: string; action?: any;
};
type A2Surface = { surfaceId?: string; components: A2Comp[] };

export default function A2UIRenderer({ surface }: { surface: A2Surface }) {
  const map: Record<string, A2Comp> = {};
  for (const c of surface.components) map[c.id] = c;
  const root = surface.components[0];
  if (!root) return null;
  return (
    <View style={{ marginTop: 8 }}>
      {/* Surface label */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 7, marginBottom: 2 }}>
        <Ic name="layers-outline" size={13} color={T.violet} />
        <Text style={{ color: T.textMut, fontSize: 10.5, fontFamily: "Courier", letterSpacing: 0.5 }}>A2UI Surface · {surface.surfaceId || "unnamed"}</Text>
        <View style={{ marginLeft: "auto", paddingHorizontal: 6, paddingVertical: 2, backgroundColor: T.violet + "18", borderRadius: 5 }}>
          <Text style={{ color: T.violet, fontSize: 9, fontFamily: "Courier" }}>v0.9</Text>
        </View>
      </View>
      {/* Content: no extra wrapper, renders directly */}
      {renderComp(root, map)}
    </View>
  );
}

function renderComp(c: A2Comp, map: Record<string, A2Comp>): React.ReactNode {
  if (!c) return null;
  switch (c.component) {
    case "Text":    return renderText(c);
    case "Row":     return (
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {(c.children || []).map(id => <View key={id}>{renderComp(map[id], map)}</View>)}
      </View>
    );
    case "Column":  return (
      <View style={{ flexDirection: "column", gap: 10 }}>
        {(c.children || []).map(id => <View key={id}>{renderComp(map[id], map)}</View>)}
      </View>
    );
    case "Card":    return (
      <View style={{ backgroundColor: T.surface, borderWidth: 1, borderColor: T.borderMid, borderRadius: 14, padding: 14 }}>
        {c.child ? renderComp(map[c.child], map)
          : (c.children || []).map(id => <View key={id}>{renderComp(map[id], map)}</View>)}
      </View>
    );
    case "Button":  return <A2Button comp={c} />;
    case "TextField": return <A2TextField comp={c} />;
    case "CheckBox":  return <A2CheckBox comp={c} />;
    case "Divider":   return <View style={{ height: 1, backgroundColor: T.border, marginVertical: 4 }} />;
    case "Icon":      return <Ic name={(c.name as any) || "ellipse-outline"} size={20} color={T.amber} />;
    case "List":      return (
      <View style={{ gap: 4 }}>
        {(c.children || []).map(id => (
          <View key={id} style={{ paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: T.border }}>
            {renderComp(map[id], map)}
          </View>
        ))}
      </View>
    );
    default: return <Text style={{ color: T.textMut, fontSize: 11, fontFamily: "Courier" }}>[{c.component}]</Text>;
  }
}

function renderText(c: A2Comp) {
  const styles: Record<string, any> = {
    h1: { fontSize: 22, fontWeight: "800", color: T.textPri },
    h2: { fontSize: 17, fontWeight: "700", color: T.textPri },
    h3: { fontSize: 14.5, fontWeight: "600", color: T.textPri },
    body:    { fontSize: 13.5, color: T.textPri },
    caption: { fontSize: 11, color: T.textSec },
  };
  const st = styles[c.variant || "body"] || styles.body;
  if ((c.text || "").match(/\*\*|`|\n/)) return <Markdown text={c.text || ""} color={st.color} size={st.fontSize} />;
  return <Text style={st}>{c.text}</Text>;
}

function A2Button({ comp }: { comp: A2Comp }) {
  const primary = comp.variant === "primary";
  return (
    <TouchableOpacity activeOpacity={0.8} style={{
      paddingVertical:   11,
      paddingHorizontal: 18,
      borderRadius:      12,
      backgroundColor:   primary ? T.amber : "transparent",
      borderWidth:       1,
      borderColor:       primary ? T.amber : T.borderMid,
      alignItems:        "center",
      flexDirection:     "row",
      justifyContent:    "center",
      gap:               7,
    }}>
      <Text style={{ color: primary ? T.bg : T.textPri, fontSize: 13.5, fontWeight: "700" }}>{comp.text}</Text>
      <Ic name="arrow-forward-outline" size={14} color={primary ? T.bg : T.textSec} />
    </TouchableOpacity>
  );
}

function A2TextField({ comp }: { comp: A2Comp }) {
  const [v, setV] = React.useState(typeof comp.value === "string" ? comp.value : "");
  return (
    <View style={{ gap: 6 }}>
      {!!comp.label && <Text style={{ color: T.textSec, fontSize: 11, fontWeight: "600", letterSpacing: 0.5 }}>{comp.label}</Text>}
      <TextInput
        value={v} onChangeText={setV} placeholderTextColor={T.textMut}
        style={{ backgroundColor: T.bg, borderWidth: 1, borderColor: T.borderMid, borderRadius: 10,
          paddingHorizontal: 12, paddingVertical: 10, color: T.textPri, fontSize: 13.5, fontFamily: "Courier" }}
      />
    </View>
  );
}

function A2CheckBox({ comp }: { comp: A2Comp }) {
  const [checked, setChecked] = React.useState(!!comp.checked);
  return (
    <TouchableOpacity onPress={() => setChecked(c => !c)} activeOpacity={0.75}
      style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={{ width: 18, height: 18, borderRadius: 5, borderWidth: 1.5,
        borderColor: checked ? T.amber : "rgba(255,255,255,0.2)",
        backgroundColor: checked ? T.amber : "transparent",
        alignItems: "center", justifyContent: "center" }}>
        {checked && <Ic name="checkmark" size={12} color={T.bg} />}
      </View>
      <Text style={{ color: T.textPri, fontSize: 13.5 }}>{comp.label}</Text>
    </TouchableOpacity>
  );
}
