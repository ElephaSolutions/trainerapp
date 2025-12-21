# Quick Start Guide - Coach Management App

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd coach-management-app
npm install
```

### Step 2: Start the Development Server
```bash
npm start
```

You'll see a QR code in the terminal.

### Step 3: Run on Your Device

**Option A: Physical Device**
- Install Expo Go app from App Store or Google Play
- Scan the QR code with your phone camera
- App opens in Expo Go

**Option B: iOS Simulator (Mac only)**
- Press `i` in the terminal
- Simulator opens automatically

**Option C: Android Emulator**
- Press `a` in the terminal
- Emulator opens automatically

**Option D: Web Browser**
- Press `w` in the terminal
- Opens in your default browser

## 📱 First Time Setup

### Login
- Email: `demo@coach.com`
- Password: `demo123`

### Add Your First Student
1. Tap **Students** tab
2. Tap **+** button
3. Fill in student details
4. Tap **Add Student**

### Mark Attendance
1. Tap **Attendance** tab
2. Tap on each student to mark present/absent
3. Tap **Save Attendance**

### Record Payment
1. Tap **Payments** tab
2. Tap **+** button
3. Select student and amount
4. Tap **Record Payment**

## 🎯 Main Features

| Feature | Location | How to Use |
|---------|----------|-----------|
| Dashboard | Home tab | View business overview |
| Students | Students tab | Manage student list |
| Attendance | Attendance tab | Mark daily attendance |
| Payments | Payments tab | Record student payments |
| Settings | Settings tab | Configure app |

## 🔧 Configuration

### Payment Gateway Setup
1. Go to **Settings**
2. Tap **Configure Payment Gateway**
3. Select provider (Stripe/Razorpay/PayPal)
4. Enter API key
5. Tap **Save**

### Profile Settings
1. Go to **Settings**
2. Tap **Edit Profile**
3. Update your information
4. Save changes

## 📊 Dashboard Overview

The dashboard shows:
- **Total Students**: Number of active students
- **Monthly Revenue**: Income this month
- **Present Today**: Attendance count
- **Potential Monthly**: Expected revenue

## 💾 Data Storage

All data is stored locally on your device:
- Students information
- Attendance records
- Payment history
- Settings and preferences

No internet required for basic operations!

## 🆘 Troubleshooting

### App Won't Start
```bash
npm start -- --clear
```

### Database Issues
- Uninstall and reinstall the app
- Clear app cache

### Navigation Issues
- Make sure you're on the latest version
- Restart the app

## 📚 Full Documentation

See **README.md** for:
- Complete feature list
- Project structure
- Database schema
- API integration guide
- Advanced configuration

## 🎓 Learning the Code

### Key Files to Explore
1. **App.js** - Navigation structure
2. **src/database/db.js** - Database operations
3. **src/store/appStore.js** - State management
4. **src/screens/** - All screen components

### Code Comments
Every file has detailed comments explaining:
- What the code does
- Why it's implemented that way
- How to modify it

## 🚀 Next Steps

1. **Customize**: Update colors, fonts, and branding
2. **Add Features**: Extend with new functionality
3. **Deploy**: Build for App Store and Google Play
4. **Integrate**: Connect payment gateways
5. **Scale**: Add cloud backend

## 📞 Need Help?

1. Check the **README.md** for detailed documentation
2. Review code comments in the files
3. Check **PROJECT_SUMMARY.md** for architecture overview
4. Look at screen components for UI patterns

## 🎉 You're Ready!

Your coach management app is ready to use. Start by:
1. Adding some students
2. Marking attendance
3. Recording payments
4. Exploring all features

Enjoy managing your coaching business! 🎓

---

**Happy Coding! 💻**
