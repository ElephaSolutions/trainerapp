import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStudentById, getPaymentsByStudent, getAttendanceByStudent, deleteStudent } from '../database/db';
import useAppStore from '../store/appStore';

/**
 * Student Detail Screen - View and manage individual student
 * Shows: student info, attendance summary, payment history
 */
const StudentDetailScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const removeStudentFromStore = useAppStore((state) => state.removeStudentFromStore);
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentDetails();
  }, []);

  /**
   * Load student details, payments, and attendance
   */
  const loadStudentDetails = async () => {
    try {
      setLoading(true);
      const studentData = await getStudentById(studentId);
      const paymentsData = await getPaymentsByStudent(studentId);
      
      // Get attendance for current month
      const currentMonth = new Date().toISOString().slice(0, 7);
      const startDate = `${currentMonth}-01`;
      const endDate = `${currentMonth}-31`;
      const attendanceData = await getAttendanceByStudent(studentId, startDate, endDate);

      setStudent(studentData);
      setPayments(paymentsData);
      setAttendance(attendanceData);
    } catch (error) {
      console.error('Error loading student details:', error);
      Alert.alert('Error', 'Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle delete student
   */
  const handleDeleteStudent = () => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student? This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteStudent(studentId);
              removeStudentFromStore(studentId);
              Alert.alert('Success', 'Student deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete student');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Student not found</Text>
      </View>
    );
  }

  const attendanceStats = {
    present: attendance.filter((a) => a.status === 'present').length,
    absent: attendance.filter((a) => a.status === 'absent').length,
    total: attendance.length,
  };

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Student Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#007AFF" />
        </View>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentSubject}>{student.sport_or_subject}</Text>
        <View
          style={[
            styles.statusBadge,
            student.status === 'active'
              ? styles.statusActive
              : styles.statusInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              student.status === 'active'
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            {student.status === 'active' ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        {student.email && (
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{student.email}</Text>
            </View>
          </View>
        )}
        {student.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{student.phone}</Text>
            </View>
          </View>
        )}
        {student.batch && (
          <View style={styles.infoRow}>
            <Ionicons name="layers" size={20} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Batch</Text>
              <Text style={styles.infoValue}>{student.batch}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Attendance Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Attendance (This Month)</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{attendanceStats.present}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{attendanceStats.absent}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{attendanceStats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.paymentSummary}>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Monthly Fee</Text>
            <Text style={styles.paymentValue}>₹{student.monthly_fee}</Text>
          </View>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Total Paid</Text>
            <Text style={styles.paymentValue}>₹{totalPaid.toFixed(2)}</Text>
          </View>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Payments</Text>
            <Text style={styles.paymentValue}>{payments.length}</Text>
          </View>
        </View>

        {payments.length > 0 && (
          <View style={styles.recentPayments}>
            <Text style={styles.recentTitle}>Recent Payments</Text>
            {payments.slice(0, 3).map((payment) => (
              <View key={payment.id} style={styles.paymentRow}>
                <View>
                  <Text style={styles.paymentDate}>
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.paymentMethod}>{payment.payment_method}</Text>
                </View>
                <Text style={styles.paymentAmount}>₹{payment.amount}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="pencil" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Edit Student</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-text" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>View Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteStudent}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            Delete Student
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  studentSubject: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusInactive: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#4CAF50',
  },
  statusTextInactive: {
    color: '#F44336',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  paymentSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentItem: {
    flex: 1,
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  recentPayments: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  paymentDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 12,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  deleteButtonText: {
    color: '#F44336',
  },
});

export default StudentDetailScreen;
