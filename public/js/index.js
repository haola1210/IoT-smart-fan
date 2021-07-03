const btnOn = document.getElementById("btn-on")
const btnOff = document.getElementById("btn-off")
const sensorOn = document.getElementById("sensor-on")
const sensorOff = document.getElementById("sensor-off")
const timingBtn = document.getElementById("timing")
const input = document.getElementById("input")


btnOn.addEventListener("click", e => {
    console.log("click")
})

btnOff.addEventListener("click", e => {
    console.log("click")
})

sensorOn.addEventListener("click", e => {
    console.log("click")
})

sensorOff.addEventListener("click", e => {
    console.log("click")
})

timingBtn.addEventListener("click", e => {
    console.log("click" + input.value)
})


//socket client
const socket = io();

socket.on("connect", () => {
    console.log(socket.id); 
  });
