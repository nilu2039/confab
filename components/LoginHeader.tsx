import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginHeader: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" />
      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
        Login
      </Text>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C6BEE",
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default LoginHeader;
