import { Tabs } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { T } from "../../src/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TABS = [
  { name: "home",   label: "Home",   icon: "home-outline",      iconFill: "home"       },
  { name: "chats",  label: "Chats",  icon: "chatbubble-outline", iconFill: "chatbubble" },
  { name: "spaces", label: "Spaces", icon: "apps-outline",       iconFill: "apps"       },
  { name: "files",  label: "Files",  icon: "folder-outline",     iconFill: "folder"     },
] as const;

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const routeNames = state.routes.map(r => r.name);
  return (
    <View style={s.bar}>
      {TABS.map(tab => {
        const routeIdx = routeNames.indexOf(tab.name);
        if (routeIdx === -1) return null;
        const focused = state.index === routeIdx;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
            style={s.tab}
          >
            <Ionicons
              name={(focused ? tab.iconFill : tab.icon) as any}
              size={22}
              color={focused ? T.amber : T.textSec}
            />
            <Text style={[s.label, { color: focused ? T.amber : T.textSec }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"  options={{ href: null }} />
      <Tabs.Screen name="home"   />
      <Tabs.Screen name="chats"  />
      <Tabs.Screen name="spaces" />
      <Tabs.Screen name="files"  />
    </Tabs>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection:     "row",
    backgroundColor:   T.card,
    borderTopWidth:    1,
    borderTopColor:    T.border,
    paddingBottom:     Platform.OS === "ios" ? 24 : 8,
    paddingTop:        10,
  },
  tab: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    gap:            3,
  },
  label: {
    fontSize:   10,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});
