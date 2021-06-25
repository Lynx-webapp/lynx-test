const router = require('express').Router()

router.route('/login').post(
    require('./login.js')
)
router.route('/register').post(
    require('./register.js')
)

module.exports = router
