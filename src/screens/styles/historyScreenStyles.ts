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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  allEntriesTitle: {
    marginTop: 8,
  },
  weeklySection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  chartArea: {
    position: 'relative',
    marginTop: 8,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 24,
    paddingHorizontal: 8,
  },
  goalIndicator: {
    position: 'absolute',
    left: 8,
    right: 60,
    height: 2,
    backgroundColor: '#FF7B00',
    opacity: 0.5,
    zIndex: 1,
  },
  goalText: {
    position: 'absolute',
    right: 0,
    fontSize: 11,
    fontWeight: '600',
    color: '#FF7B00',
    zIndex: 2,
  },
  barContainer: {
    alignItems: 'center',
    width: 36,
    marginHorizontal: 6,
  },
  barWrapper: {
    width: 28,
    height: 100,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: '#FF7B00',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barOverGoal: {
    backgroundColor: '#FF4444',
  },
  barUnderGoal: {
    backgroundColor: '#4CAF50',
  },
  barCalories: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  barCaloriesEmpty: {
    color: '#CCCCCC',
  },
  barDay: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  barDayToday: {
    color: '#FF7B00',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF7B00',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  historySection: {
    flex: 1,
  },
  logList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  logInfo: {
    flex: 1,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  logEntries: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  logCalories: {
    alignItems: 'flex-end',
  },
  logCalorieValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF7B00',
  },
  logCalorieLabel: {
    fontSize: 12,
    color: '#999999',
  },
  overGoal: {
    color: '#FF4444',
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
  },
  weeklyStatsSection: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  weeklyStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  weeklyStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  weeklyStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  deficitCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  surplusCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  weightLossCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  weightGainCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  weeklyStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  weeklyStatValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  deficitValue: {
    color: '#059669',
  },
  surplusValue: {
    color: '#DC2626',
  },
  weeklyStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  tooltip: {
    position: 'absolute',
    top: -80,
    left: 0,
    right: 0,
    backgroundColor: '#1F2937',
    padding: 10,
    borderRadius: 8,
    zIndex: 100,
  },
  tooltipText: {
    fontSize: 11,
    color: '#FFFFFF',
    lineHeight: 16,
  },
});
