const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facturaSchema = Schema({
    listadoCompra:[{
        nombreProducto: String,
        cantidad: Number,
        precio: Number,
        subTotal: Number
    }],
    total: Number,
    nit: String,
    idUsuario:{type:Schema.Types.ObjectId, ref: 'usuarios'}
    
});

module.exports = mongoose.model('factura', facturaSchema);