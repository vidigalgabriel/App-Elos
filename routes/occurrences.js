const express = require('express');
const router = express.Router();
const occurrencesController = require('../controllers/occurrenceController');
const validateOccurrence = require('../middleware/validateOccurrence');
const { isLoggedIn } = require('../middleware/authMiddleware');

router.get('/', isLoggedIn, occurrencesController.index);
router.post('/', isLoggedIn, validateOccurrence, occurrencesController.createOccurrence);

router.get('/new', isLoggedIn, occurrencesController.renderNewForm);

router.get('/:id', isLoggedIn, occurrencesController.showOccurrence);
router.put('/:id', isLoggedIn, validateOccurrence, occurrencesController.updateOccurrence);
router.delete('/:id', isLoggedIn, occurrencesController.deleteOccurrence);

router.get('/:id/edit', isLoggedIn, occurrencesController.renderEditForm);

module.exports = router;
