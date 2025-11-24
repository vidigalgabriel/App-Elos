const { tutorSchema } = require('../schemas/schemas');
const ExpressError = require('../utils/ExpressError');

const validateTutor = (req, res, next) => {
const { error } = tutorSchema.validate(req.body);
if (error) {
const msg = error.details.map(el => el.message).join(', ');
throw new ExpressError(msg, 400);
}
next();
};

module.exports = validateTutor;
