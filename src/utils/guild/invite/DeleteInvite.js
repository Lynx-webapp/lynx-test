const ApiError = require('../../../helpers/ApiError'),
    guilds = require('../../../models/guild.model'),
    roles = require('../../../models/roles.model'),
    invite = require('../../../models/invite.model')

module.exports = async (req, res) => {

    if (!req.params) return res.status(400).json(ApiError.badrequest)
    if (!req.password) return res.status(401).json(ApiError.unauthorized)
    const {
        code
    } = req.params,
        authorization = req.headers.authorization || req.signedCookies.Authorization
    let decoded = require('../../../middlewares/jwt')(authorization, req.password)

    if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

    i = await invite.findOne({
        code: code
    })

    if (!i) return res.status(404).json(ApiError.notfound)

    server = await guilds.findById(i.guild.id)

    if (!server) return res.status(403).json(ApiError.forbidden)

    let member = await server.members.find(a => a.user.id === decoded.ID)

    if (!member) return res.status(403).json(ApiError.forbidden)

    role = await roles.find({
        '_id': {
            $in: member.roles
        }
    })



    let a = []
    role.forEach(b => {
        b.permissions.forEach(c => {
            a.push(String(c))
        })
    })
    if (!a.includes("ADMINISTRATOR") && !a.includes("MANAGE_ROLES")) return res.status(403).json({ code: 403, message: 'Missing permissions', required: ['ADMINISTRATOR', 'MANAGE_INVITE']})

    i.remove()

    return res.status(204).json()

}