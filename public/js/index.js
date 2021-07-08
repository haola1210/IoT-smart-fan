const btnOn = document.getElementById("btn-on")
const btnOff = document.getElementById("btn-off")
const sensorOn = document.getElementById("sensor-on")
const sensorOff = document.getElementById("sensor-off")
const timingBtn = document.getElementById("timing")
const input = document.getElementById("input")
const fanConnection = document.getElementById("fan-cn")

sensorOn.classList.add("on-clicked")
btnOn.classList.add("btn-disable")
btnOff.classList.add("btn-disable")
timingBtn.classList.add("btn-disable")
input.classList.add("btn-disable")

        


//socket client
const socket = io({
    query : {
        client : "notARD"
    }
});

socket.on("connect", () => {
    console.log(socket.id); 

    socket.emit("status-sensor-web")

    socket.on("status-sensor-node-on",() => {
        console.log("Sensor on")
        sensorOn.classList.add("on-clicked")
        btnOn.classList.add("btn-disable")
        btnOff.classList.add("btn-disable")
        timingBtn.classList.add("btn-disable")
        input.classList.add("btn-disable")
        
        btnOn.classList.remove("on-clicked")
        btnOff.classList.remove("off-clicked")
        timingBtn.classList.remove("on-clicked")
        sensorOff.classList.remove("off-clicked")
    })
    socket.on("status-sensor-node-off",() =>{
        console.log("Sensor off")

        btnOff.classList.add("off-clicked")
        btnOn.classList.remove("on-clicked")
        sensorOn.classList.remove("on-clicked")
        sensorOff.classList.add("off-clicked")
        timingBtn.classList.remove("on-clicked")


        btnOn.classList.remove("btn-disable")
        btnOff.classList.remove("btn-disable")
        timingBtn.classList.remove("btn-disable")
        input.classList.remove("btn-disable")

    })
    socket.on("btn-node-on", ()=>{
        btnOn.classList.add("on-clicked")
        btnOff.classList.remove("off-clicked")
        sensorOff.classList.add("off-clicked")
    })
    socket.on("btn-node-off", ()=>{
        btnOn.classList.remove("on-clicked")
        btnOff.classList.add("off-clicked")
        sensorOff.classList.add("off-clicked")
    })

});



socket.on("fan-connection", data => {
    console.log(data)
    if(data.connected){
        fanConnection.innerHTML = "Quạt đang online"
        fanConnection.classList.remove("offline")
        fanConnection.classList.remove("online")
        fanConnection.classList.add("online")
    } else {
        sensorOn.classList.add("on-clicked")
        btnOn.classList.add("btn-disable")
        btnOff.classList.add("btn-disable")
        timingBtn.classList.add("btn-disable")
        input.classList.add("btn-disable")

        fanConnection.innerHTML = "Quạt đang offline"
        fanConnection.classList.remove("offline")
        fanConnection.classList.remove("online")
        fanConnection.classList.add("offline")
    }

})

socket.on("server-send-status-fan", data => {  //serevr gui qua
    console.log(data)
})


/// event listener
let checkTime = 0;
btnOn.addEventListener("click", e => {
    console.log("click btnOn")
        //send command to srver 
    btnOn.classList.add("on-clicked")
    btnOff.classList.remove("off-clicked")
    socket.emit("turn-on-fan")
})

btnOff.addEventListener("click", e => {
  
    console.log("click btnOff")
    btnOn.classList.remove("on-clicked")
    btnOff.classList.add("off-clicked")

    timingBtn.classList.remove("on-clicked")
    socket.emit("turn-off-fan")
})

sensorOn.addEventListener("click", e => {
    console.log("click sensorOn")
    //css
        sensorOn.classList.add("on-clicked")
        sensorOff.classList.remove("off-clicked")
    
        btnOn.classList.remove("on-clicked")
        btnOff.classList.remove("off-clicked")
        timingBtn.classList.remove("on-clicked")
    
        btnOn.classList.add("btn-disable")
        btnOff.classList.add("btn-disable")
        timingBtn.classList.add("btn-disable")
        input.classList.add("btn-disable")
        socket.emit("turn-on-sensor")
})

sensorOff.addEventListener("click", e => {
    console.log("click sensorOff")
    sensorOn.classList.remove("on-clicked")
    sensorOff.classList.add("off-clicked")

    btnOn.classList.remove("on-clicked")
    btnOff.classList.add("off-clicked")
    timingBtn.classList.remove("on-clicked")

    btnOn.classList.remove("btn-disable")
    btnOff.classList.remove("btn-disable")
    timingBtn.classList.remove("btn-disable")
    input.classList.remove("btn-disable")

    socket.emit("turn-off-sensor")


})

timingBtn.addEventListener("click", e => {
    console.log("click " + input.value)
    timingBtn.classList.add("on-clicked")
    btnOff.classList.remove("off-clicked")
    btnOn.classList.add("on-clicked")
    socket.emit("set-time-fan", input.value)
})
// recive from sever
socket.on("timerem-to-web",(data) => {
    console.log("timerem-to-web" + data)
    if(parseInt(data.time) == 0){
        timingBtn.classList.remove("on-clicked")
        btnOff.classList.add("off-clicked")
        btnOn.classList.remove("on-clicked")
    }
})

