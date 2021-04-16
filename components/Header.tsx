import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import "react-native-vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Menu } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { auth } from "../firebase";

interface Props {
  navigation: any;
}

const Header: React.FC<Props> = ({ navigation }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  return (
    <View>
      <View style={styles.header}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar.Image
            size={35}
            source={{
              uri: auth.currentUser?.photoURL!,
            }}
          />
          <Text style={{ marginLeft: 20, fontSize: 22, fontWeight: "bold" }}>
            Confab
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <AntDesign
              onPress={() => navigation.navigate("ContactScreen")}
              name="message1"
              size={24}
              color="black"
              style={{ marginRight: 18 }}
            />
          </TouchableOpacity>

          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Entypo
                  name="dots-three-vertical"
                  size={20}
                  color="black"
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => {
                auth.signOut();
                navigation.replace("PhoneRegister");
              }}
              title="Logout"
            />
          </Menu>
        </View>
      </View>
      <View style={styles.container}>
        <StatusBar style="auto" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    marginLeft: 20,
  },
});
export default Header;
