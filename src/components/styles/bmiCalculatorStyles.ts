import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  inputSection: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    minWidth: 180,
    maxWidth: 200,
  },
  unit: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    width: 30,
  },
  saveButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  savedValue: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
  weightProgressSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  weightProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weightStat: {
    alignItems: "center",
    flex: 1,
  },
  weightStatLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  weightStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  weightStatDate: {
    fontSize: 10,
    color: "#D1D5DB",
    marginTop: 2,
  },
  weightChangeStat: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 8,
  },
  weightChangeValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  weightChangePercent: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  bmiResultSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  bmiTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  bmiValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 4,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: "800",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryDescription: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  bmiScaleContainer: {
    marginBottom: 16,
  },
  bmiScale: {
    height: 12,
    borderRadius: 6,
    flexDirection: "row",
    overflow: "hidden",
    position: "relative",
  },
  bmiZone: {
    height: "100%",
  },
  bmiUnderweight: {
    flex: 14,
    backgroundColor: "#3B82F6",
  },
  bmiNormal: {
    flex: 26,
    backgroundColor: "#10B981",
  },
  bmiOverweight: {
    flex: 20,
    backgroundColor: "#F59E0B",
  },
  bmiObese: {
    flex: 40,
    backgroundColor: "#EF4444",
  },
  bmiIndicator: {
    position: "absolute",
    top: -4,
    marginLeft: -8,
  },
  bmiIndicatorTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#1F2937",
  },
  bmiLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingHorizontal: 2,
  },
  bmiLabel: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  healthyRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  healthyRangeText: {
    fontSize: 13,
    color: "#047857",
    fontWeight: "500",
  },
  noDataContainer: {
    alignItems: "center",
    paddingVertical: 24,
    marginTop: 16,
  },
  noDataText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
});
