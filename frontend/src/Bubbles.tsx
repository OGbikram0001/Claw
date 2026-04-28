import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ic, TypingDots } from "./primitives";
import { T } from "./theme";
import Markdown from "./Markdown";
import {
  CodeBlock,
  TerminalBlock,
  ConnectionBlock,
  MermaidBlock,
  SwarmBlock,
  PreviewBlock,
  BrowserBlock,
  SearchBlock,
  DeepResearchBlock,
  ToolCallBlock,
  PlanBlock,
  AutomationBlock,
} from "./blocks";
import A2UIRenderer from "./A2UIRenderer";

export const UserBubble = React.memo(function UserBubble({ msg }: { msg: any }) {
  return (
    <Animated.View entering={FadeInDown.duration(220)} style={{ flexDirection: "row", justifyContent: "flex-end", marginVertical: 4 }}>
      <View style={{
        maxWidth: "85%",
        backgroundColor: T.userBub,
        borderWidth: 1,
        borderColor: T.borderMid,
        borderRadius: 14,
        borderTopRightRadius: 0,
        paddingHorizontal: 14,
        paddingVertical: 12,
      }}>
        <Markdown text={msg.content} />
      </View>
    </Animated.View>
  );
});

export function ApprovalCard({ content, onApprove, onReject }: { content: string; onApprove: () => void; onReject: () => void }) {
  return (
    <Animated.View entering={FadeInDown.duration(280)} style={{
      backgroundColor: T.violet + "11",
      borderWidth: 1,
      borderColor: T.violet + "55",
      borderRadius: 16,
      padding: 14,
      marginVertical: 6,
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: T.violet + "22", alignItems: "center", justifyContent: "center" }}>
          <Ic name="lock-closed-outline" size={13} color={T.violet} />
        </View>
        <Text style={{ color: T.violet, fontSize: 11, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" }}>Approval Required</Text>
      </View>
      <Text style={{ color: T.textPri, fontSize: 13.5, lineHeight: 20, marginBottom: 14 }}>{content}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity onPress={onApprove} activeOpacity={0.8} style={{ flex: 1, padding: 11, borderRadius: 10, backgroundColor: T.sage, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}>
          <Text style={{ color: "#0C0A08", fontSize: 13.5, fontWeight: "700" }}>Approve</Text>
          <Ic name="checkmark" size={14} color="#0C0A08" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onReject} activeOpacity={0.8} style={{ flex: 1, padding: 11, borderRadius: 10, backgroundColor: T.red + "22", borderWidth: 1, borderColor: T.red + "55", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}>
          <Text style={{ color: T.red, fontSize: 13.5, fontWeight: "600" }}>Reject</Text>
          <Ic name="close" size={14} color={T.red} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export const AgentBubble = React.memo(function AgentBubble({
  msg,
  isToolExpanded,
  toggleTool,
  onApprove,
  onReject,
}: {
  msg: any;
  isToolExpanded: boolean;
  toggleTool: (id: number) => void;
  onApprove: (m: any) => void;
  onReject: (m: any) => void;
}) {
  if (msg.role === "tool") {
    return (
      <View style={{ paddingLeft: 36, marginVertical: 2 }}>
        <ToolCallBlock msg={msg} expanded={isToolExpanded} onToggle={() => toggleTool(msg.id)} />
      </View>
    );
  }
  if (msg.role === "approval") {
    return (
      <View style={{ paddingLeft: 36 }}>
        <ApprovalCard content={msg.content} onApprove={() => onApprove(msg)} onReject={() => onReject(msg)} />
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(220)} style={{ flexDirection: "row", gap: 8, marginVertical: 4 }}>
      <View style={{
        width: 28, height: 28, borderRadius: 8,
        backgroundColor: T.agentBub,
        borderWidth: 1, borderColor: T.amber + "44",
        alignItems: "center", justifyContent: "center",
      }}>
        <Ic name="hardware-chip-outline" size={15} color={T.amber} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        {!!msg.content && (
          <View style={{
            backgroundColor: T.agentBub,
            borderWidth: 1, borderColor: T.border,
            borderRadius: 14, borderTopLeftRadius: 0,
            paddingHorizontal: 14, paddingVertical: 12,
          }}>
            <Markdown text={msg.content} />
          </View>
        )}
        {msg.block?.type === "connection" && <ConnectionBlock nodes={msg.block.nodes} style={msg.block.style} />}
        {msg.block?.type === "preview" && <PreviewBlock data={msg.block} />}
        {msg.block?.type === "terminal" && <TerminalBlock filename={msg.block.filename} code={msg.block.code} output={msg.block.output} />}
        {msg.block?.type === "swarm" && <SwarmBlock agents={msg.block.agents} />}
        {msg.block?.type === "browser" && <BrowserBlock data={msg.block} />}
        {msg.block?.type === "search" && <SearchBlock data={msg.block} />}
        {msg.block?.type === "deepresearch" && <DeepResearchBlock data={msg.block} />}
        {msg.block?.type === "automation" && <AutomationBlock steps={msg.block.steps} />}
        {msg.block?.type === "mermaid" && <MermaidBlock code={msg.block.code} />}
        {msg.block?.type === "code" && <CodeBlock code={msg.block.code} lang={msg.block.lang} />}
        {msg.block?.type === "a2ui" && <A2UIRenderer surface={msg.block} />}
        {msg.plan && <PlanBlock plan={msg.plan} />}
      </View>
    </Animated.View>
  );
});

export function TypingMessage() {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginVertical: 4 }}>
      <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: T.agentBub, borderWidth: 1, borderColor: T.amber + "44", alignItems: "center", justifyContent: "center" }}>
        <Ic name="hardware-chip-outline" size={15} color={T.amber} />
      </View>
      <View style={{ backgroundColor: T.agentBub, borderWidth: 1, borderColor: T.border, borderRadius: 14, borderTopLeftRadius: 0 }}>
        <TypingDots />
      </View>
    </View>
  );
}
