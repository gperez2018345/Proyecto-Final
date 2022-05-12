// importaciones
const express = require('express');
const Usuarios = require('../models/usuarios.model');
const Productos = require('../models/productos.model');
const Categorias = require('../models/categorias.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');


function registrarAdmin(req, res) {
  var usuarioModelo = new Usuarios();

  usuarioModelo.nombre = "admin";
  usuarioModelo.email = "admin@kinal.edu.gt";
  usuarioModelo.rol = "ROL_ADMIN";

  Usuarios.find({ email: "admin@kinal.edu.gt", nombre: "admin" }, (err, usuarioAgregado) => {
    if (usuarioAgregado.length == 0) {
      bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
        usuarioModelo.password = passwordEncriptada;
        usuarioModelo.save((err, usuarioGuardado) => {
          console.log(err);
        });
      });
    } else {
      console.log("Este usuario ya está creado");
    }
  });
}

function registrarUsuario(req, res){
    var paramentros = req.body;
    var usuarioModelo = new Usuarios();
  
    if(paramentros.nombre, paramentros.email, paramentros.password){
        usuarioModelo.nombre = paramentros.nombre;
        usuarioModelo.email =  paramentros.email;
        usuarioModelo.password = paramentros.password;
        usuarioModelo.rol = paramentros.rol;
    }
            Usuarios.find({nombre: paramentros.nombre, email: paramentros.email, password: paramentros.password, rol: paramentros.rol}, (err, clienteGuardado)=>{
                if(clienteGuardado.length == 0){
                    bcrypt.hash(paramentros.password, null,null, (err, passwordEncriptada)=>{
                        usuarioModelo.password = passwordEncriptada;
                        usuarioModelo.save((err, clienteGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!clienteGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});
  
                            return res.status(201).send({usuarios: clienteGuardado});
                         })
                    })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
        
  }

function login(req, res) {
    var parametros = req.body;

    Usuarios.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ message: "error en la peticion" });
        if (usuarioEncontrado) {

            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, verificacionPassword) => {
                if (verificacionPassword) {

                    if (parametros.obtenerToken === 'true') {
                        return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuario: usuarioEncontrado })
                    }


                } else {
                    return res.status(500).send({ mensaje: 'las contraseñas no coinciden' });
                }
            })

        } else {
            return res.status(404).send({ message: "Error, correo no registrado" })
        }
    })
}

function registrarClienteAdmin(req, res){
  var parametros = req.body;
  var usuarioModelo = new Usuarios();

  if(parametros.nombre, parametros.email, parametros.password){
      usuarioModelo.nombre = parametros.nombre;
      usuarioModelo.email =  parametros.email;
      usuarioModelo.password = parametros.password;
      usuarioModelo.rol = 'ROL_CLIENTE';
  }
          Usuarios.find({nombre: parametros.nombre, email: parametros.email, password: parametros.password, rol: parametros.rol}, (err, clienteGuardado)=>{
              if(clienteGuardado.length == 0){
                  bcrypt.hash(parametros.password, null,null, (err, passwordEncriptada)=>{
                      usuarioModelo.password = passwordEncriptada;
                      usuarioModelo.save((err, clienteGuardado) => {
                          if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                          if(!clienteGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});

                          return res.status(201).send({usuarios: clienteGuardado});
                       })
                  })
              }else{
                  return res.status(500).send({ mensaje: 'Error en la peticion' });
              }
          })
      
}

function editarClienteAdmin(req, res) {
    var idUs = req.params.id;
    var parametros = req.body;

        Usuarios.findById(idUs, (err, usuarioReg) => {
            if (usuarioReg.rol == "ROL_ADMIN") {
                return res.status(500).send({ mensaje: 'No se puede editar' });
            } else {
                Usuarios.findByIdAndUpdate( { _id: idUs }, parametros, (err, usuarioEditado) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                    if (!usuarioEditado) return res.status(400).send({ mensaje: 'no se pudo editar el cliente' });
                    return res.status(200).send({ usuarios: usuarioEditado });
                })
            }
        })
}

function eliminarClienteAdmin(req, res) {
    var idUs = req.params.id;
    var parametros = req.body;

        Usuarios.findById(idUs, (err, usuarioReg) => {
            if (usuarioReg.rol == "ROL_ADMIN") {
                return res.status(500).send({ mensaje: 'No se puede eliminar' });
            } else {
                Usuarios.findByIdAndDelete( { _id: idUs }, parametros, (err, usuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                    if (!usuarioEliminado) return res.status(400).send({ mensaje: 'no se pudo eliminar el cliente' });
                    return res.status(200).send({ usuarios: usuarioEliminado });
                })
            }
        })
}

function editarPerfilCliente(req,res){
    var idUs = req.params.id;
    var parametros = req.body;

    if ( idUs !== req.user.sub ) 
    return res.status(500).send({ mensaje: 'id de perfil inválido'});

    Usuarios.findByIdAndUpdate({ _id: idUs },parametros,{ new:true },(err, perfilEditado) => {

        if(err) return res.status(500).send({mensaje:'error en la peticion'});
        if(!perfilEditado) return res.status(404).send({mensaje:'No se pudo editar el perfil'});

        return res.status(500).send({ usuario: perfilEditado});
    })
}

function eliminarPerfilCliente(req,res){
    var idUs = req.params.id;
    var parametros = req.body;

    if ( idUs !== req.user.sub ) 
    return res.status(500).send({ mensaje: 'id de perfil inválido'});

    Usuarios.findByIdAndDelete({ _id: idUs }, parametros, (err, perfilEliminado) => {
        
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!perfilEliminado) return res.status(404).send({mensaje:'No se pudo eliminar el perfil'});

        return res.status(500).send({ usuario: perfilEliminado});

    });

}

function agregarProductoCarrito(req, res) {

    const requsuario = req.user.sub;
    const parametros = req.body;

    Productos.findOne({ nombre: parametros.nombreProducto }, (err, busqueda) => {

        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!busqueda) return res.status(404).send({ mensaje: 'No se puede obtener el producto' });

        Usuarios.find({ _id: requsuario }, (err,usuarioFind) => {

            if(err) return res.status(500).send({mensaje:'Error en la peticion'});
            if(!usuarioFind) return res.status(404).send({mensaje:'No se puede encontrar el usuario'});
            return res.status(200).send({Usuario:usuarioFind})

        })

        Usuarios.find({ _id: requsuario }, { carrito: { $elementMatch: { nombreProducto: parametros.nombreProducto }}}, 
            (err, res) => {
            if (res == null) {

                Usuarios.findByIdAndUpdate(requsuario, {$push: {
                    carrito: { 
                        nombreProducto: parametros.nombreProducto, 
                        cantidad: parametros.cantidad, 
                        precio: busqueda.precio, 
                        subTotal: busqueda.precio * parametros.cantidad }}},
                        { new: true },(err, updateUsuario) => {

                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                        if(!updateUsuario) return res.status(404).send( { mensaje: 'No se puede agregar el producto'});

                        let totalOp = 0;
                        for (let i = 0; i < updateUsuario.carrito.length; i++) {
                            totalOp = totalOp + updateUsuario.carrito[i].subTotal
                        }

                        Usuarios.findByIdAndUpdate(requsuario, { totalCarrito: totalOp }, { new: true },
                            (err, updateTotal) => {

                                if (err) return res.status(500).send({ mensaje: 'error al solicitar el carrito' });
                                if (!updateTotal) return res.status(404).send({ mensaje: 'No se puede modificar el total carrito' });
                            })
                    })
            } else {
                Usuarios.findByIdAndUpdate({ $inc : { cantidad: parametros.cantidad } }, { new: true }, 
                    (err, productoMod) => {

                        if(err) return res.status(500).send({ mensaje: "error en la peticion" });
                        if(!productoMod) return res.status(500).send({ mensaje: 'No se pudo editar la cantidad del Producto'});

                        return res.status(200).send({ producto: productoMod});
                        
                    })
            }
        })

    })
}

function eliminarProductosCarrito(req, res) {

    const requsuario = req.user.sub;
    const parametros = req.body;

    Usuarios.findByIdAndUpdate(requsuario,{ $pull: { carrito: { nombreProducto: parametros.nombreProducto } } }, { new: true },
        (err, usuarioEliminado) => {

          if (err) return res.status(500).send({ mensaje: "error en la peticion" });
          if (!usuarioEliminado) 
          return res.status(404).send({ mensaje: "No se puede obtener el usuario" });
    
          let totalOp = 0;
          for (let i = 0; i < usuarioEliminado.carrito.length; i++) {
            totalOp =
              totalOp + usuarioEliminado.carrito[i].subTotal;
          }
    
          Usuarios.findByIdAndUpdate(requsuario, { totalCarrito: totalOp },{ new: true },
            (err, updateTotal) => {
              if (err) return res.status(500).send({ mensaje: "error al solicitar total carrito" });
              if (!updateTotal) 
              return res.status(500).send({ mensaje: "Error al modificar el total del carrito" });                
                return res.status(200).send({ mensaje: updateTotal });
             
            }
          );
        }
      );
}

module.exports = {
    registrarAdmin,
    login,
    registrarClienteAdmin,
    eliminarClienteAdmin,
    editarClienteAdmin,
    editarPerfilCliente,
    eliminarPerfilCliente,
    agregarProductoCarrito,
    registrarUsuario,
    eliminarProductosCarrito,
}