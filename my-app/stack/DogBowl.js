import React, { useState, useMemo } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import init from "react_native_mqtt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@react-native-material/core";
import { useFocusEffect } from "@react-navigation/native";

export default function DogBowl({ navigation }) {
  const less = require("./../assets/images/less.png");
  const full = require("./../assets/images/full.png");
  const [choice, setSelected] = useState(less);
  const [buffering, setBuffering] = useState(false);

  const options = {
    host: "test.mosquitto.org",
    path: "",
    port: 8080,
  };

  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {},
  });

  const client = useMemo(
    () => new Paho.MQTT.Client(options.host, options.port, options.path),
    []
  );

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("dogBowlID").then((value) => {
        if (value != null) {
          options.path = value;
          console.log("Connecting...");

          client.onMessageArrived = onMessageArrived;
          client.connect({
            reconnect: true,
            onSuccess: () => {
              client.subscribe(options.path);
            },
            timeout: 3,
            onFailure: (message) => {
              console.log("Connection failed: " + message.errorMessage);
            },
          });
        } else {
          alert("Le numéro de gamelle n'est pas enregistré en base, veuillez réessayer.");
            navigation.replace("Homepage");
        }
      });
      return () => {
        console.log("Disconnecting...");
        client.disconnect();
      };
    }, [])
  );

  function onMessageArrived(message) {
    console.log(message.payloadString);
    let returnVal = parseInt(message.payloadString, 10);
    if (returnVal == 0) {
      setSelected(less);
    } else if (returnVal == 1200) {
      setSelected(full);
      setBuffering(false);
    }
  }

  const refillBowl = () => {
    let localMessage = new Paho.MQTT.Message("refill");
    try {
      localMessage.destinationName = options.path;
      console.log("Message : \n" + localMessage.payloadString);
      console.log("Client : \n" + client.isConnected());
      client.send(localMessage);
      setBuffering(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Votre gamelle est :</Text>
      <Image source={choice} />
      <Button
        style={styles.button}
        title={buffering ? "Remplissage..." : "Wouaf !"}
        onPress={() => refillBowl()}
        disabled={(choice == full) | buffering}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    margin: 10,
    width: 200,
    backgroundColor: "palevioletred",
  },
});
