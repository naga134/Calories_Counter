import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider
          useSuspense
          databaseName="appDatabase.db"
          assetSource={{
            assetId: require("@/assets/database/appDatabase.db"),
          }}
        >
          <GestureHandlerRootView>
            <Stack />
          </GestureHandlerRootView>
        </SQLiteProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
