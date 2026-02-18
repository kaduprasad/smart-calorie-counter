import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
      size={24} 
      color={focused ? '#FF7B00' : '#999999'} 
    />
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
      {label}
    </Text>
  </View>
);

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
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
          <TabIcon iconName="settings" focused={focused} label="Settings" />
        ),
      }}
    />
  </Tab.Navigator>
);

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
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#FF7B00',
    fontWeight: '600',
  },
});
