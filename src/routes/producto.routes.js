const express = require('express');
const productoController = require('../controllers/productos.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles')

var api = express.Router();

api.post('/agregarProducto',[md_autenticacion.Auth, md_roles.verAdmin],productoController.agregarProducto);
api.get('/obtenerProductoId/:idProducto',[md_autenticacion.Auth, md_roles.verAdmin],productoController.ObtenerProductoId);
api.get('/obtenerNombre/:nombreProducto',[md_autenticacion.Auth, md_roles.verAdmin],productoController.ObtenerProductoNombre);
api.get('/obtenerProducto',[md_autenticacion.Auth, md_roles.verAdmin],productoController.ObtenerProductos);
api.put('/editarProducto/:idProducto',[md_autenticacion.Auth, md_roles.verAdmin],productoController.editarProducto);
api.delete('/eliminarProducto/:idProducto',[md_autenticacion.Auth, md_roles.verAdmin],productoController.eliminarProducto);
api.put('/stockProducto/:idProducto', [md_autenticacion.Auth, md_roles.verAdmin], productoController.stockProducto);

module.exports =api;