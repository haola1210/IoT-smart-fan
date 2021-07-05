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
      fanSocket.emit("get-status")
      
      //
      io.emit("fan-connection", {
        connected : true
      })
      fanSocket.on("disconnect", (reason) => {
        fanSocket = null
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
      } else {
        socket.emit("fan-connection", {
          connected : true
        })
      }
    }

    
    socket.on("fan-send-server-status", data => {
      console.log("fan send: " + data)
      io.emit("server-send-status-of-fan", data)
    })

    socket.on("disconnect", (reason) => {
        console.log(reason)
    });
  });



