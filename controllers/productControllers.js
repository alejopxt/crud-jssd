const Product = require('../models/Products');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const subcategory = require('../models/Subcategory');

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, subcategory } = req.body;

        // Validacion de campos requeridos
        if (!name || !description || !price || !stock || !category || !subcategory) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        // Verificar si la categoria exista
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: 'La categoria especifica no existe'
            });
        }

        // Verificar que la subcategoria existe y pertenezca a la categoria
        const subcategoryExists = await Subcategory.findOne({
            _id: subcategory,
            category: category
        });

        if (!subcategoryExists) {
            return res.status(404).json({
                success: false,
                message: 'La subcategoria no existe o no pertenece a la categoria especifica'
            });
        }

        // Crear el producto sin el createBy temporalmente
        const product = new Product({
            name: name.trim(),
            description: description.trim(),
            price,
            stock,
            category,
            subcategory
            // CreatedBy se agregara despues de verificar el usuario
        });

        // Verificar si el usuario esta disponible en el request
        if (req.user && req.user._id) {
            product.createdBy = req.user._id;
        }

        // Guardar en la base de datos
        const savedProduct = await product.save();

        // Obtener el producto con los datos poblados
        const productWithDetails = await Product.findById(savedProduct._id)
        .populate('category', 'name')
        .populate('subcategory', 'name')

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: productWithDetails
        });

    } catch (error) {
        console.error('Error en createdProduct:', error);

        // Manejo de errores en mongoDB
        if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Ya existe un producto con ese nombre'
        })
    } 

        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message
        });
    }
};

// Consulta de productos  GET api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .populate('subcategory', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count : products.length,
            data: products
        });
    } catch (error) {
        console.error('Error de getProducts', error)
        res.status(500).json({
            success: false,
            message: 'Error añ obtener productos'
        });
    }
};


exports.getProductsById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        .populate('category', 'name description')
        .populate('subcategory', 'name description')

        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
    console.error('Error en getProductById', error)
    res.status(500).json({
        success: false,
        message: 'Error añ obtener producto'
    });
    }
    };

    exports.updateProduct = async (req, res) => {
        try {
            const {name, description, price, stock,category, subcategory } =req.body;
            const updateData = {};

            // Validar y prepara datos para actualizacion
            if (name) updateData.name = name;
            if (description) updateData.description = description;
            if (price) updateData.price = price;
            if (stock) updateData.stock = stock;

            // Validar relaciones si se actualizan 
            if (category || subcategory) {
                if (category) {
                    const categoryExists = await Category.findById(category);
                    if (!categoryExists) {
                        return res.status(404).json({
                            success: false,
                            message: 'La categoria especifica no existe'
                        });
                    }
                    updateData.category = category;
                }

                if (subcategory) {
                    const subcategoryExists = await Subcategory.findOne({
                        _id: subcategory,
                        category: category || updateData.category
                    });

                    if (!subcategoryExists) {
                        return res.status(400).json ({
                            success: false,
                            message: 'La subcategoria no existe o no pertenece a la categoria'
                        });
                    }
                    update.Subcategory = subca
                }
            }

            // Actualizar el producto
            const updateProduct = await Product.findByIdAndUpdate(
                req.param.id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate('category', 'name')
            .populate('subcategory', 'name');

            if (!updateProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: updatedProduct
            });

    } catch (error) {
        console.error('Error en updateProduct', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar producto',
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente',
            data: product
        });

    } catch (error) {
        console.error('Error en deleteProduct', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto',
        });
    }
};