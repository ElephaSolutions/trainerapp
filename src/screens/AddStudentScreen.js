import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '../store/appStore';
import { addStudent } from '../database/db';

/**
 * Add Student Screen - Form to add new student
 * Collects: name, email, phone, sport/subject, batch, monthly fee
 */
const AddStudentScreen = ({ navigation }) => {
  const coach = useAppStore((state) => state.coach);
  const addStudentToStore = useAppStore((state) => state.addStudentToStore);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sport_or_subject: '',
    batch: '',
    monthly_fee: '',
  });

  /**
   * Handle form input change
   */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Student name is required');
      return false;
    }
    if (formData.email && !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const coachId = coach?.id || 1;
      const studentData = {
        coach_id: coachId,
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        sport_or_subject: formData.sport_or_subject.trim() || null,
        batch: formData.batch.trim() || null,
        monthly_fee: parseFloat(formData.monthly_fee) || 0,
      };

      const result = await addStudent(studentData);
      
      // Add to store
      addStudentToStore({
        id: result.insertId,
        ...studentData,
        status: 'active',
        enrollment_date: new Date().toISOString(),
      });

      Alert.alert('Success', 'Student added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('Error', 'Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Icon */}
        <View style={styles.headerIcon}>
          <Ionicons name="person-add" size={60} color="#007AFF" />
        </View>

        <Text style={styles.title}>Add New Student</Text>
        <Text style={styles.subtitle}>
          Fill in the details below to add a new student
        </Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="person" size={20} color="#8E8E93" />
              <TextInput
                style={styles.input}
                placeholder="Student's full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                editable={!loading}
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="mail" size={20} color="#8E8E93" />
              <TextInput
                style={styles.input}
                placeholder="student@email.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="call" size={20} color="#8E8E93" />
              <TextInput
                style={styles.input}
                placeholder="10-digit phone number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                editable={!loading}
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          {/* Sport/Subject Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sport / Subject</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="book" size={20} color="#8E8E93" />
              <TextInput
                style={styles.input}
                placeholder="e.g., Cricket, Badminton, Mathematics"
                value={formData.sport_or_subject}
                onChangeText={(value) =>
                  handleInputChange('sport_or_subject', value)
                }
                editable={!loading}
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          {/* Batch Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Batch / Class</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="layers" size={20} color="#8E8E93" />
              <TextInput
                style={styles.input}
                placeholder="e.g., Batch A, Class 10"
                value={formData.batch}
                onChangeText={(value) => handleInputChange('batch', value)}
                editable={!loading}
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          {/* Monthly Fee Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monthly Fee (₹)</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="wallet" size={20} color="#8E8E93" />
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.monthly_fee}
                onChangeText={(value) => handleInputChange('monthly_fee', value)}
                keyboardType="decimal-pad"
                editable={!loading}
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              Fields marked with * are required. You can update other details later.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Add Student</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#000',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 12,
    color: '#1976D2',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddStudentScreen;
