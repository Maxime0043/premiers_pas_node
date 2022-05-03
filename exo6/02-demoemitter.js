const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("messageReçu", function (eventArguments) {
  console.log(eventArguments);
});

emitter.emit("messageReçu", "Ceci est une string");
emitter.emit("messageReçu", { id: 1, message: "Hey ça va ?" });
