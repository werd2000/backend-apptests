const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let testSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario'],
    },
    descripcion: {
        type: String,
        required: false
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria']
    },
    tags: {
        type: String,
        required: false
    },
    img: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }
});

testSchema.methods.toJSON = function() {
    let test = this;
    let testObject = test.toObject();

    return testObject;
};

testSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Test', testSchema);