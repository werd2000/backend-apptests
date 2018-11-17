const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Paciente = require('../models/paciente');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/pacientes', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 10;
    limite = Number(limite);
    let terapeuta = req.query.terapeuta || 'todos';
    let condicion = {};
    if (terapeuta !== 'todos') {
        condicion = { estado: true, cargado_por: terapeuta };
    }
    // Usuario.find({ acá van las condiciones de búsqueda }, 'los campos que quiero mostrar')
    Paciente.find(condicion)
        .skip(desde)
        .limit(limite)
        .populate('cargado_por', 'nombre email')
        .exec((err, pacientes) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            Paciente.countDocuments(condicion, (err, cantidad) => {
                return res.json({
                    ok: true,
                    pacientes,
                    cantidad
                });
            });

        });
});

app.get('/paciente/:id', [verificaToken], (req, res) => {
    const id = req.params.id;
    Paciente.findById(id)
        .populate('cargado_por')
        .exec((err, pacienteDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar al paciente.',
                    errors: err
                });
            }

            if (!pacienteDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El paciente con el id ' + id + ' no existe.',
                    errors: { message: 'No existe un paciente con ese ID.' }
                });
            }

            res.status(200).json({
                ok: true,
                paciente: pacienteDB
            });
        });
});



app.post('/paciente', verificaToken, function(req, res, next) {
    let body = req.body;

    let paciente = new Paciente({
        apellido: body.apellido,
        nombre: body.nombre,
        tipo_doc: body.tipo_doc,
        nro_doc: body.nro_doc,
        nacionalidad: body.nacionalidad,
        sexo: body.sexo,
        cargado_por: body.cargado_por,
        actualizado: new Date().getTime(),
        fecha_nac: body.fecha_nac,
        // domicilio: domicilio
    });

    paciente.save((err, pacienteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        return res.json({
            ok: true,
            paciente: pacienteDB
        });
    });

});

// =========================================================
// Actualizar un paciente
// =========================================================
app.put('/paciente/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'email', 'sexo', 'fnac']);
    let body = req.body;

    Paciente.findById(id, (err, paciente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar paciente.',
                errors: err
            });
        }

        if (!paciente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El paciente con el id ' + id + ' no existe.',
                errors: { message: 'No existe un paciente con ese ID.' }
            });
        }

        paciente.apellido = body.apellido;
        paciente.nombre = body.nombre;
        paciente.tipo_doc = body.tipo_doc;
        paciente.nro_doc = body.nro_doc;
        paciente.nacionalidad = body.nacionalidad;
        paciente.sexo = body.sexo;
        paciente.fecha_nac = body.fecha_nac;
        paciente.actualizado = new Date().getTime();
        paciente.cargado_por = body.cargado_por;
        paciente.img = body.img;

        paciente.save((err, pacienteGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar paciente.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                paciente: pacienteGuardado
            });
        });
    });
});

app.delete('/paciente/:id', [verificaToken], function(req, res) {

    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let cambiaEstado = {
        estado: false
    };
    Paciente.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, pacienteBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            paciente: pacienteBorrado
        });
    });
});


module.exports = app;