console.log("HELLO WORLD");

const mavariable = process.env["MAVARIABLE"];
console.log(mavariable);

const contexte = mavariable ? "JE SUIS EN DEV" : "JE SUIS EN PROD";
console.log(contexte);
