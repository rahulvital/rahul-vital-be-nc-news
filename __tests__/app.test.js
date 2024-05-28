const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
    it("Should return a status code: 200 and all the topics", () => {
         return request(app)
             .get("/api/topics")
             .expect(200)
             .then(({ body }) => {
                const { topics } = body

                topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
             })
    })
})