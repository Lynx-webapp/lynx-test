const router = require('express').Router(),
auth = require('../../../middlewares/authorization')

/** routes cache */
router.route('/:id').get(
    auth,
    require('./FindUser.cache')
)
router.route('/:id/profile').get(
    auth,
    require('./FindUserProfile.cache')
)

module.exports = router