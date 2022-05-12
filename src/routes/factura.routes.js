const express = require('express');
const facturaController = require('../controllers/factura.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles')

var api = express.Router();

api.post('/compras',[md_autenticacion.Auth, md_roles.verCliente],facturaController.facturaCompras);
api.get('/obtenerFactura',[md_autenticacion.Auth, md_roles.verAdmin],facturaController.obtenerFacturas);
api.get('/obtenerFacturaId/:idFactura',[md_autenticacion.Auth, md_roles.verAdmin],facturaController.obtenerFacturaId);

module.exports =api;