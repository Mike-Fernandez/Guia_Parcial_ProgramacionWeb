var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');

router.get('/search/:search', postController.find);
router.get('/:id', postController.getPost);
router.get('/', postController.getAllPosts);

router.post('/', postController.makePost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;