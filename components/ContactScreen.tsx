import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import * as Contacts from "expo-contacts";
import { auth, db } from "../firebase";
import firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
import Header from "./Header";
interface Props {
  navigation: any;
}
const App: React.FC<Props> = ({ navigation }) => {
  var temp = 0;
  const [contacts, setContacts] = useState<any>([]);
  const [id, setId] = useState<any>([]);
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

  useEffect(() => {
    console.log(contacts);
  }, [contacts]);
  const addgroup = async (number: string) => {
    const promise = new Promise((resolve, reject) => {
      db.collection("messages")
        .doc("main")
        .collection("message")
        .onSnapshot((snapshot) => {
          for (let i = 0; i < snapshot.docs.length; i++) {
            console.log(snapshot.docs[i].data().title);

            if (number == snapshot.docs[i].data().title) {
              resolve(0);
              break;
            }
          }
          resolve(1);
        });
    });

    promise.then((val) => {
      console.log(number);

      if (val != 0) {
        db.collection("messages")
          .doc("main")
          .collection("message")
          .add({
            phoneNumber: auth.currentUser?.phoneNumber,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            title: number,
            subtitle: `Hello ${number}`,
          });
      }

      navigation.navigate("ChatScreen", {
        user: auth.currentUser?.phoneNumber?.replace(/\s+/g, ""),
        number: number.replace(/\s+/g, ""),
      });
    });
  };
  interface area {
    name: string;
    number: string;
    id: number;
  }
  const Area: React.FC<area> = ({ name, number, id }) => {
    return (
      <View style={styles.container}>
        <AntDesign
          name="aliwangwang-o1"
          size={40}
          color="black"
          style={{ marginLeft: 20 }}
        />
        <TouchableRipple
          onPress={() => addgroup(number)}
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
      <Header navigation={navigation} />
      <ScrollView>
        <View
          style={{ display: "flex", flexDirection: "column", marginTop: 50 }}
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
