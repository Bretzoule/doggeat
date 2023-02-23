// In App.js in a new project

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton } from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Homepage from "./stack/Homepage";
import DogBowl from "./stack/DogBowl";
import LoadingScreen from "./stack/LoadingScreen";
import Icon from "@expo/vector-icons/Ionicons";
const Stack = createNativeStackNavigator();

function resetAppState(navigation) {
  console.log("Resetting state");
  AsyncStorage.clear();
  navigation.replace("Homepage");
}

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
  });

  const [isRegistered, setIsRegistered] = React.useState(false);

  useEffect(() => {
    AsyncStorage.getItem("dogBowlID").then((value) => {
      if (value != null) {
        setState({ isLoading: false });
        setIsRegistered(true);
      } else {
        setState({ isLoading: false });
      }
    });
  });

  if (state.isLoading) {
    return <LoadingScreen />;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isRegistered ? "DogBowl" : "Homepage"}
        >
          <Stack.Screen
            name="DogBowl"
            component={DogBowl}
            options={({ navigation }) => ({
              headerTitle: "Doggeat",
              headerRight: () => (
                <IconButton
                  onPress={() => resetAppState(navigation)}
                  icon={(props) => <Icon {...props} name="exit-outline" />}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Homepage"
            component={Homepage}
            options={{ title: "Accueil" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
