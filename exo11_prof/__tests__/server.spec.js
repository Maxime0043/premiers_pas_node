const request = require("supertest");
const server = require("../server");

describe("Mon serveur de fichiers statiques", () => {
  it("should return Hello World and HTML on GET /", async () => {
    const res = await request(server)
      .get("/")
      .expect(200)
      .expect("content-type", "text/html");

    expect(res.text).toMatch(/HELLO/);
  });

  test("Doit retourner 404 en HTML sur GET /nexistepas", async () => {
    const res = await request(server)
      .get("/nexistepas")
      .expect(404)
      .expect("content-type", "text/html");

    expect(res.text).toMatch(/404/);
  });
});
