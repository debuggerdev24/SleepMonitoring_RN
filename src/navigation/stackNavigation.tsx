import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NotificationsLogScreen from "../screens/NotificationsLogScreen";

const Stack = createStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="NotificationDetails" component={ProfileScreen} />
      <Stack.Screen name="NotificationsLog" component={NotificationsLogScreen} />
    </Stack.Navigator>
  );
}
