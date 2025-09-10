import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

interface SleepSession {
  id: string;
  startTime: string | number; 
  duration: string; 
  quality?: string;
  notes?: string;
}

interface ChartDataPoint {
  date: string;
  duration: number;
}

type SleepHistoryScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const formatDate = (timestamp?: string | number): string => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
};

export default function SleepHistoryScreen({
  navigation,
}: SleepHistoryScreenProps): JSX.Element {
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const screenWidth = Dimensions.get("window").width - 32;

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

  const chartData: ChartDataPoint[] = sessions.slice(-7).map((s) => {
    const [hours, minutes] = s.duration.split(":").map(Number);
    return {
      date: formatDate(s.startTime),
      duration: parseFloat((hours + minutes / 60).toFixed(2)),
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌙 Sleep Adventure</Text>

      <Text style={styles.subtitle}>✨ Last 7 Sleep Sessions</Text>
      {chartData.length > 0 ? (
        <LineChart
          data={{
            labels: chartData.map((d) => d.date.slice(5)),
            datasets: [{ data: chartData.map((d) => d.duration) }],
          }}
          width={screenWidth}
          height={250}
          yAxisSuffix="h"
          fromZero
          chartConfig={{
            backgroundGradientFrom: "#FFD6E0",
            backgroundGradientTo: "#A5D8FF",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "7",
              strokeWidth: "2",
              stroke: "#FF69B4",
            },
          }}
          bezier
          style={{ marginVertical: 20, borderRadius: 20 }}
          yLabelsOffset={10}
          segments={5}
          formatYLabel={(yValue) => `${parseFloat(yValue).toFixed(1)}`}
        />
      ) : (
        <Text style={{ marginTop: 20, color: "#666", textAlign: "center" }}>
          💤 No sleep data yet. Time to dream!
        </Text>
      )}

      <Text style={[styles.subtitle, { marginTop: 40 }]}>
        🛌 Recent Sleep Sessions
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 10 }}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {sessions
          .slice(-7)
          .reverse()
          .map((session) => (
            <ImageBackground
              key={session.id}
              source={require("../assest/images/cloud.jpeg")}
              style={styles.sessionCard}
              imageStyle={{ borderRadius: 20 }}
            >
              <Text style={styles.sessionDate}>
                📅 {formatDate(session.startTime)}
              </Text>
              <Text style={styles.sessionDuration}>
                ⏰ Duration: <Text style={styles.bold}>{session.duration}</Text>
              </Text>
              <Text style={styles.sessionDuration}>
                🌟 Quality:{" "}
                <Text style={styles.bold}>{session.quality ?? "--"}</Text>
              </Text>
              {session.notes ? (
                <Text style={styles.sessionNotes}>💭 Notes: {session.notes}</Text>
              ) : null}
            </ImageBackground>
          ))}
        {sessions.length === 0 && (
          <Text style={{ marginTop: 10, color: "#666", textAlign: "center" }}>
            💤 No recent sleep data yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF7FA" },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
    color: "#FF69B4",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 5,
    color: "#6A5ACD",
  },
  sessionCard: {
    backgroundColor: "#E0F7FA",
    padding: 18,
    borderRadius: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionDate: { fontSize: 16, fontWeight: "600", color: "#333" },
  sessionDuration: { fontSize: 15, color: "#444", marginTop: 6 },
  bold: { fontWeight: "700", color: "#FF4500" },
  sessionNotes: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    fontStyle: "italic",
  },
});
