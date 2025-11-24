const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logController');
const { logSchema } = require('../schemas/schemas');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware/authMiddleware');

const validateLog = (req, res, next) => {
    const { error } = logSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
};

router.get('/', isLoggedIn, logsController.index);
router.post('/', isLoggedIn, validateLog, logsController.createLog);
router.get('/:id', isLoggedIn, logsController.showLog);

module.exports = router;
