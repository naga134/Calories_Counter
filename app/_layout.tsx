import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { Text } from "react-native";

export default function RootLayout() {
  <Suspense fallback={<Text>Loading...</Text>}>
    <SQLiteProvider
      useSuspense
      databaseName="appDatabase.db"
      assetSource={{
        assetId: require("@/assets/database/appDatabase.db"),
      }}
    >
      return <Stack />;
    </SQLiteProvider>
  </Suspense>;
}
