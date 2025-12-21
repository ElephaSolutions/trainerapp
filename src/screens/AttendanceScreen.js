import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '../store/appStore';
import { getStudentsByCoach, markAttendance, getAttendanceByDate } from '../database/db';

/**
 * Attendance Screen - Mark and track student attendance
 * Features: daily attendance marking, attendance summary, batch operations
 */
const AttendanceScreen = ({ navigation }) => {
  const coach = useAppStore((state) => state.coach);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAttendanceData();
  }, [selectedDate]);

  /**
   * Load students and their attendance for selected date
   */
  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const coachId = coach?.id || 1;
      
      // Get all active students
      const studentsList = await getStudentsByCoach(coachId);
      const activeStudents = studentsList.filter((s) => s.status === 'active');
      setStudents(activeStudents);

      // Get attendance for selected date
      const attendanceData = await getAttendanceByDate(coachId, selectedDate);
      const attendanceMap = {};
      attendanceData.forEach((record) => {
        attendanceMap[record.student_id] = record.status;
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error loading attendance data:', error);
      Alert.alert('Error', 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle attendance status for a student
   */
  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  /**
   * Mark all students as present
   */
  const markAllPresent = () => {
    const newAttendance = {};
    students.forEach((student) => {
      newAttendance[student.id] = 'present';
    });
    setAttendance(newAttendance);
  };

  /**
   * Mark all students as absent
   */
  const markAllAbsent = () => {
    const newAttendance = {};
    students.forEach((student) => {
      newAttendance[student.id] = 'absent';
    });
    setAttendance(newAttendance);
  };

  /**
   * Save attendance records
   */
  const saveAttendance = async () => {
    if (Object.keys(attendance).length === 0) {
      Alert.alert('Info', 'No attendance marked for this date');
      return;
    }

    setSaving(true);
    try {
      for (const [studentId, status] of Object.entries(attendance)) {
        await markAttendance(parseInt(studentId), selectedDate, status, '');
      }
      Alert.alert('Success', 'Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      Alert.alert('Error', 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Get previous date
   */
  const getPreviousDate = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  /**
   * Get next date
   */
  const getNextDate = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  /**
   * Render attendance item
   */
  const renderAttendanceItem = ({ item }) => {
    const isPresent = attendance[item.id] === 'present';
    const isMarked = item.id in attendance;

    return (
      <TouchableOpacity
        style={[
          styles.attendanceItem,
          isMarked && (isPresent ? styles.itemPresent : styles.itemAbsent),
        ]}
        onPress={() => toggleAttendance(item.id)}
      >
        <View style={styles.itemContent}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentBatch}>{item.batch || 'No batch'}</Text>
        </View>

        <View
          style={[
            styles.statusIndicator,
            isPresent ? styles.statusPresent : styles.statusAbsent,
          ]}
        >
          <Ionicons
            name={isPresent ? 'checkmark' : 'close'}
            size={20}
            color="#FFFFFF"
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'absent').length;

  return (
    <View style={styles.container}>
      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={getPreviousDate} style={styles.dateButton}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>
            {new Date(selectedDate).toLocaleDateString('en-IN', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        <TouchableOpacity onPress={getNextDate} style={styles.dateButton}>
          <Ionicons name="chevron-forward" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Present</Text>
          <Text style={[styles.summaryValue, styles.presentValue]}>
            {presentCount}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Absent</Text>
          <Text style={[styles.summaryValue, styles.absentValue]}>
            {absentCount}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>{students.length}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={markAllPresent}
        >
          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
          <Text style={styles.quickActionText}>All Present</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={markAllAbsent}
        >
          <Ionicons name="close-circle" size={18} color="#F44336" />
          <Text style={styles.quickActionText}>All Absent</Text>
        </TouchableOpacity>
      </View>

      {/* Attendance List */}
      {students.length > 0 ? (
        <FlatList
          data={students}
          renderItem={renderAttendanceItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color="#C7C7CC" />
          <Text style={styles.emptyText}>No active students</Text>
        </View>
      )}

      {/* Save Button */}
      {students.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={saveAttendance}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="save" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Attendance</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  dateButton: {
    padding: 8,
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  presentValue: {
    color: '#4CAF50',
  },
  absentValue: {
    color: '#F44336',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginLeft: 6,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E5EA',
  },
  itemPresent: {
    borderLeftColor: '#4CAF50',
    backgroundColor: '#F1F8F6',
  },
  itemAbsent: {
    borderLeftColor: '#F44336',
    backgroundColor: '#FEF5F5',
  },
  itemContent: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  studentBatch: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
  },
  statusPresent: {
    backgroundColor: '#4CAF50',
  },
  statusAbsent: {
    backgroundColor: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AttendanceScreen;
