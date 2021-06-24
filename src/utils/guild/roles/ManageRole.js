const ApiError = require('../../../helpers/ApiError'),
    guilds = require('../../../models/guild.model'),
    roles = require('../../../models/roles.model')

module.exports = async (req, res) => {

    if (!req.params) return res.status(400).json(ApiError.badrequest)
    if (!req.password) return res.status(401).json(ApiError.unauthorized)

    function hexColored(h) {
        if (!h) return;
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
    } = req.params, {
        name,
        color,
        permissions,
        position
    } = req.body
    authorization = req.headers.authorization || req.signedCookies.Authorization,
        decoded = require('../../../middlewares/jwt')(authorization, req.password)

    if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

    if (isNaN(guild_id) && isNaN(role_id)) return res.status(400).json(new ApiError(400, 'The value is not int.'))

    const server = await guilds.findById(guild_id)
    if (!server) return res.status(404).json(ApiError.notfound)

    role = await roles.findById(role_id)

    if (!role) return res.status(404).json(ApiError.notfound)

    const member = await server.members.find(a => a.user.id === decoded.ID)
    if (!member) return res.status(403).json(ApiError.forbidden)

    client_role = await roles.find({
        '_id': {
            $in: member.roles
        }
    })
    let a = [],
        ok = true,
        positionok = true,
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

    if (Number(server.roles.indexOf(role._id)) === Math.min(...arr)) {
        positionok = false
    }
    console.log(Math.min(...arr), Number(server.roles.indexOf(role._id)))
    if (Math.min(...arr) < Number(server.roles.indexOf(role._id))) {
        ok = true
    }

    console.log(ok)
    if (!ok) return res.status(403).json(ApiError.forbidden)

    if (!a.includes("ADMINISTRATOR") && !a.includes("MANAGE_ROLES")) return res.status(403).json({
        code: 403,
        message: 'Missing permissions',
        required: ['ADMINISTRATOR', 'MANAGE_ROLES']
    })

    [permissions].forEach(a => {
        if (a && !require('../../../models/other/permissions.json').permissions.includes(a)) return res.status(400).json(ApiError.badrequest)
    })

    if (position < 0) return res.status(400).json(ApiError.badrequest)
    if (position > server.roles.length) return res.status(400).json(ApiError.badrequest)
    if (position) {
        await guilds.findByIdAndUpdate(guild_id, {
            $pull: {
                roles: Number(role_id)
            }
        })
        await guilds.findByIdAndUpdate(guild_id, {
            $push: {
                roles: {
                    $each: [Number(role_id)],
                    $position: position
                }
            }
        })
    }

    const result = {
        name: name || role.name,
        color: hexColored(color) || role.color,
        permissions: permissions || role.permissions,
        position: positionok ? position !== 0 ? position : 1 : role.position
    }

    await roles.findByIdAndUpdate(role_id, result)


    res.status(200).json({
        code: 200,
        roles: result
    })
}