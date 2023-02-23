const storage = require("./storage");
require("dotenv").config();
const mqtt_handler = require("./mqtt_handler");
const xbee_handler = require("./xbee_handler");
let client;
let mqtt_topic;
let eventEmitter = new (require("events").EventEmitter)();

xbee_handler.initSerialPort(eventEmitter);
eventEmitter.once("NI_COMMAND_RECEIVED", (node_id) => {
  console.log("Node ID: " + node_id);
  storage.checkForDevice(node_id).then(async (result) => {
    console.log("Device registered: " + result);
    if (result) {
      let elements = await mqtt_handler.init_mqtt(node_id);
      client = elements.client;
      mqtt_topic = elements.mqtt_topic;
      xbee_handler.initXBeeBehaviour(client, mqtt_topic);
    } else {
      console.log("Device not registered, contact the administrator");
    }
  });
});
