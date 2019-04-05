require('dotenv').config()

const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

require('./routes')(app)

const port = process.env.PORT || 8080

app.listen(port)
