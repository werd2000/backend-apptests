const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let puntuacionIndiceSchema = new Schema({
    grupo_etareo: {
        type: String
    },
    prueba: {
        type: String,
    },
    minimo: {
        type: String,
    },
    maximo: {
        type: String,
    },
    puntuacion_escalar: {
        type: String,
    },
});

puntuacionIndiceSchema.methods.toJSON = function() {
    let puntuacionIndice = this;
    let puntuacionIndiceObject = puntuacionIndice.toObject();

    return puntuacionIndiceObject;
};

// wiscAdministradoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('PuntuacionIndice', puntuacionIndiceSchema);