const router = require('express').Router()

router.use('/', require('./auth'), require('./guild'), require('./users/referral/index'), require('./channels/index'))
router.use('/users', require('./users/account/index'), require('./users/relationship/index'), require('./users/cache/index'))

module.exports = router