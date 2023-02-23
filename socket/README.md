# Socket for Doggeat XBee IoT project
Manages communication between the XBee device and and the host computer.
It supports : 
- Device enrollement verification
- Command handling for different functionnalities
- more...

## Getting Started

#### Prerequisites...

node.js > @16.0
npm > @9.3.0
#### Init and configure Firebase

In order to make the program work, you need to create a firebase project that will handle a collection of objects according to this schema :

```
/doggeatDeviceID
   ${random_10_chars_id}/
        created_on: 'date'
        mqtt_topic: 'string'
```

The `mqtt_topic` string will be a random string that you choose which will be used by the server and the mobile app to send and receive data over an MQTT connection.

The `$ {random_10_chars_id}` will also be the XBee NI default value. This will allow some verification during the device enrollment process. 

* Go to your Firebase project and reach "Settings/Project Settings/Service Account"
* Generate a new private key and save it as a `serviceAccountKey.json` file at the root folder


#### More configuration...
* Copy .env.dist to .env file and edit with local parameters

* Configure a coordinator and router/enddevice with XCTU ([Download XCTU](https://www.digi.com/products/embedded-systems/digi-xbee/digi-xbee-tools/xctu#productsupport-utilities)) and set the NI value to the previously generated : `$ {random_10_chars_id}`

* Ensure your user is member of the `dialout` group on Linux (use the `id` command) and add user to group if not already done
```sh
> sudo usermod -a -G dialout yourUserName
``` 
* Install node modules using `npm install`
* Connect the coordinator to your computer and start the server using  `npm start`

---

### Authors
LEFLOCH Thomas <<leflochtho@cy-tech.fr>>
