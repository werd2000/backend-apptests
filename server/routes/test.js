const express = require('express');

const Test = require('../models/test');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

app.get('/tests', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    // Test.find({ acá van las condiciones de búsqueda }, 'los campos que quiero mostrar')
    Test.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, tests) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            Test.countDocuments({ estado: true }, (err, cantidad) => {
                return res.json({
                    ok: true,
                    tests,
                    cantidad
                });
            });

        });
});

app.get('/test/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    Test.findById(id).exec((err, testDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el test.',
                errors: err
            });
        }

        if (!testDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El test con el id ' + id + ' no existe.',
                errors: { message: 'No existe un test con ese ID.' }
            });
        }

        res.status(200).json({
            ok: true,
            test: testDB
        });
    });
});



app.post('/test', verificaToken, function(req, res, next) {
    let body = req.body;
    console.log(body);

    let test = new Test({
        nombre: body.nombre,
        descripcion: body.descripcion,
        categoria: body.categoria,
        tags: body.tags,
    });

    test.save((err, testDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        return res.json({
            ok: true,
            test: testDB
        });
    });

});

// =========================================================
// Actualizar un test
// =========================================================
app.put('/test/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'tags', 'categoria']);

    Test.findById(id, (err, test) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar test.',
                errors: err
            });
        }

        if (!test) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El test con el id ' + id + ' no existe.',
                errors: { message: 'No existe un test con ese ID.' }
            });
        }

        test.nombre = req.body.nombre;
        test.descripcion = body.descripcion;
        test.categoria = body.categoria;
        test.tags = body.tags;

        test.save((err, testGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar test.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                test: testGuardado
            });
        });
    });
});

app.delete('/test/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    Test.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, testBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            test: testBorrado
        });
    });
});


module.exports = app;