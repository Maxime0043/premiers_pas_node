const Logger = require("./emitter");
const logger = new Logger();

logger.on("messageReçu", function (payload) {
  console.log("Message Reçu, payload: ", payload);
});

module.exports = logger;
