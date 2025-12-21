import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '../store/appStore';
import {
  getStudentsByCoach,
  getPaymentSummary,
  getAttendanceByDate,
} from '../database/db';

const { width } = Dimensions.get('window');

/**
 * Dashboard Screen - Main overview of coach's business
 * Shows: total students, monthly revenue, attendance stats, recent payments
 */
const DashboardScreen = ({ navigation }) => {
  const coach = useAppStore((state) => state.coach);
  const [stats, setStats] = useState({
    totalStudents: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    attendanceToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load all dashboard statistics
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const coachId = coach?.id || 1; // Default to 1 for demo

      // Get total students
      const students = await getStudentsByCoach(coachId);

      // Get monthly revenue
      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthlySummary = await getPaymentSummary(coachId, currentMonth);

      // Get today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = await getAttendanceByDate(coachId, today);

      setStats({
        totalStudents: students.length,
        monthlyRevenue: monthlySummary.total || 0,
        totalRevenue: students.reduce((sum, s) => sum + (s.monthly_fee || 0), 0),
        attendanceToday: todayAttendance.length,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.coachName}>{coach?.business_name || 'Coach'}</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="person-circle" size={50} color="#007AFF" />
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Total Students Card */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Students')}
        >
          <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="people" size={28} color="#007AFF" />
          </View>
          <Text style={styles.statValue}>{stats.totalStudents}</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </TouchableOpacity>

        {/* Monthly Revenue Card */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Payments')}
        >
          <View style={[styles.statIconContainer, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="wallet" size={28} color="#9C27B0" />
          </View>
          <Text style={styles.statValue}>₹{stats.monthlyRevenue.toFixed(0)}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </TouchableOpacity>

        {/* Attendance Today Card */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Attendance')}
        >
          <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
          </View>
          <Text style={styles.statValue}>{stats.attendanceToday}</Text>
          <Text style={styles.statLabel}>Present Today</Text>
        </TouchableOpacity>

        {/* Potential Revenue Card */}
        <TouchableOpacity style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="trending-up" size={28} color="#FF9800" />
          </View>
          <Text style={styles.statValue}>₹{stats.totalRevenue.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Potential Monthly</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Students', { screen: 'AddStudent' })}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="person-add" size={24} color="#007AFF" />
            </View>
            <Text style={styles.actionLabel}>Add Student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Attendance')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="checkmark-done" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.actionLabel}>Mark Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Payments')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="card" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.actionLabel}>Record Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Students')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="list" size={24} color="#FF9800" />
            </View>
            <Text style={styles.actionLabel}>View Students</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>

        <View style={styles.infoCard}>
          <Ionicons name="people-outline" size={24} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Student Management</Text>
            <Text style={styles.infoDescription}>
              Add, edit, and manage student information and enrollment
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Attendance Tracking</Text>
            <Text style={styles.infoDescription}>
              Mark daily attendance and view attendance reports
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="card-outline" size={24} color="#9C27B0" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Payment Management</Text>
            <Text style={styles.infoDescription}>
              Track payments, integrate payment gateways, and manage invoices
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="settings-outline" size={24} color="#FF9800" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Settings & Configuration</Text>
            <Text style={styles.infoDescription}>
              Configure payment methods and manage your profile
            </Text>
          </View>
        </View>
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
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  coachName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 32) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 40) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 18,
  },
});

export default DashboardScreen;
