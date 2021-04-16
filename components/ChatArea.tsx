import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TouchableRipple, TextInput, Button } from "react-native-paper";
import { LogBox } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { auth, db } from "../firebase";
import firebase from "firebase";
import Header from "./Header";

interface Props {
  navigation: any;
  number: string;
}

interface area {
  title: string;
  subtitle: string;
  id: number;
}

const ChatArea: React.FC<Props> = ({ navigation, number }) => {
  const [group, setGroup] = useState<any>([]);
  LogBox.ignoreLogs(["Setting a timer"]);
  const [addGroup, setAddGroup] = useState<string>("");
  const addgroup = () => {
    if (addGroup) {
      db.collection("messages")
        .doc("main")
        .collection("message")
        .add({
          phoneNumber: auth.currentUser?.phoneNumber,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          title: addGroup,
          subtitle: `Hello ${addGroup}`,
        });
      setAddGroup("");
    } else {
      return alert("Enter a group name");
    }
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .doc("main")
      .collection("message")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setGroup(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            subtitle: doc.data().subtitle,
          }))
        )
      );
    return unsubscribe;
  }, []);
  const Area: React.FC<area> = ({ title, subtitle, id }) => {
    return (
      <View style={styles.container}>
        <AntDesign
          name="aliwangwang-o1"
          size={40}
          color="black"
          style={{ marginLeft: 20 }}
        />
        <TouchableRipple
          onPress={() =>
            navigation.navigate("ChatScreen", {
              user: auth.currentUser?.phoneNumber?.replace(/\s+/g, ""),
              number: title.replace(/\s+/g, ""),
            })
          }
          rippleColor="#d3d3d3"
          borderless
          style={{ borderRadius: 10 }}
        >
          <View style={{ marginLeft: 10, width: 320 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>{title}</Text>

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
        <View>
          {group.map((val: any) => (
            <Area
              title={val.title}
              subtitle={val.subtitle}
              key={val.id}
              id={val.id}
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
