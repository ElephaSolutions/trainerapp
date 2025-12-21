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
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import useAppStore from '../store/appStore';
import {
  getPaymentsByCoach,
  getStudentsByCoach,
  addPayment,
  getPaymentSummary,
} from '../database/db';

/**
 * Payments Screen - Track and manage student payments
 * Features: payment history, add payment, payment summary, payment methods
 */
const PaymentsScreen = ({ navigation }) => {
  const coach = useAppStore((state) => state.coach);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ total: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [paymentForm, setPaymentForm] = useState({
    student_id: '',
    amount: '',
    payment_method: 'cash',
    month: selectedMonth,
    notes: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      loadPaymentData();
    }, [selectedMonth])
  );

  /**
   * Load all payment data
   */
  const loadPaymentData = async () => {
    try {
      setLoading(true);
      const coachId = coach?.id || 1;

      // Get payments
      const paymentsData = await getPaymentsByCoach(coachId);
      setPayments(paymentsData);

      // Get students
      const studentsData = await getStudentsByCoach(coachId);
      setStudents(studentsData);

      // Get summary
      const summaryData = await getPaymentSummary(coachId, selectedMonth);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading payment data:', error);
      Alert.alert('Error', 'Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle add payment
   */
  const handleAddPayment = async () => {
    if (!paymentForm.student_id || !paymentForm.amount) {
      Alert.alert('Error', 'Please select student and enter amount');
      return;
    }

    try {
      const paymentData = {
        student_id: parseInt(paymentForm.student_id),
        amount: parseFloat(paymentForm.amount),
        payment_method: paymentForm.payment_method,
        status: 'completed',
        month: paymentForm.month,
        notes: paymentForm.notes,
        transaction_id: `TXN-${Date.now()}`,
      };

      await addPayment(paymentData);
      Alert.alert('Success', 'Payment recorded successfully!');
      setShowAddPayment(false);
      setPaymentForm({
        student_id: '',
        amount: '',
        payment_method: 'cash',
        month: selectedMonth,
        notes: '',
      });
      loadPaymentData();
    } catch (error) {
      console.error('Error adding payment:', error);
      Alert.alert('Error', 'Failed to record payment');
    }
  };

  /**
   * Render payment item
   */
  const renderPaymentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.paymentCard}
      onPress={() =>
        navigation.navigate('PaymentDetail', { paymentId: item.id })
      }
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={styles.studentName}>{item.student_name}</Text>
          <Text style={styles.paymentDate}>
            {new Date(item.payment_date).toLocaleDateString('en-IN')}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'completed'
              ? styles.statusCompleted
              : styles.statusPending,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'completed'
                ? styles.statusTextCompleted
                : styles.statusTextPending,
            ]}
          >
            {item.status === 'completed' ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.paymentDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>₹{item.amount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Method</Text>
          <Text style={styles.detailValue}>{item.payment_method}</Text>
        </View>
        {item.notes && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Notes</Text>
            <Text style={styles.detailValue}>{item.notes}</Text>
          </View>
        )}
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

  const monthlyPayments = payments.filter(
    (p) => p.payment_date.slice(0, 7) === selectedMonth
  );

  return (
    <View style={styles.container}>
      {/* Header with Add Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddPayment(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.summaryScroll}
        contentContainerStyle={styles.summaryContent}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="wallet" size={28} color="#9C27B0" />
          </View>
          <Text style={styles.summaryValue}>₹{summary.total?.toFixed(0) || 0}</Text>
          <Text style={styles.summaryLabel}>This Month</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
          </View>
          <Text style={styles.summaryValue}>{summary.count || 0}</Text>
          <Text style={styles.summaryLabel}>Transactions</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="trending-up" size={28} color="#FF9800" />
          </View>
          <Text style={styles.summaryValue}>
            ₹{(summary.total / (summary.count || 1)).toFixed(0) || 0}
          </Text>
          <Text style={styles.summaryLabel}>Avg Payment</Text>
        </View>
      </ScrollView>

      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <TouchableOpacity
          onPress={() => {
            const date = new Date(selectedMonth);
            date.setMonth(date.getMonth() - 1);
            setSelectedMonth(date.toISOString().slice(0, 7));
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {new Date(selectedMonth + '-01').toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        <TouchableOpacity
          onPress={() => {
            const date = new Date(selectedMonth);
            date.setMonth(date.getMonth() + 1);
            setSelectedMonth(date.toISOString().slice(0, 7));
          }}
        >
          <Ionicons name="chevron-forward" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Payments List */}
      {monthlyPayments.length > 0 ? (
        <FlatList
          data={monthlyPayments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="card-outline" size={60} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>No Payments</Text>
          <Text style={styles.emptyDescription}>
            No payments recorded for this month
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setShowAddPayment(true)}
          >
            <Ionicons name="add-circle" size={24} color="#007AFF" />
            <Text style={styles.emptyButtonText}>Record Payment</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Payment Modal */}
      <Modal
        visible={showAddPayment}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddPayment(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Payment</Text>
              <TouchableOpacity onPress={() => setShowAddPayment(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              {/* Student Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Select Student *</Text>
                <View style={styles.pickerContainer}>
                  {students.map((student) => (
                    <TouchableOpacity
                      key={student.id}
                      style={[
                        styles.pickerOption,
                        paymentForm.student_id === student.id.toString() &&
                          styles.pickerOptionSelected,
                      ]}
                      onPress={() =>
                        setPaymentForm({
                          ...paymentForm,
                          student_id: student.id.toString(),
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          paymentForm.student_id === student.id.toString() &&
                            styles.pickerOptionTextSelected,
                        ]}
                      >
                        {student.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Amount */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Amount (₹) *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter amount"
                  value={paymentForm.amount}
                  onChangeText={(value) =>
                    setPaymentForm({ ...paymentForm, amount: value })
                  }
                  keyboardType="decimal-pad"
                  placeholderTextColor="#C7C7CC"
                />
              </View>

              {/* Payment Method */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Payment Method</Text>
                <View style={styles.methodContainer}>
                  {['cash', 'upi', 'bank', 'card'].map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.methodButton,
                        paymentForm.payment_method === method &&
                          styles.methodButtonSelected,
                      ]}
                      onPress={() =>
                        setPaymentForm({
                          ...paymentForm,
                          payment_method: method,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.methodButtonText,
                          paymentForm.payment_method === method &&
                            styles.methodButtonTextSelected,
                        ]}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputMultiline]}
                  placeholder="Add notes (optional)"
                  value={paymentForm.notes}
                  onChangeText={(value) =>
                    setPaymentForm({ ...paymentForm, notes: value })
                  }
                  multiline={true}
                  numberOfLines={3}
                  placeholderTextColor="#C7C7CC"
                />
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddPayment(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleAddPayment}
              >
                <Text style={styles.modalSubmitButtonText}>Record Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  summaryScroll: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  summaryContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  summaryCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    width: 140,
    alignItems: 'center',
  },
  summaryIconContainer: {
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: '#4CAF50',
  },
  statusTextPending: {
    color: '#FF9800',
  },
  paymentDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  modalForm: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#F9F9F9',
  },
  formInputMultiline: {
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    maxHeight: 200,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  pickerOptionSelected: {
    backgroundColor: '#E3F2FD',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#000',
  },
  pickerOptionTextSelected: {
    fontWeight: '600',
    color: '#007AFF',
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  methodButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  methodButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  methodButtonTextSelected: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  modalSubmitButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default PaymentsScreen;
