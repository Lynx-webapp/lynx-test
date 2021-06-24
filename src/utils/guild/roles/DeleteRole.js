const ApiError = require('../../../helpers/ApiError'),
    guilds = require('../../../models/guild.model'),
    roles = require('../../../models/roles.model')

module.exports = async (req, res) => {

    if (!req.params) return res.status(400).json(ApiError.badrequest)
    if (!req.password) return res.status(401).json(ApiError.unauthorized)

    function hexColored(h) {
        if(!h) return;
        const r = /^#[0-9a-f]{3,6}$/i
        if (h.match(r)) {
            return h
        } else {
            return null
        }
    }
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

    role = await roles.findById(role_id)

    if(!role) return res.status(404).json(ApiError.notfound)

    const member = await server.members.find(a => a.user.id === decoded.ID)
    if (!member) return res.status(403).json(ApiError.forbidden)

    role_member = await roles.find({
        '_id': {
            $in: member.roles
        }
    })
    let a = [],
    ok = true,
    arr = []
    role_member.forEach(b => {
        b.permissions.forEach(c => {
            a.push(String(c))
        })
        if (Number(server.roles.indexOf(b._id)) > Number(server.roles.indexOf(role._id))) {
            ok = false
        }
        arr.push(Number(server.roles.indexOf(b._id)))
    })

    let filtre = Math.min(...arr)

    if (Number(server.roles.indexOf(role._id)) === filtre) return res.status(403).json(ApiError.forbidden)
    if (Math.min(...arr) < Number(server.roles.indexOf(role._id))) {
        ok = true
    }

    if (!ok) return res.status(403).json(ApiError.forbidden)

    if (!a.includes("ADMINISTRATOR") && !a.includes("MANAGE_ROLES")) return res.status(403).json({ code: 403, message: 'Missing permissions', required: ['ADMINISTRATOR', 'MANAGE_ROLES']})

    if (!role.deletable) return res.status(403).json(ApiError.forbidden)

    await guilds.findByIdAndUpdate(guild_id, {
        $pull: {
            roles: Number(role_id),
            members: {
                roles: {
                    $elemMatch: Number(role_id)
                }
            }
        }
    })
    role.remove()

    return res.status(204).json({
        code: 204
    })
}