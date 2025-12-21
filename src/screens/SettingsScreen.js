import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '../store/appStore';

/**
 * Settings Screen - Configure app settings and payment methods
 * Features: profile settings, payment gateway configuration, notifications, about
 */
const SettingsScreen = ({ navigation }) => {
  const coach = useAppStore((state) => state.coach);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState({
    provider: 'stripe',
    apiKey: '',
  });

  /**
   * Handle payment gateway configuration
   */
  const handleSavePaymentGateway = () => {
    if (!paymentGateway.apiKey) {
      Alert.alert('Error', 'Please enter API key');
      return;
    }

    Alert.alert('Success', 'Payment gateway configured successfully!');
    setShowPaymentModal(false);
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => {
          // Clear user data and navigate to login
          Alert.alert('Logged out', 'You have been logged out successfully');
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Ionicons name="person-circle" size={60} color="#007AFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{coach?.business_name || 'Coach'}</Text>
            <Text style={styles.profileEmail}>{coach?.email || 'email@example.com'}</Text>
            <Text style={styles.profileSpecialization}>
              {coach?.specialization || 'Specialization'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="person" size={20} color="#007AFF" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Edit Profile</Text>
              <Text style={styles.settingDescription}>Update your information</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="lock-closed" size={20} color="#007AFF" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Change Password</Text>
              <Text style={styles.settingDescription}>Update your password</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {/* Payment Methods Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowPaymentModal(true)}
        >
          <View style={styles.settingContent}>
            <Ionicons name="card" size={20} color="#9C27B0" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Configure Payment Gateway</Text>
              <Text style={styles.settingDescription}>
                Setup Stripe, Razorpay, or PayPal
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="wallet" size={20} color="#9C27B0" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Payment Methods</Text>
              <Text style={styles.settingDescription}>
                Manage your payment options
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="receipt" size={20} color="#9C27B0" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Invoice Settings</Text>
              <Text style={styles.settingDescription}>
                Customize invoice templates
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="notifications" size={20} color="#FF9800" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive payment and attendance alerts
              </Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#E5E5EA', true: '#81C784' }}
            thumbColor={notifications ? '#4CAF50' : '#F5F5F5'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="moon" size={20} color="#FF9800" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Enable dark theme
              </Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#E5E5EA', true: '#81C784' }}
            thumbColor={darkMode ? '#4CAF50' : '#F5F5F5'}
          />
        </View>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="language" size={20} color="#FF9800" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingDescription}>English</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {/* Data & Privacy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="download" size={20} color="#4CAF50" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Export Data</Text>
              <Text style={styles.settingDescription}>
                Download your data as CSV
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                Read our privacy policy
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="document-text" size={20} color="#4CAF50" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
              <Text style={styles.settingDescription}>
                Read our terms and conditions
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Coach Manager</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutDescription}>
            Manage your coaching business efficiently with student tracking,
            attendance management, and payment processing.
          </Text>
        </View>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="help-circle" size={20} color="#2196F3" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingDescription}>
                Get help and contact support
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Ionicons name="star" size={20} color="#2196F3" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Rate App</Text>
              <Text style={styles.settingDescription}>
                Rate us on app store
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="#F44336" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Gateway Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configure Payment Gateway</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Payment Provider</Text>
                <View style={styles.providerContainer}>
                  {['stripe', 'razorpay', 'paypal'].map((provider) => (
                    <TouchableOpacity
                      key={provider}
                      style={[
                        styles.providerButton,
                        paymentGateway.provider === provider &&
                          styles.providerButtonSelected,
                      ]}
                      onPress={() =>
                        setPaymentGateway({
                          ...paymentGateway,
                          provider,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.providerButtonText,
                          paymentGateway.provider === provider &&
                            styles.providerButtonTextSelected,
                        ]}
                      >
                        {provider.charAt(0).toUpperCase() + provider.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>API Key</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter your API key"
                  value={paymentGateway.apiKey}
                  onChangeText={(value) =>
                    setPaymentGateway({
                      ...paymentGateway,
                      apiKey: value,
                    })
                  }
                  secureTextEntry={true}
                  placeholderTextColor="#C7C7CC"
                />
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#007AFF" />
                <Text style={styles.infoText}>
                  Your API key is encrypted and stored securely. Never share your
                  API key with anyone.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleSavePaymentGateway}
              >
                <Text style={styles.modalSubmitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  profileSpecialization: {
    fontSize: 12,
    color: '#8E8E93',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#8E8E93',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    paddingVertical: 14,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
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
  providerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  providerButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  providerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  providerButtonTextSelected: {
    color: '#FFFFFF',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 12,
    color: '#1976D2',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
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

export default SettingsScreen;
