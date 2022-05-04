const absolue = require("../absolue");

describe("La fonction absolue", () => {
  // Fonctions de Préparation / Nettoyage
  beforeEach(() => {
    console.log("Before each");
  });
  afterEach(() => {
    console.log("After each");
  });
  beforeAll(() => {
    console.log("Before all");
  });
  afterAll(() => {
    console.log("After all");
  });

  test("absolue - doit retourner 0 si on lui passe 0", () => {
    const result = absolue(0);
    expect(result).toBe(0);
  });

  test("absolue - doit retourner 3 si on lui passe 3", () => {
    const result = absolue(3);
    expect(result).toBe(3);
  });

  test("absolue - doit retourner 7 si on lui passe -7", () => {
    const result = absolue(-7);
    expect(result).toBe(7);
  });

  test("absolue - doit retourner Infinity si on lui passe Infinity", () => {
    const result = absolue(Infinity);
    expect(result).toBe(Infinity);
  });

  test("absolue - doit retourner Infinity si on lui passe -Infinity", () => {
    const result = absolue(-Infinity);
    expect(result).toBe(Infinity);
  });

  test("absolue - doit retourner NaN si on lui passe NaN", () => {
    const result = absolue(NaN);
    expect(result).toBe(NaN);
  });

  test.each([undefined, "aaa", "", " ", [], [1], {}, { i: "2" }, true])(
    "absolue - doit rejeter ce qui n'est pas un nombre, ici %p",
    (a) => {
      expect(() => absolue(a)).toThrow(/nombre/);
    }
  );
});
