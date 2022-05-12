var mongoose = require('mongoose');
const app = require('./app');
UsuarioController = require('./src/controllers/usuarios.controller');
var Categorias = require('./src/models/categorias.model');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/proyectofinal', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos");

    app.listen(3000, function(){
        console.log("Esta funcionando en el puerto 3000")
    })

UsuarioController.registrarAdmin();

Categorias.find({nombre: 'general'},(err, categoriaEncontrada)=>{
    if(categoriaEncontrada.length == 0){
        Categorias.create({nombre: "general"});
    }else{
        console.log("Categoria existente");
    }
})

}).catch(err => console.log(err))