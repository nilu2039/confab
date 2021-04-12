import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { auth } from "../firebase";
const HomeScreen: () => JSX.Element = () => {
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
            source={{
              uri: auth.currentUser?.photoURL!,
            }}
          />
          <Text style={{ marginLeft: 20, fontSize: 22, fontWeight: "bold" }}>
            Signal
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <MaterialIcons
              name="search"
              size={24}
              color="black"
              style={{ marginRight: 18 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color="black"
              style={{ marginRight: 16 }}
            />
          </TouchableOpacity>
        </View>
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
export default HomeScreen;
