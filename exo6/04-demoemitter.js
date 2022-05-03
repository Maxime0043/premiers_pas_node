/*
  POURQUOI NE PAS JUSTE FAIRE CA ?
*/

const EventEmitter = require("events");
const emitter = new EventEmitter();

const logArgs = function (eventArguments) {
  console.log(eventArguments);
};

emitter.on("messageReçu", logArgs);

emitter.emit("messageReçu", "Ceci est une string");
emitter.emit("messageReçu", { id: 1, message: "Hey ça va ?" });
