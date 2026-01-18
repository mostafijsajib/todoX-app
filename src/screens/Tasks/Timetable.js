import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { palette, radius, space, font, shadowPresets } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import StudyBlockCard from '../../components/Timetable/StudyBlockCard';
import StudyBlockFormModal from '../../components/Timetable/StudyBlockFormModal';
import { useSchedule } from '../../hooks';

const { width } = Dimensions.get('window');
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

/**
 * Timetable Screen - Weekly study schedule view with modern design
 */
const Timetable = () => {
  const studyBlocks = useSelector((state) => state.schedule?.study_blocks || []);
  const subjects = useSelector((state) => state.subject?.subjects || []);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const { loadStudyBlocksFromStorage, getCurrentBlock } = useSchedule();

  useEffect(() => {
    loadStudyBlocksFromStorage();
  }, []);

  /**
   * Get blocks for selected day
   */
  const getBlocksForDay = (dayOfWeek) => {
    return studyBlocks
      .filter(block => block.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  /**
   * Get subject by ID
   */
  const getSubject = (subjectId) => {
    return subjects.find(s => s.id === subjectId);
  };

  /**
   * Check if time slot is current
   */
  const isCurrentTime = (hour) => {
    const now = new Date();
    const currentHour = now.getHours();
    return now.getDay() === selectedDay && currentHour === hour;
  };

  /**
   * Handle block press
   */
  const handleBlockPress = (block) => {
    setEditingBlock(block);
    setShowBlockForm(true);
  };

  /**
   * Handle add block
   */
  const handleAddBlock = (time = null) => {
    setEditingBlock(null);
    setSelectedTime(time);
    setShowBlockForm(true);
  };

  /**
   * Get total study hours for selected day
   */
  const getTotalStudyHours = () => {
    const blocks = getBlocksForDay(selectedDay);
    let totalMinutes = 0;
    blocks.forEach(block => {
      const start = parseInt(block.startTime.split(':')[0]) * 60 + parseInt(block.startTime.split(':')[1] || 0);
      const end = parseInt(block.endTime.split(':')[0]) * 60 + parseInt(block.endTime.split(':')[1] || 0);
      totalMinutes += end - start;
    });
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  /**
   * Render day tabs
   */
  const renderDayTabs = () => (
    <View style={styles.dayTabsWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayTabsContainer}
      >
        {DAYS.map((day, index) => {
          const isToday = new Date().getDay() === index;
          const isSelected = selectedDay === index;
          const blocksCount = getBlocksForDay(index).length;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayTab,
                isSelected && styles.dayTabSelected,
              ]}
              onPress={() => setSelectedDay(index)}
              activeOpacity={0.7}
            >
              {isSelected ? (
                <LinearGradient
                  colors={[palette.primary[500], palette.primary[600]]}
                  style={styles.dayTabGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.dayTabTextSelected}>{day}</Text>
                  {blocksCount > 0 && (
                    <View style={styles.dayBadgeSelected}>
                      <Text style={styles.dayBadgeTextSelected}>{blocksCount}</Text>
                    </View>
                  )}
                </LinearGradient>
              ) : (
                <View style={[styles.dayTabContent, isToday && styles.dayTabToday]}>
                  <Text style={[styles.dayTabText, isToday && styles.dayTabTextToday]}>
                    {day}
                  </Text>
                  {blocksCount > 0 && (
                    <View style={[styles.dayBadge, isToday && styles.dayBadgeToday]}>
                      <Text style={[styles.dayBadgeText, isToday && styles.dayBadgeTextToday]}>
                        {blocksCount}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  /**
   * Render time slot
   */
  const renderTimeSlot = (hour) => {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;

    // Find blocks that START in this time slot
    const blocksInSlot = getBlocksForDay(selectedDay).filter(block => {
      const blockStart = parseInt(block.startTime.split(':')[0]);
      return blockStart === hour;
    });

    const isCurrent = isCurrentTime(hour);

    return (
      <View key={hour} style={styles.timeSlot}>
        <View style={styles.timeLabel}>
          <Text style={[styles.timeLabelText, isCurrent && styles.timeLabelCurrent]}>
            {timeString}
          </Text>
          {isCurrent && <View style={styles.currentDot} />}
        </View>

        <View style={styles.timeSlotContent}>
          {isCurrent && <View style={styles.currentTimeIndicator} />}

          {blocksInSlot.length > 0 ? (
            blocksInSlot.map(block => {
              const subject = getSubject(block.subjectId);
              const currentBlock = getCurrentBlock();
              const isActive = currentBlock && currentBlock.id === block.id;

              return (
                <StudyBlockCard
                  key={block.id}
                  block={block}
                  subject={subject}
                  onPress={() => handleBlockPress(block)}
                  isActive={isActive}
                />
              );
            })
          ) : (
            <TouchableOpacity
              style={styles.emptySlot}
              onPress={() => handleAddBlock(timeString)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={18} color={palette.gray[300]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  /**
   * Render header
   */
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>{FULL_DAYS[selectedDay]}</Text>
        <View style={styles.headerStats}>
          <Ionicons name="book-outline" size={14} color={palette.gray[500]} />
          <Text style={styles.headerSubtitle}>
            {getBlocksForDay(selectedDay).length} blocks • {getTotalStudyHours()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddBlock()}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[palette.primary[500], palette.primary[600]]}
          style={styles.addButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="calendar-outline" size={48} color={palette.gray[300]} />
      </View>
      <Text style={styles.emptyTitle}>No study blocks yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button to add your first study block for {FULL_DAYS[selectedDay]}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => handleAddBlock()}
        activeOpacity={0.7}
      >
        <Text style={styles.emptyButtonText}>Add Study Block</Text>
      </TouchableOpacity>
    </View>
  );

  const dayBlocks = getBlocksForDay(selectedDay);

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderDayTabs()}

      {dayBlocks.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          style={styles.timeline}
          contentContainerStyle={styles.timelineContent}
          showsVerticalScrollIndicator={false}
        >
          {HOURS.map(hour => renderTimeSlot(hour))}
        </ScrollView>
      )}

      {/* Study Block Form Modal */}
      <StudyBlockFormModal
        visible={showBlockForm}
        onClose={() => {
          setShowBlockForm(false);
          setEditingBlock(null);
          setSelectedTime(null);
        }}
        block={editingBlock}
        selectedDay={selectedDay}
        selectedTime={selectedTime}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space[5],
    paddingTop: space[4],
    paddingBottom: space[2],
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: font.size['2xl'],
    fontWeight: font.weight.bold,
    color: palette.gray[900],
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    marginTop: space[1],
  },
  headerSubtitle: {
    fontSize: font.size.sm,
    color: palette.gray[500],
  },
  addButton: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadowPresets.md,
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayTabsWrapper: {
    paddingVertical: space[3],
  },
  dayTabsContainer: {
    paddingHorizontal: space[5],
    gap: space[2],
  },
  dayTab: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  dayTabContent: {
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    alignItems: 'center',
    minWidth: 56,
    ...shadowPresets.sm,
  },
  dayTabGradient: {
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    alignItems: 'center',
    minWidth: 56,
  },
  dayTabSelected: {},
  dayTabToday: {
    borderWidth: 2,
    borderColor: palette.primary[500],
  },
  dayTabText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: palette.gray[600],
  },
  dayTabTextSelected: {
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: '#FFFFFF',
  },
  dayTabTextToday: {
    color: palette.primary[600],
  },
  dayBadge: {
    backgroundColor: palette.gray[100],
    paddingHorizontal: space[2],
    paddingVertical: 2,
    borderRadius: radius.full,
    marginTop: space[1],
    minWidth: 20,
    alignItems: 'center',
  },
  dayBadgeSelected: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: space[2],
    paddingVertical: 2,
    borderRadius: radius.full,
    marginTop: space[1],
    minWidth: 20,
    alignItems: 'center',
  },
  dayBadgeToday: {
    backgroundColor: palette.primary[100],
  },
  dayBadgeText: {
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    color: palette.gray[600],
  },
  dayBadgeTextSelected: {
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    color: '#FFFFFF',
  },
  dayBadgeTextToday: {
    color: palette.primary[600],
  },
  timeline: {
    flex: 1,
  },
  timelineContent: {
    paddingHorizontal: space[5],
    paddingBottom: 120,
  },
  timeSlot: {
    flexDirection: 'row',
    minHeight: 70,
    marginBottom: space[1],
  },
  timeLabel: {
    width: 56,
    alignItems: 'flex-end',
    paddingRight: space[3],
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space[1],
  },
  timeLabelText: {
    fontSize: font.size.xs,
    color: palette.gray[400],
    fontWeight: font.weight.medium,
  },
  timeLabelCurrent: {
    color: palette.error[500],
    fontWeight: font.weight.bold,
  },
  currentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.error[500],
  },
  timeSlotContent: {
    flex: 1,
    position: 'relative',
    borderLeftWidth: 1,
    borderLeftColor: palette.gray[200],
    paddingLeft: space[3],
    minHeight: 60,
  },
  emptySlot: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.gray[200],
    borderRadius: radius.lg,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
    backgroundColor: palette.gray[50],
  },
  currentTimeIndicator: {
    position: 'absolute',
    left: -4,
    right: 0,
    top: 0,
    height: 2,
    backgroundColor: palette.error[500],
    zIndex: 10,
    borderRadius: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space[8],
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: palette.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: space[4],
  },
  emptyTitle: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: palette.gray[800],
    marginBottom: space[2],
  },
  emptySubtitle: {
    fontSize: font.size.md,
    color: palette.gray[500],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: space[6],
  },
  emptyButton: {
    backgroundColor: palette.primary[500],
    paddingHorizontal: space[6],
    paddingVertical: space[3],
    borderRadius: radius.xl,
  },
  emptyButtonText: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: '#FFFFFF',
  },
});

export default Timetable;
