const express = require("express")
const { getTopics, getAPI, getArticleByID, getArticles, getCommentsByArticle, postComments } = require("./controllers/news.controller")

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getAPI)
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticle)

app.post("/api/articles/:article_id/comments", postComments)

app.use((err, req, res, next) => {
    if(err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.status === 404){
        res.status(404).send({ msg: err.msg })
    } else { 
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.code === "23502"){
        res.status(422).send({ msg: "Unprocessable Entity" })
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
