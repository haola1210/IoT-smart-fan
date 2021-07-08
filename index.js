require('dotenv').config()

//web server
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

//socket io
const { Server } = require("socket.io");
const io = new Server(server);


app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static('public'))


//mqtt client broker
const mqtt = require('mqtt')
const options = {
    host: 'fec7a5c7e592453e81dd0b1ba5784676.s2.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'Haopro094',
    password: process.env.BROKER_PASSWORD
}

//initialize the MQTT client
// const client = mqtt.connect(options);

//setup the callbacks
// client.on('connect', function () {
//     console.log('Connected');
// });

// client.on('error', function (error) {
//     console.log(error);
// });

// client.on('message', function (topic, message) {
//     //Called each time a message is received
//     console.log('Received message:', topic, message.toString());
// });

// // subscribe to topic 'my/test/topic'
// client.subscribe('hao');


app.get("/", (req, res) => res.render("index"))


app.get('/send', (req, res) => {
  // publish message 'Hello' to topic 'my/test/topic'
    client.publish('hao', 'hao ne');
    res.send(`Sent topic: hao `)
})

server.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${3000}`)
})


let fanSocket = null

io.on('connection', (socket) => {
    
    // identify client: ard or web
    if(socket.handshake.query.client != "notARD"){
      fanSocket = socket
      console.log("arduino connected")

      //get ard status 
     // fanSocket.emit("get-status")
      
      //
      io.emit("fan-connection", {
        connected : true
      });
      // fanSocket.on("timerem",(data) => {
      //     console.log(data.timerem)
      //     socket.emit("timerem",{
      //       timerem: data.timerem
      //     });
      // });
      fanSocket.on("disconnect", (reason) => {
        fanSocket.disconnect(true)
        fanSocket = null
        console.log("ard off" + reason)
        io.emit("fan-connection", {
          connected : false
        })
      });
      
    } else {
      console.log("web controller connected")
    
      // get the connection of fan to show on the UI
      if(fanSocket == null){
          socket.emit("fan-connection", {
            connected : false
          })
      } 
      else{
        socket.emit("fan-connection", {
          connected : true
        })
      }
    }
    socket.on("fan-send-server-status", data => {
      //console.log("fan send: " + data)
      io.emit("server-send-status-of-fan", data)
    })
    //commadn from ui
    

   // get Status nodeMcu => web
    socket.on("status-sensor-web",(data) => {
      //console.log("Web send to sever: " + data)
      if(fanSocket != null){
        fanSocket.emit("status-sensor")

        fanSocket.on("status-sensor-on",(data) => {
          socket.emit("status-sensor-node-on")
         // console.log("SenSor - on: ", data)
        })
        fanSocket.on("status-sensor-off",(data) => {
          socket.emit("status-sensor-node-off")
         // console.log("SenSor - off: ", data)
        })
        fanSocket.on("status-btn-on",(data) =>{
          socket.emit("btn-node-on")
          //console.log("btn-on: " + data)
        })
        fanSocket.on("status-btn-off",(data) =>{
          socket.emit("btn-node-off")
          //console.log("btn-off: " + data)
        })
      }
    });
    socket.on("turn-on-fan", () => {
      //send command to ard
     // console.log("turn-on-fan");
      if(fanSocket != null){
        fanSocket.emit("server-send-turn-on-fan",{
          fanMode: true
        });
      }
    })

    socket.on("turn-off-fan", () => {
      //send command to ard
     // console.log("turn-off-fan");
     if(fanSocket != null) 
        fanSocket.emit("server-send-turn-off-fan",{
        fanMode: true
      });
    })

    socket.on("turn-on-sensor", () => {
      //send command to ard
     // console.log("turn-off-fan");
     if(fanSocket != null)
      fanSocket.emit("server-send-turn-on-sensor",{
        sensorMode: true
      });
    })

    socket.on("turn-off-sensor", () => {
      //send command to ard
     // console.log("turn-off-fan");
     if(fanSocket != null)
      fanSocket.emit("server-send-turn-off-sensor",{
        sensorMode: true
      });

    })

    socket.on("set-time-fan", (data) => {
      if(fanSocket != null){
        fanSocket.emit("set-time",{
          time: data
        });
      }
    });
    // recive time from NodeMcu
    if(fanSocket != null){
      fanSocket.on("timerem",(data) => {
        console.log("Revice node Mcu: " + data.timerem)
        // Send time to Web //broadcast
        io.emit("timerem-to-web", {
          time: data.timerem
        });
      });
     }
    //commnad from arduino
    socket.on("fan-send-server-status-fan", (data) => {
      console.log(data)

      //broadcash len all socket
      io.emit("server-send-status-fan", data)
    })

    socket.on("disconnect", (reason) => {
        console.log(reason)
    });
  });


