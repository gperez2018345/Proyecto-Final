// importaciones
const express = require('express');
const Productos = require('../models/productos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

function agregarProducto(req, res) {
    var parametros = req.body;
    var productoModel = new Productos();

    if (parametros.nombre && parametros.descripcion && parametros.precio && parametros.stock) {
        productoModel.nombre = parametros.nombre;
        productoModel.descripcion = parametros.descripcion;
        productoModel.precio = parametros.precio;
        productoModel.stock = parametros.stock;
        productoModel.idCategoria = parametros.idCategoria; 
    }else {
        return res.status(500).send({ message: "error" })
    }

    Productos.find({ nombre: parametros.nombre,descripcion:parametros.descripcion,precio:parametros.precio,stock:parametros.stock,idCategoria: parametros.idCategoria},
        (err, productoGuardado) => {
        if (productoGuardado.length==0) {

            productoModel.save((err, productosGuardados) => {
                console.log(err)
                if (err) return res.status(500).send({ message: "error en la peticion" });
                if (!productosGuardados) return res.status(404).send({ message: "No se puede agregar un producto" });
                return res.status(200).send({ empleado: productosGuardados  });
            });

        } else {
            return res.status(500).send({ message: 'producto existente' });
        }
    })
}

function ObtenerProductoId(req,res){
    var idProd = req.params.idProducto;

    Productos.findById(idProd,(err,productoEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!productoEncontrado) return res.status(404).send({mensaje:'Error, no se encontraron productos'});
        return res.send({producto: productoEncontrado});
    })
}

function ObtenerProductoNombre(req, res) {
    var nomProd = req.params.nombreProducto;
    Productos.find({nombre : {$regex:nomProd,$options: 'i'} },(err,productoEncontrado) =>{
        if(err) return res.status(500).send({message: "error en la peticion"});
        if(!productoEncontrado) return res.status(404).send({message: "Error, no se encontraron productos"})
        return res.status(200).send({producto: productoEncontrado});
    })
}

function ObtenerProductos(req,res){
    Productos.find((err, productosObtenidos) =>{
        if(err) return res.send({mensaje:"Error: "+err})

        for(let i = 0; i<productosObtenidos.length; i++){
            console.log(productosObtenidos[i].nombre)
        }

        return res.send({productos: productosObtenidos})
    })
}
    
function editarProducto(req, res){
    var idProd = req.params.idProducto;
    var paramentros = req.body;

        Productos.findByIdAndUpdate({_id: idProd, nombre: paramentros.nombre, descripcion: paramentros.descripcion, precio: paramentros.precio,
            stock: paramentros.stock}, paramentros,{new:true},
            (err, productoEditado)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!productoEditado) return res.status(400).send({mensaje: 'No se puede ediar el producto'});
                
                return res.status(200).send({productos: productoEditado});
        })

}

function eliminarProducto(req,res){
    var idProd = req.params.idProducto; 

    Productos.findOneAndDelete({_id:idProd},
        (err,productoEliminado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!productoEliminado) return res.status(400).send({mensaje: 'No se puede eliminar el producto'});
        return res.status(200).send({producto: productoEliminado});

    })
}

function stockProducto(req, res) {
    const productoId = req.params.idProducto;
    const parametros = req.body;

    Productos.findByIdAndUpdate(productoId, { $inc : { stock: parametros.stock } }, { new: true },
        (err, productoModificado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!productoModificado) return res.status(500).send({ mensaje: 'Error al editar el stock del Producto'});

            return res.status(200).send({ productos: productoModificado});
        })

}


module.exports = {
    agregarProducto,
    ObtenerProductoId,
    ObtenerProductoNombre,
    ObtenerProductos,
    editarProducto,
    eliminarProducto,
    stockProducto
}