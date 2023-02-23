"use strict";
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

module.exports.getDeviceMQTTTopic = async function (doggeatDeviceID) {
  const snapshot = await db.collection("/doggeatDevice*").get();
  snapshot.docs.filter((doc) => doc.id == doggeatDeviceID);
  return snapshot.docs[0].data().mqtt_topic;
};

module.exports.checkForDevice = async (doggeatDeviceID) => {
  const snapshot = await db.collection("/doggeatDevice*").get();
  snapshot.docs.filter((doc) => doc.id == doggeatDeviceID);
  return !snapshot.empty;
};
