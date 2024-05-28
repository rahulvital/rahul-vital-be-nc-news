const db = require("../db/connection")

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((fetchedTopics) => {
        return fetchedTopics.rows
    })
}

module.exports = { fetchTopics }