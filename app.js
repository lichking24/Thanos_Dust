const express = require('express')
const path = require('path')
const ejs = require('ejs')

const app = express()
app.engine('.html', ejs.__express)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')

app.use('/public', express.static('public', {
  maxAge: 1000 * 60 * 60 * 24
}))

var router = require('./route/index')
router(app)

module.exports = app