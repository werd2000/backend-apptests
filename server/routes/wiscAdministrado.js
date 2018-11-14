const express = require('express');

const WiscAdministrado = require('../models/wiscAdministrado');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

app.get('/wiscadministrado', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    // WiscAdministrado.find({ acá van las condiciones de búsqueda }, 'los campos que quiero mostrar')
    WiscAdministrado.find({})
        .skip(desde)
        .limit(limite)
        .populate('paciente', 'apellido nombre img')
        .exec((err, wiscAdministrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            WiscAdministrado.countDocuments({}, (err, cantidad) => {
                return res.json({
                    ok: true,
                    wiscAdministrado,
                    cantidad
                });
            });

        });
});

app.get('/wiscadministrado/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    WiscAdministrado.findById(id)
        .populate('paciente', 'apellido nombre img fecha_nac')
        .exec((err, wiscDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el test.',
                    errors: err
                });
            }

            if (!wiscDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La prueba con el id ' + id + ' no existe.',
                    errors: { message: 'No existen resultados con ese ID.' }
                });
            }

            res.status(200).json({
                ok: true,
                wiscAdministrado: wiscDB
            });
        });
});



app.post('/wiscadministrado', verificaToken, function(req, res, next) {
    let body = req.body;

    let wisc = new WiscAdministrado({
        paciente: body.paciente,
        fecha_eval: body.fecha_eval,
        edad_eval: body.edad_eval,
        grupo_etareo: body.grupo_etareo,
        edad_mental: body.edad_mental,
    });

    wisc.save((err, wiscDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        return res.json({
            ok: true,
            wiscAdministrado: wiscDB
        });
    });

});

// =========================================================
// Actualizar un test
// =========================================================
app.put('/wiscadministrado/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['paciente', 'fecha_eval', 'edad_eval', 'grupo_etareo', 'edad_mental']);

    WiscAdministrado.findById(id, (err, wiscAdministrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar test administrado.',
                errors: err
            });
        }

        if (!wiscAdministrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La prueba con el id ' + id + ' no existe.',
                errors: { message: 'No existen resultados con ese ID.' }
            });
        }

        wiscAdministrado.paciente = req.body.paciente;
        wiscAdministrado.fecha_eval = body.fecha_eval;
        wiscAdministrado.edad_eval = body.edad_eval;
        wiscAdministrado.grupo_etareo = body.grupo_etareo;
        wiscAdministrado.edad_mental = body.edad_mental;
        console.log(wiscAdministrado);

        wiscAdministrado.save((err, wiscGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar prueba.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                wiscGuardado
            });
        });
    });
});

app.delete('/wiscadministrado/:id', function(req, res) {

    let id = req.params.id;
    WiscAdministrado.findByIdAndRemove(id, (err, wiscBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!wiscBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Prueba no encontrada'
                }
            });
        }

        return res.json({
            ok: true,
            wiscBorrado
        });
    });
});



module.exports = app;