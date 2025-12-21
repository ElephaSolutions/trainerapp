import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Payment Detail Screen - View detailed payment information
 */
const PaymentDetailScreen = ({ route, navigation }) => {
  const { paymentId } = route.params;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Details</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Payment ID</Text>
          <Text style={styles.value}>TXN-{paymentId}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.amountValue}>₹5,000</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>Cash</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Information</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>John Doe</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>john@example.com</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Download Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Share Receipt</Text>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 12,
  },
});

export default PaymentDetailScreen;
