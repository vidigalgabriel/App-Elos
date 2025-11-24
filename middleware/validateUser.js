const { userSchema } = require('../schemas/schemas')
const ExpressError = require('../utils/ExpressError')

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(', ')
    throw new ExpressError(msg, 400)
  }
  next()
}

module.exports = validateUser
