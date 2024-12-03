import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { Text } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  <Suspense fallback={<Text>Loading...</Text>}>
    <QueryClientProvider client={queryClient}>
      <SQLiteProvider
        useSuspense
        databaseName="appDatabase.db"
        assetSource={{
          assetId: require("@/assets/database/appDatabase.db"),
        }}
      >
        return <Stack />;
      </SQLiteProvider>
    </QueryClientProvider>
  </Suspense>;
}
