import { useNavigation } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { Colors, Text, View } from "react-native-ui-lib";

export default function FoodsList() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View
        style={{
          flexDirection: "row",
          height: 64,
          borderRadius: 100,
          backgroundColor: Colors.white,
          // justifyContent: "center",
          alignItems: "center",
          paddingStart: 10,
        }}
      >
        <View
          style={{
            height: 48,
            width: 48,
            borderRadius: 100,
            backgroundColor: Colors.purple50,
          }}
        ></View>
        {/* <Text white>adasd</Text> */}
      </View>
    </ScrollView>
  );
}
