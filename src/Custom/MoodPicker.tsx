import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Mood {
  label: string;
  emoji: string;
}

interface MoodPickerProps {
  moods: Mood[];
  onSelect?: (mood: Mood) => void;
  initialMood?: Mood | null;
}

export default function MoodPicker({ moods, onSelect, initialMood = null }: MoodPickerProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(initialMood);

  const handleSelect = (mood: Mood) => {
    setSelectedMood(mood);
    if (onSelect) onSelect(mood);
  };

  return (
    <View style={styles.container}>
      {moods.map((mood) => {
        const isSelected = selectedMood?.label === mood.label;
        return (
          <TouchableOpacity
            key={mood.label}
            style={[
              styles.moodButton,
              { backgroundColor: isSelected ? "#2196F3" : "#E0E0E0" },
            ]}
            onPress={() => handleSelect(mood)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text
              style={[
                styles.label,
                { color: isSelected ? "#fff" : "#333" },
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  moodButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    width: 70,
    marginVertical: 5,
  },
  emoji: { fontSize: 28 },
  label: { marginTop: 4, fontSize: 14, textAlign: "center" },
});
