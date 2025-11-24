const { childSchema } = require('../schemas/schemas')
const ExpressError = require('../utils/ExpressError')

const validateChild = (req, res, next) => {
  const data = {
    name: req.body.childName,
    birthDate: req.body.childBirthDate,
    specialNeeds: req.body.childSpecialNeeds,
    age: req.body.childAge
  }

  const { error } = childSchema.validate(data)
  if (error) {
    const msg = error.details.map(el => el.message).join(', ')
    throw new ExpressError(msg, 400)
  }
  next()
}

module.exports = validateChild
