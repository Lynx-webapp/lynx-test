const ApiError = require('../../../helpers/ApiError'),
    invite = require('../../../models/invite.model')

module.exports = async (req, res) => {

    if (!req.params) return res.status(400).json(ApiError.badrequest)
    if (!req.password) return res.status(401).json(ApiError.unauthorized)
    const {
        code
    } = req.params,
    i = await invite.findOne({
        code: code
    })

    if (!i) return res.status(404).json(ApiError.notfound)


    if (Date.parse(i.expired) < Date.now()) {
        i.remove()
        return res.status(404).json(ApiError.notfound)
    }

    return res.status(200).json(i)

}