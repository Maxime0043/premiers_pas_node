const EventEmitter = require("events");
const emitter = new EventEmitter();

// enregistrer un écouteur (un listener)
emitter.on("messageReçu", function () {
  console.log("message reçu");
});

console.log(
  "Heyyy, après la définition de l'event mais avant l'emission de l'event."
);

emitter.emit("messageReçu");
