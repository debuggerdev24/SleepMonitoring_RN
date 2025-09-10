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
  { emoji: "😕", label: "Confused" },
  { emoji: "😇", label: "Relaxed" },
  { emoji: "😥", label: "Sad" },
  { emoji: "😱", label: "Anxious" },
  { emoji: "😌", label: "Content" },
  { emoji: "🤯", label: "Overwhelmed" },
  { emoji: "🤗", label: "Excited" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "🥱", label: "Bored" },
  { emoji: "😎", label: "Confident" },
  { emoji: "🤔", label: "Thoughtful" },
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

  const handleButtonClick = () => {
    navigation.goBack()
    setDuration(0)
       AsyncStorage.removeItem("sleep_start");
      AsyncStorage.removeItem("sleep_end");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.greeting}>⏱ Duration</Text>
        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={() => handleButtonClick()}
        >
          <Image
            source={require("../assest/images/close.png")}
            style={{ width: 20, height: 20, tintColor: "black" }}
          />
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.subtitle}> Duration</Text> */}
      <Text style={styles.time}>{formatTime(duration)}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor:isRunning ? "lightgray" : "green" }]}
          onPress={handleStart}
          disabled={isRunning}
        >
          <Text style={[styles.buttonText,{color: isRunning ? 'black' : "#fff",}]}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: !isRunning ? 'lightgray' : "#FF4A4A" }]}
          onPress={handleStop}
          disabled={!isRunning}
        >
          <Text style={[styles.buttonText, {color: !isRunning ? 'black' : "#fff",}]}>Stop</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.subtitle}>How are you feeling today?</Text>

        <MoodPicker
          moods={moods}
          initialMood={selectedMood}
          onSelect={(mood: Mood) => setSelectedMood(mood)}
        />

      </View>
        {selectedMood && (
          <Text style={[styles.subtitle, { marginBottom: 20 }]}>
            Add your session description:
          </Text>
        )}

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Notes"
        placeholderTextColor="#ccc"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {endTime && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={[styles.buttonText, {fontSize:20, color:"white", fontWeight:"400"}]}>Save Session</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#EAF4FF", paddingTop:25 },
  greeting: { fontSize: 28, fontWeight: "700", color: "#1E1E2C",},
  subtitle: { fontSize: 16, color: "#1E1E2C", marginTop: 8 },
  time: { fontSize: 28, fontWeight: "700", color: "#1E1E2C", textAlign: "center", marginVertical: 20 },
  btnRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
  button: {
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    width: "40%",
  },
  buttonText: {  fontSize: 25, fontWeight: "700" },
  saveButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#4A90E2",
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#1E1E2C",
  },
});
