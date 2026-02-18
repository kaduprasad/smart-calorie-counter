import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7B00',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  form: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1A1A1A',
  },
  unitOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  unitOptionActive: {
    backgroundColor: '#FF7B00',
  },
  unitOptionText: {
    fontSize: 14,
    color: '#666666',
  },
  unitOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#FF7B00',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  customFoodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  customFoodInfo: {
    flex: 1,
  },
  customFoodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  customFoodMarathi: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  customFoodCalories: {
    fontSize: 14,
    color: '#FF7B00',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
    textAlign: 'center',
  },
});
