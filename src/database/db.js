import * as SQLite from 'expo-sqlite';

// Open or create the database
const db = SQLite.openDatabase('coach_management.db');

/**
 * Initialize database with all required tables
 * Creates tables for: coaches, students, attendance, payments, payment_methods
 */
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Coaches table - stores coach/trainer information
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS coaches (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          specialization TEXT,
          business_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        [],
        () => console.log('Coaches table created'),
        (_, error) => console.error('Error creating coaches table:', error)
      );

      // Students table - stores student/client information
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          coach_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          sport_or_subject TEXT,
          batch TEXT,
          enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'active',
          monthly_fee REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (coach_id) REFERENCES coaches(id)
        );`,
        [],
        () => console.log('Students table created'),
        (_, error) => console.error('Error creating students table:', error)
      );

      // Attendance table - tracks student attendance
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS attendance (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          date DATE NOT NULL,
          status TEXT DEFAULT 'present',
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id),
          UNIQUE(student_id, date)
        );`,
        [],
        () => console.log('Attendance table created'),
        (_, error) => console.error('Error creating attendance table:', error)
      );

      // Payments table - tracks payment transactions
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          payment_method TEXT,
          status TEXT DEFAULT 'completed',
          month TEXT,
          notes TEXT,
          transaction_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id)
        );`,
        [],
        () => console.log('Payments table created'),
        (_, error) => console.error('Error creating payments table:', error)
      );

      // Payment Methods table - stores payment gateway configurations
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS payment_methods (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          coach_id INTEGER NOT NULL,
          method_type TEXT,
          provider TEXT,
          api_key TEXT,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (coach_id) REFERENCES coaches(id)
        );`,
        [],
        () => console.log('Payment methods table created'),
        (_, error) => console.error('Error creating payment methods table:', error)
      );
    }, reject, resolve);
  });
};

/**
 * Execute a SELECT query
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} - Promise resolving to query results
 */
export const executeQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result.rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

/**
 * Execute an INSERT/UPDATE/DELETE query
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} - Promise resolving to insert ID or affected rows
 */
export const executeUpdate = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

// ============ COACH OPERATIONS ============

/**
 * Add a new coach
 */
export const addCoach = async (coachData) => {
  const { name, email, phone, specialization, business_name } = coachData;
  const sql = `INSERT INTO coaches (name, email, phone, specialization, business_name) 
               VALUES (?, ?, ?, ?, ?)`;
  return executeUpdate(sql, [name, email, phone, specialization, business_name]);
};

/**
 * Get coach by ID
 */
export const getCoachById = async (coachId) => {
  const sql = `SELECT * FROM coaches WHERE id = ?`;
  const results = await executeQuery(sql, [coachId]);
  return results[0] || null;
};

// ============ STUDENT OPERATIONS ============

/**
 * Add a new student
 */
export const addStudent = async (studentData) => {
  const { coach_id, name, email, phone, sport_or_subject, batch, monthly_fee } = studentData;
  const sql = `INSERT INTO students (coach_id, name, email, phone, sport_or_subject, batch, monthly_fee) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  return executeUpdate(sql, [coach_id, name, email, phone, sport_or_subject, batch, monthly_fee]);
};

/**
 * Get all students for a coach
 */
export const getStudentsByCoach = async (coachId) => {
  const sql = `SELECT * FROM students WHERE coach_id = ? ORDER BY name ASC`;
  return executeQuery(sql, [coachId]);
};

/**
 * Get student by ID
 */
export const getStudentById = async (studentId) => {
  const sql = `SELECT * FROM students WHERE id = ?`;
  const results = await executeQuery(sql, [studentId]);
  return results[0] || null;
};

/**
 * Update student information
 */
export const updateStudent = async (studentId, studentData) => {
  const { name, email, phone, sport_or_subject, batch, monthly_fee, status } = studentData;
  const sql = `UPDATE students SET name = ?, email = ?, phone = ?, sport_or_subject = ?, 
               batch = ?, monthly_fee = ?, status = ? WHERE id = ?`;
  return executeUpdate(sql, [name, email, phone, sport_or_subject, batch, monthly_fee, status, studentId]);
};

/**
 * Delete a student
 */
export const deleteStudent = async (studentId) => {
  const sql = `DELETE FROM students WHERE id = ?`;
  return executeUpdate(sql, [studentId]);
};

// ============ ATTENDANCE OPERATIONS ============

/**
 * Mark attendance for a student
 */
export const markAttendance = async (studentId, date, status, notes = '') => {
  const sql = `INSERT OR REPLACE INTO attendance (student_id, date, status, notes) 
               VALUES (?, ?, ?, ?)`;
  return executeUpdate(sql, [studentId, date, status, notes]);
};

/**
 * Get attendance for a student in a date range
 */
export const getAttendanceByStudent = async (studentId, startDate, endDate) => {
  const sql = `SELECT * FROM attendance WHERE student_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC`;
  return executeQuery(sql, [studentId, startDate, endDate]);
};

/**
 * Get attendance summary for a student
 */
export const getAttendanceSummary = async (studentId, month) => {
  const sql = `SELECT status, COUNT(*) as count FROM attendance 
               WHERE student_id = ? AND strftime('%Y-%m', date) = ? 
               GROUP BY status`;
  return executeQuery(sql, [studentId, month]);
};

/**
 * Get all attendance for a date (for batch marking)
 */
export const getAttendanceByDate = async (coachId, date) => {
  const sql = `SELECT a.*, s.name FROM attendance a 
               JOIN students s ON a.student_id = s.id 
               WHERE s.coach_id = ? AND a.date = ? 
               ORDER BY s.name ASC`;
  return executeQuery(sql, [coachId, date]);
};

// ============ PAYMENT OPERATIONS ============

/**
 * Add a payment record
 */
export const addPayment = async (paymentData) => {
  const { student_id, amount, payment_method, status, month, notes, transaction_id } = paymentData;
  const sql = `INSERT INTO payments (student_id, amount, payment_method, status, month, notes, transaction_id) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  return executeUpdate(sql, [student_id, amount, payment_method, status, month, notes, transaction_id]);
};

/**
 * Get payments for a student
 */
export const getPaymentsByStudent = async (studentId) => {
  const sql = `SELECT * FROM payments WHERE student_id = ? ORDER BY payment_date DESC`;
  return executeQuery(sql, [studentId]);
};

/**
 * Get all payments for a coach
 */
export const getPaymentsByCoach = async (coachId) => {
  const sql = `SELECT p.*, s.name as student_name FROM payments p 
               JOIN students s ON p.student_id = s.id 
               WHERE s.coach_id = ? 
               ORDER BY p.payment_date DESC`;
  return executeQuery(sql, [coachId]);
};

/**
 * Get payment summary for a coach (monthly revenue)
 */
export const getPaymentSummary = async (coachId, month) => {
  const sql = `SELECT SUM(amount) as total, COUNT(*) as count FROM payments p 
               JOIN students s ON p.student_id = s.id 
               WHERE s.coach_id = ? AND strftime('%Y-%m', p.payment_date) = ? AND p.status = 'completed'`;
  const results = await executeQuery(sql, [coachId, month]);
  return results[0] || { total: 0, count: 0 };
};

/**
 * Get pending payments for a coach
 */
export const getPendingPayments = async (coachId) => {
  const sql = `SELECT p.*, s.name as student_name FROM payments p 
               JOIN students s ON p.student_id = s.id 
               WHERE s.coach_id = ? AND p.status = 'pending' 
               ORDER BY p.payment_date ASC`;
  return executeQuery(sql, [coachId]);
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (paymentId, status) => {
  const sql = `UPDATE payments SET status = ? WHERE id = ?`;
  return executeUpdate(sql, [status, paymentId]);
};

// ============ PAYMENT METHOD OPERATIONS ============

/**
 * Add payment method configuration
 */
export const addPaymentMethod = async (coachId, methodData) => {
  const { method_type, provider, api_key } = methodData;
  const sql = `INSERT INTO payment_methods (coach_id, method_type, provider, api_key) 
               VALUES (?, ?, ?, ?)`;
  return executeUpdate(sql, [coachId, method_type, provider, api_key]);
};

/**
 * Get payment methods for a coach
 */
export const getPaymentMethods = async (coachId) => {
  const sql = `SELECT * FROM payment_methods WHERE coach_id = ? AND is_active = 1`;
  return executeQuery(sql, [coachId]);
};

/**
 * Update payment method
 */
export const updatePaymentMethod = async (methodId, methodData) => {
  const { method_type, provider, api_key, is_active } = methodData;
  const sql = `UPDATE payment_methods SET method_type = ?, provider = ?, api_key = ?, is_active = ? WHERE id = ?`;
  return executeUpdate(sql, [method_type, provider, api_key, is_active, methodId]);
};

export default db;
