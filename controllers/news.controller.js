const { fetchTopics, fetchAPI, fetchArticleByID, checkValidArticleId } = require("../models/news.model")

const getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err)
    })
}

const getAPI = (req, res, next) => {
    fetchAPI()
    .then((apis) => {
        res.status(200).json(apis)
    })
    .catch((err) => {
        next(err)
    })
}

const getArticleByID = (req, res, next) => {
    const { article_id } = req.params

    checkValidArticleId(article_id)
    .then(() => {
        return fetchArticleByID(article_id)
    })
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getTopics, getAPI, getArticleByID }