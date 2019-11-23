var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')

router.get('/', userController.getAll);
router.get('/:username', userController.getOne);


module.exports = router;