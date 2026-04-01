import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Toast from 'react-native-toast-message';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <ErrorBoundary>
      <RootNavigator />
      <StatusBar style="light" />
      <Toast position="top" topOffset={54} />
    </ErrorBoundary>
  );
}
