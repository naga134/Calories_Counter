import { useContext, useState } from "react";
import { Colors, Text, View } from "react-native-ui-lib";
import { Pressable } from "react-native-gesture-handler";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { DateContext } from "@/app/_layout";
import IconSVG from "./icons/IconSVG";
import { formatDate } from "@/utils/formatDate";

export default function DateBanner() {
  const { get: currentDate, set: setDate } = useContext(DateContext) as {
    get: Date;
    set: (date: Date) => void;
  };

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (selectedDate) {
      setDatePickerVisible(false);
      setDate(selectedDate);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: Colors.grey40,
        paddingHorizontal: 24,
        paddingVertical: 12,
      }}
    >
      <Text text60L white style={{ marginTop: 8 }}>
        {formatDate(currentDate)}
      </Text>
      <Pressable onPress={() => setDatePickerVisible(true)}>
        <IconSVG width={40} height={40} name="calendar-2" color="white" />
      </Pressable>

      {isDatePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={currentDate}
          mode="date"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}
