const router = require('express').Router(),
auth = require('../../../middlewares/authorization')

/** routes accounts */
router.route('/referral').post(
    auth,
    require('./CreateLink')
)
router.route('/referral/:code').get(
    auth,
    require('./GetInfos')
)

module.exports = router