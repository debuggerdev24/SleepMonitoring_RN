import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

interface DateItem {
  id: string;
  day: string;
  label: string;
  fullDate: string;
}

const generateDates = (): DateItem[] => {
  const today = new Date();
  let dates: DateItem[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push({
      id: i.toString(),
      day: date.getDate().toString(),
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      fullDate: date.toDateString(),
    });
  }

  return dates;
};

export default function HorizontalCalendar() {
  const [selected, setSelected] = useState<DateItem | null>(null);
  const dates = generateDates();

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        horizontal
        data={dates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selected?.day === item.day;
          return (
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={[styles.dateBox, isSelected && styles.selectedBox]}
                onPress={() => setSelected(item)}
              >
                <Text style={[styles.day, isSelected && styles.selectedText]}>
                  {item.day}
                </Text>
                <Text style={[styles.label, isSelected && styles.selectedText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
              {isSelected && <View style={styles.bottomLine} />}
            </View>
          );
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dateBox: {
    padding: 15,
    margin: 5,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    width: 55,
  },
  selectedBox: {
    backgroundColor: "#00adf5",
  },
  day: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  label: {
    fontSize: 12,
    color: "#555",
  },
  selectedText: {
    color: "#fff",
  },
  bottomLine: {
    marginTop: 6,
    height: 3,
    width: 40,
    backgroundColor: "#00adf5",
    borderRadius: 2,
  },
});
