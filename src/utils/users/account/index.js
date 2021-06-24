const router = require('express').Router(),
auth = require('../../../middlewares/authorization')

/** routes accounts */
router.route('/@me').get(
    auth,
    require('./GetAccount')
)
router.route('/@me').delete(
    auth,
    require('./DeleteAccount')
)

module.exports = router