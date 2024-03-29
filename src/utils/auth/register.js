const jwt = require('jsonwebtoken'),
    ApiError = require('../../helpers/ApiError'),
    user = require('../../models/user.model'),
    crypt = require('../../function/crypto'),
    bcrypt = require('bcrypt'),
    SECRET = process.env.SECRET || require('../../../c.json').SECRET,
    mail = require('mailgun-js')

module.exports = async (req, res) => {
    if (!req.body) return res.status(400).json(ApiError.badrequest)
    var {
        username,
        email,
        password,
        referral
    } = req.body,
        gen = function (l) {
            var r = ''
            var b = '123456789azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN'
            for (var i = 0; i < l; i++) {
                r += b.charAt(Math.floor(Math.random() * b.length))
            }
            return r
        }


    if (!username) {
        return res.status(400).json(new ApiError(400, 'No username field found.'))
    } else if (!email) {
        return res.status(400).json(new ApiError(400, 'No email field found.'))
    } else if (!password) {
        return res.status(400).json(new ApiError(400, 'No password field found.'))
    } else if (password.length < 6) {
        return res.status(400).json(new ApiError(400, 'The password given is too short.'))
    }

    var h = crypt.encrypt(email, SECRET)

    //findAll
    let doc = await user.find({})

    const checkemail = doc.find(a => {
        if (a.email == null) return
        if (crypt.decrypt({
                iv: a.email.iv,
                content: a.email.content
            }, SECRET) === email) return true
    })


    if (checkemail) return res.status(503).json({
        code: 503,
        message: 'The email is already used'
    })


    user_id = Date.now() + 5000000000000 * 9000

    const p = await bcrypt.hash(password, await bcrypt.genSalt(12)),
        client = await user.create({
            _id: user_id,
            tag: gen(5),
            username: username,
            email: {
                iv: h.iv,
                content: h.content
            },
            avatar: null,
            bot: false,
            password: p
        })

    mail({
        apiKey: process.env.MAILGUN || require('../../../c.json').MAILGUN,
        domain: process.env.STMP_DOMAINE || require('../../../c.json').STMP_DOMAINE
    }).messages().send({
        from: "xelies.com",
        to: email,
        subject: `hey ${username}`,
        html: `<h2>hey ${username}</h2><p>welcome to xelies</p>`,
    }, function (e, r) {
        if (e) return console.error(e)
        console.log(r)
    })


    let token = jwt.sign({
        ID: user_id
    }, p, {
        expiresIn: '24h'
    })


    res.cookie("Authorization", token, {
        maxAge: 86400000,
        httpOnly: true,
        signed: true
    })

    var inviter = null

    if (referral) {
        inviter = await user.findOneAndUpdate({
            'referral.code': referral
        }, {
            $push: {
                'referral.members': {
                    username: client.username,
                    tag: client.tag,
                    avatar: client.avatar,
                    id: client._id
                }
            }
        })
    }

    if (inviter) return res.status(200).json({
        token: token,
        inviter: {
            username: inviter.username,
            tag: inviter.tag,
            avatar: inviter.avatar,
            id: inviter._id
        }
    })

    return res.status(200).json({
        token: token
    })


}