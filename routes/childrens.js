const express = require('express');
const router = express.Router();
const childrenController = require('../controllers/childrenController');
const validateChild = require('../middleware/validateChild');
const { isLoggedIn } = require('../middleware/authMiddleware');

router.route('/')
  .get(isLoggedIn, childrenController.index)
  .post(isLoggedIn, validateChild, childrenController.createChild);

router.get('/new', isLoggedIn, childrenController.renderNewForm);

router.route('/:id')
  .get(isLoggedIn, childrenController.showChild)
  .put(isLoggedIn, validateChild, childrenController.updateChild)
  .delete(isLoggedIn, childrenController.deleteChild);

router.get('/:id/edit', isLoggedIn, childrenController.renderEditForm);

module.exports = router;
