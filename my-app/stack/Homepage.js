import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "@react-native-material/core";
import {
  getFirestore,
  collection,
  getDocs,
  documentId,
} from "firebase/firestore/lite";
import firebaseApp from "./../firebase/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Homepage({ navigation }) {
  const [text, onChangeText] = React.useState("");
  const [buttonStatus, setStatus] = React.useState(true);
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    if (text.length == 20) {
      setStatus(false);
    } else {
      setStatus(true);
    }
  }, [text]);

  //
  async function getElementFromCollection(text) {
    const doggeatIDsCol = collection(db, "/doggeatDevice*");
    const doggeatIDsSnapShot = await getDocs(doggeatIDsCol);
    const doggeatIDs = doggeatIDsSnapShot.docs
      .filter((doc) => doc.id == text)
      .map((doc) => doc.data());
    return doggeatIDs;
  }

  const checkDBForCurrentID = (text) => {
    console.log("Checking DB for ID: " + text);
    getElementFromCollection(text).then((doggeatID) => {
      if (doggeatID.length > 0) {
        AsyncStorage.setItem("dogBowlID", doggeatID[0].mqtt_topic).then(() => {
          navigation.replace("DogBowl");
        });
      } else {
        alert("ID non trouvé dans la base de données");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text>Merci d'entrer le numéro de votre DOGGEAT.</Text>
      <TextInput
        style={styles.input}
        value={text}
        label="Doggeat_ID"
        onChangeText={onChangeText}
      />

      <Button
        title="Activer !"
        onPress={() => checkDBForCurrentID(text)}
        disabled={buttonStatus}
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
  input: {
    margin: 10,
    width: 230,
  },
});
