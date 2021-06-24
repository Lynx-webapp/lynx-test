const mongoose = require('mongoose'),
    bp = require('body-parser'),
    secret = process.env.SECRET || require("../c.json").SECRET,
    micro = require('express-microservice-starter')

module.exports = app => {
    app.use(require('cors')({
        origin: 'http://localhost:3000',
        allowedHeaders: ['content-type', 'authorization'],
        optionsSuccessStatus: 203
    }))

    app.use(bp.urlencoded({
        extended: false
    }))
    app.use(bp.json())
    app.use(require('cookie-parser')(secret))

    mongoose.connect(process.env.MONGO || require('../c.json').MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    mongoose.connection.on('connected', e => {
        if (e) throw e
        console.info('connected to data base!')
    })

    app.use('/', require('../src/utils/main'))

}