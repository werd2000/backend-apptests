const express = require('express');

const PuntuacionIndice = require('../models/puntuacionIndice');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

app.get('/puntuacionesindice', verificaToken, (req, res) => {
    let grupo_etareo = req.query.grupo_etareo || 0;
    let prueba = req.query.prueba || '';
    let puntaje = req.query.puntaje || 0;
    // WiscAdministrado.find({ acá van las condiciones de búsqueda }, 'los campos que quiero mostrar')
    PuntuacionIndice.find({ 'grupo_etareo': grupo_etareo, 'prueba': prueba })
        .exec((err, pi) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            PuntuacionIndice.countDocuments({}, (err, cantidad) => {
                return res.json({
                    ok: true,
                    pi,
                    cantidad
                });
            });

        });
});

app.get('/puntuacionindice/:id', verificaToken, (req, res) => {
    // const id = req.params.id;
    // WiscAdministrado.findById(id)
    //     .populate('paciente', 'apellido nombre img fecha_nac')
    //     .exec((err, wiscDB) => {
    //         if (err) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 mensaje: 'Error al buscar el test.',
    //                 errors: err
    //             });
    //         }

    //         if (!wiscDB) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 mensaje: 'La prueba con el id ' + id + ' no existe.',
    //                 errors: { message: 'No existen resultados con ese ID.' }
    //             });
    //         }

    //         res.status(200).json({
    //             ok: true,
    //             wiscAdministrado: wiscDB
    //         });
    //     });
});



app.post('/puntuacionindice', verificaToken, function(req, res, next) {
    let body = req.body;

    let pi = new PuntuacionIndice({
        grupo_etareo: body.grupo_etareo,
        prueba: body.prueba,
        minimo: body.min,
        maximo: body.max,
        puntuacion_escalar: body.pe,
    });

    pi.save((err, piDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        return res.json({
            ok: true,
            pi: piDB
        });
    });

});

// =========================================================
// Actualizar un test
// =========================================================
app.put('/puntuacionindice/:id', [verificaToken, verificaAdminRole], (req, res) => {

    // let id = req.params.id;
    // let body = _.pick(req.body, ['paciente', 'fecha_eval', 'edad_eval', 'grupo_etareo', 'edad_mental']);

    // WiscAdministrado.findById(id, (err, wiscAdministrado) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             mensaje: 'Error al buscar test administrado.',
    //             errors: err
    //         });
    //     }

    //     if (!wiscAdministrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             mensaje: 'La prueba con el id ' + id + ' no existe.',
    //             errors: { message: 'No existen resultados con ese ID.' }
    //         });
    //     }

    //     wiscAdministrado.paciente = req.body.paciente;
    //     wiscAdministrado.fecha_eval = body.fecha_eval;
    //     wiscAdministrado.edad_eval = body.edad_eval;
    //     wiscAdministrado.grupo_etareo = body.grupo_etareo;
    //     wiscAdministrado.edad_mental = body.edad_mental;
    //     console.log(wiscAdministrado);

    //     wiscAdministrado.save((err, wiscGuardado) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 mensaje: 'Error al actualizar prueba.',
    //                 errors: err
    //             });
    //         }

    //         res.status(200).json({
    //             ok: true,
    //             wiscGuardado
    //         });
    //     });
    // });
});

app.delete('/puntuacionindice/:id', function(req, res) {

    // let id = req.params.id;
    // WiscAdministrado.findByIdAndRemove(id, (err, wiscBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!wiscBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Prueba no encontrada'
    //             }
    //         });
    //     }

    //     return res.json({
    //         ok: true,
    //         wiscBorrado
    //     });
    // });
});



module.exports = app;