import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { WebView } from "react-native-webview";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { T } from "./theme";
import { Ic, BlinkingCursor, StatusDot, CircularProgress } from "./primitives";

/* ════════════════════════════════════════
   1. CODE BLOCK (with copy + fake highlight)
   ════════════════════════════════════════ */
export function CodeBlock({ code, lang = "python" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <View style={styles.codeWrap}>
      <View style={styles.codeHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.red }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.amber }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.sage }} />
        </View>
        <Text style={{ color: T.textSec, fontSize: 11, fontFamily: "Courier" }}>{lang}</Text>
        <TouchableOpacity onPress={onCopy} style={styles.copyBtn}>
          <Ic name={copied ? "checkmark-outline" : "copy-outline"} size={13} color={copied ? T.sage : T.textSec} />
          <Text style={{ color: copied ? T.sage : T.textSec, fontSize: 11 }}>{copied ? "Copied" : "Copy"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 14 }}>
        <Text style={styles.codeText} selectable>
          {colourisePython(code)}
        </Text>
      </ScrollView>
    </View>
  );
}

/* fake python "highlight": colour keywords/strings */
function colourisePython(src: string) {
  const KEYWORDS = ["def","async","await","return","import","from","if","else","elif","for","in","print","class","with","as","lambda","try","except","True","False","None"];
  const tokens: any[] = [];
  let buf = "";
  let i = 0;
  const flush = (col?: string) => { if (buf) { tokens.push(<Text key={tokens.length} style={{ color: col || T.textPri }}>{buf}</Text>); buf = ""; } };
  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'") {
      flush();
      const q = c; let j = i + 1;
      while (j < src.length && src[j] !== q) j++;
      tokens.push(<Text key={tokens.length} style={{ color: T.sage }}>{src.slice(i, j + 1)}</Text>);
      i = j + 1; continue;
    }
    if (c === "#") {
      flush();
      let j = i; while (j < src.length && src[j] !== "\n") j++;
      tokens.push(<Text key={tokens.length} style={{ color: T.textMut }}>{src.slice(i, j)}</Text>);
      i = j; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i; while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      flush();
      if (KEYWORDS.includes(word)) tokens.push(<Text key={tokens.length} style={{ color: T.violet, fontWeight: "600" }}>{word}</Text>);
      else if (j < src.length && src[j] === "(") tokens.push(<Text key={tokens.length} style={{ color: T.amber }}>{word}</Text>);
      else tokens.push(<Text key={tokens.length} style={{ color: T.textPri }}>{word}</Text>);
      i = j; continue;
    }
    if (/\d/.test(c)) {
      let j = i; while (j < src.length && /[\d.]/.test(src[j])) j++;
      flush();
      tokens.push(<Text key={tokens.length} style={{ color: T.blue }}>{src.slice(i, j)}</Text>);
      i = j; continue;
    }
    buf += c; i++;
  }
  flush();
  return tokens;
}

/* ════════════════════════════════════════
   2. TERMINAL BLOCK (streaming output)
   ════════════════════════════════════════ */
export function TerminalBlock({ filename, code, output }: { filename?: string; code?: string; output: string }) {
  const [stream, setStream] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i >= output.length) { clearInterval(id); return; }
      setStream(output.slice(0, i));
      i += 2;
    }, 30);
    return () => clearInterval(id);
  }, [output]);

  return (
    <View style={styles.terminal}>
      <View style={styles.terminalHeader}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.red }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.amber }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.sage }} />
        </View>
        <Text style={{ color: T.textSec, fontSize: 11, fontFamily: "Courier" }}>{filename || "shell"}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: T.sage }} />
          <Text style={{ color: T.sage, fontSize: 10 }}>LIVE</Text>
        </View>
      </View>
      {!!code && (
        <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.04)" }}>
          <Text style={{ color: T.textSec, fontFamily: "Courier", fontSize: 11.5, lineHeight: 18 }}>{code}</Text>
        </View>
      )}
      <View style={{ padding: 12, minHeight: 80, backgroundColor: "#000" }}>
        <Text style={{ color: T.sage, fontFamily: "Courier", fontSize: 11.5, lineHeight: 18 }}>
          {stream}
          <BlinkingCursor />
        </Text>
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   3. CONNECTION DIAGRAM (animated reveal)
   ════════════════════════════════════════ */
export function ConnectionBlock({ nodes, style: orient = "vertical" }: { nodes: any[]; style?: "vertical" | "horizontal" }) {
  const horizontal = orient === "horizontal";
  return (
    <View style={[styles.diagram, horizontal && { paddingVertical: 16 }]}>
      <View style={{ flexDirection: horizontal ? "row" : "column", alignItems: "center", justifyContent: "center", gap: horizontal ? 0 : 8 }}>
        {nodes.map((n, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(i * 120).duration(400)} style={{ flexDirection: horizontal ? "row" : "column", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 14, paddingVertical: 12, backgroundColor: T.surface, borderWidth: 1, borderColor: (n.color || T.amber) + "55", borderRadius: 12, gap: 10, minWidth: horizontal ? 120 : 200 }}>
              <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: (n.color || T.amber) + "22", alignItems: "center", justifyContent: "center" }}>
                <Ic name={n.icon || "ellipse-outline"} size={14} color={n.color || T.amber} />
              </View>
              <Text style={{ color: T.textPri, fontSize: 13, fontWeight: "500" }}>{n.label}</Text>
            </View>
            {i < nodes.length - 1 && (
              <Animated.View entering={FadeIn.delay(i * 120 + 80)}>
                {horizontal ? (
                  <View style={{ width: 18, height: 2, backgroundColor: T.amber + "66", marginHorizontal: 4 }} />
                ) : (
                  <View style={{ width: 2, height: 18, backgroundColor: T.amber + "66", marginVertical: 4 }} />
                )}
              </Animated.View>
            )}
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   4. MERMAID BLOCK (WebView with platform fallback)
   ════════════════════════════════════════ */
export function MermaidBlock({ code }: { code: string }) {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:14px;background:#1D1A16;font-family:system-ui;}
  .mermaid{display:flex;justify-content:center;align-items:center;min-height:120px;}
  .mermaid svg{max-width:100%;height:auto;}
</style>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
</head><body>
<div class="mermaid">${code.replace(/`/g, "\\`")}</div>
<script>
mermaid.initialize({startOnLoad:true,theme:'dark',themeVariables:{
  primaryColor:'#1D1A16',primaryTextColor:'#EDE5D8',primaryBorderColor:'#E8923A',
  lineColor:'#E8923A',secondaryColor:'#9E7FC5',tertiaryColor:'#6DB88C',
  background:'#1D1A16',mainBkg:'#1D1A16',secondBkg:'#161310'
}});
</script>
</body></html>`;

  // Web fallback: render an iframe directly with the mermaid HTML
  if (Platform.OS === "web") {
    const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
    return (
      <View style={[styles.diagram, { padding: 0, overflow: "hidden", height: 240 }]}>
        <View style={styles.diagramHeader}>
          <Ic name="git-network-outline" size={14} color={T.amber} />
          <Text style={{ color: T.textSec, fontSize: 11, fontFamily: "Courier" }}>mermaid · diagram</Text>
        </View>
        {/* @ts-ignore web-only iframe */}
        <iframe src={dataUri} style={{ flex: 1, border: 0, backgroundColor: T.card, width: "100%", height: 200 }} />
      </View>
    );
  }

  return (
    <View style={[styles.diagram, { padding: 0, overflow: "hidden", height: 240 }]}>
      <View style={styles.diagramHeader}>
        <Ic name="git-network-outline" size={14} color={T.amber} />
        <Text style={{ color: T.textSec, fontSize: 11, fontFamily: "Courier" }}>mermaid · diagram</Text>
      </View>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ flex: 1, backgroundColor: T.card }}
        scrollEnabled={false}
      />
    </View>
  );
}

/* ════════════════════════════════════════
   5. SWARM BLOCK (floating agent nodes)
   ════════════════════════════════════════ */
function FloatingAgent({ agent, idx }: { agent: any; idx: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(idx * 200, withRepeat(withTiming(1, { duration: 2000 + idx * 200 }), -1, true));
  }, []);
  const s = useAnimatedStyle(() => ({ transform: [{ translateY: -6 * v.value }] }));
  return (
    <Animated.View style={[{ alignItems: "center", gap: 6 }, s]}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: agent.color + "22", borderWidth: 1, borderColor: agent.color, alignItems: "center", justifyContent: "center" }}>
        <Ic name="hardware-chip-outline" size={18} color={agent.color} />
      </View>
      <Text style={{ color: T.textPri, fontSize: 11, fontWeight: "600" }}>{agent.id}</Text>
      <Text style={{ color: T.textSec, fontSize: 10 }}>{agent.role}</Text>
    </Animated.View>
  );
}

export function SwarmBlock({ agents }: { agents: any[] }) {
  return (
    <View style={styles.diagram}>
      <View style={styles.diagramHeader}>
        <Ic name="apps-outline" size={14} color={T.amber} />
        <Text style={{ color: T.textSec, fontSize: 11 }}>Agent Swarm · {agents.length} active</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 12 }}>
        {agents.map((a, i) => <FloatingAgent key={i} agent={a} idx={i} />)}
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   6. PREVIEW BLOCK (web preview with stats)
   ════════════════════════════════════════ */
export function PreviewBlock({ data }: { data: any }) {
  return (
    <View style={[styles.diagram, { padding: 0 }]}>
      <View style={styles.diagramHeader}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.red }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.amber }} />
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.sage }} />
        </View>
        <View style={{ flex: 1, backgroundColor: T.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
          <Text style={{ color: T.textSec, fontSize: 10, fontFamily: "Courier", textAlign: "center" }}>{data?.url}</Text>
        </View>
        <Ic name="open-outline" size={14} color={T.textSec} />
      </View>
      <LinearGradient colors={["#0D0F12", "#0A0C0F"]} style={{ padding: 14 }}>
        <Text style={{ color: "#FFF", fontSize: 14, fontWeight: "600", marginBottom: 12 }}>{data?.title}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(data?.stats || []).map((s: any, i: number) => (
            <View key={i} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}>
              <Text style={{ color: T.textMut, fontSize: 10 }}>{s.label}</Text>
              <Text style={{ color: s.color, fontSize: 17, fontWeight: "700", marginTop: 3 }}>{s.value}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

/* ════════════════════════════════════════
   7. BROWSER BLOCK (live agent web session)
   ════════════════════════════════════════ */
export function BrowserBlock({ data }: { data: any }) {
  return (
    <View style={[styles.diagram, { padding: 0 }]}>
      <View style={styles.diagramHeader}>
        <Ic name="globe-outline" size={14} color={T.blue} />
        <Text style={{ color: T.textSec, fontSize: 11, flex: 1 }} numberOfLines={1}>{data?.url}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <StatusDot status="running" size={6} />
          <Text style={{ color: T.sage, fontSize: 10 }}>Browsing</Text>
        </View>
      </View>
      <View style={{ padding: 14 }}>
        <Text style={{ color: T.textPri, fontSize: 13, fontWeight: "600", marginBottom: 10 }}>{data?.title}</Text>
        <View style={{ gap: 8 }}>
          {(data?.actions || []).map((a: any, i: number) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: a.done ? T.sage + "22" : T.card, borderWidth: 1, borderColor: a.done ? T.sage : T.textMut, alignItems: "center", justifyContent: "center" }}>
                {a.done ? <Ic name="checkmark" size={11} color={T.sage} /> : <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: T.textMut }} />}
              </View>
              <Text style={{ color: a.done ? T.textSec : T.textPri, fontSize: 13, textDecorationLine: a.done ? "line-through" : "none" }}>{a.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   8. SEARCH BLOCK
   ════════════════════════════════════════ */
export function SearchBlock({ data }: { data: any }) {
  return (
    <View style={[styles.diagram, { padding: 0 }]}>
      <View style={styles.diagramHeader}>
        <Ic name="search-outline" size={14} color={T.amber} />
        <Text style={{ color: T.textSec, fontSize: 11, flex: 1 }} numberOfLines={1}>{data?.query}</Text>
        <Text style={{ color: T.amber, fontSize: 10, fontWeight: "600" }}>{(data?.results || []).length} results</Text>
      </View>
      <View style={{ padding: 12, gap: 10 }}>
        {(data?.results || []).map((r: any, i: number) => (
          <Animated.View key={i} entering={FadeInDown.delay(i * 80)} style={{ flexDirection: "row", gap: 10, padding: 10, backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" }}>
            <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: (r.color || T.amber) + "22", alignItems: "center", justifyContent: "center" }}>
              <Ic name="link-outline" size={14} color={r.color || T.amber} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.textPri, fontSize: 13, fontWeight: "600" }}>{r.title}</Text>
              <Text style={{ color: T.blue, fontSize: 10.5, fontFamily: "Courier", marginTop: 1 }}>{r.url}</Text>
              <Text style={{ color: T.textSec, fontSize: 12, marginTop: 4, lineHeight: 16 }}>{r.snippet}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   9. DEEP RESEARCH BLOCK (multi-step)
   ════════════════════════════════════════ */
export function DeepResearchBlock({ data }: { data: any }) {
  return (
    <View style={[styles.diagram, { padding: 0 }]}>
      <View style={styles.diagramHeader}>
        <Ic name="library-outline" size={14} color={T.violet} />
        <Text style={{ color: T.textSec, fontSize: 11, flex: 1 }}>Deep Research</Text>
        <Text style={{ color: T.violet, fontSize: 10, fontWeight: "600" }}>{data?.sources} sources</Text>
      </View>
      <View style={{ padding: 14 }}>
        <Text style={{ color: T.textPri, fontSize: 13, marginBottom: 10, fontStyle: "italic" }}>&quot;{data?.query}&quot;</Text>
        <View style={{ gap: 12 }}>
          {(data?.steps || []).map((s: any, i: number) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: s.done ? T.sage + "22" : T.card, borderWidth: 1.5, borderColor: s.done ? T.sage : T.violet }}>
                {s.done ? <Ic name="checkmark" size={12} color={T.sage} /> : <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.violet }} />}
              </View>
              <Text style={{ flex: 1, color: s.done ? T.textSec : T.textPri, fontSize: 13 }}>{s.label}</Text>
              {s.count > 0 && (
                <View style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: T.violet + "22", borderRadius: 6 }}>
                  <Text style={{ color: T.violet, fontSize: 10, fontWeight: "600" }}>{s.count}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   10. TOOL CALL BLOCK (collapsible)
   ════════════════════════════════════════ */
export function ToolCallBlock({ msg, expanded, onToggle }: { msg: any; expanded: boolean; onToggle: () => void }) {
  const TOOL_COLOR: Record<string, string> = { search: T.amber, code: T.violet, file: T.sage, browser: T.blue };
  const TOOL_ICON: Record<string, string> = { search: "search-outline", code: "code-slash-outline", file: "document-text-outline", browser: "globe-outline" };
  const color = TOOL_COLOR[msg.tool] || T.amber;
  const icon = TOOL_ICON[msg.tool] || "construct-outline";
  return (
    <View style={{ borderWidth: 1, borderColor: T.borderMid, borderRadius: 12, overflow: "hidden", backgroundColor: "rgba(26,23,18,0.9)", marginVertical: 4 }}>
      <TouchableOpacity onPress={onToggle} style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 12 }}>
        <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: color + "22", alignItems: "center", justifyContent: "center" }}>
          <Ic name={icon as any} size={14} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: T.textPri, fontSize: 13, fontWeight: "500" }}>{msg.label}</Text>
          {!expanded && (
            <Text style={{ color: T.textSec, fontSize: 11, marginTop: 2 }}>
              {msg.done ? "✓ Completed" : "Running…"}
            </Text>
          )}
        </View>
        <Ic name={expanded ? "chevron-up" : "chevron-down"} size={16} color={T.textSec} />
      </TouchableOpacity>
      {expanded && (
        <View style={{ borderTopWidth: 1, borderTopColor: T.border, padding: 12 }}>
          {msg.code ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={{ fontFamily: "Courier", fontSize: 11.5, color: T.textSec, lineHeight: 17 }}>{msg.code}</Text>
            </ScrollView>
          ) : (
            <Text style={{ color: T.textSec, fontSize: 12.5, lineHeight: 18 }}>{msg.result}</Text>
          )}
        </View>
      )}
    </View>
  );
}

/* ════════════════════════════════════════
   11. PLAN / PROGRESS BLOCK
   ════════════════════════════════════════ */
export function PlanBlock({ plan }: { plan: any[] }) {
  if (!plan?.length) return null;
  return (
    <View style={[styles.diagram, { padding: 14, marginTop: 8 }]}>
      <Text style={{ color: T.textSec, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: "500", marginBottom: 12 }}>Agent Plan</Text>
      <View style={{ gap: 10 }}>
        {plan.map((step, i) => (
          <View key={i} style={{ gap: 5 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: step.done ? T.sage : step.pct > 0 ? T.amber : T.textMut, backgroundColor: step.done ? T.sage + "22" : "transparent" }}>
                {step.done ? <Ic name="checkmark" size={10} color={T.sage} /> : <Text style={{ color: T.amber, fontSize: 9, fontWeight: "700" }}>{i + 1}</Text>}
              </View>
              <Text style={{ flex: 1, color: step.done ? T.textSec : T.textPri, fontSize: 13, textDecorationLine: step.done ? "line-through" : "none", fontWeight: step.pct > 0 && !step.done ? "500" : "400" }}>{step.label}</Text>
              {step.pct > 0 && !step.done && <Text style={{ color: T.amber, fontSize: 11, fontFamily: "Courier", fontWeight: "500" }}>{step.pct}%</Text>}
            </View>
            {step.pct > 0 && !step.done && (
              <View style={{ height: 2, backgroundColor: T.card, borderRadius: 1, marginLeft: 26, overflow: "hidden" }}>
                <View style={{ height: "100%", width: `${step.pct}%`, backgroundColor: T.amber, borderRadius: 1 }} />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   12. AUTOMATION BLOCK (animated workflow)
   ════════════════════════════════════════ */
function AutomationStep({ step, idx }: { step: any; idx: number }) {
  const isRunning = step.status === "running";
  const v = useSharedValue(0);
  useEffect(() => {
    if (isRunning) {
      v.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
    }
  }, [isRunning]);
  const ringS = useAnimatedStyle(() => ({
    opacity: 0.5 - v.value * 0.5,
    transform: [{ scale: 1 + v.value * 0.4 }],
  }));
  const isDone = step.status === "done";
  const isPending = step.status === "pending";
  const color = isRunning ? T.amber : isDone ? T.sage : T.textMut;
  return (
    <Animated.View entering={FadeInDown.delay(idx * 80)} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
        {isRunning && <Animated.View style={[{ position: "absolute", width: 36, height: 36, borderRadius: 18, backgroundColor: T.amber }, ringS]} />}
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: color + "22", borderWidth: 1.5, borderColor: color, alignItems: "center", justifyContent: "center" }}>
          {isDone ? <Ic name="checkmark" size={14} color={color} /> : <Ic name={step.icon as any} size={14} color={color} />}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: isPending ? T.textMut : T.textPri, fontSize: 13, fontWeight: isRunning ? "600" : "400" }}>{step.label}</Text>
        <Text style={{ color, fontSize: 10, fontFamily: "Courier", textTransform: "uppercase", letterSpacing: 1 }}>
          {isRunning ? "● Running" : isDone ? "✓ Complete" : "○ Pending"}
        </Text>
      </View>
    </Animated.View>
  );
}

export function AutomationBlock({ steps }: { steps: any[] }) {
  return (
    <View style={[styles.diagram, { padding: 14 }]}>
      <View style={[styles.diagramHeader, { paddingHorizontal: 0, paddingBottom: 12, paddingTop: 0 }]}>
        <Ic name="git-merge-outline" size={14} color={T.amber} />
        <Text style={{ color: T.textSec, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>Automation Pipeline</Text>
      </View>
      <View style={{ gap: 14 }}>
        {steps.map((s, i) => (
          <View key={i}>
            <AutomationStep step={s} idx={i} />
            {i < steps.length - 1 && (
              <View style={{ width: 2, height: 12, backgroundColor: T.amber + "44", marginLeft: 17, marginTop: 4 }} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   STYLES
   ════════════════════════════════════════ */
const styles = StyleSheet.create({
  diagram: {
    backgroundColor: T.card,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    overflow: "hidden",
  },
  diagramHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.borderMid,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: -14,
    marginTop: -14,
    marginBottom: 12,
  },
  codeWrap: {
    backgroundColor: "#0A0907",
    borderWidth: 1,
    borderColor: T.borderMid,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 6,
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: T.card,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  copyBtn: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codeText: {
    fontFamily: "Courier",
    fontSize: 12,
    color: T.textPri,
    lineHeight: 18,
  },
  terminal: {
    backgroundColor: "#050505",
    borderWidth: 1,
    borderColor: T.borderMid,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 6,
  },
  terminalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: T.card,
    borderBottomWidth: 1,
    borderBottomColor: T.borderMid,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
