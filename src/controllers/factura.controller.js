// importaciones
const express = require('express');
const Usuarios = require('../models/usuarios.model');
const Productos = require('../models/productos.model');
const Facturas = require('../models/factura.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

function facturaCompras(req, res) {
    usuarioLogeado = req.user.sub;
  
    const facturaModel = new Facturas();
  
    Usuarios.findById(usuarioLogeado, (err, busqueda) => {
      facturaModel.listadoCompra = busqueda.carrito;
      facturaModel.idUsuario = req.user.sub;
      facturaModel.total = busqueda.totalCarrito;
      facturaModel.nit = req.body.nit;
  
      facturaModel.save((err, facturaSave) => {
        Usuarios.findByIdAndUpdate( req.user.sub, { $set: { carrito: [] }, totalCarrito: 0 }, { new: true },
            (err, carritoEmpty) => {
              return res.status(200).send({ factura: facturaSave });

        });
      });
    });

}

function obtenerFacturas(req, res){

    Facturas.find((err,busquedaFactura) =>{

        if(err) return res.status(500).send({ mensaje: 'error en la peticion'});
        if(!busquedaFactura) 
        return res.status(400).send({mensaje : 'no se encontró ninguna factura'});

        return res.status(202).send({facturas : busquedaFactura});
     })

};

function obtenerFacturaId(req,res){
    var idFac = req.params.idFactura;

    Facturas.findById(idFac, (err, busquedaFactura) => {

        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!busquedaFactura) 
        return res.status(404).send({mensaje:'Error, no se encontraron facturas'});

        return res.send({producto: busquedaFactura});
    })
}

module.exports ={
    facturaCompras,
    obtenerFacturas,
    obtenerFacturaId
}