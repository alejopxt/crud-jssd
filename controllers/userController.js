const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios (Solo Admin)
exports.getAllUsers = async (req, res) => {
    console.log('[CONTROLLER] Ejecutando getAllUsers'); //Diagnostico
    try {
        const users = await User.find().select('password');
        console.log('[CONTROLLER] Usuarios encontrados:', users.length); //Diagnostico
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('[CONTROLLER] Error en getAllUsers:', error.message); //Diagnostico
        res.status(500).json({
            success: false,
            message: 'Error al obtener los usuarios'
        });
    }
};


// Obtener usuario especifico
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Validaciones de acceso
        if (req.user.role === 'auxiliar' && req.user._id!==user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver este usuario'
            });
        }

        if (req.user.role === 'admin' && user.role === 'admin'){
            return res.status(403).json({
                success: false,
                message: 'NO puedes ver ususarios admin'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario',
            error: error.message
        });
    }
};

//Crear usuario (Admin y Coordinador)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const user = new User({
            username,
            email,
            password: await bcrypt.hash(password, 10),
            role
        });

        const savedUser = await user.save();

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el usuario',
            error: error.message
        });
    }
};

// Actualizar usuario (Admin y Coordinador)
exports.updateUser = async (req, res) => {
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el usuario',
            error: error.message
        });
    }
};

// Eliminar usuario (solo Admin)
exports.deleteUser = async (req, res) => {
    console.log('[CONTROLLER] Ejecutando deleteUser para ID', req.params.id); //Diagnostico
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            console.error('[CONTROLLER] Usuario no encontrado para eliminar'); //Diagnostico
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        console.log('[CONTROLLER] Usuario eliminado exitosamente:', deletedUser._id); //Diagnostico
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error('[CONTROLLER] Error al eliminar usuario:', error.message); //Diagnostico
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario',
        });
    }
};
