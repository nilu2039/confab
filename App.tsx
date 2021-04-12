import "react-native-gesture-handler";
import React from "react";
import ChatArea from "./components/ChatArea";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./components/ChatScreen";
import Login from "./components/Login";
import Register from "./components/Register";
const App: () => JSX.Element = () => {
  const Stack = createStackNavigator();
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ChatArea" component={ChatArea} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
