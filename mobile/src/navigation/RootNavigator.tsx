import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { configureApi } from '../api/client';
import { AuthProvider, useAuth } from '../auth/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { colors } from '../theme/colors';
import { AppTabs } from './AppTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function StackRoutes() {
  const { isLoading, accessToken, refreshSession, signOut } = useAuth();

  useEffect(() => {
    if (!accessToken) return;
    configureApi({
      onUnauthorized: async () => {
        const ok = await refreshSession();
        if (!ok) {
          await signOut();
        }
      },
    });
  }, [accessToken, refreshSession, signOut]);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.gateYellow} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {accessToken ? (
        <Stack.Screen name="Main" component={AppTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
});
