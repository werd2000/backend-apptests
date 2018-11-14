const express = require('express');

const app = express();

app.use(require('./usuario'));
app.use(require('./paciente'));
app.use(require('./login'));
app.use(require('./imagenes'));
app.use(require('./upload'));
app.use(require('./test'));
app.use(require('./wiscAdministrado'));
app.use(require('./puntuacionIndice'));



module.exports = app;