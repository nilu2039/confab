import "react-native-gesture-handler";
import React from "react";
import ChatArea from "./components/ChatArea";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./components/ChatScreen";
import PhoneRegister from "./components/PhoneRegister";
import Header from "./components/Header";
import ContactScreen from "./components/ContactScreen";

const App: React.FC = () => {
  const Stack = createStackNavigator();

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="PhoneRegister" component={PhoneRegister} />
          <Stack.Screen name="ChatArea" component={ChatArea} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="Header" component={Header} />
          <Stack.Screen name="ContactScreen" component={ContactScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
