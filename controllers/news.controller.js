const { fetchTopics, fetchAPI, fetchArticleByID, checkValidArticleId, fetchArticles, fetchCommentsByArticle, createComments } = require("../models/news.model")

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

const getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    })
}

const getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params
    checkValidArticleId(article_id)
    .then(()=>{
        fetchCommentsByArticle(article_id)
        .then((comments) => {
            res.status(200).send({ comments })
        })
    })
    .catch((err) => {
        next(err)
    })
}

const postComments = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    
    checkValidArticleId(article_id) 
    .then(() => {
        createComments(article_id, { username, body })
        .then((postedComment) => {
            res.status(201).send({ comment: postedComment })
        })
        .catch((err) => {
            next(err)
        })
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getTopics, getAPI, getArticleByID, getArticles, getCommentsByArticle, postComments }