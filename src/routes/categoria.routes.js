const express = require('express');
const categoriaController = require('../controllers/categoria.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles')
//const md_roles = require('../middlewares/roles');

var api = express.Router();

api.post('/agregarCategoria',[md_autenticacion.Auth, md_roles.verAdmin],categoriaController.agregarCategoria);
api.get('/obtenerCategorias',[md_autenticacion.Auth, md_roles.verAdmin],categoriaController.ObtenerCategorias);
api.put('/editarCategoria/:idCategoria', [md_autenticacion.Auth, md_roles.verAdmin],categoriaController.editarCategoria);
api.delete('/eliminarCategoria/:idCategoria', [md_autenticacion.Auth, md_roles.verAdmin],categoriaController.eliminarCategoria);

module.exports =api;