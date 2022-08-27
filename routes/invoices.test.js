// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

let testInvoices;

beforeEach(async function() {
    let result = await db.query(`
      INSERT INTO
        companies (name) VALUES ('testInvoices')
        RETURNING id, name`);
    testCompany = result.rows[0];
  });

  /** GET /companies - returns `{companies: [company, ...]}` */

describe("GET /companies", function() {
    test("Gets a list of 1 invoice", async function() {
      const response = await request(app).get(`/companies`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        invoices: [testInvoices]
      });
    });
  });
  // end
/** GET /invoices/[id] - return data about one invoice: `{invoice: invoice}` */

describe("GET /invoices/:id", function() {
    test("Gets a single invoice", async function() {
      const response = await request(app).get(`/invoices/${testinvoice.id}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({invoice: testinvoice});
    });
  
    test("Responds with 404 if can't find invoice", async function() {
      const response = await request(app).get(`/invoices/0`);
      expect(response.statusCode).toEqual(404);
    });
  });
  // end
  
  
  /** POST /invoices - create invoice from data; return `{invoice: invoice}` */
  
describe("POST /invoices", function() {
    test("Creates a new invoice", async function() {
      const response = await request(app)
        .post(`/invoices`)
        .send({
          name: "Ezra"
        });
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        invoice: {id: expect.any(Number), name: "Ezra"}
      });
    });
  });
  // end
  
  
  /** PATCH /invoices/[id] - update invoice; return `{invoice: invoice}` */
  
describe("PATCH /invoices/:id", function() {
    test("Updates a single invoice", async function() {
      const response = await request(app)
        .patch(`/invoices/${testinvoice.id}`)
        .send({
          name: "Troll"
        });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        invoice: {id: testinvoice.id, name: "Troll"}
      });
    });
  
    test("Responds with 404 if can't find invoice", async function() {
      const response = await request(app).patch(`/invoices/0`);
      expect(response.statusCode).toEqual(404);
    });
  });
  // end
  
  
  /** DELETE /invoices/[id] - delete invoice,
   *  return `{message: "invoice deleted"}` */
  
describe("DELETE /invoices/:id", function() {
    test("Deletes a single a invoice", async function() {
      const response = await request(app)
        .delete(`/invoices/${testinvoice.id}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ message: "invoice deleted" });
    });
  });
  // end
  
  
afterEach(async function() {
    // delete any data created by test
    await db.query("DELETE FROM invoices");
  });
  
afterAll(async function() {
    // close db connection
    await db.end();
  });  