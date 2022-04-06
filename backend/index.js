//importar configuración,express,socket.io y diferentes librerías
  const dotenv = require('dotenv');
  const Email = require('./routes/email');
  const http = require('http');
  const { Server } = require('socket.io');
  const path = require('path');
  const express = require('express');
  const cors=require('cors');

//Variables
  const app = express();
  const port = process.env.PORT;
  const server = http.createServer(app);
  const io = new Server(server);

//Envío de la vista index a la aplicación


//Comprobamos que se hace la conexión con socket.io

  io.on('connection',(socket) => {

    console.log('conectado');


  })


//Middlewares de la app relacionados con node
  app.use(cors());
  app.use(express.urlencoded({extended:true}));
  app.use(express.json());

//Configuración de dotenv para recibir las variables del archivo .env

  dotenv.config();

//Usos de la app(Librerias, Rutas, Etc)

  app.use(Email);


//Puerto 
  server.listen(port, () => {
    console.log('listening on *:3000');
  });
 