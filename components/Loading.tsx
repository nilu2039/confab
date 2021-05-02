import React from "react";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface Props {
  loading: boolean;
}
const Loading: React.FC<Props> = ({ loading }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator animating={loading} color="black" size="large" />
    </View>
  );
};

export default Loading;
