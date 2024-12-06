import { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import {
  ExpandableSection,
  Text,
  View,
  Colors,
  Button,
} from "react-native-ui-lib";

import IconSVG from "./icons/IconSVG";
import RotatingCaret from "./RotatingCaret";

type MealDrawerProps = {
  mealName: string;
};

type DrawerHeaderProps = {
  mealName: string;
  expanded: boolean;
};

type DrawerBodyProps = {};

export default function MealDrawer({ mealName }: MealDrawerProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ExpandableSection
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      sectionHeader={<DrawerHeader mealName={mealName} expanded={expanded} />}
    >
      <DrawerBody />
    </ExpandableSection>
  );
}

// This is the header for each meal's drawer.
// It should contain: kcals overview, meal name, caret.
function DrawerHeader({ expanded, mealName }: DrawerHeaderProps) {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={[
        styles.sectionHeader,
        {
          width: screenWidth * 0.8,
          borderBottomLeftRadius: expanded ? 0 : 10,
          borderBottomRightRadius: expanded ? 0 : 10,
        },
      ]}
    >
      <View>{/* kcals overview comes here */}</View>
      <Text grey10 text70>
        {mealName}
      </Text>
      <RotatingCaret rotated={expanded} />
    </View>
  );
}

// This is the body for each meal's drawer.
// It should contain: each food, its amount, its caloric total; "add food" button.
function DrawerBody({}: DrawerBodyProps) {
  return (
    <View style={styles.sectionBody}>
      {/* Each entry COMES HERE*/}

      {/* <Button
        backgroundColor={Colors.green70}
        iconSource={() => (
          <IconSVG name={"plus-solid"} width={16} color={Colors.green10} />
        )}
        round
        onPress={() => console.log("blip bloop")}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    height: "auto",
    backgroundColor: Colors.white,
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionBody: {
    gap: 8,
    backgroundColor: Colors.grey80,
    minHeight: 60,
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
