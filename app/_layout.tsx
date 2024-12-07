import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { createContext, Suspense, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native";
import { ColorsProvider } from "@/context/ColorContext";
import { DateProvider } from "@/context/DateContext";
import { Colors } from "react-native-ui-lib";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.grey70 }}>
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider
          useSuspense
          databaseName="appDatabase.db"
          assetSource={{
            assetId: require("@/assets/database/appDatabase.db"),
          }}
        >
          <DateProvider>
            <ColorsProvider>
              <Suspense fallback={<Text>Loading...</Text>}>
                <Stack
                  screenOptions={{
                    animation: "slide_from_right", // This will work for both pushing and popping
                    gestureEnabled: true, // Enable swipe gestures for popping
                  }}
                />
              </Suspense>
            </ColorsProvider>
          </DateProvider>
        </SQLiteProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
