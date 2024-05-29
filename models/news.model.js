const db = require("../db/connection")
const fs = require("fs/promises")
const path = require("path")
const endpoints = require("../endpoints.json")

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
                throw { status: 404, msg: "Article not found" }
            }
        })
    }
}


module.exports = { fetchTopics, fetchAPI, fetchArticleByID, checkValidArticleId }