import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { T } from "../src/theme";
import { CONVOS, MOCK_CHATS, INITIAL_BG_TASKS, BgTask, Message } from "../src/data/mock";
import { Ic, GlassPill, AmbientBlob } from "../src/primitives";
import Header from "../src/Header";
import BottomBar from "../src/BottomBar";
import { ChatsView, SpacesView, FilesView, Sidebar, ProcessesPopover, ChatMenuPopover } from "../src/Views";
import { AgentBubble, UserBubble, TypingMessage } from "../src/Bubbles";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const PHONE_WIDTH = Math.min(SCREEN_W, 440);

export default function App() {
  const [view, setView] = useState<"home" | "chat">("home");
  const [activeTab, setActiveTab] = useState<"chats" | "spaces" | "files">("chats");
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [expandedTools, setExpandedTools] = useState<Record<number, boolean>>({ 21: true, 12: true, 32: true });
  const [isTyping, setIsTyping] = useState(false);

  const [fabExpanded, setFabExpanded] = useState(false);
  const [newChatText, setNewChatText] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessesOpen, setIsProcessesOpen] = useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  const [bgTasks, setBgTasks] = useState<BgTask[]>(INITIAL_BG_TASKS);
  const overallProgress = Math.round(bgTasks.reduce((a, t) => a + t.progress, 0) / Math.max(1, bgTasks.length)) || 0;

  const scrollRef = useRef<ScrollView>(null);

  // bg task increment
  useEffect(() => {
    const id = setInterval(() => {
      setBgTasks((prev) =>
        prev.map((t) => ({ ...t, progress: t.progress >= 100 ? 0 : Math.min(100, t.progress + Math.floor(Math.random() * 5) + 1) })),
      );
    }, 2200);
    return () => clearInterval(id);
  }, []);

  // close menus when view changes
  useEffect(() => {
    setIsProcessesOpen(false);
    setIsChatMenuOpen(false);
  }, [view]);

  // scroll on new message
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages, isTyping]);

  const toggleTool = useCallback((id: number) => setExpandedTools((p) => ({ ...p, [id]: !p[id] })), []);

  const handleSend = (override?: string) => {
    const text = override || inputText;
    if (!text.trim()) return;
    setMessages((p) => [...p, { id: Date.now(), role: "user", content: text }]);
    if (!override) setInputText("");
    setIsTyping(true);

    const lower = text.toLowerCase();
    setTimeout(() => {
      setIsTyping(false);
      let resp: Message = { id: Date.now() + 1, role: "agent" };

      if (lower.includes("mermaid") || lower.includes("flowchart")) {
        resp.content = "Here's the mermaid flowchart you requested:";
        resp.block = { type: "mermaid", code: "flowchart TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Path A]\n  B -->|No| D[Path B]\n  C --> E[End]\n  D --> E" };
      } else if (lower.includes("architecture") || lower.includes("diagram") || lower.includes("connection")) {
        resp.content = "Here is the connection diagram:";
        resp.block = { type: "connection", nodes: [
          { label: "Client App", icon: "phone-portrait-outline", color: T.amber },
          { label: "API Gateway", icon: "git-network-outline", color: T.violet },
          { label: "Database", icon: "server-outline", color: T.sage },
        ] };
      } else if (lower.includes("terminal") || lower.includes("sandbox") || lower.includes("run")) {
        resp.content = "Streaming live terminal output:";
        resp.block = { type: "terminal", filename: "task.py", code: "result = compute_data()\nprint(f'Done: {result}')", output: "> Booting sandbox...\n> Compiling 142 modules...\n> ✓ Done in 1.4s\n> Result: SUCCESS" };
      } else if (lower.includes("swarm") || lower.includes("agents")) {
        resp.content = "Initializing the multi-agent swarm:";
        resp.block = { type: "swarm", agents: [
          { id: "A-1", role: "Planner", color: T.amber },
          { id: "B-2", role: "Coder", color: T.violet },
          { id: "C-3", role: "Review", color: T.sage },
        ] };
      } else if (lower.includes("preview") || lower.includes("dashboard")) {
        resp.content = "I've compiled a live preview:";
        resp.block = { type: "preview", title: "Generated Dashboard", url: "https://kittyclaw.app/preview", stats: [
          { label: "Users",  value: "2.3k", color: T.sage },
          { label: "Errors", value: "0",    color: T.red  },
          { label: "Speed",  value: "92ms", color: T.amber },
        ] };
      } else if (lower.includes("research") || lower.includes("deep")) {
        resp.content = "Running deep research:";
        resp.block = { type: "deepresearch", query: text, sources: 8, steps: [
          { label: "Web search", done: true, count: 3 },
          { label: "Source analysis", done: true, count: 5 },
          { label: "Synthesis", done: false, count: 0 },
        ] };
      } else if (lower.includes("search") || lower.includes("find")) {
        resp.content = "Search results:";
        resp.block = { type: "search", query: text, results: [
          { title: "Top match", url: "example.com/a", snippet: "Most relevant result.", color: T.amber },
          { title: "Related",   url: "example.com/b", snippet: "Useful adjacent content.", color: T.violet },
        ] };
      } else if (lower.includes("browser") || lower.includes("web")) {
        resp.content = "Opening a browser session:";
        resp.block = { type: "browser", url: "https://example.com", title: "Example Page", actions: [
          { label: "Navigate", done: true },
          { label: "Extract content", done: false },
        ] };
      } else if (lower.includes("automation") || lower.includes("workflow") || lower.includes("pipeline")) {
        resp.content = "Designing automation pipeline:";
        resp.block = { type: "automation", steps: [
          { label: "Trigger", icon: "flash-outline", status: "done" },
          { label: "Process", icon: "code-slash-outline", status: "running" },
          { label: "Notify",  icon: "send-outline", status: "pending" },
        ] };
      } else if (lower.includes("a2ui") || lower.includes("form") || lower.includes("config")) {
        resp.content = "Here's an A2UI surface so you can configure it inline:";
        resp.block = { type: "a2ui", surfaceId: "cfg", components: [
          { id: "root", component: "Card", child: "col" },
          { id: "col", component: "Column", children: ["title", "f1", "cb", "btn"] },
          { id: "title", component: "Text", text: "Quick Config", variant: "h2" },
          { id: "f1", component: "TextField", label: "Endpoint URL", value: "https://api.kittyclaw.app" },
          { id: "cb", component: "CheckBox", label: "Enable webhook", checked: true },
          { id: "btn", component: "Button", text: "Apply", variant: "primary" },
        ] };
      } else if (lower.includes("code")) {
        resp.content = "Here is the generated code:";
        resp.block = { type: "code", lang: "python", code: "async def kitty_task():\n    # Fetch and transform\n    data = await api.get('/v1/items')\n    return [d for d in data if d.active]" };
      } else {
        resp.content = "I'll process that and update the parameters right away.\n\nTry asking me about: **mermaid**, **architecture**, **terminal**, **swarm**, **preview**, **research**, **search**, **browser**, **automation**, **a2ui** or **code**.";
      }
      setMessages((p) => [...p, resp]);
    }, 1300);
  };

  const handleFabSubmit = () => {
    if (!newChatText.trim()) return;
    setActiveConvo({ name: "New Agent Session", status: "running" });
    setMessages([]);
    handleSend(newChatText);
    setView("chat");
    setTimeout(() => {
      setNewChatText("");
      setFabExpanded(false);
    }, 400);
  };

  const initiateNewChat = () => {
    setView("home");
    setIsChatMenuOpen(false);
    setTimeout(() => setFabExpanded(true), 250);
  };

  const handleApprove = useCallback((msg: Message) => {
    setMessages((p) => p.filter((m) => m.id !== msg.id).concat([{ id: Date.now(), role: "user", content: "Approved. Proceed." }]));
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((p) => [...p, { id: Date.now() + 1, role: "agent", content: "Deployment initiated. ✓" }]);
    }, 900);
  }, []);
  const handleReject = useCallback((msg: Message) => {
    setMessages((p) => p.filter((m) => m.id !== msg.id).concat([{ id: Date.now(), role: "user", content: "Let's review first." }]));
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((p) => [...p, { id: Date.now() + 1, role: "agent", content: "Pausing deployment. What should we review?" }]);
    }, 900);
  }, []);

  const openConvo = (c: any) => {
    setActiveConvo(c);
    setMessages(MOCK_CHATS[c.id] || []);
    setView("chat");
  };

  // animated view layers
  const homeT = useSharedValue(view === "home" ? 1 : 0);
  const chatT = useSharedValue(view === "chat" ? 1 : 0);
  useEffect(() => {
    homeT.value = withTiming(view === "home" ? 1 : 0, { duration: 480, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    chatT.value = withTiming(view === "chat" ? 1 : 0, { duration: 480, easing: Easing.bezier(0.32, 0.72, 0, 1) });
  }, [view]);
  const homeStyle = useAnimatedStyle(() => ({
    opacity: homeT.value,
    transform: [{ scale: 0.92 + homeT.value * 0.08 }],
  }));
  const chatStyle = useAnimatedStyle(() => ({
    opacity: chatT.value,
    transform: [{ translateY: (1 - chatT.value) * 40 }],
  }));

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.outer}>
        <View style={[styles.shell, { width: PHONE_WIDTH }]}>
          {/* ambient blobs */}
          <AmbientBlob style={{ top: -80, left: -80, width: 280, height: 220 }} color={T.amber + "1A"} />
          <AmbientBlob style={{ bottom: -100, right: -80, width: 320, height: 240 }} color={T.violet + "14"} delay={4000} />

          {/* Background subtle gradient */}
          <LinearGradient
            colors={[T.bg, "#070605"]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* HEADER */}
          <Header
            view={view}
            onMenu={() => setIsSidebarOpen(true)}
            onBack={() => setView("home")}
            activeConvo={activeConvo}
            overallProgress={overallProgress}
            onProgressTap={() => setIsProcessesOpen((s) => !s)}
            onNewChat={initiateNewChat}
            onChatMenu={() => setIsChatMenuOpen((s) => !s)}
          />

          {/* DROPDOWN POSITIONERS (anchored top-right) */}
          {isProcessesOpen && view === "home" && (
            <>
              <TouchableOpacity activeOpacity={1} onPress={() => setIsProcessesOpen(false)} style={[StyleSheet.absoluteFillObject, { zIndex: 90 }]} />
              <View style={{ position: "absolute", top: 72, right: 20, zIndex: 100 }}>
                <ProcessesPopover tasks={bgTasks} />
              </View>
            </>
          )}
          {isChatMenuOpen && view === "chat" && (
            <>
              <TouchableOpacity activeOpacity={1} onPress={() => setIsChatMenuOpen(false)} style={[StyleSheet.absoluteFillObject, { zIndex: 90 }]} />
              <View style={{ position: "absolute", top: 72, right: 20, zIndex: 100 }}>
                <ChatMenuPopover />
              </View>
            </>
          )}

          {/* HOME LAYER */}
          {view === "home" && (
            <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFillObject}>
              {activeTab === "chats" && <ChatsView onOpen={openConvo} />}
              {activeTab === "spaces" && <SpacesView />}
              {activeTab === "files" && <FilesView />}
              <BottomBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                fabExpanded={fabExpanded}
                setFabExpanded={setFabExpanded}
                newChatText={newChatText}
                setNewChatText={setNewChatText}
                onSubmit={handleFabSubmit}
              />
            </Animated.View>
          )}

          {/* CHAT LAYER */}
          {view === "chat" && (
            <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFillObject}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={0}
              >
                <ScrollView
                  ref={scrollRef}
                  contentContainerStyle={{ paddingTop: 90, paddingBottom: 100, paddingHorizontal: 16 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={{ gap: 8 }}>
                    {messages.map((m) =>
                      m.role === "user"
                        ? <UserBubble key={m.id} msg={m} />
                        : <AgentBubble key={m.id} msg={m} isToolExpanded={!!expandedTools[m.id]} toggleTool={toggleTool} onApprove={handleApprove} onReject={handleReject} />,
                    )}
                    {isTyping && <TypingMessage />}
                  </View>
                </ScrollView>

                {/* Floating chat input (no background behind it) */}
                <View style={chatStyles.inputArea}>
                  <GlassPill rounded={28} style={{ flex: 1, height: 56, borderColor: T.amber + "44" }}>
                    <View style={chatStyles.inputRow}>
                      <TouchableOpacity style={chatStyles.iconBtn}>
                        <Ic name="attach-outline" size={20} color={T.textSec} />
                      </TouchableOpacity>
                      <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Message kittyclaw…"
                        placeholderTextColor={T.textMut}
                        onSubmitEditing={() => handleSend()}
                        returnKeyType="send"
                        style={{ flex: 1, color: T.textPri, fontSize: 15, paddingHorizontal: 6, height: "100%" }}
                      />
                      {inputText.length > 0 ? (
                        <TouchableOpacity onPress={() => handleSend()} style={[chatStyles.iconBtn, { backgroundColor: T.amber }]}>
                          <Ic name="send" size={16} color="#1A1208" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={chatStyles.iconBtn}>
                          <Ic name="mic" size={20} color={T.amber} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </GlassPill>
                </View>
              </KeyboardAvoidingView>
            </Animated.View>
          )}

          {/* SIDEBAR */}
          {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  shell: { flex: 1, backgroundColor: T.bg, overflow: "hidden", position: "relative" },
});

const chatStyles = StyleSheet.create({
  inputArea: { position: "absolute", bottom: 24, left: 20, right: 20, height: 56, flexDirection: "row" },
  inputRow: { flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 6, gap: 4 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
});
