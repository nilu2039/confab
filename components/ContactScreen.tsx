import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import * as Contacts from "expo-contacts";
import { auth, db } from "../firebase";
import firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
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
                            contact.phoneNumbers?.map((doc) =>
                              doc.number?.split(",")
                            )[0],
                          id: doc.id,
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

  const addgroup = async (number: string, name: string) => {
    /*const promise = new Promise((resolve, reject) => {
      db.collection("messages")
        .doc("main")
        .collection("message")
        .doc(auth.currentUser?.phoneNumber!)
        .collection("number")
        .onSnapshot((snapshot) => {
          for (let i = 0; i < snapshot.docs.length; i++) {
            if (number.replace(/\s+/g, "") == snapshot.docs[i].data().title) {
              resolve(0);
              break;
            }
          }
          resolve(1);
        });
    });*/

    //promise.then(async (val) => {
    /*if (val != 0) {
        const promise0 = new Promise((resolve, reject) => {
          db.collection("messages")
            .doc("main")
            .collection("messdage")
            .onSnapshot((snapshot) => {
              for (let i = 0; i < snapshot.docs.length; i++) {
                if (snapshot.docs[i].id == auth.currentUser?.phoneNumber) {
                  resolve(0);
                  break;
                }
              }
              resolve(1);
            });
        });
        promise0.then((data) => {
          if (data != 0) {
            db.collection("messages")
              .doc("main")
              .collection("message")
              .doc(auth.currentUser?.phoneNumber!)
              .set({
                name: "HI",
              });
          }
        });

        await db
          .collection("messages")
          .doc("main")
          .collection("message")
          .doc(auth.currentUser?.phoneNumber!)
          .collection("number")
          .add({
            phoneNumber: auth.currentUser?.phoneNumber,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            title: number.replace(/\s+/g, ""),
            name: name,
            subtitle: `Hello ${name}`,
            groupCreator: "",
            uid: "",
            type: "external",
            chatId: "",
          });
      }*/
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
      });
    } else {
      navigation.navigate("ChatScreen", {
        user: auth.currentUser?.phoneNumber?.replace(/\s+/g, ""),
        number: number.replace(/\s+/g, ""),
        chatId:
          auth.currentUser?.phoneNumber?.replace(/\s+/g, "") +
          number.replace(/\s+/g, ""),
      });
    }
    //});
  };

  interface area {
    name: string;
    number: string;
    id: number;
  }

  const Area: React.FC<area> = ({ name, number }) => {
    return (
      <View style={styles.container}>
        <AntDesign
          name="aliwangwang-o1"
          size={40}
          color="black"
          style={{ marginLeft: 20 }}
        />
        <TouchableRipple
          onPress={() => addgroup(number, name)}
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
