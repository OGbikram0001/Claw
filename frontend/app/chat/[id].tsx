import React, { useRef, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StyleSheet,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { T, STATUS_COLOR } from "../../src/theme";
import { Ic, StatusDot } from "../../src/primitives";
import { AgentBubble, UserBubble, TypingMessage } from "../../src/Bubbles";
import { MOCK_CHATS, CONVOS, Message } from "../../src/data/mock";

const BLOCK_HINTS = [
  { keyword: "mermaid",      label: "Flowchart",   icon: "git-network-outline"  },
  { keyword: "architecture", label: "Diagram",     icon: "share-social-outline" },
  { keyword: "terminal",     label: "Terminal",    icon: "terminal-outline"     },
  { keyword: "research",     label: "Research",    icon: "library-outline"      },
  { keyword: "code",         label: "Code",        icon: "code-slash-outline"   },
  { keyword: "swarm",        label: "Swarm",       icon: "apps-outline"         },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const convo = CONVOS.find(c => c.id === Number(id)) ?? null;
  const [messages,      setMessages]      = useState<Message[]>(MOCK_CHATS[Number(id)] || []);
  const [input,         setInput]         = useState("");
  const [isTyping,      setIsTyping]      = useState(false);
  const [expandedTools, setExpandedTools] = useState<Record<number, boolean>>({});
  const [showHints,     setShowHints]     = useState(false);

  function scrollToEnd() {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }

  const toggleTool = useCallback((id: number) => {
    setExpandedTools(p => ({ ...p, [id]: !p[id] }));
  }, []);

  const handleApprove = useCallback((id: number) => {
    setMessages(p => p.map(x =>
      x.id === id ? { ...x, role: "agent" as const, content: "✓ Approved. Deploying…" } : x
    ));
  }, []);

  const handleReject = useCallback((id: number) => {
    setMessages(p => p.map(x =>
      x.id === id ? { ...x, role: "agent" as const, content: "Rejected. No changes made." } : x
    ));
  }, []);

  function handleSend(override?: string) {
    const text = (override ?? input).trim();
    if (!text) return;
    setInput("");
    setShowHints(false);
    setMessages(p => [...p, { id: Date.now(), role: "user", content: text }]);
    setIsTyping(true);
    scrollToEnd();

    const lower = text.toLowerCase();
    setTimeout(() => {
      setIsTyping(false);
      let resp: Message = { id: Date.now() + 1, role: "agent" };

      if (lower.includes("mermaid") || lower.includes("flowchart")) {
        resp.content = "Here's the rendered flowchart:";
        resp.block   = { type: "mermaid", code: "flowchart TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Path A]\n  B -->|No| D[Path B]\n  C --> E[End]\n  D --> E" };
      } else if (lower.includes("architecture") || lower.includes("connection") || lower.includes("diagram")) {
        resp.content = "Connection diagram:";
        resp.block   = { type: "connection", nodes: [
          { label: "Client",      icon: "phone-portrait-outline", color: T.amber  },
          { label: "API Gateway", icon: "git-network-outline",    color: T.violet },
          { label: "Database",    icon: "server-outline",         color: T.sage   },
        ] };
      } else if (lower.includes("terminal") || lower.includes("run") || lower.includes("sandbox")) {
        resp.content = "Live sandbox:";
        resp.block   = { type: "terminal", filename: "task.py", code: "result = compute()\nprint(f'Done: {result}')", output: "> Booting sandbox...\n> Compiling 142 modules...\n> ✓ Done in 1.4s\n> Result: SUCCESS" };
      } else if (lower.includes("swarm") || lower.includes("agents")) {
        resp.content = "Agent swarm:";
        resp.block   = { type: "swarm", agents: [
          { id: "A-1", role: "Planner", color: T.amber  },
          { id: "B-2", role: "Coder",   color: T.violet },
          { id: "C-3", role: "Review",  color: T.sage   },
        ] };
      } else if (lower.includes("preview") || lower.includes("dashboard")) {
        resp.content = "Live preview:";
        resp.block   = { type: "preview", title: "Generated Dashboard", url: "kittyclaw.app/preview", stats: [
          { label: "Users",  value: "2.3k", color: T.sage  },
          { label: "Errors", value: "0",    color: T.red   },
          { label: "Speed",  value: "92ms", color: T.amber },
        ] };
      } else if (lower.includes("research") || lower.includes("deep")) {
        resp.content = "Deep research:";
        resp.block   = { type: "deepresearch", query: text, sources: 8, steps: [
          { label: "Web search",      done: true,  count: 3 },
          { label: "Source analysis", done: true,  count: 5 },
          { label: "Synthesis",       done: false, count: 0 },
        ] };
      } else if (lower.includes("search") || lower.includes("find")) {
        resp.content = "Results:";
        resp.block   = { type: "search", query: text, results: [
          { title: "Best match", url: "example.com/a", snippet: "Most relevant result.", color: T.amber  },
          { title: "Related",   url: "example.com/b", snippet: "Adjacent content.",      color: T.violet },
        ] };
      } else if (lower.includes("automation") || lower.includes("workflow") || lower.includes("pipeline")) {
        resp.content = "Automation pipeline:";
        resp.block   = { type: "automation", steps: [
          { label: "Trigger", icon: "flash-outline",      status: "done"    },
          { label: "Process", icon: "code-slash-outline", status: "running" },
          { label: "Notify",  icon: "send-outline",       status: "pending" },
        ] };
      } else if (lower.includes("code")) {
        resp.content = "Generated code:";
        resp.block   = { type: "code", lang: "python", code: "async def kitty_task():\n    data = await api.get('/v1/items')\n    return [d for d in data if d.active]" };
      } else if (lower.includes("a2ui") || lower.includes("form") || lower.includes("config")) {
        resp.content = "Configuration surface:";
        resp.block   = { type: "a2ui", surfaceId: "cfg", components: [
          { id: "root", component: "Card",      child: "col" },
          { id: "col",  component: "Column",    children: ["t","f","cb","btn"] },
          { id: "t",    component: "Text",       text: "Quick Config", variant: "h2" },
          { id: "f",    component: "TextField",  label: "Endpoint URL", value: "https://api.kittyclaw.app" },
          { id: "cb",   component: "CheckBox",   label: "Enable webhook", checked: true },
          { id: "btn",  component: "Button",     text: "Apply", variant: "primary" },
        ] };
      } else {
        resp.content = `I'm on it.\n\nTry asking about: **mermaid**, **architecture**, **terminal**, **swarm**, **preview**, **research**, **search**, **automation**, **code**, or **a2ui** to see each block type.`;
      }

      setMessages(p => [...p, resp]);
      scrollToEnd();
    }, 1400);
  }

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* ── TOP BAR ── */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={s.backBtn}>
          <Ic name="chevron-back" size={22} color={T.textPri} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.topTitle} numberOfLines={1}>
            {convo?.name ?? "New Session"}
          </Text>
          {convo && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 }}>
              <StatusDot status={convo.status} size={5} />
              <Text style={s.topSub}>
                {convo.status === "running" ? "Agent running"
                  : convo.status === "waiting" ? "Awaiting approval"
                  : convo.status === "error"   ? "Error"
                  : "Completed"}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity activeOpacity={0.7} style={s.menuBtn}>
          <Ic name="ellipsis-horizontal" size={20} color={T.textSec} />
        </TouchableOpacity>
      </View>

      {/* ── MESSAGES ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          contentContainerStyle={s.messages}
          onContentSizeChange={scrollToEnd}
        >
          {messages.length === 0 && !isTyping && (
            <Animated.View entering={FadeInDown.duration(400)} style={s.empty}>
              <View style={s.emptyIcon}>
                <Ic name="sparkles-outline" size={28} color={T.amber} />
              </View>
              <Text style={s.emptyTitle}>Start the conversation</Text>
              <Text style={s.emptySub}>Ask anything — I'll use the right tools.</Text>
              {/* Quick hints */}
              <View style={s.hintsGrid}>
                {BLOCK_HINTS.map((h, i) => (
                  <TouchableOpacity key={i} onPress={() => handleSend(h.keyword)} activeOpacity={0.75}
                    style={s.hintChip}>
                    <Ic name={h.icon as any} size={13} color={T.amber} />
                    <Text style={s.hintText}>Try {h.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {messages.map(m =>
            m.role === "user"
              ? <UserBubble key={m.id} msg={m} />
              : <AgentBubble
                  key={m.id}
                  msg={m}
                  isExpanded={!!expandedTools[m.id]}
                  toggleTool={toggleTool}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
          )}

          {isTyping && <TypingMessage />}
        </ScrollView>

        {/* ── INPUT BAR ── */}
        <View style={s.inputWrap} pointerEvents="box-none">
          <LinearGradient
            colors={["transparent", T.bg + "F8", T.bg]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={s.inputBox}>
            <TouchableOpacity activeOpacity={0.7} style={s.inputSide}>
              <Ic name="attach-outline" size={20} color={T.textSec} />
            </TouchableOpacity>
            <TextInput
              value={input}
              onChangeText={v => { setInput(v); setShowHints(v.length === 0); }}
              onFocus={() => setShowHints(input.length === 0)}
              placeholder="Message kittyclaw…"
              placeholderTextColor={T.textMut}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
              multiline
              style={s.input}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              activeOpacity={0.8}
              style={[s.sendBtn, { backgroundColor: input.trim() ? T.amber : T.cardHi }]}
            >
              <Ic
                name={input.trim() ? "arrow-up" : "mic-outline"}
                size={17}
                color={input.trim() ? T.bg : T.textSec}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  topBar:    { flexDirection: "row", alignItems: "center", paddingTop: 56, paddingBottom: 12, paddingHorizontal: 16, gap: 10, borderBottomWidth: 1, borderBottomColor: T.border, backgroundColor: T.bg },
  backBtn:   { width: 38, height: 38, borderRadius: 12, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: "center", justifyContent: "center" },
  menuBtn:   { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  topTitle:  { color: T.textPri, fontSize: 15, fontWeight: "600" },
  topSub:    { color: T.textSec, fontSize: 11.5 },
  messages:  { paddingTop: 16, paddingBottom: 130, paddingHorizontal: 16 },
  empty:     { alignItems: "center", paddingTop: 60, gap: 12, paddingHorizontal: 24 },
  emptyIcon: { width: 60, height: 60, borderRadius: 20, backgroundColor: T.amber + "14", borderWidth: 1, borderColor: T.amber + "28", alignItems: "center", justifyContent: "center" },
  emptyTitle:{ color: T.textPri, fontSize: 18, fontWeight: "600" },
  emptySub:  { color: T.textSec, fontSize: 13, textAlign: "center" },
  hintsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 },
  hintChip:  { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: T.card, borderRadius: 20, borderWidth: 1, borderColor: T.border },
  hintText:  { color: T.textSec, fontSize: 12 },
  inputWrap: { position: "absolute", bottom: 0, left: 0, right: 0, paddingTop: 24, paddingBottom: 24, paddingHorizontal: 14 },
  inputBox:  { flexDirection: "row", alignItems: "flex-end", backgroundColor: T.card, borderRadius: 24, borderWidth: 1, borderColor: T.borderMid, paddingHorizontal: 6, paddingVertical: 6, gap: 4, minHeight: 52 },
  inputSide: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19 },
  input:     { flex: 1, color: T.textPri, fontSize: 15, paddingHorizontal: 4, paddingVertical: 6, maxHeight: 120, lineHeight: 21 },
  sendBtn:   { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
});
