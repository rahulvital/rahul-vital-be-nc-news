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
    it("Should return a status code: 200 and a json of the endpoints", async () => {
        const filePath = path.join(__dirname, '../endpoints.json')
        const expectedJSON = JSON.parse(await fs.readFile(filePath, 'utf-8'))

        const result = await request(app).get('/api')
        expect(result.status).toBe(200)
        expect(result.body).toEqual(expectedJSON)
    })
})

describe("GET /api/articles/:article_id", () => {
    it("Should return a status code: 200 and an article object", () => {
        return request(app)
             .get("/api/articles/1")
             .expect(200)
             .then(({ body }) => {
                const { article } = body
                expect(article).toEqual({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
             })
    })
    it("Should return error 404 when searching for an invalid article_id", ()=> {
        return request(app)
        .get("/api/articles/420")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Article not found")
        })
    })
    it("Should return error 400 when searching for an invalid url (article_id is NaN)", ()=> {
        return request(app)
        .get("/api/articles/seven")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    })
})

describe("GET /api/articles", () => {
    it("Should return a status code: 200 and an array of all articles", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            const { articles } = body
            expect(articles.length).toBe(13)
        })
    })
    it("Should return a status code: 200 and an array of all articles, removing the body key", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            const { articles } = body
            articles.forEach((article) => {
                expect(article).toEqual({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                }) 
            })
        })
    })
    it("Should return a status code: 200 and an ordered array of all articles", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            const { articles } = body
            expect(articles).toBeSortedBy('created_at', { descending: true, coerce: true })
        })
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    it("Should return a status code: 200 and an array of the comments", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
        const { comments } = body
            comments.forEach((comment) => {
                expect(comment).toEqual({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                })
            })
        })
    })
    it("Should return a status code: 200 and an ordered array of all articles", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
            const { comments } = body
            expect(comments).toBeSortedBy('created_at', { descending: true, coerce: true })
        })
    })
    it("Should return error 404 when searching for an invalid article_id", ()=> {
        return request(app)
        .get("/api/articles/420/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Article not found")
        })
    })
    it("Should return error 400 when searching for an invalid url (article_id is NaN)", ()=> {
        return request(app)
        .get("/api/articles/seven/comments")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    })
})