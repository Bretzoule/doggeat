const SerialPort = require("serialport");
const xbee_api = require("xbee-api");
const C = xbee_api.constants;
const SERIAL_PORT = process.env.SERIAL_PORT;

const xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2,
  convert_adc: true,
});

const serialport = new SerialPort(
  SERIAL_PORT,
  {
    baudRate: parseInt(process.env.SERIAL_BAUDRATE) || 9600,
  },
  function (err) {
    if (err) {
      return console.log("Error: ", err.message);
    }
  }
);
serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

const sendATCommand = (
  command,
  commandType = C.FRAME_TYPE.AT_COMMAND,
  destinationAdress = "",
  commandParameter = []
) => {
  const frame_obj = {
    // AT Request to be sent
    type: commandType,
    destination64: destinationAdress,
    command: command,
    commandParameter: commandParameter,
  };
  xbeeAPI.builder.write(frame_obj);
};

module.exports.initSerialPort = async (eventEmitter) => {
  serialport.on("open", function () {
    sendATCommand("NI");
  });
  console.log("Serial port opened");
  xbeeAPI.parser.on("data", function (frame) {
    console.debug(frame);
    if (
      C.FRAME_TYPE.AT_COMMAND_RESPONSE === frame.type &&
      frame.command === "NI"
    ) {
      eventEmitter.emit(
        "NI_COMMAND_RECEIVED",
        String.fromCharCode.apply(null, frame.commandData)
      );
    }
  });
};

module.exports.initXBeeBehaviour = (client, mqtt_topic) => {
  console.log("XBee behaviour initialized");
  xbeeAPI.parser.removeAllListeners("data");
  xbeeAPI.parser.on("data", function (frame) {
    if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
      client.publish(mqtt_topic, `${frame.analogSamples.AD1}`);
    } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
    } else {
      console.debug(frame);
      let dataReceived = String.fromCharCode.apply(null, frame.commandData);
      console.log(dataReceived);
    }
  });
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports.sendRefillRequest = () => {
  sendATCommand(
    "D2",
    C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    "FFFFFFFFFFFFFFFF",
    [0x05]
  );
  sleep(5000).then(() => {
    sendATCommand(
      "D2",
      C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
      "FFFFFFFFFFFFFFFF",
      [0x04]
    );
  });
  console.log("Refill request sent");
};
module.exports.sendATCommand = sendATCommand;
