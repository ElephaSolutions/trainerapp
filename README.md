# Coach Management App

A comprehensive mobile application for coaches, trainers, and tutors to manage their business efficiently. Built with React Native and Expo, this app provides complete student management, attendance tracking, and payment processing capabilities.

## Features

### 📚 Student Management
- **Add & Manage Students**: Easily onboard new students with detailed information
- **Student Profiles**: Store contact details, sport/subject, batch, and monthly fees
- **Status Tracking**: Mark students as active or inactive
- **Search & Filter**: Quickly find students by name, email, or phone

### 📅 Attendance Tracking
- **Daily Attendance**: Mark student attendance with a single tap
- **Batch Operations**: Mark all students present or absent at once
- **Attendance Summary**: View monthly attendance statistics
- **Date Navigation**: Navigate between dates to mark past or future attendance

### 💳 Payment Management
- **Payment Recording**: Record payments manually or via payment gateway
- **Multiple Payment Methods**: Support for Cash, UPI, Bank Transfer, and Card
- **Payment History**: Track all student payments with dates and amounts
- **Monthly Summary**: View revenue statistics and payment trends
- **Payment Gateway Integration**: Configure Stripe, Razorpay, or PayPal

### 📊 Dashboard
- **Business Overview**: Quick stats on students, revenue, and attendance
- **Quick Actions**: Fast access to common tasks
- **Monthly Revenue**: Track income for the current month
- **Attendance Today**: See how many students attended today

### ⚙️ Settings & Configuration
- **Profile Management**: Update coach/trainer information
- **Payment Gateway Setup**: Configure payment processors
- **Preferences**: Customize notifications and app behavior
- **Data Export**: Download your data as CSV
- **Privacy & Security**: Manage data privacy settings

## Tech Stack

- **Framework**: React Native with Expo
- **State Management**: Zustand
- **Database**: SQLite (expo-sqlite)
- **Navigation**: React Navigation
- **UI Components**: Expo Icons (Ionicons)
- **Payment Integration**: Ready for Stripe, Razorpay, PayPal

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Setup Steps

1. **Clone or navigate to the project**
   ```bash
   cd coach-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo app
   - **Web**: Press `w` in the terminal

## Project Structure

```
coach-management-app/
├── src/
│   ├── database/
│   │   └── db.js                 # SQLite database operations
│   ├── screens/
│   │   ├── LoginScreen.js        # Authentication
│   │   ├── DashboardScreen.js    # Main dashboard
│   │   ├── StudentsScreen.js     # Student list
│   │   ├── StudentDetailScreen.js # Student details
│   │   ├── AddStudentScreen.js   # Add new student
│   │   ├── AttendanceScreen.js   # Attendance marking
│   │   ├── PaymentsScreen.js     # Payment management
│   │   ├── PaymentDetailScreen.js # Payment details
│   │   └── SettingsScreen.js     # App settings
│   ├── store/
│   │   └── appStore.js           # Zustand state management
│   ├── components/               # Reusable components
│   └── utils/                    # Utility functions
├── App.js                        # Main app component
├── app.json                      # Expo configuration
└── package.json                  # Dependencies
```

## Database Schema

### Tables

**coaches**
- id, name, email, phone, specialization, business_name, created_at

**students**
- id, coach_id, name, email, phone, sport_or_subject, batch, enrollment_date, status, monthly_fee, created_at

**attendance**
- id, student_id, date, status (present/absent), notes, created_at

**payments**
- id, student_id, amount, payment_date, payment_method, status, month, notes, transaction_id, created_at

**payment_methods**
- id, coach_id, method_type, provider, api_key, is_active, created_at

## Key Features Explained

### Student Onboarding
1. Navigate to Students tab
2. Click the "+" button to add a new student
3. Fill in student details (name is required)
4. Set monthly fee for automatic revenue tracking
5. Student is automatically marked as "active"

### Attendance Marking
1. Go to Attendance tab
2. Select date using navigation arrows
3. Tap on each student to toggle present/absent
4. Use "All Present" or "All Absent" for batch operations
5. Click "Save Attendance" to record

### Payment Recording
1. Navigate to Payments tab
2. Click "+" to record a new payment
3. Select student and enter amount
4. Choose payment method (Cash, UPI, Bank, Card)
5. Add optional notes
6. Payment is recorded with timestamp

### Payment Gateway Integration
1. Go to Settings
2. Tap "Configure Payment Gateway"
3. Select provider (Stripe, Razorpay, PayPal)
4. Enter your API key
5. Payments can now be processed through the gateway

## Demo Credentials

For testing purposes:
- **Email**: demo@coach.com
- **Password**: demo123

## API Integration

### Payment Gateway Setup

#### Stripe Integration
```javascript
// In SettingsScreen.js
const stripeConfig = {
  provider: 'stripe',
  apiKey: 'sk_test_your_key_here',
};
```

#### Razorpay Integration
```javascript
const razorpayConfig = {
  provider: 'razorpay',
  apiKey: 'rzp_test_your_key_here',
};
```

#### PayPal Integration
```javascript
const paypalConfig = {
  provider: 'paypal',
  apiKey: 'your_paypal_client_id',
};
```

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## Troubleshooting

### Database Issues
- Clear app cache: `npm start -- --clear`
- Reset database: Delete the app and reinstall

### Navigation Issues
- Ensure all screen components are properly imported in App.js
- Check navigation prop is passed correctly to screens

### Payment Gateway Issues
- Verify API keys are correct
- Check internet connection
- Ensure payment provider account is active

## Future Enhancements

- [ ] Cloud backup and sync
- [ ] Advanced analytics and reports
- [ ] SMS/Email notifications
- [ ] Invoice generation and sending
- [ ] Student performance tracking
- [ ] Batch scheduling
- [ ] Multi-language support
- [ ] Offline mode with sync
- [ ] Video tutorials integration
- [ ] Student feedback system

## Support

For issues, feature requests, or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Contact support through the app

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Changelog

### Version 1.0.0
- Initial release
- Student management
- Attendance tracking
- Payment management
- Settings and configuration

---

**Built with ❤️ for coaches and trainers**
