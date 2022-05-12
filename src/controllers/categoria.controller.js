// importaciones
const express = require('express');
const Categoria = require('../models/categorias.model');
const Productos = require('../models/productos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');
const { find } = require('../models/categorias.model');


function agregarCategoria(req, res){
    var parametros = req.body;
    var categoriaModel = new Categoria();

    if(parametros.nombre){
        categoriaModel.nombre = parametros.nombre;
    }else{
        return res.status(500).send({message:"error"})
    }

        Categoria.find({nombre:parametros.nombre},(err,categoriaGuardada)=>{
            if (categoriaGuardada.length == 0){
                categoriaModel.save((err, categoriaAgregada)=>{
                    console.log(err)
                    if (err) return res.status(500).send({message:"error en la peticion"});
                    if(!categoriaAgregada) return res.status(404).send({message:"No se puede agregar la categoria"});
                    return res.status(200).send({categoria: categoriaAgregada});

                })
            }else{
                return res.status(500).send({message:"Este curso ya existe"});
            }
        })

}

function ObtenerCategorias(req,res){
    Categoria.find((err, categoriasObtenidas) =>{
        if(err) return res.send({mensaje:"Error: "+err})

        for(let i = 0; i<categoriasObtenidas.length; i++){
            console.log(categoriasObtenidas[i].nombre)
        }

        return res.send({categorias: categoriasObtenidas})
    })
}

function editarCategoria(req, res){
    var idCat = req.params.idCategoria;
    var paramentros = req.body;

        Categoria.findByIdAndUpdate({_id: idCat, nombre: paramentros.nombre}, paramentros,{new:true},
            (err, categoriaEditada)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!categoriaEditada) return res.status(400).send({mensaje: 'No se puede ediar la categoria'});
                
                return res.status(200).send({categoria: categoriaEditada});
        })

}

function eliminarCategoria(req, res) {
    var idCat = req.params.idCategoria;
    Categoria.findOne({ nombre: 'general' }, (err, categoriaActualizada) => {

        Productos.updateMany({ idCategoria: idCat }, { idCategoria: categoriaActualizada._id }, 
            (err, categoriaEliminada) => {

            Categoria.findByIdAndDelete(idCat, (err, categoriaDelete) => {
                
                if (err)return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!categoriaDelete)return res.status(500).send({ mensaje: "Error al editar la categoria" });
                return res.status(200).send({ categoria: categoriaDelete });
            })
        })
    })
}

module.exports ={
    agregarCategoria,
    ObtenerCategorias,
    editarCategoria,
    eliminarCategoria
}
