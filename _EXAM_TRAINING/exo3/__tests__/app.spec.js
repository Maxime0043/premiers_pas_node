const request = require("supertest");
const app = require("../app");
const db = require("../Table");

describe("CRUD API", () => {
  describe("Route /api/names", () => {
    test("GET /api/names\t\t - [OK]", () => {
      return request(app)
        .get("/api/names")
        .expect(200)
        .expect("Content-Type", /json/);
    });

    test("PUT /api/names\t\t - [KO - méthode non correct]", () => {
      return request(app)
        .put("/api/names")
        .send({
          name: "Maurice",
        })
        .expect(404);
    });

    test("DELETE /api/names\t - [KO - méthode non correct]", () => {
      return request(app).delete("/api/names").expect(404);
    });

    test("POST /api/names\t\t - [OK]", () => {
      return request(app)
        .post("/api/names")
        .send({
          name: "Maurice",
        })
        .expect(201)
        .expect("Content-Type", /json/)
        .then((response) => {
          const data = JSON.parse(response.text);
          expect(data).toMatchObject(db.getOne(db.id - 1));
        });
    });

    test("POST /api/names\t\t - [KO - données non valides]", () => {
      return request(app)
        .post("/api/names")
        .send({
          blabla: "Maurice",
        })
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("POST /api/names\t\t - [KO - données vides]", () => {
      return request(app)
        .post("/api/names")
        .expect(400)
        .expect("Content-Type", /json/);
    });
  });

  describe("Route /api/names/{id}", () => {
    test("GET /api/names/0\t\t - [OK]", () => {
      return request(app)
        .get("/api/names/0")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((response) => {
          expect(response.text).toBe(JSON.stringify(db.memoryDb.get(0)));
        });
    });

    test("GET /api/names/999\t - [KO - id non trouvé]", () => {
      return request(app).get("/api/names/999").expect(400);
    });

    test("POST /api/names/0\t - [KO - méthode non correct]", () => {
      return request(app).post("/api/names/0").expect(404);
    });

    test("PUT /api/names/0\t\t - [OK]", () => {
      return request(app)
        .put("/api/names/0")
        .send({
          name: "Martine",
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .then((response) => {
          const data = JSON.parse(response.text);
          expect(data).toMatchObject(db.getOne(0));
        });
    });

    test("PUT /api/names/999\t - [KO - id non trouvé]", () => {
      return request(app)
        .put("/api/names/999")
        .send({
          name: "Martine",
        })
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("PUT /api/names/0\t\t - [KO - données non valides]", () => {
      return request(app)
        .put("/api/names/0")
        .send({
          blabla: "Maurice",
        })
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("PUT /api/names/0\t\t - [KO - données vides]", () => {
      return request(app)
        .put("/api/names/0")
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("DELETE /api/names/0\t - [OK]", () => {
      return request(app)
        .delete("/api/names/0")
        .expect(200)
        .then(() => {
          expect(db.memoryDb.get(0)).toBe(undefined);
        });
    });

    test("DELETE /api/names/999\t - [KO - id non trouvé]", () => {
      return request(app)
        .delete("/api/names/999")
        .expect(400)
        .expect("Content-Type", /json/);
    });
  });
});
