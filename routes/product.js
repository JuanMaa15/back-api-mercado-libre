const {Router} = require('express');
const ProductController = require('../controller/productController');

const router = Router();

router.post('/create', ProductController.create);
router.get('/get', ProductController.getAPI);

module.exports = router;


//Actividades tareas 
