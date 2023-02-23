const mqtt = require("mqtt");
const storage = require("./storage");
const xbee_handler = require("./xbee_handler");

module.exports.init_mqtt = (doggeatDeviceID) => {
  return storage.getDeviceMQTTTopic(doggeatDeviceID).then((mqtt_topic) => {
    let client = mqtt.connect("mqtt://test.mosquitto.org");
    client.on("connect", function () {
      client.subscribe(mqtt_topic, (err) => {
        if (err) {
          console.error(`Can't subscribe to ${mqtt_topic}`);
          process.exit(1);
        }
      });
    });
    client.on("message", function (topic, message) {
      console.log(message.toString());
      if (topic === mqtt_topic && message.toString() === "refill") {
        xbee_handler.sendRefillRequest();
      }
    });
    return { client, mqtt_topic };
  });
};
