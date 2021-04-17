import React, { useState } from "react";
import { View, Text } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Dialog, Paragraph, TextInput } from "react-native-paper";
import { db, auth } from "../firebase";
import firebase from "firebase";
const AddGroup: React.FC = () => {
  const [addGroup, setAddGroup] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const addgroup = () => {
    if (addGroup) {
      try {
        db.collection("messages")
          .doc("main")
          .collection("message")
          .add({
            phoneNumber: auth.currentUser?.phoneNumber,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            title: addGroup,
            subtitle: `Hello ${addGroup}`,
            name: addGroup,
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
