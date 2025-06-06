require('dotenv').config();

module.exports = {
    secret: process.env.AUTH_SECRET || "tusecretoparalostokens",
    jwtExpiration: process.env.JWT_Expiration || 86400, //24 horas en segundos
    saltRounds: process.env.SALT_ROUNDS || 8
};