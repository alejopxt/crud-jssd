const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers');
const { check } = require('express-validator');

const validateProduct = [
    check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('description').not().isEmpty().withMessage('La descripción es obligatoria'),
    check('price').isFloat({ min:0 }).withMessage('Precio invalido'),
    check('stock').isInt({ min:0 }).withMessage('stock invalido'),
    check('category').not().isEmpty().withMessage('La categoría es requerida'),
    check('subcategory').not().isEmpty().withMessage('La subcategoría es requerida')
];

router.post('/', validateProduct, productController.createProduct);
router.get('/', productController.getProducts)
router.get('/:id', productController.getProductsById);
router.put('/:id', validateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;