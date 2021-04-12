import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity } from "react-native";

const CameraPencil: React.FC = () => {
  return (
    <View>
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          display: "flex",
          height: 700,
          marginLeft: 320,
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity>
          <Entypo
            onPress={() => console.log("camera")}
            name="camera"
            size={24}
            color="gray"
            style={{
              marginBottom: 20,
              backgroundColor: "#FFF",
              padding: 15,
              borderRadius: 50,
              elevation: 8,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons
            onPress={() => console.log("pencil")}
            name="pencil"
            size={24}
            color="white"
            style={{
              backgroundColor: "#2C6BEE",
              padding: 15,
              borderRadius: 50,
              elevation: 8,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraPencil;
