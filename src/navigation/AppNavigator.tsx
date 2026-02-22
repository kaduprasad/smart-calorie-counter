import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HomeScreen,
  AddFoodScreen,
  HistoryScreen,
  CustomDishScreen,
  HealthScreen,
  SettingsScreen,
} from '../screens';

type HomeStackParamList = {
  HomeMain: undefined;
  AddFood: undefined;
};

type TabParamList = {
  Home: undefined;
  History: undefined;
  Custom: undefined;
  Health: undefined;
  Settings: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

type IconName = 'home' | 'stats-chart' | 'star' | 'heart' | 'settings';

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

// Home stack with AddFood nested inside
const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="AddFood" component={AddFoodScreen} />
  </HomeStack.Navigator>
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
        component={HomeStackNavigator}
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
        name="Health"
        component={HealthScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="heart" focused={focused} label="Health" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="settings" focused={focused} label="Settings" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <MainTabs />
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
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
