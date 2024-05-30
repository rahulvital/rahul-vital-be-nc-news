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
    if (isNaN(article_id)){
        throw { status: 400, msg: "Bad Request" }
    } else {
        return db.query(`SELECT * FROM articles WHERE article_id =$1`, [article_id])
        .then((validArticle) => {
            if (validArticle.rows.length > 0) {
                return true     
            } else {
                return Promise.reject({ status: 404, msg: "Article not found"})
            }
        })
    }
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

module.exports = { fetchTopics, fetchAPI, fetchArticleByID, checkValidArticleId, fetchArticles, fetchCommentsByArticle }