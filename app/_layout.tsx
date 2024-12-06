import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { createContext, Suspense, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native";
import { ColorsProvider } from "@/context/ColorContext";
import { DateProvider } from "@/context/DateContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider
          useSuspense
          databaseName="appDatabase.db"
          assetSource={{
            assetId: require("@/assets/database/appDatabase.db"),
          }}
        >
          <DateProvider>
            <Suspense fallback={<Text>Loading...</Text>}>
              <Stack />
            </Suspense>
          </DateProvider>
        </SQLiteProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
