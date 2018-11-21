const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let puntajeObtenidoSchema = new Schema({
    idWiscAdministrado: { type: String },
    dc_puntajeobtenido: { type: Number },
    dc_puntajenatural: { type: Number },
    dc_rp: { type: Number },
    dc_total: { type: Number },
    se_puntajeobtenido: { type: Number },
    se_puntajenatural: { type: Number },
    se_cv: { type: Number },
    se_total: { type: Number },
    ar_puntajeobtenido: { type: Number },
    ar_puntajenatural: { type: Number },
    ar_mt: { type: Number },
    ar_total: { type: Number },
    bs_puntajeobtenido: { type: Number },
    bs_puntajenatural: { type: Number },
    bs_vp: { type: Number },
    bs_total: { type: Number },
    cd_puntajeobtenido: { type: Number },
    cd_puntajenatural: { type: Number },
    cd_rp: { type: Number },
    cd_total: { type: Number },
    cl_puntajeobtenido: { type: Number },
    cl_puntajenatural: { type: Number },
    cl_vp: { type: Number },
    cl_total: { type: Number },
    cm_puntajeobtenido: { type: Number },
    cm_puntajenatural: { type: Number },
    cm_cv: { type: Number },
    cm_total: { type: Number },
    fi_puntajeobtenido: { type: Number },
    fi_puntajenatural: { type: Number },
    fi_rp: { type: Number },
    fi_total: { type: Number },
    in_puntajeobtenido: { type: Number },
    in_puntajenatural: { type: Number },
    in_cv: { type: Number },
    in_total: { type: Number },
    mt_puntajeobtenido: { type: Number },
    mt_puntajenatural: { type: Number },
    mt_rp: { type: Number },
    mt_total: { type: Number },
    nl_puntajeobtenido: { type: Number },
    nl_puntajenatural: { type: Number },
    nl_mt: { type: Number },
    nl_total: { type: Number },
    pc_puntajeobtenido: { type: Number },
    pc_puntajenatural: { type: Number },
    pc_cv: { type: Number },
    pc_total: { type: Number },
    rd_puntajeobtenido: { type: Number },
    rd_puntajenatural: { type: Number },
    rd_mt: { type: Number },
    rd_total: { type: Number },
    rg_puntajeobtenido: { type: Number },
    rg_puntajenatural: { type: Number },
    rg_vp: { type: Number },
    rg_total: { type: Number },
    suma_cv: { type: Number },
    suma_mt: { type: Number },
    suma_op: { type: Number },
    suma_vp: { type: Number },
    suma_total: { type: Number },
});

puntajeObtenidoSchema.methods.toJSON = function() {
    let puntajeObtenido = this;
    let puntajeObtenidoObject = puntajeObtenido.toObject();

    return puntajeObtenidoObject;
};

module.exports = mongoose.model('PuntajeObtenido', puntajeObtenidoSchema);