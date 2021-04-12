import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, TextInput } from "react-native-paper";
import { db, auth } from "../firebase";
import Header from "./Header";
import firebase from "firebase";
interface Props {
  route: any;
}
const ChatScreen: React.FC<Props> = ({ route }) => {
  const [chat, setChat] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .doc(route.params.id)
      .collection("message")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setChat(
          snapshot.docs.map((val) => ({
            id: val.id,
            email: val.data().email,
            text: val.data().text,
          }))
        )
      );
    return unsubscribe;
  }, []);
  const sendMessage = () => {
    if (message) {
      db.collection("messages").doc(route.params.id).collection("message").add({
        email: auth.currentUser?.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        text: message,
      });
      setMessage("");
    } else alert("Enter a message");
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.conatiner}>
      <Header />
      <View style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: "#fff" }}>
          {chat.map((data: any) => (
            <View
              style={
                data.email === auth.currentUser?.email
                  ? styles.senderchat
                  : styles.receiverchat
              }
            >
              <Text
                key={data.id}
                style={
                  data.email === auth.currentUser?.email
                    ? styles.sender
                    : styles.receiver
                }
              >
                {data.text}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.input}>
          <TextInput
            multiline
            dense
            style={{
              width: Dimensions.get("window").width * 0.7,
            }}
            placeholder="Type a message..."
            label="Type a message..."
            mode="outlined"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <Button
            mode="contained"
            onPress={sendMessage}
            style={{
              marginLeft: 10,
              borderRadius: 50,
              backgroundColor: "#1744a3",
            }}
          >
            SEND
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: "#fff",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  input: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sender: {
    marginBottom: 20,
    backgroundColor: "#2C6BEE",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    color: "#fff",
  },
  receiver: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    color: "#000",
  },
  senderchat: {
    marginLeft: 20,
    marginTop: 20,

    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  receiverchat: {
    marginRight: 20,
    marginTop: 20,

    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
export default ChatScreen;
