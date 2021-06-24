const ApiError = require('../../../helpers/ApiError'),
    users = require('../../../models/user.model'),
    guilds = require('../../../models/guild.model')

module.exports = async (req, res) => {

    if (!req.password) return res.status(401).json(ApiError.unauthorized)
    authorization = req.headers.authorization || req.signedCookies.Authorization
    let decoded = require('../../../middlewares/jwt')(authorization, req.password),

        {
            id
        } = req.params

    if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

    if (isNaN(id)) return res.status(400).json({
        code: 400,
        message: 'The value is not int.'
    })

    let user = await users.findById(id)
    if (!user) return res.status(404).json({
        code: 404,
        message: 'User not found'
    })

    var arr = []

    if (user.guilds) {
        user.guilds.forEach(async a => {
            let b = await guilds.findById(a)
            let c = b.members.find(c => c.user.id === Number(id))
            if (!c) return
            arr.push({
                name: b.name,
                icon: b.icon,
                description: b.description
            })
            return res.status(201).json({
                code: 201,
                user: {
                    id: user._id,
                    username: user.username,
                    tag: user.tag,
                    avatar: user.avatar,
                    createdAt: user.CreatedAt,
                    guilds: arr
                }
            })
        })
    } else return res.status(201).json({
        code: 201,
        user: {
            id: user._id,
            username: user.username,
            tag: user.tag,
            avatar: user.avatar,
            createdAt: user.CreatedAt
        }
    })
}