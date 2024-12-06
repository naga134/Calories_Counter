import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { createContext, Suspense, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native";

const queryClient = new QueryClient();

interface DateContextType {
  get: Date;
  set: React.Dispatch<React.SetStateAction<Date>>;
}

export const DateContext = createContext<DateContextType>({
  get: new Date(),
  set: () => {},
});

export default function RootLayout() {
  const [date, setDate] = useState(new Date());

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
          <DateContext.Provider value={{ get: date, set: setDate }}>
            <Suspense fallback={<Text>Loading...</Text>}>
              <Stack />
            </Suspense>
          </DateContext.Provider>
        </SQLiteProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
