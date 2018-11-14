const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let wiscAdministradoSchema = new Schema({
    paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
    fecha_eval: {
        type: String,
    },
    edad_eval: {
        type: String,
    },
    grupo_etareo: {
        type: String,
    },
    edad_mental: {
        type: String,
    },
});

wiscAdministradoSchema.methods.toJSON = function() {
    let wiscAdministrado = this;
    let wiscAdministradoObject = wiscAdministrado.toObject();

    return wiscAdministradoObject;
};

wiscAdministradoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('WiscAdministrado', wiscAdministradoSchema);