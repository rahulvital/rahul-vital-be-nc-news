const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const fs = require("fs/promises")
const path = require("path")

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
                    expect(topic.slug.length).toBeGreaterThan(0)
                    expect(topic.description.length).toBeGreaterThan(0)
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
             })
    })
})
describe("GET /api", () => {
    it("Should return a status code: 200", () => {
         return request(app)
             .get("/api")
             .expect(200)
    })
    it("Should return a status code: 200 and a json of the endpoints", async () => {
        const filePath = path.join(__dirname, '../endpoints.json')
        const output = JSON.parse(await fs.readFile(filePath, 'utf-8'))

        const result = await request(app).get('/api')
        expect(result.status).toBe(200)
        expect(result.body).toEqual(output)
    })

})