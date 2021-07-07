const express = require('express')
const routeDulces = require('./routes/routeDulces')

const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/dulces', routeDulces)

module.exports = app