const router = require('express').Router(),
auth = require('../../middlewares/authorization')

router.route('/guild/:id/channel').post(
    auth,
    require('./CreateChannel')
)

module.exports = router