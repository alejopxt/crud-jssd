const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        require: [true, 'La descripcion es obligatoria'],
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

//  Eliminar el indice problematico si existe
categorySchema.pre('save', async function(next) {
    try {
        const collection = this.constructor.collection;
        const indexes = await collection.indexes();

        // Buscar y eliminar indice problematico con nombre "nombre_1"
        const problematicIndex = indexes.find(index => index.name === 'nombre_1');
        if(problematicIndex) {
            await collection.dropIndex('nombre_1');
        }
    } catch  (err) {
        //Ignorar si el indice no existe
        if (!err.message.includes('index not Found')) {
            return next(err);
        }
    }
    next();
});

// Crear nuevo indice correcto
categorySchema.index({ name:1 }, {
    unique: true,
    name: 'name_1' //Nombre explicito para el indice
})

module.exports = mongoose.model('Category', categorySchema);