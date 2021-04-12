import React, { useState } from "react";
import { View, Text, SafeAreaView, Image, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { auth } from "../firebase";
import uuid from "react-native-uuid";
interface Props {
  navigation: any;
}
const Register: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const registerUser = async () => {
    const seed = uuid.v4();
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user?.updateProfile({
          displayName: name,
          photoURL:
            photo || `https://avatars.dicebear.com/api/male/${seed}.png`,
        });
      })
      .catch((err) => alert(err.message));
    if (auth.currentUser) {
      navigation.navigate("ChatArea");
    }
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text>
        <SafeAreaView style={styles.container}>
          <Text style={styles.text}>Create a signal account</Text>
          <View>
            <TextInput
              dense
              mode="outlined"
              placeholder="Name"
              value={name}
              label="Name"
              onChangeText={(text) => setName(text)}
              style={{ width: 300 }}
            />
            <TextInput
              dense
              mode="outlined"
              placeholder="Email"
              value={email}
              label="Email"
              onChangeText={(text) => setEmail(text)}
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
              style={{ width: 300, marginTop: 20 }}
            />
            <TextInput
              dense
              secureTextEntry={true}
              mode="outlined"
              placeholder="Enter a picture URL(Optional)"
              value={photo}
              label="Enter a picture URL(Optional)"
              onChangeText={(text) => setPhoto(text)}
              style={{ width: 300, marginTop: 20, marginBottom: 20 }}
            />
          </View>
          <View>
            <Button mode="contained" color="#2C6BEE" onPress={registerUser}>
              Register
            </Button>
          </View>
          <View style={{ height: 100 }}></View>
        </SafeAreaView>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
    color: "#2C6BEE",
    fontWeight: "bold",
    marginBottom: 30,
  },
});
export default Register;
