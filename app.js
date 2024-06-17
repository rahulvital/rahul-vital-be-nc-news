const express = require("express")
const { getTopics, getAPI, getArticleByID, getArticles, getCommentsByArticle, postComments, patchArticle, deleteComment, getUsers } = require("./controllers/news.controller")
const cors = require('cors')

const app = express();
app.use(express.json())
app.use(cors())

app.get("/api/topics", getTopics)
app.get("/api", getAPI)
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticle)
app.get("/api/users", getUsers)

app.post("/api/articles/:article_id/comments", postComments)
app.patch("/api/articles/:article_id", patchArticle)
app.delete("/api/comments/:comment_id", deleteComment)

app.use((err, req, res, next) => {
    if(err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request: Invalid URL"})
    } else if(err.code === "23502"){
        res.status(400).send({ msg: "Bad Request: Body or Username not present" })
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.status === 404){
        res.status(404).send({ msg: err.msg })
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "Not Found: Username Not Found"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error"})
})

module.exports = app;
