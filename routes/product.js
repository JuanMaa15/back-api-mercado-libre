const {Router} = require('express');
const ProductController = require('../controller/productController');

const router = Router();

router.post('/create', ProductController.create);

module.exports = router;
