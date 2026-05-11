import { Tabs } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { T } from "../../src/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TABS = [
  { name: "home",   label: "Home",   icon: "home-outline",       iconFill: "home"        },
  { name: "chats",  label: "Chats",  icon: "chatbubble-outline",  iconFill: "chatbubble"  },
  { name: "spaces", label: "Spaces", icon: "apps-outline",        iconFill: "apps"        },
  { name: "files",  label: "Files",  icon: "folder-outline",      iconFill: "folder"      },
] as const;

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  /* Map route names → tab index */
  const routeNames = state.routes.map(r => r.name);

  return (
    <View style={s.wrapper} pointerEvents="box-none">
      <LinearGradient
        colors={["transparent", T.bg + "F5", T.bg]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={s.bar}>
        {TABS.map((tab) => {
          const routeIdx = routeNames.indexOf(tab.name);
          /* skip hidden routes (index redirect) */
          if (routeIdx === -1) return null;
          const focused = state.index === routeIdx;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              activeOpacity={0.75}
              style={s.tab}
            >
              <View style={[s.pill, focused && s.pillActive]}>
                <Ionicons
                  name={(focused ? tab.iconFill : tab.icon) as any}
                  size={20}
                  color={focused ? T.amber : T.textSec}
                />
              </View>
              <Text style={[s.label, { color: focused ? T.amber : T.textMut }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
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
  wrapper: {
    position:      "absolute",
    bottom:        0,
    left:          0,
    right:         0,
    paddingTop:    28,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    zIndex:        50,
    pointerEvents: "box-none" as any,
  },
  bar: {
    flexDirection:     "row",
    marginHorizontal:  20,
    backgroundColor:   T.card,
    borderRadius:      24,
    borderWidth:       1,
    borderColor:       T.border,
    paddingHorizontal: 8,
    paddingVertical:   8,
    justifyContent:    "space-around",
  },
  tab: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    gap:            4,
    paddingVertical: 2,
  },
  pill:      { width: 42, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  pillActive:{ backgroundColor: T.amber + "1A" },
  label:     { fontSize: 10, fontWeight: "600", letterSpacing: 0.2 },
});
