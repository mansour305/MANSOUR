/**
 * Root Layout — Global layout for Mawaeedak Mobile App
 * 
 * Provides:
 * - RTL support for Arabic
 * - QueryClient for data fetching
 * - Tab navigation
 * - Status bar styling
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Force RTL for Arabic language
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Query Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      gcTime: 5 * 60_000
    },
    mutations: {
      retry: 0
    }
  }
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FAF7F2' }
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="daily-card" options={{ title: 'البطاقة اليومية' }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
