import { StyleSheet } from "react-native";
import { COLORS } from "../../../common/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purpleMedium,
    padding: 14,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  recipeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purpleMedium,
    padding: 14,
    borderRadius: 12,
  },
  recipeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  recipeButtonSub: {
    fontSize: 10,
    color: COLORS.purpleSubtext,
    marginTop: 2,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  unitOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  unitOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  unitOptionActive: {
    backgroundColor: COLORS.purpleMedium,
  },
  unitOptionText: {
    fontSize: 13,
    color: "#666666",
  },
  unitOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  saveButton: {
    backgroundColor: COLORS.purpleMedium,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  listSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  customFoodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
  },
  customFoodInfo: {
    flex: 1,
  },
  customFoodName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  customFoodMarathi: {
    fontSize: 11,
    color: "#666666",
    marginTop: 1,
  },
  customFoodCalories: {
    fontSize: 11,
    color: COLORS.purple,
    marginTop: 2,
  },
  deleteButton: {
    padding: 6,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666666",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#999999",
    marginTop: 3,
    textAlign: "center",
  },
});
