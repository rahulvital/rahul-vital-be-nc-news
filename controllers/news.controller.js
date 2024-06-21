const { fetchTopics, fetchAPI, fetchArticleByID, checkValidArticleId, fetchArticles, fetchCommentsByArticle, createComments, fetchPatchedArticle, fetchDeleteComment, checkValidCommentId, fetchUsers } = require("../models/news.model")

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
    const { sort_by, order} = req.query
    fetchArticles({sort_by, order})
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

const patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body

    checkValidArticleId(article_id)
    .then(() => {
        return fetchPatchedArticle(article_id, inc_votes)
    })
    .then((patchedArticle) => {
            res.status(200).send({ article: patchedArticle })
    })
    .catch((err) => {
        next(err)
    })
}

const deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    
    checkValidCommentId(comment_id)
    .then(()=> {
        return fetchDeleteComment(comment_id)
    })
    .then((deletedComment)=> {
        res.status(204).send({ comment: deletedComment })
    })
    .catch((err) => {
        next(err)
    })
}
const getUsers = (req, res, err) => {
    fetchUsers()
    .then((allUsers) => {
        res.status(200).send({ users: allUsers })
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getTopics, getAPI, getArticleByID, getArticles, getCommentsByArticle, postComments, patchArticle, deleteComment, getUsers }