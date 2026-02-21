import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HomeScreen,
  AddFoodScreen,
  HistoryScreen,
  CustomDishScreen,
  SettingsScreen,
} from '../screens';

type RootStackParamList = {
  MainTabs: undefined;
  AddFood: undefined;
};

type TabParamList = {
  Home: undefined;
  History: undefined;
  Custom: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

type IconName = 'home' | 'stats-chart' | 'star' | 'settings';

const TabIcon: React.FC<{ iconName: IconName; focused: boolean; label: string }> = ({
  iconName,
  focused,
  label,
}) => (
  <View style={styles.tabIconContainer}>
    <Ionicons 
      name={focused ? iconName : `${iconName}-outline` as any} 
      size={22} 
      color={focused ? '#FF7B00' : '#999999'} 
    />
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const MainTabs: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 56 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 6,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="home" focused={focused} label="Home" />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="stats-chart" focused={focused} label="History" />
          ),
        }}
      />
      <Tab.Screen
        name="Custom"
        component={CustomDishScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="star" focused={focused} label="Custom" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="settings" focused={focused} label="Setti..." />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="AddFood"
        component={AddFoodScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  tabLabel: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#FF7B00',
    fontWeight: '600',
  },
});
