import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Avatar, TouchableRipple } from "react-native-paper";
import { LogBox } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { auth, db } from "../firebase";
import Header from "./Header";
import * as Contacts from "expo-contacts";
import { useIsFocused } from "@react-navigation/native";

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

  /*useEffect(() => {
    const test = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          data.map(async (contact) => {
            const unsubscribe = await db
              .collection("messages")
              .doc("main")
              .collection("message")
              .doc(auth.currentUser?.phoneNumber!)
              .collection("number")
              .where("title", "in", [
                (
                  "+91" +
                  contact.phoneNumbers?.map((doc) => doc.number?.split(","))[0]
                ).replace(/\s+/g, ""),
              ])
              .get()
              .then((val) => {
                val.docs.map((doc) => {
                  console.log(doc.data());
                  setGroup((prev: any) => [
                    ...prev,
                    {
                      id: doc.id,
                      title: (
                        "+91" +
                        contact.phoneNumbers?.map((doc) =>
                          doc.number?.split(",")
                        )[0]
                      ).replace(/\s+/g, ""),
                      subtitle: `Hello ${contact.name}`,
                      name: contact.name,
                      chatId: doc.data().chatId,
                    },
                  ]);
                });
              });
            return unsubscribe;
          });
          /*await db
            .collection("messages")
            .doc("main")
            .collection("message")
            .doc(auth.currentUser?.phoneNumber!)
            .collection("number")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
              snapshot.docs.map((doc) => {
                data.map((contact) => {
                  if (
                    doc.data().title ==
                    (
                      "+91" +
                      contact.phoneNumbers?.map((doc) =>
                        doc.number?.split(",")
                      )[0]
                    ).replace(/\s+/g, "")
                  ) {
                    setGroup((prev: any) => [
                      ...prev,
                      {
                        id: doc.id,
                        title: (
                          "+91" +
                          contact.phoneNumbers?.map((doc) =>
                            doc.number?.split(",")
                          )[0]
                        ).replace(/\s+/g, ""),
                        subtitle: `Hello ${contact.name}`,
                        name: contact.name,
                        chatId: doc.data().chatId,
                      },
                    ]);
                  }
                });
              })
            );
        }
      }
    };
    test();
  }, [useIsFocused()]);
  /*useEffect(() => {
    const test = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          data.map(async (contact) => {
            db.collection("messages")
              .doc("main")
              .collection("message")
              .doc(auth.currentUser?.phoneNumber!)
              .collection("number")
              .orderBy("timestamp", "desc")
              .onSnapshot((snapshot) =>
                setGroup(
                  snapshot.docs.map(
                    (doc) =>
                      doc.data().title ==
                        (
                          "+91" +
                          contact.phoneNumbers?.map((doc) =>
                            doc.number?.split(",")
                          )[0]
                        ).replace(/\s+/g, "") && {
                        id: doc.id,
                        title: doc.data().title,
                        name: doc.data().name,
                        subtitle: doc.data().subtitle,
                        chatId: doc.data().chatId,
                      }
                  )
                )
              );
          });
          console.log(arr);
        }
      }
    };
    test();
  }, [useIsFocused()]);*/
  const Area: React.FC<area> = ({
    title,
    subtitle,
    name,
    chatId,
    photo,
    uid,
  }) => {
    return (
      <View style={styles.container}>
        <Avatar.Image
          size={50}
          source={{
            uri: photo,
          }}
          style={{ marginLeft: 20, backgroundColor: "#b58282" }}
        />
        <TouchableRipple
          onPress={() =>
            navigation.navigate("ChatScreen", {
              user: auth.currentUser?.phoneNumber?.replace(/\s+/g, ""),
              number: title.replace(/\s+/g, ""),
              chatId,
              uid,
            })
          }
          rippleColor="#d3d3d3"
          borderless
          style={{ borderRadius: 10 }}
        >
          <View style={{ marginLeft: 10, width: 320 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>{name}</Text>

            <Text style={{ fontStyle: "italic", color: "gray", fontSize: 16 }}>
              {subtitle}
            </Text>
          </View>
        </TouchableRipple>
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
  },
});
export default ChatArea;
