const db = require("../db/connection")
const fs = require("fs/promises")
const path = require("path")

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

module.exports = { fetchTopics, fetchAPI }