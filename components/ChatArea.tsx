import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Avatar, TouchableRipple } from "react-native-paper";
import { LogBox } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { auth, db } from "../firebase";
import Header from "./Header";

interface Props {
  navigation: any;
  contacts?: any;
}

interface area {
  title: string;
  subtitle: string;
  name: string;
  chatId: string;
  photo: string;
  uid: string;
}

const ChatArea: React.FC<Props> = ({ navigation, contacts }) => {
  const [group, setGroup] = useState<any>([]);
  LogBox.ignoreLogs(["Setting a timer"]);
  var arr: any = [];
  useEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .doc("main")
      .collection("message")
      .doc(auth.currentUser?.phoneNumber!)
      .collection("number")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setGroup(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            name: doc.data().name,
            subtitle: doc.data().subtitle,
            chatId: doc.data().chatId,
            photo: doc.data().photo,
            uid: doc.data().uid,
          }))
        )
      );
    return unsubscribe;
  }, []);

  const Area: React.FC<area> = ({
    title,
    subtitle,
    name,
    chatId,
    photo,
    uid,
  }) => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.container}>
          <Avatar.Image
            size={50}
            source={{
              uri: photo,
            }}
            style={{ marginLeft: 20, backgroundColor: "#e09f9f" }}
          />
          <TouchableRipple
            onPress={() =>
              navigation.navigate("ChatScreen", {
                user: auth.currentUser?.phoneNumber?.replace(/\s+/g, ""),
                number: title.replace(/\s+/g, ""),
                chatId,
                uid,
                photo,
                name,
              })
            }
            rippleColor="#d3d3d3"
            borderless
            style={{ borderRadius: 10 }}
          >
            <View style={{ marginLeft: 10, width: 320 }}>
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>{name}</Text>

              <Text
                style={{ fontStyle: "italic", color: "gray", fontSize: 16 }}
              >
                {subtitle}
              </Text>
            </View>
          </TouchableRipple>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: Dimensions.get("window").height,
      }}
    >
      <Header navigation={navigation} />
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View>
          {group.map((val: any) => (
            <Area
              title={val.title}
              subtitle={val.subtitle}
              name={val.name}
              key={val.id}
              chatId={val.chatId}
              photo={val.photo}
              uid={val.uid}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e6e6",
    width: Dimensions.get("window").width * 0.91,
  },
});
export default ChatArea;
