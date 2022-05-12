const express = require('express');
const usuarioController = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

var api = express.Router();

api.post('/registrarAdmin',usuarioController.registrarAdmin);
api.post('/login',usuarioController.login);
api.post('/registrarUsuario',[md_autenticacion.Auth, md_roles.verAdmin], usuarioController.registrarUsuario);
api.post('/registrarCliente',[md_autenticacion.Auth, md_roles.verCliente], usuarioController.registrarClienteAdmin);
api.put('/editarCliente/:id',[md_autenticacion.Auth, md_roles.verAdmin], usuarioController.editarClienteAdmin);
api.delete('/eliminarCliente/:id',[md_autenticacion.Auth, md_roles.verAdmin], usuarioController.eliminarClienteAdmin);
api.put('/editarPerfil/:id',[md_autenticacion.Auth, md_roles.verCliente], usuarioController.editarPerfilCliente);
api.delete('/eliminarPerfil/:id',[md_autenticacion.Auth, md_roles.verCliente], usuarioController.eliminarPerfilCliente);
api.put('/agregarProductoCarrito',[md_autenticacion.Auth, md_roles.verCliente],usuarioController.agregarProductoCarrito);
api.put('/eliminarProductoCarrito',[md_autenticacion.Auth, md_roles.verCliente],usuarioController.eliminarProductosCarrito);

module.exports =api;