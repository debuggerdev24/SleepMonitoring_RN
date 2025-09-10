import React, { ReactNode } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TouchableOpacityProps,
} from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import DashboardStack from "./stackNavigation";
import SleepLoggingScreen from "../screens/SleepLoggingScreen";
import SleepHistoryScreen from "../screens/SleepHistoryScreen";
import DynamicScheduleScreen from "../screens/DynamicScheduleScreen";
import NotificationsLogScreen from "../screens/NotificationsLogScreen";

type RootStackParamList = {
  MainTabs: undefined;
  SleepLogging: undefined;
};

type BottomTabParamList = {
  Dashboard: undefined;
  History: undefined;
  PlusButton: undefined;
  Sleep: undefined;
  Notifications: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

const icons = {
  dashboard: require("../assest/images/dashboard.png"),
  history: require("../assest/images/history.png"),
  sleep: require("../assest/images/sleep.png"),
  notifications: require("../assest/images/bell.png"),
};

interface CustomTabBarButtonProps extends BottomTabBarButtonProps {
  children: ReactNode;
}

function CustomTabBarButton({ children }: CustomTabBarButtonProps) {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <TouchableOpacity
      style={styles.centerButtonWrapper}
      onPress={() => navigation.navigate("SleepLogging")}
      activeOpacity={0.9}
    >
      <View style={styles.centerButton}>{children}</View>
    </TouchableOpacity>
  );
}

function BottomTabs(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.dashboard}
              style={[
                styles.icon,
                { tintColor: focused ? "#FFA726" : "#A9A9A9" },
              ]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={SleepHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.history}
              style={[
                styles.icon,
                { tintColor: focused ? "#FFA726" : "#A9A9A9" },
              ]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="PlusButton"
        component={View}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../assest/images/plus.png")}
              style={{ width: 28, height: 28, tintColor: "white" }}
            />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Sleep"
        component={DynamicScheduleScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.sleep}
              style={[
                styles.icon,
                { tintColor: focused ? "#FFA726" : "#A9A9A9" },
              ]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsLogScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.notifications}
              style={[
                styles.icon,
                { tintColor: focused ? "#FFA726" : "#A9A9A9" },
              ]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={BottomTabs} />
        <RootStack.Screen name="SleepLogging" component={SleepLoggingScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 40,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  icon: {
    width: 24,
    height: 24,
    marginTop: 15,
  },
  centerButtonWrapper: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#FF3366",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
