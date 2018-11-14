const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let sexosValidos = {
    values: ['SIN DATOS', 'VARON', 'MUJER'],
    message: '{VALUE} no es un valor válido'
};
let tipoDocValidos = {
    values: ['DNI', 'CI', 'CUIL'],
    message: '{VALUE} no es un valor válido'
};

let Schema = mongoose.Schema;

let pacienteSchema = new Schema({
    apellido: { type: String, required: [true, 'El apellido es necesario'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    tipo_doc: { type: String, default: 'DNI', enum: tipoDocValidos },
    nro_doc: { type: String, required: false, default: '' },
    nacionalidad: { type: String, default: 'ARGENTINA' },
    sexo: { type: String, enum: sexosValidos, default: 'SIN DATOS' },
    cargado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    actualizado: { type: String, required: false },
    fecha_nac: { type: String, default: '' },
    domicilio: { type: Schema.Types.ObjectId, ref: 'Domicilio', required: false },
    estado: { type: Boolean, default: true },
    img: { type: String, default: '' }
});

pacienteSchema.methods.toJSON = function() {
    let paciente = this;
    let pacienteObject = paciente.toObject();

    return pacienteObject;
};

pacienteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Paciente', pacienteSchema);