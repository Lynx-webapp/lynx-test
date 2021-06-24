const router = require('express').Router(),
auth = require('../../../middlewares/authorization')

/** routes relationship */
router.route('/relationship/:to').patch(
    auth,
    require('./AcceptFriend')
)
router.route('/relationship/:to').post(
    auth,
    require('./AddFriend')
)
router.route('/relationship/:to').post(
    auth,
    require('./AddFriend')
)
router.route('/relationship/:to').delete(
    auth,
    require('./DeniedFriend')
)
router.route('/relationship/').get(
    auth,
    require('./GetAllFriends')
)

module.exports = router