import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import * as Contacts from "expo-contacts";
import { auth, db } from "../firebase";
import { Avatar, TouchableRipple } from "react-native-paper";
import ChatArea from "./ChatArea";
interface Props {
  navigation: any;
}
var chatId: string;
const App: React.FC<Props> = ({ navigation }) => {
  const [contacts, setContacts] = useState<any>([]);
  useEffect(() => {
    const test = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          await db
            .collection("messages")
            .doc("phone")
            .collection("number")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
              snapshot.docs.map((doc) => {
                data.map((contact) => {
                  if (
                    doc.data().phoneNumber ==
                      (
                        "+91" +
                        contact.phoneNumbers?.map((doc) =>
                          doc.number?.split(",")
                        )[0]
                      ).replace(/\s+/g, "") ||
                    doc.data().phoneNumber ==
                      (
                        "" +
                        contact.phoneNumbers?.map((doc) =>
                          doc.number?.split(",")
                        )[0]
                      ).replace(/\s+/g, "")
                  ) {
                    if (
                      auth.currentUser?.phoneNumber != doc.data().phoneNumber
                    ) {
                      setContacts((prev: any) => [
                        ...prev,
                        {
                          name: contact.name,
                          number:
                            "+91" +
                            (
                              "" +
                              contact.phoneNumbers?.map((doc) =>
                                doc.number?.split(",")
                              )[0]
                            ).replace(/(^\+91)/g, ""),
                          id: doc.id,
                          photo: doc.data().profilePhoto,
                          chatName: doc.data().name,
                        },
                      ]);
                    }
                  }
                });
              })
            );
        }
      }
    };
    test();
  }, []);

  const addgroup = async (
    number: string,
    name: string,
    photo: string,
    chatName: string
  ) => {
    await db
      .collection("messages")
      .doc("main")
      .collection("message")
      .doc(auth.currentUser?.phoneNumber!)
      .collection("number")
      .where("title", "in", [number.replace(/\s+/g, "")])
      .get()
      .then((val) => {
        val.docs.map((data) => {
          chatId = data.data().chatId;
        });
      });
    if (chatId) {
      navigation.navigate("ChatScreen", {
        user: auth.currentUser?.phoneNumber?.replace(/\s+/g, ""),
        number: number.replace(/\s+/g, ""),
        chatId,
        photo,
        name,
        chatName,
      });
    } else {
      navigation.navigate("ChatScreen", {
        user: auth.currentUser?.phoneNumber?.replace(/\s+/g, ""),
        number: number.replace(/\s+/g, ""),
        chatId:
          auth.currentUser?.phoneNumber?.replace(/\s+/g, "") +
          number.replace(/\s+/g, ""),
        photo,
        name,
        chatName,
      });
    }
    //});
  };

  interface area {
    name: string;
    number: string;
    id: number;
    photo: string;
    chatName: string;
  }

  const Area: React.FC<area> = ({ name, number, photo, chatName }) => {
    return (
      <View style={styles.container}>
        <Avatar.Image
          size={50}
          source={{
            uri: photo,
          }}
          style={{ marginLeft: 20, backgroundColor: "#e09f9f" }}
        />
        <TouchableRipple
          onPress={() => addgroup(number, name, photo, chatName)}
          rippleColor="#d3d3d3"
          borderless
          style={{ borderRadius: 10 }}
        >
          <View style={{ marginLeft: 10, width: 320 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>{name}</Text>

            <Text style={{ fontStyle: "italic", color: "gray", fontSize: 16 }}>
              {number}
            </Text>
          </View>
        </TouchableRipple>
      </View>
    );
  };
  return (
    <>
      <View style={{ display: "none" }}>
        <ChatArea navigation={navigation} contacts={contacts} />
      </View>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 15,
          }}
        >
          {contacts.map((val: any) => (
            <Area
              name={val.name}
              number={val.number}
              key={val.id}
              id={val.id}
              photo={val.photo}
              chatName={val.chatName}
            />
          ))}
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
});

export default App;
