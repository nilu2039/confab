import React, { useState } from "react";
import { View, Image, StyleSheet, SafeAreaView, LogBox } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { auth } from "../firebase";
import LoginHeader from "./LoginHeader";
interface Props {
  navigation: any;
}
const Login: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState<string>("");
  const [register, setRegister] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  LogBox.ignoreLogs(["Setting a timer"]);
  const loginUser = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("ChatArea");
      } else {
        alert("No user found");
      }
    });
  };
  const registerUser = () => {
    navigation.navigate("PhoneRegister");
  };
  return (
    <>
      <LoginHeader />
      <SafeAreaView style={styles.container}>
        <Image
          style={{ width: 250, height: 250 }}
          source={{
            uri:
              "https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png",
          }}
        />
        <View>
          <TextInput
            dense
            mode="outlined"
            placeholder="Name"
            value={name}
            label="Name"
            onChangeText={(text) => setName(text)}
            style={{ width: 300, marginTop: 20 }}
          />
          <TextInput
            dense
            mode="outlined"
            placeholder="Email"
            label="Email"
            value={register}
            onChangeText={(text) => setRegister(text)}
            style={{ width: 300, marginTop: 20 }}
          />
          <TextInput
            dense
            secureTextEntry={true}
            mode="outlined"
            placeholder="Password"
            value={password}
            label="Password"
            onChangeText={(text) => setPassword(text)}
            style={{ width: 300, marginTop: 20, marginBottom: 20 }}
          />
        </View>
        <View>
          <Button
            mode="outlined"
            color="#2C6BEE"
            style={{ marginBottom: 20 }}
            onPress={loginUser}
          >
            Login
          </Button>
          <Button mode="contained" color="#2C6BEE" onPress={registerUser}>
            Register
          </Button>
        </View>
        <View style={{ height: 100 }}></View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Login;
