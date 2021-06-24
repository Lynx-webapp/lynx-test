const ApiError = require('../../../helpers/ApiError'),
    guilds = require('../../../models/guild.model'),
    roles = require('../../../models/roles.model')

module.exports = async (req, res) => {

    if (!req.params) return res.status(400).json(ApiError.badrequest)
    if (!req.password) return res.status(401).json(ApiError.unauthorized)

    const {
        guild_id,
        role_id
    } = req.params
    authorization = req.headers.authorization || req.signedCookies.Authorization,
        decoded = require('../../../middlewares/jwt')(authorization, req.password)

    if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
    if (isNaN(guild_id) && isNaN(role_id)) return res.status(400).json(new ApiError(400, 'The value is not int.'))

    let server = await guilds.findById(guild_id)
    if (!server) return res.status(404).json(ApiError.notfound)
    let member = await server.members.find(a => a.user.id === decoded.ID)
    if (!member) return res.status(403).json(ApiError.forbidden)

    role = await roles.findById(role_id)

    if(!role) return res.status(404).json(ApiError.notfound)
    let members = []
    m = server.members.find(a=> a.roles.includes(role._id))
    if(m[0]) return m.forEach(client=> {
        members.push({
            "user": {
                "id": client.user.id,
                "username": client.user.username,
                "tag": client.user.tag,
                "avatar": client.user.avatar
            },
            "createdAt": client.createdAt,
            "nickname": client.nickname,
            "joinedAt": client.joinedAt
        })
    })

    return res.status(200).json({
        code: 200,
        role: {
            permissions: role.permissions,
            CreatedAt: role.CreatedAt,
            id: role._id,
            name: role.name,
            guild: role.guild,
            color: role.color,
            deletable: role.deletable,
            default: role.default,
            position: server.roles.indexOf(role._id)
        },
        members: members
    })
}