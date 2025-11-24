const { occurrenceSchema } = require('../schemas/schemas');
const ExpressError = require('../utils/ExpressError');

const validateOccurrence = (req, res, next) => {
const { error } = occurrenceSchema.validate(req.body);
if (error) {
const msg = error.details.map(el => el.message).join(', ');
throw new ExpressError(msg, 400);
}
next();
};

module.exports = validateOccurrence;
