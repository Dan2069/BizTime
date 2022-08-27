// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

let testCompanies;

beforeEach(async function() {
    let result = await db.query(`
      INSERT INTO
        companies (name) VALUES ('TestCompanies')
        RETURNING id, name`);
    testCompany = result.rows[0];
  });

  /** GET /companies - returns `{companies: [company, ...]}` */

describe("GET /companies", function() {
    test("Gets a list of 1 company", async function() {
      const response = await request(app).get(`/companies`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        companies: [testCompanies]
      });
    });
  });
  // end
/** GET /companies/[id] - return data about one company: `{company: company}` */

describe("GET /companies/:id", function() {
    test("Gets a single company", async function() {
      const response = await request(app).get(`/companies/${testCompanies.id}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({company: testCompanies});
    });
  
    test("Responds with 404 if can't find company", async function() {
      const response = await request(app).get(`/companies/0`);
      expect(response.statusCode).toEqual(404);
    });
  });
  // end
  
  
  /** POST /companies - create company from data; return `{company: company}` */
  
describe("POST /companies", function() {
    test("Creates a new company", async function() {
      const response = await request(app)
        .post(`/companies`)
        .send({
          name: "Ezra"
        });
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        company: {id: expect.any(Number), name: "Ezra"}
      });
    });
  });
  // end
  
  
  /** PATCH /companies/[id] - update company; return `{company: company}` */
  
describe("PATCH /companies/:id", function() {
    test("Updates a single company", async function() {
      const response = await request(app)
        .patch(`/companies/${testCompanies.id}`)
        .send({
          name: "Pepsi"
        });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        company: {id: testCompanies.id, name: "Pepsi"}
      });
    });
  
    test("Responds with 404 if can't find company", async function() {
      const response = await request(app).patch(`/companies/0`);
      expect(response.statusCode).toEqual(404);
    });
  });
  // end
  
  
  /** DELETE /companies/[id] - delete company,
   *  return `{message: "company deleted"}` */
  
describe("DELETE /companies/:id", function() {
    test("Deletes a single a company", async function() {
      const response = await request(app)
        .delete(`/companies/${testCompanies.id}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ message: "company deleted" });
    });
  });
  // end
  
  
afterEach(async function() {
    // delete any data created by test
    await db.query("DELETE FROM companies");
  });
  
afterAll(async function() {
    // close db connection
    await db.end();
  });  