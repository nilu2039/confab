import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LogBox,
  KeyboardAvoidingView,
} from "react-native";
import { Button, TextInput, ActivityIndicator } from "react-native-paper";
import uuid from "react-native-uuid";
import { auth, db, firebaseConfig } from "../firebase";
import firebase from "firebase";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import Loading from "./Loading";
import { ScrollView } from "react-native-gesture-handler";
interface Props {
  navigation: any;
}
const Register: React.FC<Props> = ({ navigation }) => {
  LogBox.ignoreLogs(["Setting a timer"]);
  const [name, setName] = useState<string>("");
  const [splashloading, setSplashLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string>("");
  const recaptchaVerifier = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [message, showMessage] = useState({
    text: "",
    color: "",
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("ChatArea");
      }
      setSplashLoading(false);
    });
  }, []);
  const attemptInvisibleVerification = false;
  const sendCode = async () => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationid = await phoneProvider.verifyPhoneNumber(
        "+91" + phoneNumber,
        recaptchaVerifier.current!
      );

      setVerificationId(verificationid);
      showMessage({
        text: "Verification code has been sent to your phone.",
        color: "",
      });
    } catch (err) {
      showMessage({ text: `Error: ${err}`, color: "red" });
    }
  };

  const enterCode = async () => {
    setLoading(true);
    const seed = uuid.v4();
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId!,
        verificationCode
      );
      await firebase
        .auth()
        .signInWithCredential(credential)
        .then((result) => {
          result.user?.updateProfile({
            displayName: name,
            photoURL: photo || `https://robohash.org/${seed}`,
          });
        });
      showMessage({ text: "Phone authentication successful 👍", color: "" });
      setLoading(false);
      const promise = new Promise((resolve, reject) => {
        db.collection("messages")
          .doc("phone")
          .collection("number")
          .onSnapshot((snapshot) => {
            for (let i = 0; i < snapshot.docs.length; i++) {
              if ("+91" + phoneNumber == snapshot.docs[i].data().phoneNumber) {
                resolve(0);
                break;
              }
            }
            resolve(1);
          });
      });
      promise.then(async (val) => {
        if (val != 0) {
          const seed = uuid.v4();
          await db
            .collection("messages")
            .doc("phone")
            .collection("number")
            .add({
              phoneNumber: auth.currentUser?.phoneNumber,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              profilePhoto: photo || `https://robohash.org/${seed}`,
            });
        }
      });

      navigation.replace("ChatArea");
    } catch (err) {
      showMessage({ text: `Error: ${err.message}`, color: "red" });
    }
  };

  return (
    <ScrollView>
      {splashloading ? (
        <Loading loading={splashloading} />
      ) : (
        <KeyboardAvoidingView
          behavior="padding"
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            height: Dimensions.get("window").height,
          }}
        >
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
            attemptInvisibleVerification={attemptInvisibleVerification}
          />
          <View style={styles.container}>
            <View
              style={{
                width: Dimensions.get("window").width,
              }}
            >
              <Text
                style={{
                  color: message.color || "blue",
                  fontSize: 18,
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                {message.text}
              </Text>
            </View>
            <Text style={styles.text}>Login/Create a confab account</Text>
            <View>
              <TextInput
                dense
                mode="outlined"
                placeholder="Name"
                value={name}
                label="Name"
                onChangeText={(text) => setName(text)}
                style={{ width: 300 }}
              />
              <TextInput
                dense
                mode="outlined"
                placeholder="Phone Number"
                value={phoneNumber}
                label="Phone Number"
                autoCompleteType="tel"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                onChangeText={(text) => setPhoneNumber(text)}
                style={{ width: 300, marginTop: 20 }}
              />
              <TextInput
                dense
                secureTextEntry={true}
                mode="outlined"
                placeholder="Enter a photo URL(Optional)"
                value={photo}
                label="Enter a photo URL(Optional)"
                onChangeText={(text) => setPhoto(text)}
                style={{ width: 300, marginTop: 20, marginBottom: 20 }}
              />
            </View>
            <View>
              <Button mode="contained" color="#2C6BEE" onPress={sendCode}>
                Get verification code
              </Button>
            </View>
            <View>
              <TextInput
                dense
                disabled={!verificationId}
                secureTextEntry={true}
                mode="outlined"
                placeholder="Confirm code"
                value={verificationCode}
                label="Confirm Code"
                onChangeText={(text) => setVerificationCode(text)}
                style={{ width: 300, marginTop: 20, marginBottom: 20 }}
              />
              <Button
                mode="contained"
                color="#2C6BEE"
                onPress={enterCode}
                disabled={!verificationId}
              >
                Continue
              </Button>
              <ActivityIndicator animating={loading} color="red" />
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
    color: "#2C6BEE",
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
});
export default Register;
