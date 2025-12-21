import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { initializeDatabase } from './src/database/db';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import StudentsScreen from './src/screens/StudentsScreen';
import StudentDetailScreen from './src/screens/StudentDetailScreen';
import AddStudentScreen from './src/screens/AddStudentScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import PaymentsScreen from './src/screens/PaymentsScreen';
import PaymentDetailScreen from './src/screens/PaymentDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Dashboard Tab Navigator - Main navigation for authenticated users
 * Contains tabs for Dashboard, Students, Attendance, Payments, and Settings
 */
function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Students') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Payments') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#F2F2F7',
          borderTopColor: '#E5E5EA',
          borderTopWidth: 1,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Students" 
        component={StudentsNavigator}
        options={{ headerShown: false, title: 'Students' }}
      />
      <Tab.Screen 
        name="Attendance" 
        component={AttendanceScreen}
        options={{ title: 'Attendance' }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsNavigator}
        options={{ headerShown: false, title: 'Payments' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

/**
 * Students Stack Navigator - Handles student list and detail views
 */
function StudentsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F2F2F7',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="StudentsList" 
        component={StudentsScreen}
        options={{ title: 'Students' }}
      />
      <Stack.Screen 
        name="StudentDetail" 
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
      />
      <Stack.Screen 
        name="AddStudent" 
        component={AddStudentScreen}
        options={{ title: 'Add Student' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Payments Stack Navigator - Handles payment list and detail views
 */
function PaymentsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F2F2F7',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="PaymentsList" 
        component={PaymentsScreen}
        options={{ title: 'Payments' }}
      />
      <Stack.Screen 
        name="PaymentDetail" 
        component={PaymentDetailScreen}
        options={{ title: 'Payment Details' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Root App Component
 * Initializes database and manages authentication state
 */
export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  useEffect(() => {
    // Initialize database on app startup
    const initDB = async () => {
      try {
        await initializeDatabase();
        setIsReady(true);
        // Check if user is already logged in (would be stored in AsyncStorage in production)
        setIsLoggedIn(true); // For demo purposes
      } catch (error) {
        console.error('Database initialization error:', error);
        setIsReady(true);
      }
    };

    initDB();
  }, []);

  if (!isReady) {
    return null; // Show splash screen while initializing
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen 
            name="MainApp" 
            component={DashboardTabs}
            options={{ animationEnabled: false }}
          />
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ animationEnabled: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
