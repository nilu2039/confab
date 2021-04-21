import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Dialog, Paragraph, TextInput } from "react-native-paper";
import { db, auth } from "../firebase";
import firebase from "firebase";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
const AddGroup: React.FC = () => {
  const [addGroup, setAddGroup] = useState<string>("");
  const [joinGroup, setJoinGroup] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [number, setNumber] = useState<string>("");
  const joingroup = () => {
    const promise = new Promise((resolve, reject) => {
      db.collection("messages")
        .doc("main")
        .collection("message")
        .doc(joinGroup.split("*")[1])
        .collection("number")
        .onSnapshot((snapshot) => {
          for (let i = 0; i < snapshot.docs.length; i++) {
            if (snapshot.docs[i].data().uid == joinGroup) {
              resolve(1);
              break;
            }
          }
          resolve(0);
        });
    });
    promise.then(async (val) => {
      if (val == 1) {
        const temp = await db
          .collection("messages")
          .doc("main")
          .collection("message")
          .doc(joinGroup.split("*")[1])
          .collection("number")
          .doc(joinGroup.split("*")[2])
          .get();
        console.log(temp.data());

        db.collection("messages")
          .doc("main")
          .collection("message")
          .doc(auth.currentUser?.phoneNumber!)
          .collection("number")
          .add({
            groupCreator: joinGroup.split("*")[1],
            name: joinGroup.split("*")[0],
            phoneNumber: "+911234567893",
            subtitle: "Hello Test",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            title: auth.currentUser?.phoneNumber,
            uid: joinGroup,
            type: "",
          });
        setNumber(joinGroup.split("*")[1]);
      }
    });
  };
  const addgroup = () => {
    if (addGroup) {
      try {
        const promise = new Promise((resolve, reject) => {
          db.collection("messages")
            .doc("main")
            .collection("message")
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
        promise.then((val) => {
          if (val != 0) {
            db.collection("messages")
              .doc("main")
              .collection("message")
              .doc(auth.currentUser?.phoneNumber!)
              .set({
                name: "HI",
              });
          }
        });
        db.collection("messages")
          .doc("main")
          .collection("message")
          .doc(auth.currentUser?.phoneNumber!)
          .collection("number")
          .add({
            phoneNumber: auth.currentUser?.phoneNumber,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            title: addGroup,
            subtitle: `Hello ${addGroup}`,
            name: addGroup,
            groupCreator: auth.currentUser?.phoneNumber,
            uid:
              addGroup + "*" + auth.currentUser?.phoneNumber + "*" + nanoid(),
          });
        setAddGroup("");
        setSuccess(true);
      } catch (error) {
        alert(error);
      }
    } else {
      return setVisible(true);
    }
  };
  return (
    <>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            mode="outlined"
            dense
            multiline
            placeholder="Add a group"
            value={addGroup}
            onChangeText={(text) => setAddGroup(text)}
            style={{ width: "65%", marginTop: 10 }}
          />
          <TouchableOpacity onPress={addgroup}>
            <Button
              mode="contained"
              compact
              color="#000"
              style={{
                marginTop: 10,
                marginLeft: 10,
                padding: 1,
                borderRadius: 50,
              }}
            >
              ADD GROUP
            </Button>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            mode="outlined"
            dense
            multiline
            placeholder="Add a group"
            value={joinGroup}
            onChangeText={(text) => setJoinGroup(text)}
            style={{ width: "65%", marginTop: 10 }}
          />
          <TouchableOpacity onPress={joingroup}>
            <Button
              mode="contained"
              compact
              color="#000"
              style={{
                marginTop: 10,
                marginLeft: 10,
                padding: 1,
                borderRadius: 50,
              }}
            >
              JOIN GROUP
            </Button>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {visible && (
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Enter a group name</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      )}
      {success && (
        <Dialog visible={success} onDismiss={() => setSuccess(false)}>
          <Dialog.Title>Congrats</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Group added successfully. Go back to homescreen to start
              messaging.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSuccess(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      )}
    </>
  );
};

export default AddGroup;
