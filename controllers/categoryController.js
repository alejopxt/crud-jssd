const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const {name, description } = req.body;

        //Validacion
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ 
                success: false,
                message: 'El nombre es obligatorio y debe ser un texto valido'
            });
        }
    
        if(!description || typeof description  !== 'string' || !description.trim()) {
            return res.status(400).json({ 
                success: false,
                message: 'La descripcion es obligatoria y debe ser un texto valido'
            });
        }

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    // Verificar si ya existe la categoria
    const existingCategory = await Category.findOne({ name: trimmedName});
    if (existingCategory) {
    return res.status(400).json({
        success: false,
        message: 'Ya existe una categoria con ese nombre'
        });
    }

    const newCategory = new Category({
        name: trimmedName,
        description: trimmedDesc
    });

    await newCategory.save();

    res.status(201).json({
        success: true,
        message: 'Categoria creada correctamente',
        data: newCategory
    });
} catch (error) {
    console.error('Error en createCategory:', error);

    // Manejo especifico de error de duplicados
    if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Ya existe una categoria con ese nombre'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Error al crear categoria',
        error: error.message
    });
    }
};


exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findOne().sort({ createdAt: -1});
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error en getCategories:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorias'
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error en getCategoryById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categoria'
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const {name, description} = req.body;
        const updateData = {};
        
        if (name) {
            updateData.name = name.trim();
            // verificar si el nuevo nombre ya existe
            const existing = await Category.findOne({
                name: updateData.name,
                _id: { $ne: req.params.id }
            });
            if (existing) {
                res.status(400).json({
                    success: false,
                    message: 'Ya existe una categoria con ese nombre'
                });
            }
        }

        if(description) {
            updateData.description = description.trim();
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true, runValidators: true}
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categoria actualizada correctamente',
            data: updatedCategory
        });
    } catch (error) {
        console.error('Error en updateCategory:', error)
        res.status(500).json({
            success: false,
            message: 'Error al actualizar categoria',
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deleteCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deleteCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Categoria eliminada',
        });
    } catch (error) {
        console.error('Error en deleteCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar categoria'
        });
    }
};