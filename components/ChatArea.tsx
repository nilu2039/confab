import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  TouchableRipple,
  TextInput,
  Button,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { LogBox } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { auth, db } from "../firebase";
import firebase from "firebase";
import Header from "./Header";

interface Props {
  navigation: any;
}

interface area {
  title: string;
  subtitle: string;
  name: string;
}

const ChatArea: React.FC<Props> = ({ navigation }) => {
  const [group, setGroup] = useState<any>([]);
  LogBox.ignoreLogs(["Setting a timer"]);

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
            name: doc.data().name,
            subtitle: doc.data().subtitle,
          }))
        )
      );
    return unsubscribe;
  }, []);
  const Area: React.FC<area> = ({ title, subtitle, name }) => {
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
