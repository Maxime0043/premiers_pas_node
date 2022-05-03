const Logger = require("./emitter");
const logger1 = new Logger();

// logger1.log("message n°1");
// logger1.log("message n°2");
// logger1.log("message n°3");
// logger1.log("message n°4");

// define un listener à partir de mon logger
logger1.on("messageReçu", function (payload) {
  console.log("logger 1 : payload => ", payload);
});

// define un listener à partir d'un autre object de class Logger ?
const logger2 = new Logger();
logger2.on("messageReçu", function (payload) {
  console.log("logger 2 : payload => ", payload);
});

// est ce que ça marche avec d'autres instances de types eventlistener.
const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.on("messageReçu", function (payload) {
  console.log("emitter : payload => ", payload);
});

logger1.log("message n°1");
logger1.log("message n°2");
logger1.log("message n°3");
logger1.log("message n°4");
