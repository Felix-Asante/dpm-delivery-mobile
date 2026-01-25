import { RidersHomePage } from "@/modules/dashboard/parcels/riders/home";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="p-safe mx-5">
        <RidersHomePage />
      </View>
    </View>
  );
}
