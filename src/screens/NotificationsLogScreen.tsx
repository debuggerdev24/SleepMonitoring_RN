

import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

export default function NotificationsLogScreen() {
  const [notifications, setNotifications] = useState([
    { id: "1", text: "⏰ Time to sleep! Maintain your schedule.", color: "#4A90E2" },
    { id: "2", text: "😴 You slept better than last week!", color: "#4A90E2" },
    { id: "3", text: "💡 Try reducing caffeine before bed.", color: "#4A90E2" },
  ]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <Text style={styles.text}>{item.text}</Text>
      <TouchableOpacity onPress={() => removeNotification(item.id)}>
        <Image
          source={require("../assest/images/close.png")}
          style={{ width: 18, height: 18, tintColor: "#fff" }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Notifications Log</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.empty}>No notifications yet 🎉</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#EAF4FF", // sleep blue theme background
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1E1E2C",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
    color: "#fff", // white text on blue
    fontWeight: "600",
  },
  empty: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
});
