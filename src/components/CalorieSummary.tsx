import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Circle,
  G,
  Path,
  Line,
  Text as SvgText,
  Rect,
} from "react-native-svg";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface CalorieSummaryProps {
  consumed: number;
  goal: number;
  exerciseBurnt?: number;
  exerciseGoal?: number;
  date?: string;
}

export const CalorieSummary: React.FC<CalorieSummaryProps> = ({
  consumed,
  goal,
  exerciseBurnt = 0,
  exerciseGoal = 300,
  date,
}) => {
  const roundedConsumed = Math.round(consumed);
  const roundedExercise = Math.round(exerciseBurnt);

  // Net calories = consumed - burnt
  const netCalories = roundedConsumed - roundedExercise;
  const isOverGoal = netCalories > goal;
  const remaining = goal - netCalories;

  // Speedometer calculations - semicircle gauge (180°)
  const meterWidth = 220;
  const meterHeight = 120;
  const meterStroke = 12;
  const meterRadius = 70;
  const meterCenterX = meterWidth / 2;
  const meterCenterY = 85;

  // Arc angles: 180° semicircle from left (180°) to right (0°/360°) through top
  const startAngle = 180; // Left side
  const endAngle = 360; // Right side (0° = 360°)
  const totalArcAngle = 180;

  // Calculate fill percentage (capped at 120% for visual)
  const maxDisplayedCal = goal * 1.2;
  const fillPercentage = Math.min((netCalories / maxDisplayedCal) * 100, 100);
  const targetPercentage = (goal / maxDisplayedCal) * 100;

  // Convert angle to radians (0° = right, 90° = down, 180° = left, 270° = up in SVG)
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  // Get point on circle at given angle
  const getPointOnArc = (angle: number) => {
    const rad = toRadians(angle);
    return {
      x: meterCenterX + meterRadius * Math.cos(rad),
      y: meterCenterY + meterRadius * Math.sin(rad),
    };
  };

  // Create arc path from startAngle to endAngle
  const createArcPath = (startDeg: number, endDeg: number) => {
    const start = getPointOnArc(startDeg);
    const end = getPointOnArc(endDeg);
    const arcLength = Math.abs(endDeg - startDeg);
    const largeArc = arcLength > 180 ? 1 : 0;
    // sweep = 1 to go through the top (270° in SVG coords is top)
    return `M ${start.x} ${start.y} A ${meterRadius} ${meterRadius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  // Background arc (full semicircle)
  const bgArcPath = createArcPath(startAngle, endAngle);

  // Fill arc (based on net calories) - goes from left towards right
  const fillEndAngle = startAngle + (fillPercentage / 100) * totalArcAngle;
  const fillArcPath =
    netCalories > 0
      ? createArcPath(startAngle, Math.min(fillEndAngle, endAngle))
      : "";

  // Target marker position
  const targetAngle = startAngle + (targetPercentage / 100) * totalArcAngle;
  const targetPos = getPointOnArc(targetAngle);
  const getInnerPoint = (angle: number, radiusOffset: number) => {
    const rad = toRadians(angle);
    return {
      x: meterCenterX + (meterRadius - radiusOffset) * Math.cos(rad),
      y: meterCenterY + (meterRadius - radiusOffset) * Math.sin(rad),
    };
  };
  const targetInnerPos = getInnerPoint(targetAngle, 18);

  // Determine color based on goal status
  const getMeterColor = () => {
    if (netCalories <= goal * 0.8) return "#3B82F6"; // Blue - under 80%
    if (netCalories <= goal) return "#10B981"; // Green - 80-100%
    return "#EF4444"; // Red - over goal
  };

  const meterColor = getMeterColor();

  // Card scale dimensions (responsive)
  const cardWidth = (SCREEN_WIDTH - 44) / 2; // Account for container padding and gap
  const scaleWidth = cardWidth - 36; // Padding on both sides
  const scaleHeight = 70;
  const barHeight = 22;
  const barY = 18;
  const labelY = 58;

  // Scale bar positioning (using actual width)
  const barPadding = 85;
  const barWidth = scaleWidth - barPadding * 2;

  // Food scale - max 2000 calories
  const foodScaleMax = 2000;
  const foodTargetPosition = (goal / foodScaleMax) * 100;
  const foodFillPercentage = Math.min(
    (roundedConsumed / foodScaleMax) * 100,
    100,
  );
  const isFoodOverTarget = roundedConsumed > goal;
  const foodColor = isFoodOverTarget ? "#EF4444" : "#F59E0B";

  // Exercise scale - max based on goal * 1.5 or 500 minimum
  const exerciseScaleMax = Math.max(exerciseGoal * 1.5, 500);
  const exerciseTargetPosition = (exerciseGoal / exerciseScaleMax) * 100;
  const exerciseFillPercentage = Math.min(
    (roundedExercise / exerciseScaleMax) * 100,
    100,
  );
  const isExerciseOverTarget = roundedExercise >= exerciseGoal;
  const exerciseColor = isExerciseOverTarget ? "#10B981" : "#60A5FA"; // Green when reached, Blue when not

  // Food and exercise progress (for backward compat)
  const foodPercentage = Math.min((roundedConsumed / goal) * 100, 100);
  const exercisePercentage = Math.min(
    (roundedExercise / exerciseGoal) * 100,
    100,
  );

  return (
    <View style={styles.container}>
      {/* Speedometer Section */}
      <View style={styles.meterSection}>
        <View style={styles.meterHeader}>
          <Text style={styles.meterTitle}>Daily Progress</Text>
          <View style={styles.targetBadge}>
            <Ionicons name="flag" size={12} color="#6B7280" />
            <Text style={styles.targetBadgeText}>Target: {goal} cal</Text>
          </View>
        </View>

        <View style={styles.meterContainer}>
          <Svg width={meterWidth} height={meterHeight}>
            {/* Background Arc */}
            <Path
              d={bgArcPath}
              stroke="#E5E7EB"
              strokeWidth={meterStroke}
              fill="none"
              strokeLinecap="round"
            />

            {/* Filled Arc */}
            {netCalories > 0 && (
              <Path
                d={fillArcPath}
                stroke={meterColor}
                strokeWidth={meterStroke}
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Target Line Marker */}
            <Line
              x1={targetInnerPos.x}
              y1={targetInnerPos.y}
              x2={targetPos.x}
              y2={targetPos.y}
              stroke="#4e5867"
              strokeWidth={2}
              strokeLinecap="round"
            />

            {/* Scale labels */}
            <SvgText
              x={25}
              y={meterCenterY + 15}
              fontSize="11"
              fill="#9CA3AF"
              textAnchor="middle"
            >
              0
            </SvgText>
            <SvgText
              x={meterWidth - 25}
              y={meterCenterY + 15}
              fontSize="11"
              fill="#9CA3AF"
              textAnchor="middle"
            >
              {Math.round(maxDisplayedCal)}
            </SvgText>
          </Svg>

          {/* Center Display */}
          <View style={styles.meterCenterDisplay}>
            <Text style={styles.netLabel}>NET</Text>
            <Text style={[styles.netValue, { color: meterColor }]}>
              {netCalories}
            </Text>
            <Text style={styles.netUnit}>calories</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isOverGoal ? "#FEE2E2" : "#DBEAFE" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isOverGoal ? "#DC2626" : "#2563EB" },
                ]}
              >
                {isOverGoal
                  ? `${Math.abs(remaining)} over`
                  : `${remaining} left`}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Food & Exercise Cards */}
      <View style={styles.cardsContainer}>
        {/* Food Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[styles.cardIconContainer, { backgroundColor: "#FEF3C7" }]}
            >
              <MaterialCommunityIcons
                name="food-apple"
                size={28}
                color="#F59E0B"
              />
            </View>
            <Text style={styles.cardTitle}>Food</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={[styles.cardValue, { color: foodColor }]}>
              {roundedConsumed}
            </Text>
            <Text style={styles.cardSubtext}>consumed</Text>
          </View>

          {/* Food Scale with Target Marker */}
          <View style={styles.scaleContainer}>
            <Svg width={scaleWidth} height={scaleHeight}>
              {/* Background track */}
              <Rect
                x={barPadding}
                y={barY}
                width={barWidth}
                height={barHeight}
                rx={barHeight / 2}
                fill="#E5E7EB"
              />

              {/* Filled portion */}
              <Rect
                x={barPadding}
                y={barY}
                width={Math.max(0, (foodFillPercentage / 100) * barWidth)}
                height={barHeight}
                rx={barHeight / 2}
                fill={foodColor}
              />

              {/* Target marker line */}
              <Line
                x1={barPadding + (foodTargetPosition / 100) * barWidth}
                y1={10}
                x2={barPadding + (foodTargetPosition / 100) * barWidth}
                y2={barY + barHeight + 8}
                stroke="#4e5867"
                strokeWidth={2}
                strokeLinecap="round"
              />

              {/* Target marker triangle */}
              <Path
                d={`M${barPadding + (foodTargetPosition / 100) * barWidth - 7} 2 L${barPadding + (foodTargetPosition / 100) * barWidth + 7} 2 L${barPadding + (foodTargetPosition / 100) * barWidth} 12 Z`}
                fill="#4e5867"
              />

              {/* Scale labels */}
              <SvgText
                x={barPadding + 2}
                y={labelY}
                fontSize={12}
                fill="#9CA3AF"
              >
                0
              </SvgText>
              <SvgText
                x={barPadding + (foodTargetPosition / 100) * barWidth}
                y={labelY}
                fontSize={12}
                fill="#374151"
                fontWeight="700"
                textAnchor="middle"
              >
                {goal}
              </SvgText>
              <SvgText
                x={scaleWidth - barPadding}
                y={labelY}
                fontSize={12}
                fill="#9CA3AF"
                textAnchor="end"
              >
                {foodScaleMax}
              </SvgText>
            </Svg>
          </View>

          <Text style={[styles.scaleStatus, { color: foodColor }]}>
            {isFoodOverTarget
              ? `${roundedConsumed - goal} over limit`
              : `${goal - roundedConsumed} until limit`}
          </Text>
        </View>

        {/* Exercise Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[styles.cardIconContainer, { backgroundColor: "#DBEAFE" }]}
            >
              <FontAwesome5 name="running" size={22} color="#3B82F6" />
            </View>
            <Text style={styles.cardTitle}>Exercise</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={[styles.cardValue, { color: exerciseColor }]}>
              {roundedExercise}
            </Text>
            <Text style={styles.cardSubtext}>burned</Text>
          </View>

          {/* Exercise Scale with Target Marker */}
          <View style={styles.scaleContainer}>
            <Svg width={scaleWidth} height={scaleHeight}>
              {/* Background track */}
              <Rect
                x={barPadding}
                y={barY}
                width={barWidth}
                height={barHeight}
                rx={barHeight / 2}
                fill="#E5E7EB"
              />

              {/* Filled portion */}
              <Rect
                x={barPadding}
                y={barY}
                width={Math.max(0, (exerciseFillPercentage / 100) * barWidth)}
                height={barHeight}
                rx={barHeight / 2}
                fill={exerciseColor}
              />

              {/* Target marker line */}
              <Line
                x1={barPadding + (exerciseTargetPosition / 100) * barWidth}
                y1={10}
                x2={barPadding + (exerciseTargetPosition / 100) * barWidth}
                y2={barY + barHeight + 8}
                stroke="#4e5867"
                strokeWidth={2}
                strokeLinecap="round"
              />

              {/* Target marker triangle */}
              <Path
                d={`M${barPadding + (exerciseTargetPosition / 100) * barWidth - 7} 2 L${barPadding + (exerciseTargetPosition / 100) * barWidth + 7} 2 L${barPadding + (exerciseTargetPosition / 100) * barWidth} 12 Z`}
                fill="#4e5867"
              />

              {/* Scale labels */}
              <SvgText x={barPadding + 2} y={labelY} fontSize={12} fill="#9CA3AF">
                0
              </SvgText>
              <SvgText
                x={barPadding + (exerciseTargetPosition / 100) * barWidth}
                y={labelY}
                fontSize={12}
                fill="#374151"
                fontWeight="700"
                textAnchor="middle"
              >
                {exerciseGoal}
              </SvgText>
              <SvgText
                x={scaleWidth - barPadding}
                y={labelY}
                fontSize={12}
                fill="#9CA3AF"
                textAnchor="end"
              >
                {Math.round(exerciseScaleMax)}
              </SvgText>
            </Svg>
          </View>

          <Text style={[styles.scaleStatus, { color: exerciseColor }]}>
            {isExerciseOverTarget
              ? `Target reached! +${roundedExercise - exerciseGoal}`
              : `${exerciseGoal - roundedExercise} to reach goal`}
          </Text>
        </View>
      </View>

      {/* Formula Row */}
      <View style={styles.formulaRow}>
        <View style={styles.formulaItem}>
          <MaterialCommunityIcons name="food" size={14} color="#F59E0B" />
          <Text style={styles.formulaText}>{roundedConsumed}</Text>
        </View>
        <Text style={styles.formulaOperator}>−</Text>
        <View style={styles.formulaItem}>
          <FontAwesome5 name="fire" size={12} color="#10B981" />
          <Text style={styles.formulaText}>{roundedExercise}</Text>
        </View>
        <Text style={styles.formulaOperator}>=</Text>
        <View style={[styles.formulaItem, styles.formulaResult]}>
          <Ionicons name="calculator" size={14} color={meterColor} />
          <Text
            style={[
              styles.formulaText,
              styles.formulaResultText,
              { color: meterColor },
            ]}
          >
            {netCalories} net
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  meterSection: {
    paddingTop: 14,
    paddingHorizontal: 12,
  },
  meterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  meterTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  targetBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  targetBadgeText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  meterContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 120,
  },
  meterCenterDisplay: {
    position: "absolute",
    alignItems: "center",
    bottom: 5,
  },
  netLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 1,
  },
  netValue: {
    fontSize: 32,
    fontWeight: "800",
    marginTop: -3,
  },
  netUnit: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: -3,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  cardsContainer: {
    flexDirection: "row",
    paddingHorizontal: 14,
    gap: 14,
    marginTop: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 18,
    minWidth: 0, // Allow flex shrinking
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#374151",
  },
  cardBody: {
    marginBottom: 12,
    alignItems: "center",
  },
  cardValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#F59E0B",
  },
  cardSubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: -2,
  },
  scaleContainer: {
    marginTop: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  scaleStatus: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
  },
  formulaRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 12,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 6,
  },
  formulaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  formulaText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  formulaOperator: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  formulaResult: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  formulaResultText: {
    fontWeight: "700",
  },
});
