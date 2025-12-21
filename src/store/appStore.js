import { create } from 'zustand';

/**
 * Global app state management using Zustand
 * Manages: coach info, students, attendance, payments, UI state
 */
export const useAppStore = create((set, get) => ({
  // ============ COACH STATE ============
  coach: null,
  setCoach: (coach) => set({ coach }),

  // ============ STUDENTS STATE ============
  students: [],
  setStudents: (students) => set({ students }),
  addStudentToStore: (student) => set((state) => ({
    students: [...state.students, student],
  })),
  updateStudentInStore: (studentId, updatedData) => set((state) => ({
    students: state.students.map(s => s.id === studentId ? { ...s, ...updatedData } : s),
  })),
  removeStudentFromStore: (studentId) => set((state) => ({
    students: state.students.filter(s => s.id !== studentId),
  })),

  // ============ ATTENDANCE STATE ============
  attendance: [],
  setAttendance: (attendance) => set({ attendance }),
  addAttendanceRecord: (record) => set((state) => ({
    attendance: [...state.attendance, record],
  })),

  // ============ PAYMENTS STATE ============
  payments: [],
  setPayments: (payments) => set({ payments }),
  addPaymentToStore: (payment) => set((state) => ({
    payments: [...state.payments, payment],
  })),
  updatePaymentInStore: (paymentId, updatedData) => set((state) => ({
    payments: state.payments.map(p => p.id === paymentId ? { ...p, ...updatedData } : p),
  })),

  // ============ UI STATE ============
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
  successMessage: null,
  setSuccessMessage: (message) => set({ successMessage: message }),

  // ============ FILTER STATE ============
  selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM format
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  selectedStudent: null,
  setSelectedStudent: (student) => set({ selectedStudent: student }),

  // ============ UTILITY FUNCTIONS ============
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: null }),
}));

export default useAppStore;
