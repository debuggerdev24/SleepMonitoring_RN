import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MoodPicker from "../Custom/MoodPicker";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

interface Mood {
  emoji: string;
  label: string;
}

interface SleepSession {
  id: number;
  startTime: number | null;
  endTime: number | null;
  duration: string;
  mood: Mood | null;
  notes: string;
  quality: number;
}

type SleepLoggingScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function SleepLoggingScreen({
  navigation,
}: SleepLoggingScreenProps): JSX.Element {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [notes, setNotes] = useState<string>("");

  const moods: Mood[] = [
    { emoji: "😴", label: "Sleepy" },
    { emoji: "😊", label: "Happy" },
    { emoji: "😔", label: "Tired" },
    { emoji: "😡", label: "Stressed" },
  ];

  useEffect(() => {
    const loadSession = async (): Promise<void> => {
      const storedStart = await AsyncStorage.getItem("sleep_start");
      const storedEnd = await AsyncStorage.getItem("sleep_end");

      if (storedStart && !storedEnd) {
        setStartTime(Number(storedStart));
        setIsRunning(true);
      } else if (storedStart && storedEnd) {
        setStartTime(Number(storedStart));
        setEndTime(Number(storedEnd));
        setDuration(Number(storedEnd) - Number(storedStart));
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isRunning && startTime) {
      timer = setInterval(() => {
        setDuration(Date.now() - startTime);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, startTime]);

  const handleStart = async (): Promise<void> => {
    const now = Date.now();
    setStartTime(now);
    setEndTime(null);
    setDuration(0);
    setIsRunning(true);

    await AsyncStorage.setItem("sleep_start", String(now));
    await AsyncStorage.removeItem("sleep_end");
  };

  const handleStop = async (): Promise<void> => {
    const now = Date.now();
    setEndTime(now);
    setIsRunning(false);

    await AsyncStorage.setItem("sleep_end", String(now));
  };

  const handleSave = async (): Promise<void> => {
    try {
      const session: SleepSession = {
        id: Date.now(),
        startTime,
        endTime,
        duration: formatTime(duration),
        mood: selectedMood,
        notes,
        quality: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
      };

      const existingRaw = await AsyncStorage.getItem("sleep_sessions");
      const existing: SleepSession[] = existingRaw
        ? JSON.parse(existingRaw)
        : [];

      existing.push(session);

      await AsyncStorage.setItem("sleep_sessions", JSON.stringify(existing));

      await AsyncStorage.removeItem("sleep_start");
      await AsyncStorage.removeItem("sleep_end");

      navigation.goBack();
    } catch (err) {
      console.error("Error saving session:", err);
    }
  };

  const formatTime = (ms?: number): string => {
    if (!ms) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>🛌 Sleep Timer</Text>
        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={() => navigation.navigate("NotificationsLog")}
        >
          <Image
            source={require("../assest/images/bell.png")}
            style={{ width: 20, height: 20, tintColor: "black" }}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>⏱ Duration</Text>
      <Text style={styles.timer}>{formatTime(duration)}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
          onPress={handleStart}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>▶️ Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#E53935" }]}
          onPress={handleStop}
          disabled={!isRunning}
        >
          <Text style={styles.buttonText}>⏹ Stop</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
          How are you feeling today?
        </Text>

        <MoodPicker
          moods={moods}
          initialMood={selectedMood}
          onSelect={(mood: Mood) => setSelectedMood(mood)}
        />

        {selectedMood && (
          <Text style={{ marginTop: 20, fontSize: 16 }}>
            Selected Mood: {selectedMood.label} {selectedMood.emoji}
          </Text>
        )}
      </View>

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {endTime && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 Save Session</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
  title: { fontSize: 24, fontWeight: "700", color: "#333" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  timer: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  btnRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: "40%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  saveButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
