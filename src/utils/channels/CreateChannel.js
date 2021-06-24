const ApiError = require('../../helpers/ApiError'),
    guilds = require('../../models/guild.model'),
    channels = require('../../models/channel.model'),
    roles = require('../../models/roles.model'),
    uuid = require('../../function/uuid').default

module.exports = async (req, res) => {

    if (!req.params) return res.status(400).json(ApiError.badrequest)
    if (!req.password) return res.status(401).json(ApiError.unauthorized)

    const {
        id
    } = req.params, {
        name
    } = req.body
    authorization = req.headers.authorization || req.signedCookies.Authorization,
        decoded = require('../../middlewares/jwt')(authorization, req.password),
        channel_id = uuid.gen()

    if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
    if (isNaN(id)) return res.status(400).json(new ApiError(400, 'The value is not int.'))

    let server = await guilds.findById(id)
    console.log(server)
    if (!server) return res.status(404).json(ApiError.notfound)
    const member = await server.members.find(a => a.user.id === decoded.ID)
    if (!member) return res.status(403).json(ApiError.forbidden)

    if(server.channels.length > 200) return res.status(403).json(ApiError.forbidden)

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

    if (!a.includes("ADMINISTRATOR") && !a.includes("MANAGE_CHANNELS")) return res.status(401).json(ApiError.unauthorized)

    await guilds.findByIdAndUpdate(server._id, {
        $push: {
            channels: Number(channel_id)
        }
    })

    let new_channel = await channels.create({
        _id: channel_id,
        name: name || 'new channel',
        guild: {
            id: server._id,
            name: server.name
        },
        rate_limit_per_user: 0,
        author: decoded.ID,
        type: 1,
        permissions: [
            'SEND_MESSAGE',
            'READ_MESSAGE',
            'CREATE_INVITE',
            'SPEAK',
            'CONNECT'
        ],
        categorie: channel_id,
        CreatedAt: Date.now()
    })

    server.channels.push(Number(channel_id))
    server.save()

    return res.status(201).json({
        code: 201,
        channel: new_channel
    })
}