import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ProgressScaleProps {
  /** Current value */
  value: number;
  /** Maximum scale value (usually the target/goal) */
  max: number;
  /** Color of the filled portion */
  fillColor: string;
  /** Height of the progress bar */
  barHeight?: number;
}

export const ProgressScale: React.FC<ProgressScaleProps> = ({
  value,
  max,
  fillColor,
  barHeight = 16,
}) => {
  // Calculate fill percentage (can go over 100% visually capped)
  const fillPercentage = Math.min((value / max) * 100, 100);

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.barContainer}>
        {/* Background track */}
        <View
          style={[
            styles.track,
            { height: barHeight, borderRadius: barHeight / 2 },
          ]}
        />

        {/* Filled portion */}
        <View
          style={[
            styles.fill,
            {
              width: `${fillPercentage}%`,
              height: barHeight,
              borderRadius: barHeight / 2,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>

      {/* Labels */}
      <View style={styles.labelsContainer}>
        <Text style={styles.labelMin}>0</Text>
        <Text style={styles.labelMax}>{max}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 8,
  },
  barContainer: {
    position: "relative",
    width: "100%",
  },
  track: {
    width: "100%",
    backgroundColor: "#E5E7EB",
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  labelMin: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  labelMax: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
