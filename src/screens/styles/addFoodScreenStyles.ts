import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF7B00',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 60,
  },
  recentSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  recentList: {
    paddingHorizontal: 12,
  },
  recentItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  recentCalories: {
    fontSize: 12,
    color: '#FF7B00',
  },
  recentQuickAdd: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  recentQuickAddLabel: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 4,
  },
  recentQuickAddButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  recentQuickBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    minWidth: 28,
    alignItems: 'center',
  },
  recentQuickBtnHovered: {
    backgroundColor: '#FFE0B2',
  },
  recentQuickBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
  },
  recentQuickBtnTextHovered: {
    color: '#FF7B00',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultCount: {
    fontSize: 14,
    color: '#666666',
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
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
    paddingHorizontal: 20,
  },
  // Online Search Styles
  searchOnlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FF7B00',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    minWidth: 180,
  },
  searchOnlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  onlineNote: {
    fontSize: 12,
    color: '#999999',
    marginTop: 12,
    textAlign: 'center',
  },
  onlineSection: {
    flex: 1,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  onlineResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  onlineResultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
  },
  onlineResultInfo: {
    flex: 1,
    marginRight: 12,
  },
  onlineResultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  onlineResultBrand: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  onlineResultSource: {
    fontSize: 10,
    color: '#999999',
    marginTop: 4,
  },
  onlineResultCalories: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  onlineResultCalorieValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  onlineResultCalorieUnit: {
    fontSize: 10,
    color: '#66BB6A',
  },
  backToLocalButton: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToLocalText: {
    fontSize: 14,
    color: '#FF7B00',
    fontWeight: '600',
  },
});
