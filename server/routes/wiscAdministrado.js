const express = require('express');

const WiscAdministrado = require('../models/wiscAdministrado');
const PuntajeObtenido = require('../models/puntajeObtenido');
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

app.post('/puntajeobtenido/:id', verificaToken, function(req, res, next) {
    let id = req.params.id;
    let body = req.body;

    let puntaje = new PuntajeObtenido({
        idWiscAdministrado: id,
        dc_puntajeobtenido: body.dc_puntajeobtenido,
        dc_puntajenatural: body.dc_puntajenatural,
        dc_rp: body.dc_rp,
        dc_total: body.dc_total,
        se_puntajeobtenido: body.se_puntajeobtenido,
        se_puntajenatural: body.se_puntajenatural,
        se_cv: body.se_cv,
        se_total: body.se_total,
        ar_puntajeobtenido: body.ar_puntajeobtenido,
        ar_puntajenatural: body.ar_puntajenatural,
        ar_mt: body.ar_mt,
        ar_total: body.ar_total,
        bs_puntajeobtenido: body.bs_puntajeobtenido,
        bs_puntajenatural: body.bs_puntajenatural,
        bs_vp: body.bs_vp,
        bs_total: body.bs_total,
        cd_puntajeobtenido: body.cd_puntajeobtenido,
        cd_puntajenatural: body.cd_puntajenatural,
        cd_rp: body.cd_rp,
        cd_total: body.cd_total,
        cl_puntajeobtenido: body.cl_puntajeobtenido,
        cl_puntajenatural: body.cl_puntajenatural,
        cl_vp: body.cl_vp,
        cl_total: body.cl_total,
        cm_puntajeobtenido: body.cm_puntajeobtenido,
        cm_puntajenatural: body.cm_puntajenatural,
        cm_cv: body.cm_cv,
        cm_total: body.cm_total,
        fi_puntajeobtenido: body.fi_puntajeobtenido,
        fi_puntajenatural: body.fi_puntajenatural,
        fi_rp: body.fi_rp,
        fi_total: body.fi_total,
        in_puntajeobtenido: body.in_puntajeobtenido,
        in_puntajenatural: body.in_puntajenatural,
        in_cv: body.in_cv,
        in_total: body.in_total,
        mt_puntajeobtenido: body.mt_puntajeobtenido,
        mt_puntajenatural: body.mt_puntajenatural,
        mt_rp: body.mt_rp,
        mt_total: body.mt_total,
        nl_puntajeobtenido: body.nl_puntajeobtenido,
        nl_puntajenatural: body.nl_puntajenatural,
        nl_mt: body.nl_mt,
        nl_total: body.nl_total,
        pc_puntajeobtenido: body.pc_puntajeobtenido,
        pc_puntajenatural: body.pc_puntajenatural,
        pc_cv: body.pc_cv,
        pc_total: body.pc_total,
        rd_puntajeobtenido: body.rd_puntajeobtenido,
        rd_puntajenatural: body.rd_puntajenatural,
        rd_mt: body.rd_mt,
        rd_total: body.rd_total,
        rg_puntajeobtenido: body.rg_puntajeobtenido,
        rg_puntajenatural: body.rg_puntajenatural,
        rg_vp: body.rg_vp,
        rg_total: body.rg_total,
        suma_cv: body.suma_cv,
        suma_mt: body.suma_mt,
        suma_op: body.suma_op,
        suma_vp: body.suma_vp,
        suma_total: body.suma_total
    });

    puntaje.save((err, wiscDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        return res.json({
            ok: true,
            puntaje: puntajeDB
        });
    });

});



module.exports = app;