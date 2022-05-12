const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    stock: Number,
    idCategoria:{type:Schema.Types.ObjectId, ref: 'categorias'}
});

module.exports = mongoose.model('productos', productoSchema);