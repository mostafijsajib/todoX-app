import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, radius, space, font, shadowPresets } from '../../constants/Theme';

/**
 * StudyBlockCard Component
 * Displays a study block in the timetable with modern design
 */
const StudyBlockCard = ({ block, subject, onPress, isActive = false }) => {
  const blockColor = subject?.color || palette.primary[500];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View
        style={[
          styles.card,
          { borderLeftColor: blockColor, borderLeftWidth: 4 },
          isActive && [styles.cardActive, { shadowColor: blockColor }],
        ]}
      >
        <View style={styles.header}>
          <View style={styles.subjectInfo}>
            {subject && (
              <View style={[styles.iconContainer, { backgroundColor: blockColor + '20' }]}>
                <Ionicons name={subject.icon || 'book-outline'} size={16} color={blockColor} />
              </View>
            )}
            <Text style={[styles.subjectName, { color: blockColor }]} numberOfLines={1}>
              {subject?.name || 'Study Block'}
            </Text>
          </View>
          {isActive && (
            <View style={[styles.activeBadge, { backgroundColor: palette.success[500] }]}>
              <View style={styles.liveDot} />
              <Text style={styles.activeText}>Now</Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={14} color={palette.gray[500]} />
            <Text style={styles.detailText}>
              {block.startTime} - {block.endTime}
            </Text>
          </View>

          {block.location && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={14} color={palette.gray[500]} />
              <Text style={styles.detailText} numberOfLines={1}>{block.location}</Text>
            </View>
          )}
        </View>

        {block.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {block.notes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: space[2],
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: space[4],
    ...shadowPresets.sm,
  },
  cardActive: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space[3],
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    flex: 1,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[2],
    paddingVertical: space[1],
    borderRadius: radius.full,
    gap: space[1],
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  activeText: {
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    color: '#FFFFFF',
  },
  details: {
    gap: space[2],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  detailText: {
    fontSize: font.size.sm,
    color: palette.gray[600],
    flex: 1,
  },
  notes: {
    fontSize: font.size.sm,
    color: palette.gray[500],
    marginTop: space[3],
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

export default StudyBlockCard;
