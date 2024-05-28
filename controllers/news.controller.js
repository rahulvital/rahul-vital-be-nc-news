const { fetchTopics, fetchAPI } = require("../models/news.model")
const fs = require("fs/promises")

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

module.exports = { getTopics, getAPI }