const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuarios', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    // Usuario.find({ acá van las condiciones de búsqueda }, 'los campos que quiero mostrar')
    Usuario.find({ estado: true }, 'nombre email role estado google img fnac sexo misTests')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, cantidad) => {
                return res.json({
                    ok: true,
                    usuarios,
                    cantidad
                });
            });

        });
});

app.get('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    Usuario.findById(id).exec((err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar al usuario.',
                errors: err
            });
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe.',
                errors: { message: 'No existe un usuario con ese ID.' }
            });
        }

        res.status(200).json({
            ok: true,
            usuarioBD
        });
    });
});



app.post('/usuario', function(req, res, next) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

// =========================================================
// Actualizar un usuario
// =========================================================
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'sexo', 'fnac', 'misTests', 'img']);

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario.',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe.',
                errors: { message: 'No existe un usuario con ese ID.' }
            });
        }

        usuario.nombre = req.body.nombre;
        usuario.fnac = body.fnac;
        usuario.sexo = body.sexo;
        usuario.misTests = body.misTests;
        usuario.img = body.img;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});



// =========================================================
// Borrado físico de la BD
// =========================================================
// app.delete('/usuario/:id', function(req, res) {

//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }

//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             });
//         }

//         return res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         });
//     });
// });

// =========================================================
// Guarda un test en favoritos
// =========================================================
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let test = req.query.test;
    console.log(test);

    // Usuario.findById(id, (err, usuario) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             mensaje: 'Error al buscar usuario.',
    //             errors: err
    //         });
    //     }

    //     if (!usuario) {
    //         return res.status(400).json({
    //             ok: false,
    //             mensaje: 'El usuario con el id ' + id + ' no existe.',
    //             errors: { message: 'No existe un usuario con ese ID.' }
    //         });
    //     }

    //     usuario.nombre = req.body.nombre;
    //     usuario.fnac = body.fnac;
    //     usuario.sexo = body.sexo;

    //     usuario.save((err, usuarioGuardado) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 mensaje: 'Error al actualizar usuario.',
    //                 errors: err
    //             });
    //         }

    //         res.status(200).json({
    //             ok: true,
    //             usuario: usuarioGuardado
    //         });
    //     });
    // });
});


module.exports = app;