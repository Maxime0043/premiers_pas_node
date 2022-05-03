const EventEmitter = require("events");

class Logger extends EventEmitter {
  // fonction custom pour emettre.
  log(payload) {
    console.log("Event envoyé");
    this.emit("messageReçu", payload);
  }
}

module.exports = Logger;
