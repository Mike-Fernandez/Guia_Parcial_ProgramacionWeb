var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');

router.get('/:username', postController.getPost);
router.get('/', postController.getAllPosts);

router.post('/', postController.makePost);
router.put('/:username', postController.updatePost);
router.delete('/:username', postController.deletePost);

module.exports = router;