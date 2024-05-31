const db = require("../db/connection")
const fs = require("fs/promises")
const path = require("path")

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((fetchedTopics) => {
        return fetchedTopics.rows
    })
}

const fetchAPI = () => {
    const filePath = path.join(__dirname, '../endpoints.json')
    return fs.readFile(filePath, "utf-8")
    .then((file) => JSON.parse(file))
}

const fetchArticleByID = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((fetchedArticleById) => {
            return fetchedArticleById.rows[0]
    })
}

const checkValidArticleId = (article_id) => {    
    return db.query(`SELECT * FROM articles WHERE article_id =$1`, [article_id])
    .then((validArticle) => {
        if (validArticle.rows.length > 0) {
            return true     
        } else {
            return Promise.reject({ status: 404, msg: "Article Not Found"})
        }
    })
}

const fetchArticles = () => {
    return db.query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`)
    .then((allArticles) => {
        return allArticles.rows
    })
}

const fetchCommentsByArticle = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 
    ORDER BY created_at DESC`, [article_id])
    .then((allComments) => {
        return allComments.rows
    })
}

const createComments = (article_id, { username, body }) => {
    const created_at = new Date()

    return db.query(
        `INSERT INTO comments (body, votes, author, article_id, created_at) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
    [body, 0, username, article_id, created_at])
    .then((postedComments) => {
        return postedComments.rows[0]
    })
}

const fetchPatchedArticle = (article_id, inc_votes) => {
    
    return db.query(`UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`, [inc_votes, article_id])
    .then(({ rows }) => {
        return rows[0]
    })
    .catch((err)=> {
        return Promise.reject({ status: 400, msg: "Bad Request: Invalid body"})
    })
}

module.exports = { fetchTopics, fetchAPI, fetchArticleByID, checkValidArticleId, fetchArticles, fetchCommentsByArticle, createComments, fetchPatchedArticle }