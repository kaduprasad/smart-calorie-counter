import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Clamp font sizes: scale down on narrow screens (<360dp), never exceed base size
const scale = (size: number) => Math.min(size, Math.round(size * Math.min(SCREEN_WIDTH / 375, 1)));

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: scale(22),
    fontWeight: '700',
    color: '#1A1A1A',
    flexShrink: 1,
  },
  subtitle: {
    fontSize: scale(12),
    color: '#666666',
    marginTop: 2,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateButton: {
    padding: 12,
  },
  dateButtonDisabled: {
    opacity: 0.3,
  },
  dateDisplay: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tapTodayText: {
    fontSize: 12,
    color: '#FF7B00',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  logSection: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#1A1A1A',
  },
  itemCount: {
    fontSize: 14,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF7B00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF7B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 12,
  },
  fabOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  } as any,
  miniFab: {
    position: 'absolute',
    bottom: 30,
    right: 28,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 11,
  } as any,
  miniFabButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF7B00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  miniFabLabel: {
    position: 'absolute',
    right: 56,
    backgroundColor: '#333333',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
