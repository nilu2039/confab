import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { db, auth } from "../firebase";
import firebase from "firebase";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import Clipboard from "expo-clipboard";
import ChatHeader from "./ChatHedaer";
interface Props {
  navigation?: any;
  route?: any;
}
var uuid: string;
var counter: string = "";
var add: string = "";
var add2: string = "";
const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const [chat, setChat] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const dummy = useRef<FlatList>(null);
  useEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .doc("chats")
      .collection("chat")
      .doc(route.params.chatId)
      .collection("message")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setChat(
          snapshot.docs.map((val) => ({
            id: val.id,
            phoneNumber: val.data().phoneNumber,
            text: val.data().text,
            name: val.data().name,
          }))
        )
      );
    return unsubscribe;
  }, []);
  const sendMessage = async () => {
    const promise = new Promise((resolve, reject) => {
      db.collection("messages")
        .doc("chats")
        .collection("chat")
        .onSnapshot((snapshot) => {
          for (let i = 0; i <= snapshot.docs.length; i++) {
            if (snapshot?.docs[i]?.id == route.params.chatId) {
              resolve(0);
              break;
            }
          }
          resolve(1);
        });
    });
    promise.then(async (val) => {
      if (val != 0) {
        await db
          .collection("messages")
          .doc("chats")
          .collection("chat")
          .doc(route.params.chatId)
          .set({
            number: "Hello",
          });
      }
      if (message) {
        db.collection("messages")
          .doc("chats")
          .collection("chat")
          .doc(route.params.chatId)
          .collection("message")
          .add({
            name: auth.currentUser?.displayName,
            phoneNumber: auth.currentUser?.phoneNumber,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            text: message,
          });
        setMessage("");
        dummy.current?.scrollToEnd();
      }
    });
    await db
      .collection("messages")
      .doc("main")
      .collection("message")
      .doc(route.params.user)
      .collection("number")
      .where("title", "in", [route.params.number])
      .get()
      .then((snapshot) => {
        snapshot.docs.map((val) => {
          add2 = val.id;
        });
      });

    if (add2 == "") {
      let photo: string = "";
      await db
        .collection("messages")
        .doc("phone")
        .collection("number")
        .where("phoneNumber", "in", [route.params.number])
        .get()
        .then((val) => {
          val.docs.map((data) => {
            photo = data.data().profilePhoto;
          });
        });
      db.collection("messages")
        .doc("main")
        .collection("message")
        .doc(route.params.user)
        .collection("number")
        .add({
          phoneNumber: auth.currentUser?.phoneNumber,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          title: route.params.number,
          name: route.params.chatName,
          subtitle: `Hello ${route.params.chatName}`,
          groupCreator: "",
          uid: "",
          type: "external",
          chatId: route.params.chatId,
          photo: route.params.photo,
        });
    }
    await db
      .collection("messages")
      .doc("main")
      .collection("message")
      .doc(route.params.number)
      .collection("number")
      .where("title", "in", [route.params.user])
      .get()
      .then((val) => {
        val.docs.map((data) => {
          counter = data.id;
        });
      });

    if (counter == "") {
      let photo: string = "";
      await db
        .collection("messages")
        .doc("phone")
        .collection("number")
        .where("phoneNumber", "in", [route.params.user])
        .get()
        .then((val) => {
          val.docs.map((data) => {
            photo = data.data().profilePhoto;
          });
        });
      db.collection("messages")
        .doc("main")
        .collection("message")
        .doc(route.params.number)
        .collection("number")
        .add({
          phoneNumber: auth.currentUser?.phoneNumber,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          title: auth.currentUser?.phoneNumber,
          name: auth.currentUser?.displayName,
          subtitle: `Hello ${auth.currentUser?.displayName}`,
          groupCreator: "",
          uid: "",
          type: "external",
          chatId: route.params.chatId,
          photo: photo,
        });
      await db
        .collection("messages")
        .doc("main")
        .collection("message")
        .doc(route.params.user)
        .collection("number")
        .where("title", "in", [route.params.number])
        .get()
        .then((val) => {
          val.docs.map((data) => {
            uuid = data.id;
          });
        });

      db.collection("messages")
        .doc("main")
        .collection("message")
        .doc(route.params.user)
        .collection("number")
        .doc(uuid)
        .update({
          chatId: route.params.chatId,
        });
    }
  };
  const down = () => {
    dummy.current?.scrollToEnd();
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.conatiner}>
      <ChatHeader
        navigation={navigation}
        photo={route.params.photo}
        name={route.params.name}
      />
      {route.params.uid ? (
        <View style={styles.idTextContainer}>
          <View style={styles.idText}>
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 13.5,
                fontWeight: "700",
              }}
            >
              ID: {route.params.uid}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(route.params.uid);
              }}
            >
              <Ionicons name="md-copy-outline" size={21} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <></>
      )}
      <View style={{ flex: 1 }}>
        <FlatList
          onLayout={() => dummy.current?.scrollToEnd()}
          onContentSizeChange={() => dummy.current?.scrollToEnd()}
          ref={dummy}
          keyExtractor={(item) => item.id}
          data={chat}
          renderItem={({ item }) => (
            <View
              style={
                item.phoneNumber === auth.currentUser?.phoneNumber
                  ? styles.senderchat
                  : styles.receiverchat
              }
            >
              <Text
                style={{
                  backgroundColor: "#a7c2fc",
                  borderRadius: 5,
                  padding: 1,
                  marginBottom: 5,
                  borderColor: "#000",
                  borderWidth: 0.65,
                }}
              >
                {item.name ? item.name : item.phoneNumber}
              </Text>
              <Text
                style={
                  item.phoneNumber === auth.currentUser?.phoneNumber
                    ? styles.sender
                    : styles.receiver
                }
              >
                {item.text}
              </Text>
            </View>
          )}
        />
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
            onFocus={down}
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
            <FontAwesome name="send" size={22} color="white" />
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
    marginBottom: 5,
    backgroundColor: "#2C6BEE",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    color: "#fff",
    maxWidth: Dimensions.get("window").width * 0.65,
  },
  receiver: {
    marginBottom: 5,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    color: "#000",
    maxWidth: Dimensions.get("window").width * 0.65,
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
  idTextContainer: {
    margin: 5,
  },
  idText: {
    padding: 2,
    backgroundColor: "#5785e6",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ChatScreen;
