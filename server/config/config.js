// =====================================
//  Puerto
// =====================================
process.env.PORT = process.env.PORT || 3000;

// =====================================
//  Entorno
// =====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =====================================
//  Vencimiento del token
// =====================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// =====================================
//  SEED de autenticación
//  heroku config:set SEED="este-es-el-seed-de-produccion"
//  heroku config:unset SEED
// =====================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// =====================================
//  Base de datos
// =====================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/apptest';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;


// =====================================
//  Google CLiente Id
// =====================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '440845992542-e720negrlr7r4ukb842s41su4n08uc8u.apps.googleusercontent.com';