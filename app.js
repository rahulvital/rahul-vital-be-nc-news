const express = require("express")
const { getTopics, getAPI } = require("./controllers/news.controller")

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getAPI)


app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error"})
})

module.exports = app;
