import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Dialog, Paragraph, TextInput } from "react-native-paper";
import { db, auth } from "../firebase";
import firebase from "firebase";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
var join: string = "";
var join2: string = "";
const AddGroup: React.FC = () => {
  const [addGroup, setAddGroup] = useState<string>("");
  const [joinGroup, setJoinGroup] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [number, setNumber] = useState<string>("");
  const [joinId, setJoinId] = useState<string>("");
  const [joinsuccess, setJoinSuccess] = useState<boolean>(false);
  const joingroup = async () => {
    await db
      .collection("messages")
      .doc("main")
      .collection("message")
      .doc(joinGroup.split("*")[1])
      .collection("number")
      .where("uid", "in", [joinGroup])
      .get()
      .then((val) => {
        val.docs.map((data) => {
          join = data.data().uid;
        });
      });
    if (join) {
      try {
        await db
          .collection("messages")
          .doc("main")
          .collection("message")
          .doc(auth.currentUser?.phoneNumber!)
          .collection("number")
          .where("uid", "in", [joinGroup])
          .get()
          .then((val) => {
            val.docs.map((data) => {
              join2 = data.data().uid;
            });
          });
        if (join2 == "") {
          await db
            .collection("messages")
            .doc("main")
            .collection("message")
            .doc(joinGroup.split("*")[1])
            .collection("number")
            .doc(joinGroup.split("*")[2])
            .get();

          db.collection("messages")
            .doc("main")
            .collection("message")
            .doc(auth.currentUser?.phoneNumber!)
            .collection("number")
            .add({
              groupCreator: joinGroup.split("*")[1],
              name: joinGroup.split("*")[0],
              phoneNumber: joinGroup.split("*")[1],
              subtitle: `Hello ${joinGroup.split("*")[0]}`,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              title: auth.currentUser?.phoneNumber,
              uid: joinGroup,
              type: "",
              chatId: joinGroup.split("*")[2],
              photo: `https://robohash.org/${joinGroup.split("*")[2]}`,
            });
          setNumber(joinGroup.split("*")[1]);
          setJoinSuccess(true);
          setJoinGroup("");
        }
      } catch (error) {
        alert(error);
      }
    }
  };
  const addgroup = () => {
    if (addGroup) {
      let uid = addGroup + "*" + auth.currentUser?.phoneNumber + "*" + nanoid();
      setJoinId(uid);
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
            uid: uid,
            chatId: uid.split("*")[2],
            photo: `https://robohash.org/${uid.split("*")[2]}`,
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
      <View
        style={{
          backgroundColor: "#fff",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: Dimensions.get("window").height * 0.25,
            justifyContent: "space-between",
          }}
        >
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
                color="#558bfa"
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
          <Text
            style={{ textAlign: "center", fontSize: 25, fontWeight: "700" }}
          >
            {" "}
            OR{" "}
          </Text>
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
              placeholder="Join a group"
              value={joinGroup}
              onChangeText={(text) => setJoinGroup(text)}
              style={{ width: "65%", marginTop: 10 }}
            />
            <TouchableOpacity onPress={joingroup}>
              <Button
                mode="contained"
                compact
                color="#558bfa"
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
        </View>
      </View>
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
              Group added successfully. Share this code to let other's join{" "}
              {joinId}. Go back to homescreen to start messaging.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSuccess(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      )}
      {joinsuccess && (
        <Dialog visible={joinsuccess} onDismiss={() => setJoinSuccess(false)}>
          <Dialog.Title>Congrats</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              You have successfully joined a group. Go back to homescreen to
              start messaging.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setJoinSuccess(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      )}
    </>
  );
};

export default AddGroup;
