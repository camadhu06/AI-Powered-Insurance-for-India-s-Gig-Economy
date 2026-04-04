import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Text } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SuccessScreen from './screens/SuccessScreen';
import PlanSelect from './screens/PlanSelect';
import PaymentScreen from './screens/PaymentScreen';
import HomeScreen from './screens/HomeScreen';
import ClaimsScreen from './screens/ClaimsScreen';
import MapScreen from './screens/MapScreen';
import SupportScreen from './screens/SupportScreen';
import ProfileScreen from './screens/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
  const { worker } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111318',
          borderTopColor: '#1f2937',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#f37500',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ worker }}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏠</Text>
        }}
      />
      <Tab.Screen 
        name="Claims" 
        component={ClaimsScreen} 
        initialParams={{ worker }}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🛡️</Text>
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📍</Text>
        }}
      />
      <Tab.Screen 
        name="Support" 
        component={SupportScreen} 
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🆘</Text>
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        initialParams={{ worker }}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👤</Text>
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#08090b" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Register"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
          <Stack.Screen name="PlanSelect" component={PlanSelect} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
