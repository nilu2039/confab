import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";

interface Props {
  navigation: any;
  photo: string;
  name: string;
}

const ChatHeader: React.FC<Props> = ({ photo, name }) => {
  return (
    <View>
      <View style={styles.header}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar.Image
            size={35}
            style={{ backgroundColor: "#b58282" }}
            source={{
              uri: photo,
            }}
          />
          <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: "bold" }}>
            {name}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        ></View>
      </View>
      <View style={styles.container}>
        <StatusBar style="auto" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    marginLeft: 20,
  },
});
export default ChatHeader;
