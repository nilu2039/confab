import {StatusBar} from "expo-status-bar";
import React, {useEffect, useState} from "react";
import {ScrollView, Text, View} from "react-native";
import * as Contacts from "expo-contacts";
import {db} from "../firebase"

const App: React.FC = () => {
    const [contact, setContact] = useState<any>([]);
    useEffect(() => {
        const test = async () => {
            const {status} = await Contacts.requestPermissionsAsync();
            if (status === "granted") {
                const {data} = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                });
                if (data.length > 0) {
                    db
                        .collection("messages")
                        .orderBy("timestamp", "desc")
                        .onSnapshot((snapshot) => snapshot.docs.map(doc => {
                            data.map(contact => {
                                if (doc.data().phoneNumber == ("+91" + contact.phoneNumbers?.map((doc) => doc.number?.split(","))[0]).replace(/\s+/g, '')) {
                                    console.log(doc.data().phoneNumber);
                                    setContact((prev: any) => [...prev, {
                                        name: contact.name,
                                        number: "+91" + contact.phoneNumbers?.map((doc) => doc.number?.split(","))[0],
                                    }])
                                }
                            })
                        }))
                }
            }
        };
        test();
    }, []);

    return (
        <ScrollView>
            <View style={{display: "flex", flexDirection: "column", marginTop: 50}}>
                {contact.map((val: any) => (
                    <View style={{marginBottom: 20}} key={val.number}>
                        <Text> {val.name} </Text>
                        <Text> {val.number} </Text>
                    </View>
                ))}
            </View>
            <StatusBar style="auto"/>
        </ScrollView>
    );
};

export default App;
