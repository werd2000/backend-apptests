const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let puntajeObtenidoSchema = new Schema({
    idWiscAdministrado: { type: string },
    dc_puntajeobtenido: { type: number },
    dc_puntajenatural: { type: number },
    dc_rp: { type: number },
    dc_total: { type: number },
    se_puntajeobtenido: { type: number },
    se_puntajenatural: { type: number },
    se_cv: { type: number },
    se_total: { type: number },
    ar_puntajeobtenido: { type: number },
    ar_puntajenatural: { type: number },
    ar_mt: { type: number },
    ar_total: { type: number },
    bs_puntajeobtenido: { type: number },
    bs_puntajenatural: { type: number },
    bs_vp: { type: number },
    bs_total: { type: number },
    cd_puntajeobtenido: { type: number },
    cd_puntajenatural: { type: number },
    cd_rp: { type: number },
    cd_total: { type: number },
    cl_puntajeobtenido: { type: number },
    cl_puntajenatural: { type: number },
    cl_vp: { type: number },
    cl_total: { type: number },
    cm_puntajeobtenido: { type: number },
    cm_puntajenatural: { type: number },
    cm_cv: { type: number },
    cm_total: { type: number },
    fi_puntajeobtenido: { type: number },
    fi_puntajenatural: { type: number },
    fi_rp: { type: number },
    fi_total: { type: number },
    in_puntajeobtenido: { type: number },
    in_puntajenatural: { type: number },
    in_cv: { type: number },
    in_total: { type: number },
    mt_puntajeobtenido: { type: number },
    mt_puntajenatural: { type: number },
    mt_rp: { type: number },
    mt_total: { type: number },
    nl_puntajeobtenido: { type: number },
    nl_puntajenatural: { type: number },
    nl_mt: { type: number },
    nl_total: { type: number },
    pc_puntajeobtenido: { type: number },
    pc_puntajenatural: { type: number },
    pc_cv: { type: number },
    pc_total: { type: number },
    rd_puntajeobtenido: { type: number },
    rd_puntajenatural: { type: number },
    rd_mt: { type: number },
    rd_total: { type: number },
    rg_puntajeobtenido: { type: number },
    rg_puntajenatural: { type: number },
    rg_vp: { type: number },
    rg_total: { type: number },
    suma_cv: { type: number },
    suma_mt: { type: number },
    suma_op: { type: number },
    suma_vp: { type: number },
    suma_total: { type: number },
});

puntuajeObtenidoSchema.methods.toJSON = function() {
    let puntajeObtenido = this;
    let puntajeObtenidoObject = puntajeObtenido.toObject();

    return puntajeObtenidoObject;
};

module.exports = mongoose.model('PuntajeObtenido', puntajeObtenidoSchema);
suma_cv: 28 suma_mt: 10 suma_op: 25 suma_total: 81 suma_vp: 18 vb_cv: 9 vb_puntajenatural: 9 vb_puntajeobtenido: "1"
vb_total: 9 __proto__: Object