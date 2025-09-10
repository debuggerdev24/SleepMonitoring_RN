import React from "react";
import { View, Text, Button } from "react-native";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Home / Dashboard
      </Text>
      <Text>Overview of sleep stats, recent notifications, coach tips</Text>
      <Button
        title="Go to Notification Details"
        onPress={() => navigation.navigate("NotificationDetails")}
      />
    </View>
  );
}
