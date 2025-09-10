import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

interface Schedule {
  id: number;
  start: string;
  end: string;
  confidence: number;
}

const initialSchedules: Schedule[] = [
  { id: 1, start: "22:30", end: "06:30", confidence: 0.85 },
  { id: 2, start: "23:00", end: "07:00", confidence: 0.75 },
  { id: 3, start: "22:00", end: "06:00", confidence: 0.9 },
];


export default function DynamicScheduleScreen(): JSX.Element {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedSchedule = schedules.find((s) => s.id === selectedId);

  const handleAdjustment = (adjustmentMinutes: number): void => {
    if (!selectedSchedule) return;

    const [startH, startM] = selectedSchedule.start.split(":").map(Number);
    const [endH, endM] = selectedSchedule.end.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startH, startM);
    const endDate = new Date();
    endDate.setHours(endH, endM);

    startDate.setMinutes(startDate.getMinutes() + adjustmentMinutes);
    endDate.setMinutes(endDate.getMinutes() + adjustmentMinutes);

    const updatedSchedule: Schedule = {
      ...selectedSchedule,
      start: startDate.toTimeString().slice(0, 5),
      end: endDate.toTimeString().slice(0, 5),
      confidence: Math.min(
        Math.max(selectedSchedule.confidence + adjustmentMinutes * 0.001, 0),
        1
      ),
    };

    setSchedules((prev) =>
      prev.map((s) => (s.id === selectedId ? updatedSchedule : s))
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌙 Sleepy Time Schedules!</Text>

      {schedules.map((schedule) => {
        const isSelected = schedule.id === selectedId;
        return (
          <TouchableOpacity
            key={schedule.id}
            style={[
              styles.card,
              { borderColor: isSelected ? "orange" : "white",borderWidth:isSelected ? 5 : 2 },
            ]}
            onPress={() => setSelectedId(schedule.id)}
          >
            <Text style={styles.scheduleTime}>
              🕒 {schedule.start} - {schedule.end}
            </Text>
            <View style={styles.confidenceContainer}>
              <View
                style={[
                  styles.confidenceBar,
                  { width: `${schedule.confidence * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.confidenceText}>
              Confidence: {(schedule.confidence * 100).toFixed(0)}%
            </Text>
          </TouchableOpacity>
        );
      })}

      {selectedSchedule && (
        <>
          <Text style={styles.subtitle}>⚡ Adjust Your Schedule!</Text>
          <View style={styles.adjustmentRow}>
            <TouchableOpacity
              style={[styles.adjustBtn, { backgroundColor: "#FF4A4A" }]}
              onPress={() => handleAdjustment(-30)}
            >
              <Text style={styles.adjustText}>-30 min</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adjustBtn, { backgroundColor: "#FFA500" }]}
              onPress={() => handleAdjustment(-15)}
            >
              <Text style={styles.adjustText}>-15 min</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adjustBtn, { backgroundColor: "#4A90E2" }]}
              onPress={() => handleAdjustment(15)}
            >
              <Text style={styles.adjustText}>+15 min</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adjustBtn, { backgroundColor: "#32CD32" }]}
              onPress={() => handleAdjustment(30)}
            >
              <Text style={styles.adjustText}>+30 min</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.selectedText}>
            🌟 Adjusted: {selectedSchedule.start} - {selectedSchedule.end}
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#EAF4FF",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 50,
    color: "#1E1E2C",
    textAlign: "center",
    marginTop: 20
  },
  card: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#0077BE",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleTime: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#fff",
  },
  confidenceContainer: {
    height: 12,
    backgroundColor: "#dad9d9ff",
    borderRadius: 6,
    overflow: "hidden",
  },
  confidenceBar: {
    height: 12,
    backgroundColor: "#03a30bff",
  },
  confidenceText: {
    marginTop: 6,
    fontSize: 14,
    color: "#fff",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 20,
    color: "#4A90E2",
    textAlign: "center",

  },
  adjustmentRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  adjustBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  adjustText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  selectedText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    color: "#FF69B4",
  },
});
