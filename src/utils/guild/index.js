const router = require('express').Router(),
auth = require('../../middlewares/authorization')

/** routes guild */
router.route('/guild').post(
    auth,
    require('./CreateGuild')
)
router.route('/guild/:code').delete(
    auth,
    require('./DeleteAndLeave')
)
router.route('/guild/:code/permissions').get(
    auth,
    require('./GetPermissions')
)
router.route('/guild/:code').get(
    auth,
    require('./Guild_id')
)

/** routes invite */
router.route('/guild/:guild_id/:channel_id/invite').post(
    auth,
    require('./invite/CreateInvite')
)
router.route('/invite/:code').delete(
    auth,
    require('./invite/DeleteInvite')
)
router.route('/invite/:code').get(
    require('./invite/GetInvite')
)
router.route('/invite/:code').post(
    auth,
    require('./invite/JoinGuild')
)

/** routes roles */
router.route('/guild/:id/roles').post(
    auth,
    require('./roles/CreateRole')
)
router.route('/guild/:guild_id/roles/:role_id').patch(
    auth,
    require('./roles/ManageRole')
)
router.route('/guild/:guild_id/roles/:role_id').get(
    auth,
    require('./roles/GetRole')
)
router.route('/guild/:guild_id/roles/:role_id').delete(
    auth,
    require('./roles/DeleteRole')
)
router.route('/guild/:guild_id/roles/:role_id/member/:member_id').post(
    auth,
    require('./roles/AddRoleMember')
)
router.route('/guild/:guild_id/roles/:role_id/member/:member_id').delete(
    auth,
    require('./roles/RemoveRoleMember')
)

module.exports = router