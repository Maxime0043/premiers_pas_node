module.exports = function (a) {
  // Vérifier que l'argument est un nombre
  if (typeof a !== "number") throw new Error("a doit être un nombre");
  // Retourne la valeur absolue
  // return a >= 0 ? a : -a;
  return Math.abs(a);
};
