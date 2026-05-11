import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { T } from "../src/theme";
import { MOCK_CHATS, INITIAL_BG_TASKS, BgTask, Message } from "../src/data/mock";
import { Ic, StatusDot, ScrollFade, AmbientBlob } from "../src/primitives";
import Header from "../src/Header";
import BottomBar from "../src/BottomBar";
import {
  HomeView, ChatsView, SpacesView, FilesView,
  Sidebar, ProcessesPopover, ChatMenuPopover,
} from "../src/Views";
import { AgentBubble, UserBubble, TypingMessage } from "../src/Bubbles";

type Tab     = "home" | "chats" | "spaces" | "files";
type AppView = "home" | "chat";

export default function App() {
  /* ── Navigation ── */
  const [activeTab,   setActiveTab]   = useState<Tab>("home");
  const [appView,     setAppView]     = useState<AppView>("home");
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Popovers ── */
  const [showProcesses, setShowProcesses] = useState(false);
  const [showChatMenu,  setShowChatMenu]  = useState(false);

  /* ── Chat state ── */
  const [messages,      setMessages]      = useState<Message[]>([]);
  const [newChatText,   setNewChatText]   = useState("");
  const [fabExpanded,   setFabExpanded]   = useState(false);
  const [expandedTools, setExpandedTools] = useState<Record<number, boolean>>({});
  const [isTyping,      setIsTyping]      = useState(false);

  /* ── Background tasks ── */
  const [bgTasks, setBgTasks] = useState<BgTask[]>(INITIAL_BG_TASKS);
  const overall = Math.round(bgTasks.reduce((a, t) => a + t.progress, 0) / Math.max(1, bgTasks.length));

  const scrollRef = useRef<ScrollView>(null);

  /* Animate bg task progress */
  useEffect(() => {
    const id = setInterval(() => {
      setBgTasks(prev =>
        prev.map(t => ({ ...t, progress: t.progress >= 100 ? 100 : Math.min(100, t.progress + (Math.random() > 0.65 ? 1 : 0)) }))
      );
    }, 1800);
    return () => clearInterval(id);
  }, []);

  /* Auto-scroll on new messages */
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages, isTyping]);

  /* ── Actions ── */
  function openChat(convo: any) {
    setActiveConvo(convo);
    setMessages(MOCK_CHATS[convo.id] || []);
    setExpandedTools({});
    setIsTyping(false);
    setAppView("chat");
    setShowChatMenu(false);
    setShowProcesses(false);
    setSidebarOpen(false);
  }

  function newChat() {
    setActiveConvo(null);
    setMessages([]);
    setIsTyping(false);
    setAppView("chat");
    setFabExpanded(true);
    setShowChatMenu(false);
  }

  function handleBack() {
    setAppView("home");
    setShowChatMenu(false);
    setShowProcesses(false);
    setFabExpanded(false);
  }

  function handleSubmit() {
    const text = newChatText.trim();
    if (!text) return;

    /* Bootstrap convo if fresh */
    if (!activeConvo) {
      setActiveConvo({ id: 0, name: text.slice(0, 40), status: "running" });
    }

    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setNewChatText("");
    setFabExpanded(false);
    setIsTyping(true);

    const lower = text.toLowerCase();
    setTimeout(() => {
      setIsTyping(false);
      let resp: Message = { id: Date.now() + 1, role: "agent" };

      if (lower.includes("mermaid") || lower.includes("flowchart")) {
        resp.content = "Here's the rendered flowchart:";
        resp.block   = { type: "mermaid", code: "flowchart TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Path A]\n  B -->|No| D[Path B]\n  C --> E[End]\n  D --> E" };
      } else if (lower.includes("architecture") || lower.includes("connection") || lower.includes("diagram")) {
        resp.content = "Here is the connection diagram:";
        resp.block   = { type: "connection", nodes: [
          { label: "Client",     icon: "phone-portrait-outline", color: T.amber  },
          { label: "API Gateway",icon: "git-network-outline",    color: T.violet },
          { label: "Database",   icon: "server-outline",         color: T.sage   },
        ] };
      } else if (lower.includes("terminal") || lower.includes("sandbox") || lower.includes("run")) {
        resp.content = "Live sandbox output:";
        resp.block   = { type: "terminal", filename: "task.py", code: "result = compute()\nprint(f'Done: {result}')", output: "> Booting sandbox...\n> Compiling modules...\n> ✓ Done in 1.4s\n> Result: SUCCESS" };
      } else if (lower.includes("swarm") || lower.includes("agents")) {
        resp.content = "Multi-agent swarm initialised:";
        resp.block   = { type: "swarm", agents: [
          { id: "A-1", role: "Planner", color: T.amber  },
          { id: "B-2", role: "Coder",   color: T.violet },
          { id: "C-3", role: "Review",  color: T.sage   },
        ] };
      } else if (lower.includes("preview") || lower.includes("dashboard")) {
        resp.content = "Live preview compiled:";
        resp.block   = { type: "preview", title: "Generated Dashboard", url: "kittyclaw.app/preview", stats: [
          { label: "Users",  value: "2.3k", color: T.sage  },
          { label: "Errors", value: "0",    color: T.red   },
          { label: "Speed",  value: "92ms", color: T.amber },
        ] };
      } else if (lower.includes("research") || lower.includes("deep")) {
        resp.content = "Deep research running:";
        resp.block   = { type: "deepresearch", query: text, sources: 8, steps: [
          { label: "Web search",      done: true,  count: 3 },
          { label: "Source analysis", done: true,  count: 5 },
          { label: "Synthesis",       done: false, count: 0 },
        ] };
      } else if (lower.includes("search") || lower.includes("find")) {
        resp.content = "Top results:";
        resp.block   = { type: "search", query: text, results: [
          { title: "Best match", url: "example.com/a", snippet: "Most relevant result for your query.", color: T.amber  },
          { title: "Related",   url: "example.com/b", snippet: "Adjacent useful content.",             color: T.violet },
        ] };
      } else if (lower.includes("browser") || lower.includes("web")) {
        resp.content = "Browser session opened:";
        resp.block   = { type: "browser", url: "https://example.com", title: "Example Page", actions: [
          { label: "Navigate",       done: true  },
          { label: "Extract content", done: false },
        ] };
      } else if (lower.includes("automation") || lower.includes("workflow") || lower.includes("pipeline")) {
        resp.content = "Automation pipeline:";
        resp.block   = { type: "automation", steps: [
          { label: "Trigger", icon: "flash-outline",      status: "done"    },
          { label: "Process", icon: "code-slash-outline", status: "running" },
          { label: "Notify",  icon: "send-outline",       status: "pending" },
        ] };
      } else if (lower.includes("a2ui") || lower.includes("form") || lower.includes("config")) {
        resp.content = "Interactive config surface:";
        resp.block   = { type: "a2ui", surfaceId: "cfg-inline", components: [
          { id: "root",  component: "Card",      child: "col"               },
          { id: "col",   component: "Column",    children: ["t","f","cb","btn"] },
          { id: "t",     component: "Text",      text: "Quick Config",  variant: "h2" },
          { id: "f",     component: "TextField", label: "Endpoint URL", value: "https://api.kittyclaw.app" },
          { id: "cb",    component: "CheckBox",  label: "Enable webhook", checked: true },
          { id: "btn",   component: "Button",    text: "Apply",         variant: "primary" },
        ] };
      } else if (lower.includes("code")) {
        resp.content = "Generated code:";
        resp.block   = { type: "code", lang: "python", code: "async def kitty_task():\n    # Fetch and transform\n    data = await api.get('/v1/items')\n    return [d for d in data if d.active]" };
      } else {
        resp.content = "Got it! I'm on it.\n\nYou can ask me about **mermaid**, **architecture**, **terminal**, **swarm**, **preview**, **research**, **search**, **browser**, **automation**, **a2ui**, or **code** to see each block type.";
      }

      setMessages(prev => [...prev, resp]);
    }, 1400);
  }

  function toggleTool(id: number) {
    setExpandedTools(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function closePopovers() {
    setShowProcesses(false);
    setShowChatMenu(false);
  }

  const isChat = appView === "chat";

  return (
    <View style={styles.root}>
      <LinearGradient colors={[T.bg, "#060504"]} style={StyleSheet.absoluteFill} pointerEvents="none" />
      <AmbientBlob style={{ top: -80,  left:  -80, width: 300, height: 220 }} color={T.amber  + "14"} />
      <AmbientBlob style={{ bottom: -80, right: -80, width: 320, height: 240 }} color={T.violet + "0E"} delay={4000} />

      {/* Tap-behind to dismiss popovers */}
      {(showProcesses || showChatMenu) && (
        <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={closePopovers} />
      )}

      {/* HEADER */}
      <Header
        view={isChat ? "chat" : "home"}
        onMenu={() => { setSidebarOpen(true); closePopovers(); }}
        onBack={handleBack}
        activeConvo={activeConvo}
        overallProgress={overall}
        onProgressTap={() => { setShowProcesses(v => !v); setShowChatMenu(false); }}
        onNewChat={newChat}
        onChatMenu={() => { setShowChatMenu(v => !v); setShowProcesses(false); }}
      />

      {/* PROCESSES POPOVER */}
      {showProcesses && (
        <View style={{ position: "absolute", top: 68, right: 18, zIndex: 99 }}>
          <ProcessesPopover tasks={bgTasks} />
        </View>
      )}

      {/* CHAT MENU POPOVER */}
      {showChatMenu && (
        <View style={{ position: "absolute", top: 68, right: 18, zIndex: 99 }}>
          <ChatMenuPopover onNewChat={newChat} />
        </View>
      )}

      {/* CONTENT */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {!isChat && (
          <View style={{ flex: 1 }}>
            {activeTab === "home"   && <HomeView bgTasks={bgTasks} overallProgress={overall} onOpenChat={openChat} />}
            {activeTab === "chats"  && <ChatsView onOpen={openChat} />}
            {activeTab === "spaces" && <SpacesView />}
            {activeTab === "files"  && <FilesView />}
          </View>
        )}

        {isChat && (
          <Animated.View entering={FadeIn.duration(280)} style={{ flex: 1 }}>
            {/* Convo status bar */}
            {activeConvo && (
              <View style={styles.statusBar}>
                <StatusDot status={activeConvo.status} size={6} />
                <Text style={{ color: T.textSec, fontSize: 11.5 }}>
                  {activeConvo.status === "running" ? "Agent running"
                   : activeConvo.status === "waiting" ? "Waiting for approval"
                   : activeConvo.status === "error"   ? "Error"
                   : "Completed"}
                </Text>
              </View>
            )}

            {/* Messages */}
            <ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              contentContainerStyle={{
                paddingTop:        activeConvo ? 88 : 80,
                paddingBottom:     120,
                paddingHorizontal: 16,
              }}
            >
              {messages.length === 0 && !isTyping && (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.empty}>
                  <View style={styles.emptyIcon}>
                    <Ic name="sparkles-outline" size={28} color={T.amber} />
                  </View>
                  <Text style={styles.emptyTitle}>New Session</Text>
                  <Text style={styles.emptySub}>Type a message to get started.</Text>
                </Animated.View>
              )}

              {messages.map((m) =>
                m.role === "user"
                  ? <UserBubble key={m.id} msg={m} />
                  : <AgentBubble
                      key={m.id}
                      msg={m}
                      expandedTools={expandedTools}
                      toggleTool={toggleTool}
                      onApprove={(msg) => {
                        setMessages(prev => prev.map(x =>
                          x.id === msg.id
                            ? { ...x, role: "agent" as const, content: "✓ Approved. Deploying now…" }
                            : x
                        ));
                      }}
                      onReject={(msg) => {
                        setMessages(prev => prev.map(x =>
                          x.id === msg.id
                            ? { ...x, role: "agent" as const, content: "Rejected. No changes were made." }
                            : x
                        ));
                      }}
                    />
              )}

              {isTyping && <TypingMessage />}
            </ScrollView>

            <ScrollFade position="top" />
          </Animated.View>
        )}
      </KeyboardAvoidingView>

      {/* BOTTOM BAR — always visible */}
      <BottomBar
        activeTab={activeTab}
        setActiveTab={(t) => { setActiveTab(t); setAppView("home"); }}
        fabExpanded={fabExpanded}
        setFabExpanded={setFabExpanded}
        newChatText={newChatText}
        setNewChatText={setNewChatText}
        onSubmit={handleSubmit}
        view={isChat ? "chat" : "home"}
      />

      {/* SIDEBAR */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: T.bg,
    overflow:        "hidden",
    position:        "relative",
  },
  statusBar: {
    position:          "absolute",
    top:               60,
    left:              0,
    right:             0,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               8,
    paddingVertical:   6,
    backgroundColor:   T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    zIndex:            10,
  },
  empty: {
    alignItems:    "center",
    justifyContent:"center",
    paddingTop:    100,
    gap:           12,
  },
  emptyIcon: {
    width:           56,
    height:          56,
    borderRadius:    18,
    backgroundColor: T.amber + "14",
    borderWidth:     1,
    borderColor:     T.amber + "28",
    alignItems:      "center",
    justifyContent:  "center",
  },
  emptyTitle: { color: T.textPri,  fontSize: 18, fontWeight: "600" },
  emptySub:   { color: T.textSec,  fontSize: 13, textAlign: "center" },
});
