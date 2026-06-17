import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ic, TypingDots } from "./primitives";
import { T } from "./theme";
import Markdown from "./Markdown";
import {
  CodeBlock, TerminalBlock, ConnectionBlock, MermaidBlock,
  SwarmBlock, PreviewBlock, BrowserBlock, SearchBlock,
  DeepResearchBlock, ToolCallBlock, PlanBlock, AutomationBlock, ThinkingBlock,
} from "./blocks";
import A2UIRenderer from "./A2UIRenderer";

// ⚡ Bolt: Wrapped with React.memo to prevent unnecessary re-renders when parent state (e.g. input) changes
/* ─── USER BUBBLE ─── */
export const UserBubble = React.memo(function UserBubble({ msg }: { msg: any }) {
  return (
    <Animated.View entering={FadeInDown.duration(200)} style={{ alignItems: "flex-end", marginVertical: 6, paddingLeft: 48 }}>
      <View style={{
        backgroundColor: T.userBub,
        borderWidth:     1,
        borderColor:     "rgba(255,255,255,0.08)",
        borderRadius:    18,
        borderBottomRightRadius: 4,
        paddingHorizontal: 14,
        paddingVertical:   12,
        maxWidth:          "88%",
      }}>
        <Markdown text={msg.content} size={14} />
      </View>
    </Animated.View>
  );
});

// ⚡ Bolt: Wrapped with React.memo and using primitive props (isExpanded instead of expandedTools map) to avoid cascade re-renders
/* ─── AGENT MESSAGE (no bubble, full-width, icon first) ─── */
export const AgentBubble = React.memo(function AgentBubble({
  msg, isExpanded, toggleTool, onApprove, onReject,
}: {
  msg: any;
  isExpanded: boolean;
  toggleTool: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  if (msg.role === "think") {
    return (
      <Animated.View entering={FadeInDown.duration(200)} style={{ marginVertical: 4, paddingRight: 12 }}>
        <ThinkingBlock content={msg.content} steps={msg.thinkSteps} />
      </Animated.View>
    );
  }

  if (msg.role === "tool") {
    return (
      <View style={{ marginVertical: 3, paddingLeft: 40, paddingRight: 8 }}>
        <ToolCallBlock msg={msg} expanded={isExpanded} onToggle={() => toggleTool(msg.id)} />
      </View>
    );
  }

  if (msg.role === "approval") {
    return (
      <Animated.View entering={FadeInDown.duration(260)} style={{ marginVertical: 6 }}>
        <ApprovalCard content={msg.content} onApprove={() => onApprove(msg.id)} onReject={() => onReject(msg.id)} />
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(220)} style={{ marginVertical: 8, paddingRight: 12 }}>
      {/* Agent header: icon + name */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 8 }}>
        <View style={{
          width: 30, height: 30, borderRadius: 10,
          backgroundColor: T.card,
          borderWidth: 1, borderColor: T.amber + "44",
          alignItems: "center", justifyContent: "center",
        }}>
          <Ic name="hardware-chip-outline" size={15} color={T.amber} />
        </View>
        <Text style={{ color: T.textSec, fontSize: 12, fontWeight: "600", letterSpacing: 0.3 }}>kittyclaw</Text>
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: T.textMut }} />
        <Text style={{ color: T.textMut, fontSize: 11 }}>AI</Text>
      </View>

      {/* Content — no background box */}
      <View style={{ paddingLeft: 39 }}>
        {!!msg.content && (
          <View style={{ marginBottom: msg.block || msg.plan ? 8 : 0 }}>
            <Markdown text={msg.content} size={14.5} />
          </View>
        )}

        {/* Blocks flow inline as part of the response */}
        {msg.block?.type === "connection"   && <ConnectionBlock nodes={msg.block.nodes} style={msg.block.style} />}
        {msg.block?.type === "preview"      && <PreviewBlock data={msg.block} />}
        {msg.block?.type === "terminal"     && <TerminalBlock filename={msg.block.filename} code={msg.block.code} output={msg.block.output} />}
        {msg.block?.type === "swarm"        && <SwarmBlock agents={msg.block.agents} />}
        {msg.block?.type === "browser"      && <BrowserBlock data={msg.block} />}
        {msg.block?.type === "search"       && <SearchBlock data={msg.block} />}
        {msg.block?.type === "deepresearch" && <DeepResearchBlock data={msg.block} />}
        {msg.block?.type === "automation"   && <AutomationBlock steps={msg.block.steps} />}
        {msg.block?.type === "mermaid"      && <MermaidBlock code={msg.block.code} />}
        {msg.block?.type === "code"         && <CodeBlock code={msg.block.code} lang={msg.block.lang} />}
        {msg.block?.type === "a2ui"         && <A2UIRenderer surface={msg.block} />}
        {msg.plan && <PlanBlock plan={msg.plan} />}
      </View>
    </Animated.View>
  );
});

/* ─── TYPING INDICATOR ─── */
export function TypingMessage() {
  return (
    <View style={{ marginVertical: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 8 }}>
        <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: T.card,
          borderWidth: 1, borderColor: T.amber + "44", alignItems: "center", justifyContent: "center" }}>
          <Ic name="hardware-chip-outline" size={15} color={T.amber} />
        </View>
        <Text style={{ color: T.textSec, fontSize: 12, fontWeight: "600" }}>kittyclaw</Text>
      </View>
      <View style={{ paddingLeft: 39 }}>
        <TypingDots />
      </View>
    </View>
  );
}

/* ─── APPROVAL CARD ─── */
export function ApprovalCard({ content, onApprove, onReject }: {
  content: string; onApprove: () => void; onReject: () => void;
}) {
  return (
    <View style={{
      backgroundColor: T.violet + "0A",
      borderWidth:     1,
      borderColor:     T.violet + "44",
      borderRadius:    16,
      padding:         16,
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: T.violet + "1A",
          alignItems: "center", justifyContent: "center" }}>
          <Ic name="lock-closed-outline" size={13} color={T.violet} />
        </View>
        <Text style={{ color: T.violet, fontSize: 11, fontWeight: "700", letterSpacing: 1.3, textTransform: "uppercase" }}>
          Approval Required
        </Text>
      </View>
      <Text style={{ color: T.textPri, fontSize: 13.5, lineHeight: 21, marginBottom: 16 }}>{content}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity onPress={onApprove} activeOpacity={0.8} style={{
          flex: 1, padding: 12, borderRadius: 12, backgroundColor: T.sage,
          alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6,
        }}>
          <Text style={{ color: "#0C0B09", fontSize: 13.5, fontWeight: "700" }}>Approve</Text>
          <Ic name="checkmark" size={14} color="#0C0B09" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onReject} activeOpacity={0.8} style={{
          flex: 1, padding: 12, borderRadius: 12,
          backgroundColor: T.red + "14", borderWidth: 1, borderColor: T.red + "44",
          alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6,
        }}>
          <Text style={{ color: T.red, fontSize: 13.5, fontWeight: "600" }}>Reject</Text>
          <Ic name="close" size={14} color={T.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
