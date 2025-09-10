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
      <Text style={styles.greeting}>🌙 Sleep Adventure</Text>
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
            backgroundGradientFrom: "#1E1E2C",
            backgroundGradientTo: "#4A90E2",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#FFD700",
            },
          }}
          bezier
          style={{ marginVertical: 20, borderRadius: 20 }}
          yLabelsOffset={10}
          segments={5}
          formatYLabel={(yValue) => `${parseFloat(yValue).toFixed(1)}`}
        />
      ) : (
        <Text style={{ marginTop: 20, color: "#fff", textAlign: "center" }}>
          💤 No sleep data yet. Time to dream!
        </Text>
      )}

      <Text style={[styles.subtitle, { marginTop: 20 }]}>
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
              source={require("../assest/images/cloud.jpg")}
              style={styles.card}
              imageStyle={{ borderRadius: 20 }}
            >
              <Text style={styles.subtitle}>
                📅 {formatDate(session.startTime)}
              </Text>
              <Text style={styles.subtitle}>
                ⏰ Duration: <Text style={styles.scoreText}>{session.duration}</Text>
              </Text>
              <Text style={styles.subtitle}>
                🌟 Quality: <Text style={styles.scoreText}>{session.quality ?? "--"}</Text>
              </Text>
              {session.notes ? (
                <Text style={styles.subtitle}>💭 Notes: {session.notes}</Text>
              ) : null}
            </ImageBackground>
          ))}
        {sessions.length === 0 && (
          <Text style={{ marginTop: 10, color: "#fff", textAlign: "center" }}>
            💤 No recent sleep data yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF4FF",
    padding: 16,
  },
  greeting: { fontSize: 30, color: "#1E1E2C", fontWeight: "700", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#1E1E2C", marginTop: 6 },
  card: {
    backgroundColor: "#1E1E2C",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  scoreText: { fontSize: 16, fontWeight: "400", color: "black" },
});
