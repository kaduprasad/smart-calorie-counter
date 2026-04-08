import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { accountStyles } from './styles/accountSectionStyles';
import { useSettings } from '../../context/SettingsContext';
import { COLORS } from '../../common/colors';

export const AccountSection: React.FC = () => {
  const { user, isSigningIn, signIn, signOut } = useAuth();
  const { gender } = useSettings();

  const isFemale = gender === 'female';
  const accentColor = isFemale ? COLORS.female : COLORS.male;
  const accentBg = isFemale ? COLORS.femaleLight : COLORS.maleLight;

  return (
    <View style={accountStyles.container}>
      {/* Header — same pattern as Your Profile */}
      <View style={accountStyles.header}>
        <View style={[accountStyles.iconContainer, { backgroundColor: accentBg }]}>
          <Ionicons name="person-circle" size={24} color={accentColor} />
        </View>
        <View>
          <Text style={accountStyles.title}>Account</Text>
          <Text style={accountStyles.subtitle}>
            {user ? user.email : 'Sign in for cloud features'}
          </Text>
        </View>
      </View>

      {user ? (
        <View>
          <View style={accountStyles.profileRow}>
            {user.photo ? (
              <Image source={{ uri: user.photo }} style={accountStyles.avatar} />
            ) : (
              <View style={[accountStyles.avatarPlaceholder, { backgroundColor: accentBg }]}>
                <Ionicons name="person" size={24} color={accentColor} />
              </View>
            )}
            <View style={accountStyles.profileInfo}>
              <Text style={accountStyles.profileName}>{user.name || 'User'}</Text>
              <Text style={accountStyles.profileEmail}>{user.email}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          </View>
          <TouchableOpacity style={accountStyles.signOutBtn} onPress={signOut} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={16} color="#EF4444" />
            <Text style={accountStyles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={accountStyles.description}>
            Sign in with Google to enable future features like cloud backup and sync.
          </Text>
          <TouchableOpacity
            style={[accountStyles.signInBtn, { backgroundColor: accentColor }]}
            onPress={signIn}
            disabled={isSigningIn}
            activeOpacity={0.8}
          >
            {isSigningIn ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Image
                  source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                  style={accountStyles.googleIcon}
                />
                <Text style={accountStyles.signInText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={accountStyles.optional}>Optional — app works fully without sign-in</Text>
        </View>
      )}
    </View>
  );
};
