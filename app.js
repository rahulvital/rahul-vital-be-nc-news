const express = require("express")
const { getTopics, getAPI, getArticleByID, getArticles } = require("./controllers/news.controller")

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getAPI)
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles", getArticles)

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
