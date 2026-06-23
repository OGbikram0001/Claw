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
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { T } from "./theme";
import { Ic, BlinkingCursor, StatusDot, CircularProgress, ProgressBar } from "./primitives";

/* ════════════════════════════════════════
   SHARED BLOCK WRAPPER — subtle, open
   ════════════════════════════════════════ */
function Block({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[s.block, style]}>{children}</View>
  );
}
function BlockHeader({ icon, label, right, color = T.textSec }: { icon: any; label: string; right?: React.ReactNode; color?: string }) {
  return (
    <View style={s.blockHeader}>
      <Ic name={icon} size={13} color={color} />
      <Text style={[s.blockLabel, { color }]}>{label}</Text>
      {right && <View style={{ marginLeft: "auto" }}>{right}</View>}
    </View>
  );
}

/* ════════════════════════════════════════
   1. CODE BLOCK
   ════════════════════════════════════════ */
export const CodeBlock = React.memo(function CodeBlock({ code, lang = "python" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const langIcon: Record<string, any> = {
    python: "logo-python", typescript: "logo-react", javascript: "logo-javascript",
    bash: "terminal-outline", go: "logo-react", rust: "code-slash-outline",
  };

  // Performance optimization: memoize syntax highlighting to prevent expensive re-renders
  // especially when typing in the ChatScreen input causes parent component updates.
  const highlightedCode = React.useMemo(() => syntaxHighlight(code, lang), [code, lang]);

  return (
    <View style={s.codeWrap}>
      <View style={s.codeHeader}>
        <View style={{ flexDirection: "row", gap: 5, marginRight: 10 }}>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#FF5F56" }} />
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#FFBD2E" }} />
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#27C93F" }} />
        </View>
        <Text style={s.monoSm}>{lang}</Text>
        <TouchableOpacity onPress={onCopy} activeOpacity={0.7} style={s.copyBtn}>
          <Ic name={copied ? "checkmark-outline" : "copy-outline"} size={12} color={copied ? T.sage : T.textSec} />
          <Text style={{ color: copied ? T.sage : T.textSec, fontSize: 11 }}>{copied ? "Copied!" : "Copy"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 14 }}>
        <Text style={s.codeText} selectable>
          {highlightedCode}
        </Text>
      </ScrollView>
    </View>
  );
});

function syntaxHighlight(src: string, lang: string) {
  const PY_KW  = ["def","async","await","return","import","from","if","else","elif","for","in","print","class","with","as","lambda","try","except","True","False","None","yield","pass","raise","not","and","or","is"];
  const TS_KW  = ["const","let","var","function","return","import","export","from","if","else","for","of","in","class","extends","type","interface","async","await","new","null","undefined","true","false","typeof","void","default"];
  const KEYWORDS = lang === "python" ? PY_KW : TS_KW;

  const tokens: any[] = [];
  let buf = "", i = 0;
  const flush = (col?: string) => { if (buf) { tokens.push(<Text key={tokens.length} style={{ color: col || T.textPri }}>{buf}</Text>); buf = ""; } };

  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'") {
      flush(); const q = c; let j = i + 1;
      while (j < src.length && src[j] !== q) j++;
      tokens.push(<Text key={tokens.length} style={{ color: T.sage }}>{src.slice(i, j + 1)}</Text>);
      i = j + 1; continue;
    }
    if (c === "`" && lang !== "python") {
      flush(); let j = i + 1;
      while (j < src.length && src[j] !== "`") j++;
      tokens.push(<Text key={tokens.length} style={{ color: T.sage }}>{src.slice(i, j + 1)}</Text>);
      i = j + 1; continue;
    }
    if (c === "#" && lang === "python") {
      flush(); let j = i; while (j < src.length && src[j] !== "\n") j++;
      tokens.push(<Text key={tokens.length} style={{ color: T.textMut, fontStyle: "italic" }}>{src.slice(i, j)}</Text>);
      i = j; continue;
    }
    if (c === "/" && src[i + 1] === "/" && lang !== "python") {
      flush(); let j = i; while (j < src.length && src[j] !== "\n") j++;
      tokens.push(<Text key={tokens.length} style={{ color: T.textMut, fontStyle: "italic" }}>{src.slice(i, j)}</Text>);
      i = j; continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i; while (j < src.length && /[A-Za-z0-9_$]/.test(src[j])) j++;
      const word = src.slice(i, j); flush();
      if (KEYWORDS.includes(word)) tokens.push(<Text key={tokens.length} style={{ color: T.violet, fontWeight: "600" }}>{word}</Text>);
      else if (j < src.length && src[j] === "(") tokens.push(<Text key={tokens.length} style={{ color: T.amber }}>{word}</Text>);
      else tokens.push(<Text key={tokens.length} style={{ color: T.textPri }}>{word}</Text>);
      i = j; continue;
    }
    if (/\d/.test(c)) {
      let j = i; while (j < src.length && /[\d.]/.test(src[j])) j++; flush();
      tokens.push(<Text key={tokens.length} style={{ color: T.blue }}>{src.slice(i, j)}</Text>);
      i = j; continue;
    }
    buf += c; i++;
  }
  flush();
  return tokens;
}

/* ════════════════════════════════════════
   2. TERMINAL BLOCK (streaming)
   ════════════════════════════════════════ */
export function TerminalBlock({ filename, code, output }: { filename?: string; code?: string; output: string }) {
  const [stream, setStream] = useState("");
  const [done, setDone]     = useState(false);
  useEffect(() => {
    setStream(""); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i = Math.min(i + 3, output.length);
      setStream(output.slice(0, i));
      if (i >= output.length) { clearInterval(id); setDone(true); }
    }, 22);
    return () => clearInterval(id);
  }, [output]);

  return (
    <View style={s.termWrap}>
      <View style={s.termHeader}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#FF5F56" }} />
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#FFBD2E" }} />
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#27C93F" }} />
        </View>
        <Text style={s.monoSm}>{filename || "shell"}</Text>
        <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 5 }}>
          {!done && <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: T.sage }} />}
          <Text style={{ color: done ? T.textMut : T.sage, fontSize: 10 }}>{done ? "DONE" : "LIVE"}</Text>
        </View>
      </View>
      {!!code && (
        <View style={{ paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.04)" }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={{ color: T.textSec, fontFamily: "Courier", fontSize: 11.5, lineHeight: 18 }}>{code}</Text>
          </ScrollView>
        </View>
      )}
      <View style={{ padding: 14, minHeight: 80, backgroundColor: "#040403" }}>
        <Text style={{ color: "#4AF49A", fontFamily: "Courier", fontSize: 11.5, lineHeight: 18 }} selectable>
          {stream}{!done && <BlinkingCursor color="#4AF49A" />}
        </Text>
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   3. CONNECTION DIAGRAM
   ════════════════════════════════════════ */
export function ConnectionBlock({ nodes, style: orient = "vertical" }: { nodes: any[]; style?: string }) {
  const horiz = orient === "horizontal";
  return (
    <Block>
      <BlockHeader icon="git-network-outline" label="connection map" color={T.amber} />
      <View style={{ flexDirection: horiz ? "row" : "column", alignItems: "center", justifyContent: "center", gap: 0, paddingVertical: 8 }}>
        {nodes.map((n, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(i * 100).duration(380)} style={{ flexDirection: horiz ? "row" : "column", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 11,
              backgroundColor: T.surface, borderWidth: 1, borderColor: (n.color || T.amber) + "44",
              borderRadius: 12, minWidth: horiz ? 110 : "100%" as any }}>
              <View style={{ width: 28, height: 28, borderRadius: 9, backgroundColor: (n.color || T.amber) + "18", alignItems: "center", justifyContent: "center" }}>
                <Ic name={n.icon || "ellipse-outline"} size={14} color={n.color || T.amber} />
              </View>
              <Text style={{ color: T.textPri, fontSize: 13, fontWeight: "500" }}>{n.label}</Text>
            </View>
            {i < nodes.length - 1 && (
              <Animated.View entering={FadeIn.delay(i * 100 + 60)}>
                {horiz
                  ? <View style={{ width: 22, height: 1.5, backgroundColor: T.amber + "55", marginHorizontal: 2 }} />
                  : <View style={{ width: 1.5, height: 16, backgroundColor: T.amber + "55", marginVertical: 2 }} />
                }
              </Animated.View>
            )}
          </Animated.View>
        ))}
      </View>
    </Block>
  );
}

/* ════════════════════════════════════════
   4. MERMAID BLOCK
   ════════════════════════════════════════ */
export function MermaidBlock({ code }: { code: string }) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{margin:0;padding:12px;background:#131210;font-family:system-ui;}
.mermaid{display:flex;justify-content:center;align-items:center;min-height:110px;}
.mermaid svg{max-width:100%;height:auto;}</style>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
</head><body>
<div class="mermaid">${code.replace(/`/g, "\\`")}</div>
<script>mermaid.initialize({startOnLoad:true,theme:'dark',themeVariables:{
  primaryColor:'#1A1714',primaryTextColor:'#E2DAD0',primaryBorderColor:'#C8813A',
  lineColor:'#C8813A',secondaryColor:'#8A6FB0',tertiaryColor:'#5A9E72',
  background:'#131210',mainBkg:'#131210'
}});</script></body></html>`;

  return (
    <Block>
      <BlockHeader icon="git-network-outline" label="mermaid · diagram" color={T.amber}
        right={<Text style={{ color: T.textMut, fontSize: 10, fontFamily: "Courier" }}>flowchart</Text>} />
      <View style={{ height: 220, marginTop: 4, borderRadius: 10, overflow: "hidden" }}>
        {Platform.OS === "web"
          ? <iframe src={`data:text/html;charset=utf-8,${encodeURIComponent(html)}`}
              style={{ flex: 1, border: 0, backgroundColor: T.card, width: "100%", height: "100%" } as any} />
          : <WebView originWhitelist={["*"]} source={{ html }} style={{ flex: 1, backgroundColor: T.card }} scrollEnabled={false} />
        }
      </View>
    </Block>
  );
}

/* ════════════════════════════════════════
   5. SWARM BLOCK
   ════════════════════════════════════════ */
function FloatingAgent({ agent, idx }: { agent: any; idx: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(idx * 220, withRepeat(withTiming(1, { duration: 2200 + idx * 180 }), -1, true));
  }, []);
  const s = useAnimatedStyle(() => ({ transform: [{ translateY: -7 * v.value }] }));
  return (
    <Animated.View style={[{ alignItems: "center", gap: 7, flex: 1 }, s]}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: agent.color + "18",
        borderWidth: 1.5, borderColor: agent.color + "88", alignItems: "center", justifyContent: "center" }}>
        <Ic name="hardware-chip-outline" size={20} color={agent.color} />
      </View>
      <View style={{ alignItems: "center", gap: 2 }}>
        <Text style={{ color: T.textPri, fontSize: 11, fontWeight: "700" }}>{agent.id}</Text>
        <Text style={{ color: T.textSec, fontSize: 10 }}>{agent.role}</Text>
      </View>
    </Animated.View>
  );
}

export function SwarmBlock({ agents }: { agents: any[] }) {
  return (
    <Block>
      <BlockHeader icon="apps-outline" label={`agent swarm · ${agents.length} active`} color={T.violet} />
      <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 16 }}>
        {agents.map((a, i) => <FloatingAgent key={i} agent={a} idx={i} />)}
      </View>
    </Block>
  );
}

/* ════════════════════════════════════════
   6. PREVIEW BLOCK
   ════════════════════════════════════════ */
export function PreviewBlock({ data }: { data: any }) {
  return (
    <Block style={{ padding: 0 }}>
      <View style={[s.blockHeader, { paddingHorizontal: 12 }]}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#FF5F56" }} />
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#FFBD2E" }} />
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#27C93F" }} />
        </View>
        <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginHorizontal: 8 }}>
          <Text style={{ color: T.textSec, fontSize: 10, fontFamily: "Courier", textAlign: "center" }} numberOfLines={1}>{data?.url}</Text>
        </View>
        <Ic name="open-outline" size={13} color={T.textSec} />
      </View>
      <View style={{ padding: 14 }}>
        <Text style={{ color: T.textPri, fontSize: 14, fontWeight: "600", marginBottom: 12 }}>{data?.title}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(data?.stats || []).map((st: any, i: number) => (
            <View key={i} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 10,
              borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" }}>
              <Text style={{ color: T.textMut, fontSize: 10, marginBottom: 4 }}>{st.label}</Text>
              <Text style={{ color: st.color, fontSize: 18, fontWeight: "700" }}>{st.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </Block>
  );
}

/* ════════════════════════════════════════
   7. BROWSER BLOCK
   ════════════════════════════════════════ */
export function BrowserBlock({ data }: { data: any }) {
  return (
    <Block>
      <BlockHeader icon="globe-outline" label={data?.url || "browser session"} color={T.blue}
        right={<View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <StatusDot status="running" size={5} />
          <Text style={{ color: T.sage, fontSize: 10 }}>Browsing</Text>
        </View>} />
      <View style={{ marginTop: 6, gap: 0 }}>
        <Text style={{ color: T.textPri, fontSize: 13.5, fontWeight: "600", marginBottom: 10 }}>{data?.title}</Text>
        {(data?.actions || []).map((a: any, i: number) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 7,
            borderBottomWidth: i < data.actions.length - 1 ? 1 : 0, borderBottomColor: "rgba(255,255,255,0.05)" }}>
            <View style={{ width: 20, height: 20, borderRadius: 10,
              backgroundColor: a.done ? T.sage + "20" : "rgba(255,255,255,0.04)",
              borderWidth: 1, borderColor: a.done ? T.sage + "66" : "rgba(255,255,255,0.08)",
              alignItems: "center", justifyContent: "center" }}>
              {a.done
                ? <Ic name="checkmark" size={11} color={T.sage} />
                : <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: T.textMut }} />}
            </View>
            <Text style={{ color: a.done ? T.textSec : T.textPri, fontSize: 13,
              textDecorationLine: a.done ? "line-through" : "none" }}>{a.label}</Text>
          </View>
        ))}
      </View>
    </Block>
  );
}

/* ════════════════════════════════════════
   8. SEARCH BLOCK
   ════════════════════════════════════════ */
export function SearchBlock({ data }: { data: any }) {
  return (
    <Block>
      <BlockHeader icon="search-outline" label={`"${data?.query}"`} color={T.amber}
        right={<Text style={{ color: T.amber, fontSize: 10, fontFamily: "Courier", fontWeight: "700" }}>{(data?.results || []).length} results</Text>} />
      <View style={{ gap: 8, marginTop: 8 }}>
        {(data?.results || []).map((r: any, i: number) => (
          <Animated.View key={i} entering={FadeInDown.delay(i * 70)}
            style={{ flexDirection: "row", gap: 10, paddingVertical: 10, paddingHorizontal: 10,
              backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 10,
              borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}>
            <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: (r.color || T.amber) + "18",
              alignItems: "center", justifyContent: "center" }}>
              <Ic name="link-outline" size={14} color={r.color || T.amber} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.textPri, fontSize: 13, fontWeight: "600" }}>{r.title}</Text>
              <Text style={{ color: T.blue, fontSize: 10, fontFamily: "Courier", marginTop: 1 }}>{r.url}</Text>
              <Text style={{ color: T.textSec, fontSize: 12.5, marginTop: 4, lineHeight: 17 }}>{r.snippet}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </Block>
  );
}

/* ════════════════════════════════════════
   9. DEEP RESEARCH BLOCK
   ════════════════════════════════════════ */
export function DeepResearchBlock({ data }: { data: any }) {
  return (
    <Block>
      <BlockHeader icon="library-outline" label="deep research" color={T.violet}
        right={<Text style={{ color: T.violet, fontSize: 10, fontWeight: "700" }}>{data?.sources} sources</Text>} />
      <Text style={{ color: T.textSec, fontSize: 13, fontStyle: "italic", marginTop: 6, marginBottom: 12 }}>"{data?.query}"</Text>
      <View style={{ gap: 10 }}>
        {(data?.steps || []).map((st: any, i: number) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center",
              backgroundColor: st.done ? T.sage + "20" : T.card, borderWidth: 1.5, borderColor: st.done ? T.sage : T.violet + "66" }}>
              {st.done
                ? <Ic name="checkmark" size={11} color={T.sage} />
                : <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: T.violet + "88" }} />}
            </View>
            <Text style={{ flex: 1, color: st.done ? T.textSec : T.textPri, fontSize: 13 }}>{st.label}</Text>
            {st.count > 0 && (
              <View style={{ paddingHorizontal: 7, paddingVertical: 2, backgroundColor: T.violet + "18", borderRadius: 6 }}>
                <Text style={{ color: T.violet, fontSize: 10, fontWeight: "700" }}>{st.count}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </Block>
  );
}

/* ════════════════════════════════════════
   10. TOOL CALL BLOCK (collapsible)
   ════════════════════════════════════════ */
export function ToolCallBlock({ msg, expanded, onToggle }: { msg: any; expanded: boolean; onToggle: () => void }) {
  const TOOL_COLOR: Record<string, string> = { search: T.amber, code: T.violet, file: T.sage, browser: T.blue };
  const TOOL_ICON:  Record<string, any>    = { search: "search-outline", code: "code-slash-outline", file: "document-text-outline", browser: "globe-outline" };
  const color = TOOL_COLOR[msg.tool] || T.amber;
  const icon  = TOOL_ICON[msg.tool]  || "construct-outline";
  return (
    <View style={{ borderWidth: 1, borderColor: color + "28", borderRadius: 10, overflow: "hidden",
      backgroundColor: color + "08", marginVertical: 3 }}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.75}
        style={{ flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 12, paddingVertical: 10 }}>
        <View style={{ width: 24, height: 24, borderRadius: 7, backgroundColor: color + "18", alignItems: "center", justifyContent: "center" }}>
          <Ic name={icon} size={13} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: T.textPri, fontSize: 12.5, fontWeight: "500" }}>{msg.label}</Text>
          {!expanded && <Text style={{ color: T.textSec, fontSize: 11, marginTop: 1 }}>{msg.done ? "✓ Completed" : "Running…"}</Text>}
        </View>
        <Ic name={expanded ? "chevron-up" : "chevron-down"} size={14} color={T.textSec} />
      </TouchableOpacity>
      {expanded && (
        <View style={{ borderTopWidth: 1, borderTopColor: color + "20", padding: 12, backgroundColor: "rgba(0,0,0,0.25)" }}>
          {msg.code
            ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={{ fontFamily: "Courier", fontSize: 11.5, color: T.sage, lineHeight: 17 }} selectable>{msg.code}</Text>
              </ScrollView>
            : <Text style={{ color: T.textSec, fontSize: 12.5, lineHeight: 18 }}>{msg.result}</Text>}
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
    <Block>
      <BlockHeader icon="list-outline" label="agent plan" color={T.textSec} />
      <View style={{ gap: 12, marginTop: 8 }}>
        {plan.map((step, i) => (
          <View key={i} style={{ gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center",
                borderWidth: 1.5, borderColor: step.done ? T.sage : step.pct > 0 ? T.amber : "rgba(255,255,255,0.2)",
                backgroundColor: step.done ? T.sage + "20" : "transparent" }}>
                {step.done
                  ? <Ic name="checkmark" size={11} color={T.sage} />
                  : <Text style={{ color: T.amber, fontSize: 9, fontWeight: "800" }}>{i + 1}</Text>}
              </View>
              <Text style={{ flex: 1, color: step.done ? T.textSec : T.textPri, fontSize: 13,
                textDecorationLine: step.done ? "line-through" : "none",
                fontWeight: step.pct > 0 && !step.done ? "600" : "400" }}>{step.label}</Text>
              {step.pct > 0 && !step.done && (
                <Text style={{ color: T.amber, fontSize: 11, fontFamily: "Courier", fontWeight: "700" }}>{step.pct}%</Text>
              )}
            </View>
            {step.pct > 0 && !step.done && (
              <View style={{ marginLeft: 29 }}>
                <ProgressBar progress={step.pct} color={T.amber} height={3} />
              </View>
            )}
          </View>
        ))}
      </View>
    </Block>
  );
}

/* ════════════════════════════════════════
   12. AUTOMATION BLOCK
   ════════════════════════════════════════ */
function AutoStep({ step, idx }: { step: any; idx: number }) {
  const isRunning = step.status === "running";
  const isDone    = step.status === "done";
  const isPending = step.status === "pending";
  const v = useSharedValue(0);
  useEffect(() => {
    if (isRunning) v.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [isRunning]);
  const ring = useAnimatedStyle(() => ({ opacity: 0.5 - v.value * 0.5, transform: [{ scale: 1 + v.value * 0.45 }] }));
  const color = isRunning ? T.amber : isDone ? T.sage : "rgba(255,255,255,0.2)";
  return (
    <Animated.View entering={FadeInDown.delay(idx * 80)} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
        {isRunning && <Animated.View style={[{ position: "absolute", width: 36, height: 36, borderRadius: 18, backgroundColor: T.amber + "44" }, ring]} />}
        <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: color + "18", borderWidth: 1.5,
          borderColor: color, alignItems: "center", justifyContent: "center" }}>
          {isDone
            ? <Ic name="checkmark" size={14} color={T.sage} />
            : <Ic name={step.icon} size={13} color={color} />}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: isPending ? T.textMut : T.textPri, fontSize: 13, fontWeight: isRunning ? "600" : "400" }}>{step.label}</Text>
        <Text style={{ color, fontSize: 10, fontFamily: "Courier", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 2 }}>
          {isRunning ? "● running" : isDone ? "✓ complete" : "○ pending"}
        </Text>
      </View>
    </Animated.View>
  );
}

export function AutomationBlock({ steps }: { steps: any[] }) {
  return (
    <Block>
      <BlockHeader icon="git-merge-outline" label="automation pipeline" color={T.amber} />
      <View style={{ gap: 14, marginTop: 10 }}>
        {steps.map((s, i) => (
          <View key={i}>
            <AutoStep step={s} idx={i} />
            {i < steps.length - 1 && (
              <View style={{ width: 1.5, height: 10, backgroundColor: T.amber + "33", marginLeft: 17, marginTop: 4 }} />
            )}
          </View>
        ))}
      </View>
    </Block>
  );
}

/* ════════════════════════════════════════
   13. THINKING BLOCK (collapsible, auto-open)
   ════════════════════════════════════════ */
export function ThinkingBlock({ content, steps }: { content?: string; steps?: string[] }) {
  const [open, setOpen] = useState(true);
  const spin = useSharedValue(0);
  useEffect(() => {
    spin.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.linear }), -1, false);
  }, []);
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));
  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity onPress={() => setOpen(o => !o)} activeOpacity={0.75}
        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Animated.View style={spinStyle}>
          <Ic name="refresh-outline" size={13} color={T.violet} />
        </Animated.View>
        <Text style={{ color: T.violet, fontSize: 12, fontWeight: "500" }}>Thinking</Text>
        <Text style={{ color: T.textMut, fontSize: 11 }}>· {content}</Text>
        <Ic name={open ? "chevron-up" : "chevron-down"} size={13} color={T.textMut} />
      </TouchableOpacity>
      {open && !!steps?.length && (
        <Animated.View entering={FadeInDown.duration(200)} style={{ marginTop: 8, paddingLeft: 20, gap: 6, borderLeftWidth: 1, borderLeftColor: T.violet + "30" }}>
          {steps.map((st, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: T.violet + "88" }} />
              <Text style={{ color: T.textSec, fontSize: 11.5 }}>{st}</Text>
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

/* ════════════════════════════════════════
   STYLES
   ════════════════════════════════════════ */
const s = StyleSheet.create({
  block: {
    backgroundColor: T.card,
    borderWidth:      1,
    borderColor:      T.border,
    borderRadius:     14,
    padding:          13,
    marginTop:        8,
    overflow:         "hidden",
  },
  blockHeader: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            7,
    marginBottom:   4,
  },
  blockLabel: {
    fontSize:     11,
    fontFamily:   "Courier",
    letterSpacing: 0.5,
    textTransform: "none",
  },
  codeWrap: {
    backgroundColor: "#070605",
    borderWidth:     1,
    borderColor:     T.borderMid,
    borderRadius:    12,
    overflow:        "hidden",
    marginTop:       8,
  },
  codeHeader: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:              8,
    backgroundColor:  T.card,
    borderBottomWidth:1,
    borderBottomColor:"rgba(255,255,255,0.05)",
    paddingHorizontal:12,
    paddingVertical:  9,
  },
  termWrap: {
    backgroundColor: "#030302",
    borderWidth:     1,
    borderColor:     T.borderMid,
    borderRadius:    12,
    overflow:        "hidden",
    marginTop:       8,
  },
  termHeader: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:              8,
    backgroundColor:  "#0E0D0B",
    borderBottomWidth:1,
    borderBottomColor:"rgba(255,255,255,0.05)",
    paddingHorizontal:12,
    paddingVertical:  9,
  },
  monoSm: { color: T.textSec, fontSize: 11, fontFamily: "Courier" },
  copyBtn: {
    marginLeft:       "auto",
    flexDirection:    "row",
    alignItems:       "center",
    gap:              4,
    backgroundColor:  "rgba(255,255,255,0.04)",
    paddingHorizontal:8,
    paddingVertical:  4,
    borderRadius:     6,
  },
  codeText: { fontFamily: "Courier", fontSize: 12, color: T.textPri, lineHeight: 19 },
});
