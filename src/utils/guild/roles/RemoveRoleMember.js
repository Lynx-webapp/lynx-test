const ApiError = require('../../../helpers/ApiError'),
    guilds = require('../../../models/guild.model'),
    roles = require('../../../models/roles.model')

module.exports = async (req, res) => {

    if (!req.params) return res.status(400).json(ApiError.badrequest)
    if (!req.password) return res.status(401).json(ApiError.unauthorized)

    const {
        guild_id,
        role_id,
        member_id
    } = req.params,
        authorization = req.headers.authorization || req.signedCookies.Authorization,
        decoded = require('../../../middlewares/jwt')(authorization, req.password)

    if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
    if (isNaN(guild_id)) return res.status(400).json(new ApiError(400, 'The value is not int.'))


    /** infos is valid ? */
    let server = await guilds.findById(guild_id)
    if (!server) return res.status(404).json(ApiError.notfound)

    let client = await server.members.find(a => a.user.id === decoded.ID)
    if (!client) return res.status(403).json(ApiError.forbidden)

    let member = await server.members.find(a => a.user.id === Number(member_id))
    if (!member) return res.status(404).json(ApiError.notfound)

    let role = await roles.findById(role_id)
    if (!role) return res.status(404).json(ApiError.notfound)

    let check_member_role = server.members.find(a => {
        a.roles.includes(role._id)
    })
    if (check_member_role) return res.status(403).json({
        code: 403,
        message: 'the user already has the role'
    })

    client_role = await roles.find({
        '_id': {
            $in: client.roles
        }
    })
    let a = [],
        ok = true,
        arr = []
    client_role.forEach(b => {

        b.permissions.forEach(c => {
            a.push(String(c))
        })

        if (Number(server.roles.indexOf(b._id)) > Number(server.roles.indexOf(role._id))) {
            ok = false
        }

        arr.push(Number(server.roles.indexOf(b._id)))
    })
    if (Number(server.roles.indexOf(role._id)) === Math.min(...arr)) return res.status(403).json(ApiError.forbidden)
    if (Math.min(...arr) < Number(server.roles.indexOf(role._id))) {
        ok = true
    }
    if (!ok) return res.status(403).json(ApiError.forbidden)

    if (!a.includes("ADMINISTRATOR") && !a.includes("MANAGE_ROLES")) return res.status(403).json({
        code: 403,
        message: 'Missing permissions',
        required: ['ADMINISTRATOR', 'MANAGE_ROLES']
    })

    let c = server.members.find(a=> a.user.id === Number(member_id))
    c.roles.pull(role._id)
    server.save()

    return res.status(204).json({
        code: 204
    })
}