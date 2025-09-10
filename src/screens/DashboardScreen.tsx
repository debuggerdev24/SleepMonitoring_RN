import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
} from "react-native";
import HorizontalCalendar from "../Custom/HorizontalCalendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, ParamListBase } from "@react-navigation/native";


interface SleepSession {
  id: string | number;
  startTime: string | number;
  endTime: string | number;
  duration: string; 
  quality: string;
  notes?: string;
  mood?: {
    emoji: string;
  };
}

type DashboardScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const formatTime = (timestamp?: string | number): string => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function DashboardScreen({
  navigation,
}: DashboardScreenProps): JSX.Element {
  const [sessions, setSessions] = useState<SleepSession[]>([]);
    const [loading, setLoading] = useState(true);

      useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // show loader for 1 second

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const loadSessions = async (): Promise<void> => {
      try {
        const data = await AsyncStorage.getItem("sleep_sessions");
        if (data) {
          setSessions(JSON.parse(data) as SleepSession[]);
        }
      } catch (err) {
        console.error("Error loading sessions:", err);
      }
    };

    const unsubscribe = navigation.addListener("focus", loadSessions);
    return unsubscribe;
  }, [navigation]);

  const renderSession: ListRenderItem<SleepSession> = ({ item }) => (
    <ImageBackground
      source={require("../assest/images/sleepScore.png")}
      style={styles.card}
      imageStyle={{ borderRadius: 20 }}
    >
      <Text style={styles.cardTitle}>{item?.mood?.emoji} Sleep Score</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.time}>Duration : {item.duration}</Text>
          <Text style={styles.subtitle}>
            Start Time: {formatTime(item.startTime)}
          </Text>
          <Text style={styles.subtitle}>
            End Time: {formatTime(item.endTime)}
          </Text>
          {item.notes ? (
            <Text style={styles.subtitle}>📝 {item.notes}</Text>
          ) : null}
        </View>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{item.quality}</Text>
          <Text style={styles.scoreLabel}>Quality</Text>
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assest/images/nature.jpeg")}
        style={styles.headerBackground}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.username}>John Deo 😎</Text>
        </View>
        <HorizontalCalendar />
      </ImageBackground>

     {!loading ? <View style={{ flex: 1, width: "100%" }}>
      {sessions.length === 0 ? (
        <Text
          style={{
            alignSelf: "center",
            justifyContent: "center",
            marginTop: "20%",
          }}
        >
          No sleep sessions saved yet.
        </Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSession}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View> : <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF4FF",
  },

  // Header
  headerBackground: {
    width: "100%",
    height: 250,
    justifyContent: "flex-end",
  },
  headerContent: { padding: 20, marginTop: 20 },
  greeting: { fontSize: 30, color: "#fff", marginTop: 20 },
  username: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 10 },

  // Cards
  card: {
    backgroundColor: "#1E1E2C",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 16,
    marginTop: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: { fontSize: 25, fontWeight: "700", color: "#fff" },
  subtitle: { fontSize: 14, color: "white", marginTop: 4 },

  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: { fontSize: 22, fontWeight: "700", color: "#fff" },
  scoreLabel: { fontSize: 12, color: "#fff" },
});
