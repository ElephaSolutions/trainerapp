import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import useAppStore from '../store/appStore';
import { getStudentsByCoach } from '../database/db';

const { width } = Dimensions.get('window');

/**
 * Students Screen - List all students with search and filter
 * Allows viewing, adding, and managing students
 */
const StudentsScreen = ({ navigation }) => {
  const coach = useAppStore((state) => state.coach);
  const students = useAppStore((state) => state.students);
  const setStudents = useAppStore((state) => state.setStudents);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive

  // Load students when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadStudents();
    }, [])
  );

  /**
   * Load all students for the coach
   */
  const loadStudents = async () => {
    try {
      setLoading(true);
      const coachId = coach?.id || 1;
      const studentsList = await getStudentsByCoach(coachId);
      setStudents(studentsList);
      filterStudents(studentsList, searchQuery, filterStatus);
    } catch (error) {
      console.error('Error loading students:', error);
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter students based on search query and status
   */
  const filterStudents = (studentsList, query, status) => {
    let filtered = studentsList;

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter((s) => s.status === status);
    }

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.email?.toLowerCase().includes(query.toLowerCase()) ||
          s.phone?.includes(query)
      );
    }

    setFilteredStudents(filtered);
  };

  /**
   * Handle search input change
   */
  const handleSearch = (text) => {
    setSearchQuery(text);
    filterStudents(students, text, filterStatus);
  };

  /**
   * Handle status filter change
   */
  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    filterStudents(students, searchQuery, status);
  };

  /**
   * Render individual student card
   */
  const renderStudentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}
    >
      <View style={styles.studentHeader}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentSubject}>{item.sport_or_subject}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'active'
              ? styles.statusActive
              : styles.statusInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'active'
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            {item.status === 'active' ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.studentDetails}>
        {item.email && (
          <View style={styles.detailRow}>
            <Ionicons name="mail" size={14} color="#8E8E93" />
            <Text style={styles.detailText}>{item.email}</Text>
          </View>
        )}
        {item.phone && (
          <View style={styles.detailRow}>
            <Ionicons name="call" size={14} color="#8E8E93" />
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
        )}
        {item.monthly_fee > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="wallet" size={14} color="#8E8E93" />
            <Text style={styles.detailText}>₹{item.monthly_fee}/month</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="chevron-forward" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Add Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Students</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddStudent')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#C7C7CC"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === 'all' && styles.filterTabActive,
          ]}
          onPress={() => handleStatusFilter('all')}
        >
          <Text
            style={[
              styles.filterTabText,
              filterStatus === 'all' && styles.filterTabTextActive,
            ]}
          >
            All ({students.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === 'active' && styles.filterTabActive,
          ]}
          onPress={() => handleStatusFilter('active')}
        >
          <Text
            style={[
              styles.filterTabText,
              filterStatus === 'active' && styles.filterTabTextActive,
            ]}
          >
            Active ({students.filter((s) => s.status === 'active').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === 'inactive' && styles.filterTabActive,
          ]}
          onPress={() => handleStatusFilter('inactive')}
        >
          <Text
            style={[
              styles.filterTabText,
              filterStatus === 'inactive' && styles.filterTabTextActive,
            ]}
          >
            Inactive ({students.filter((s) => s.status === 'inactive').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          renderItem={renderStudentCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>No Students Found</Text>
          <Text style={styles.emptyDescription}>
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'Add your first student to get started'}
          </Text>
          {!searchQuery && (
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AddStudent')}
            >
              <Ionicons name="add-circle" size={24} color="#007AFF" />
              <Text style={styles.emptyButtonText}>Add Student</Text>
            </TouchableOpacity>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#000',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  studentSubject: {
    fontSize: 13,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusInactive: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#4CAF50',
  },
  statusTextInactive: {
    color: '#F44336',
  },
  studentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  actionIcon: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default StudentsScreen;
