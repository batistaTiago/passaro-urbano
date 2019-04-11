var app = require('express')()
var consign = require('consign')()
let bodyParser = require('body-parser')
let expressValidator = require('express-validator')


app.use(expressValidator())

app.use(
    bodyParser.urlencoded(
        {
            extended: true
        }
    )
)



consign
    .include('app/routes').into(app)
    .then(('/config/databaseConnection.js'))
    .then(('/app/models'))
    .then(('/app/controllers'))
    .into(app)

module.exports = app;