const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Paciente = require('../models/paciente');
const Test = require('../models/test');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo.'
                }
            });
    }

    // Validar tipo
    let tiposValidos = ['usuarios', 'pacientes', 'tests'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se permiten archivos en esta categoría',
                categoria: tipo
            }
        });
    }

    let archivoSubido = req.files.archivo;
    let nombreCortado = archivoSubido.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // extensiones válidas
    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se permite este tipo de archivo',
                extension
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivoSubido.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // La imagen ya está cargada
        if (tipo === 'usuarios') imagenUsuario(id, res, nombreArchivo);
        if (tipo === 'pacientes') imagenPaciente(id, res, nombreArchivo);
        if (tipo === 'tests') imagenTest(id, res, nombreArchivo);

        // res.json({
        //     ok: true,
        //     message: 'File uploaded!'
        // });
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}


function imagenTest(id, res, nombreArchivo) {
    Test.findById(id, (err, testDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'tests');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!testDB) {
            borraArchivo(nombreArchivo, 'tests');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El test no existe'
                }
            });
        }

        if (testDB.img !== '') {
            borraArchivo(testDB.img, 'tests');
        }

        testDB.img = nombreArchivo;

        testDB.save((err, testGuardado) => {
            res.json({
                ok: true,
                test: testGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenPaciente(id, res, nombreArchivo) {
    Paciente.findById(id, (err, pacienteDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'pacientes');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!pacienteDB) {
            borraArchivo(nombreArchivo, 'pacientes');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El paciente no existe'
                }
            });
        }

        if (pacienteDB.img !== '') {
            borraArchivo(pacienteDB.img, 'pacientes');
        }

        pacienteDB.img = nombreArchivo;

        pacienteDB.save((err, pacienteGuardado) => {
            res.json({
                ok: true,
                paciente: pacienteGuardado,
                img: nombreArchivo
            });
        });
    });
}


function borraArchivo(nombreArchivo, tipo) {
    console.log(nombreArchivo);
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreArchivo }`)
    console.log(pathImagen);
    // Compruebo que la imagen exista en el sistema
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;