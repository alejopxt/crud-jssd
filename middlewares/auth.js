const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        replace('Bearer ', ' ');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticacion'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token invalido o expirado', //Viva petro
        });
    }
};

// Middleware de autorización
exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para realizar esta accion',
                requiredRoles: roles,
                currentRole: req.user.role
            });
        }
        next();
    };
};