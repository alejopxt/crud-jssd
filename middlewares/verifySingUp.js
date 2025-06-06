const User = require ('../models/User');

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try { 
        const user = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        }).exec();

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Error Usuario o email ya existen!'
            });
        }
        next();
    } catch (err) {
        console.error('[verifySignUp] Error en checkDuplicateUsernameOrEmail:', err);
        res.status(500).json({
            success: false,
            message: 'Error al verificar credenciales',
            error: err.message
        });
    }
};

const checkRolesExisted = (req, res, next) => {
    //Verificamos si viene el campo 'role' como string
    if (req.body.role) {
        const validRoles = ['admin', 'coordinador', 'auxiliar'];

        if (!validRoles.includes(req.body.role)) {
            return res.status(400).json({
                success: false,
                message: `Rol no valido: ${req.body.role}`
            });
        }
    }
    next();
};
module.exports = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
}