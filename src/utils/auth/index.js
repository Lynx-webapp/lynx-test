const router = require('express').Router()

router.route('/login').post(
    require('./login')
)
router.route('/register').post(
    require('./register')
)

module.exports = router