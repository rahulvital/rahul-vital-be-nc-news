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
            expect(body.msg).toBe("Article Not Found")
        })
    })
    it("Should return error 400 when searching for an invalid url (article_id is NaN)", ()=> {
        return request(app)
        .get("/api/articles/seven")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request: invalid URL")
        })
    })
})

describe("GET /api/articles", () => {
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
    it("Should return a status code: 200 and an ordered array of the comments", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
        const { comments } = body
        expect(comments).toBeSortedBy('created_at', { descending: true, coerce: true })
            comments.forEach((comment) => {
                expect(comment.article_id).toBe(1)
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
    it("Should return a status code: 200 and an empty array if there are no comments on the article", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
            const { comments } = body
            expect(comments).toEqual([])
            expect(comments.length).toBe(0)
        })
    })
    it("Should return error 404 when searching for an invalid article_id", ()=> {
        return request(app)
        .get("/api/articles/420/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Article Not Found")
        })
    })
    it("Should return error 400 when searching for an invalid url (article_id is NaN)", ()=> {
        return request(app)
        .get("/api/articles/invalid_id/comments")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request: invalid URL")
        })
    })
})

describe("POST /api/articles/:article_id/comments", () => {
    it("Should return a status code: 201 and the posted comment", () => {
        const newComment = { username: 'butter_bridge', body: 'Im not Kakarot?'}
        
        return request(app)
             .post("/api/articles/1/comments")
             .send(newComment)
             .expect(201)
             .then(({ body }) => {
                const { comment } = body
                            
                expect(comment.body).toBe("Im not Kakarot?")
                expect(comment.author).toBe("butter_bridge")
             })
    })
    it("Should return a status code: 400 when articles_id is NaN", () => {
        const newComment = { username: 'butter_bridge', body: 'Im not Kakarot?'}
        
        return request(app)
             .post ("/api/articles/invalid_id/comments")
             .send(newComment)
             .expect(400)
             .then(({ body }) => {
                expect(body.msg).toBe("Bad Request: invalid URL")
             })
    })
    it("Should return a status code: 404 when articles_id doesn't exist", () => {
        const newComment = { username: 'butter_bridge', body: 'Im not Kakarot?'}
        
        return request(app)
             .post("/api/articles/420/comments")
             .send(newComment)
             .expect(404)
             .then(({ body }) => {
                expect(body.msg).toBe("Article Not Found")
             })
    })
    it("Should return error 422 when using invalid input (username/body isnt present/valid)", ()=> {
        const invalidComment = { username: 'butter_bridge' }
        
        return request(app)
        .post("/api/articles/1/comments")
        .send(invalidComment)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request: Body or Username not present")
        })
    })
    it("Should return error 400 when using invalid username)", ()=> {
        const invalidUsername = { username: 'son_goku', body: 'Im not Kakarot' }
        
        return request(app)
        .post("/api/articles/1/comments")
        .send(invalidUsername)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found: Username Not Found")
        })
    })
})

describe("PATCH /api/articles/:article_id", () => {
    it("Should return the updated article when sent an object with a vote count", () => {
        const updateVotes = { inc_votes: 10 }
        
        return request(app)
        .patch("/api/articles/1")
        .send(updateVotes)
        .expect(200)
        .then(({ body }) => {
            const { article } = body
            
            expect(article).toEqual({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                votes: 110,
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2020-07-09T20:11:00.000Z',
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
        })
    })
    it("Should return an error 400 when given an invalid URL", () => {
        const updateVotes = { inc_votes: 10 }
        return request(app)
        .patch("/api/articles/invalid_id")
        .send(updateVotes)
        .expect(400)
        .then(({ body }) => {        
            expect(body.msg).toBe("Bad Request: invalid URL")
        })
    })
    it("Should return an error 404 when given an unassigned article_id", () => {
        const updateVotes = { inc_votes: 10 }
        return request(app)
        .patch("/api/articles/420")
        .send(updateVotes)
        .expect(404)
        .then(({ body }) => {        
            expect(body.msg).toBe("Article Not Found")
        })
    })
    it("Should return an error 400 when given an empty body", () => {
        const updateVotes = { }
        return request(app)
        .patch("/api/articles/10")
        .send(updateVotes)
        .expect(400)
        .then(({ body }) => {        
            expect(body.msg).toBe("Bad Request: Invalid body")
        })
    })
    it("Should return an error 400 when given an empty body", () => {
        const updateVotes = { inc_votes: "invalid_votes"}
        return request(app)
        .patch("/api/articles/3")
        .send(updateVotes)
        .expect(400)
        .then(({ body }) => {        
            expect(body.msg).toBe("Bad Request: Invalid body")
        })
    })
})