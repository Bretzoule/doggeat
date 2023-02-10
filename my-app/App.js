import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react'
import { Button } from 'react-native'
import { AppRegistry, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';








export default function App() {

  const less = require('./assets/images/less.png');
  const full = require('./assets/images/full.png');
  const [choice, setSelected] = useState(less);

  const options = {
    host: 'test.mosquitto.org',
    path: '0013a20012345678',
    port: 8080,
  };
  
  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {
    }
  });
  
  function onMessageArrived(message) {
    console.log(message.payloadString);
    let returnVal = parseInt(message.payloadString,10);
    if(returnVal == 0){
      setSelected(less);
    }
    else if(returnVal == 1200) {
      setSelected(full);
    }
  }
  
  let client
  try {
    client = new Paho.MQTT.Client(options.host, options.port, options.path);
  } catch (error) {
    console.log(error);
  }
  
  client.onMessageArrived = onMessageArrived;
  client.connect({
    onSuccess: () => {
      client.subscribe(options.path);
    },
    timeout: 3,
    onFailure: (message) => {
      console.log('Connection failed: ' + message.errorMessage);
    }
  });



  return (
    <View style={styles.container}>
      <Text>Votre gamelle est :</Text>
      <Image source={choice}/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
