import { RidersHomePage } from "@/modules/dashboard/parcels/riders/home";
import { ScrollView, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-white"
      nestedScrollEnabled
    >
      <View className="p-safe mx-5">
        <RidersHomePage />
      </View>
    </ScrollView>
  );
}
