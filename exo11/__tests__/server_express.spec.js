const request = require("supertest");
const server = require("../server_express");
const db = require("../db");

describe("CRUD API", () => {
  // beforeAll(() => server.listen(5000));
  // afterAll(() => server.close());
  // beforeEach(() => console.log(db));
  // afterEach(() => console.log(db));

  describe("Route /api/names", () => {
    test("GET /api/names\t\t - [OK]", () => {
      return request(server)
        .get("/api/names")
        .expect(200)
        .expect("Content-Type", /^application\/json/);
    });

    test("PUT /api/names\t\t - [KO - méthode non correct]", () => {
      return request(server)
        .put("/api/names")
        .send({
          name: "Maurice",
        })
        .expect(404);
    });

    test("DELETE /api/names\t - [KO - méthode non correct]", () => {
      return request(server).delete("/api/names").expect(404);
    });

    test("POST /api/names\t\t - [OK]", () => {
      return request(server)
        .post("/api/names")
        .send({
          name: "Maurice",
        })
        .expect(201)
        .expect("Content-Type", /^application\/json/)
        .then((response) => {
          const data = JSON.parse(response.text);
          const result = JSON.stringify({ nom: data.name });
          expect(result).toBe(JSON.stringify(db.memoryDb.get(db.id - 1)));
        });
    });

    test("POST /api/names\t\t - [KO - données non valides]", () => {
      return request(server)
        .post("/api/names")
        .send({
          blabla: "Maurice",
        })
        .expect(424)
        .expect("Content-Type", /^application\/json/);
    });

    test("POST /api/names\t\t - [KO - données vides]", () => {
      return request(server)
        .post("/api/names")
        .expect(424)
        .expect("Content-Type", /^application\/json/);
    });
  });

  describe("Route /api/name/{id}", () => {
    test("GET /api/name/0\t\t - [OK]", () => {
      return request(server)
        .get("/api/name/0")
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .then((response) => {
          expect(response.text).toBe(JSON.stringify(db.memoryDb.get(0)));
        });
    });

    test("GET /api/name/999\t - [KO - id non trouvé]", () => {
      return request(server).get("/api/name/999").expect(404);
    });

    test.skip("POST /api/name/0\t - [KO - méthode non correct]", () => {
      return request(server)
        .post("/api/name/0")
        .expect(405)
        .expect("Content-Type", /^application\/json/);
    });

    test.skip("PUT /api/name/0\t\t - [OK]", () => {
      return request(server)
        .put("/api/name/0")
        .send({
          name: "Martine",
        })
        .expect(201)
        .expect("Content-Type", /^application\/json/)
        .then((response) => {
          const data = JSON.parse(response.text);
          const result = JSON.stringify({ nom: data.name });
          expect(result).toBe(JSON.stringify(db.memoryDb.get(0)));
        });
    });

    test.skip("PUT /api/name/999\t - [KO - id non trouvé]", () => {
      return request(server)
        .put("/api/name/999")
        .send({
          name: "Martine",
        })
        .expect(404)
        .expect("Content-Type", /^application\/json/);
    });

    test.skip("PUT /api/name/0\t\t - [KO - données non valides]", () => {
      return request(server)
        .put("/api/name/0")
        .send({
          blabla: "Maurice",
        })
        .expect(424)
        .expect("Content-Type", /^application\/json/);
    });

    test.skip("PUT /api/name/0\t\t - [KO - données vides]", () => {
      return request(server)
        .put("/api/name/0")
        .expect(424)
        .expect("Content-Type", /^application\/json/);
    });

    test.skip("DELETE /api/name/0\t - [OK]", () => {
      return request(server)
        .delete("/api/name/0")
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .then(() => {
          expect(db.memoryDb.get(0)).toBe(undefined);
        });
    });

    test.skip("DELETE /api/name/999\t - [KO - id non trouvé]", () => {
      return request(server)
        .delete("/api/name/999")
        .expect(404)
        .expect("Content-Type", /^application\/json/);
    });
  });
});
