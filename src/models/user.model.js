const mongoose = require('mongoose'),

   u = new mongoose.Schema({
        _id: Number,
        email: {
            type: Object,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true
        },
        tag: {
            type: String,
            required: true
        },
        id: {
           type: String,
           unique: true,
           required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: String,
        friends: Array,
        guilds: Array,
        notifications: Array,
        bio: String,
        status: Number,
        CreatedAt: {
            default: Date.now(),
            type: Date,
            required: true
        }
    }, {
        versionKey: false
    })

module.exports = mongoose.model('user', u)
