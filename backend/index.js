//importar configuración,express,socket.io y diferentes librerías
const dotenv = require('dotenv');
const Email = require('./routes/email');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const express = require('express');

//Variables
const app = express();
const router = express.Router();
const port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server);

//Vista html(Prueba)

app.get('/',function(req,res){

  res.sendFile(path.join(__dirname + '/html/index.html'));


});
io.on('connection',(socket) => {

  console.log('conectado');


})

io.on('redirect', (socket) => {


  console.log('redireccionado');

})


//Middlewares de la app relacionados con node

app.use(express.urlencoded({extended:true}));
//app.use(express.json());

//Configuración de dotenv para recibir las variables del archivo .env
dotenv.config();

//Usos de la app(Librerias, Rutas, Etc)
app.use(Email);


//Puerto 
server.listen(3000, () => {
  console.log('listening on *:3000');
});
 