const ApiError = require('../../../helpers/ApiError'),
    guilds = require('../../../models/guild.model'),
    roles = require('../../../models/roles.model'),
    uuid = require('../../../function/uuid').default

module.exports = async (req, res) => {

    if (!req.params) return res.status(400).json(ApiError.badrequest)
    if (!req.password) return res.status(401).json(ApiError.unauthorized)

    const {
        id
    } = req.params, {
        name
    } = req.body
    authorization = req.headers.authorization || req.signedCookies.Authorization,
        decoded = require('../../../middlewares/jwt')(authorization, req.password),
        role_id = uuid.gen()

    if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
    if (isNaN(id)) return res.status(400).json(new ApiError(400, 'The value is not int.'))

    let server = await guilds.findById(id)
    if (!server) return res.status(404).json(ApiError.notfound)
    const member = await server.members.find(a => a.user.id === decoded.ID)
    if (!member) return res.status(403).json(ApiError.forbidden)

    console.log(await roles.find({ 'guild.id': id }).length)
    if(await roles.find({ 'guild.id': id }).length > 100) return res.status(403).json(ApiError.forbidden)

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

    if (!a.includes("ADMINISTRATOR") && !a.includes("MANAGE_ROLES")) return res.status(401).json(ApiError.unauthorized)

    await guilds.findByIdAndUpdate(server._id, {
        $push: {
            roles: Number(role_id)
        }
    })

    let new_role = await roles.create({
        _id: role_id,
        name: name || 'new role',
        guild: server._id,
        permissions: [
            'SEND_MESSAGE',
            'READ_MESSAGE',
            'CREATE_INVITE',
            'SPEAK',
            'CONNECT'
        ],
        color: '#ababab',
        deletable: true,
        default: false,
        CreatedAt: Date.now()
    })

    return res.status(201).json({
        code: 201,
        role: new_role
    })
}