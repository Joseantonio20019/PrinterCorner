
//Importar y generar la función que permita recoger los datos del archivo .env

const dotenv= require('dotenv');
dotenv.config();

//Importe de modulos

const MailSlurp = require('mailslurp-client').default;
const path = require('path');
const fs = require('fs');
const { webkit } = require('playwright');
const pdf = require('html-pdf');
const PDFDocument = require('pdfkit');
//Creación de Variables

const doc = new PDFDocument();
const apiKey = process.env.API_KEY;
const mailslurp = new MailSlurp({ apiKey});



    //FUNCIONES

    //Función para la creación de bandejas de entrada

        async function createInbox(req,res){

        //Creamos la variable inbox, que llama a la función createInbox y pide como parámetros el nombre, si utiliza un dominio específico y fecha de expiración

            const inbox= await mailslurp.inboxController.createInbox({

            //Parámetros de la bandeja de entrada 

                name: 'R2 Hotels Printer Corner',
                useDomainPool: true,
                expiresAt: null,

            });
            
        //Envío de la bandeja de entrada

            res.send(inbox);

        //Mensaje por consola para mostrar que la bandeja de entrada se ha creado
            
            console.log('Bandeja creada correctamente');
            
        }


    /*FUNCIÓN EN PRUEBAS*/

    //Función para mostrar el último email recibido, en caso de que no se reciba ninguno se creará un bucle infinito hasta que llegue un correo

    async function getLatestEmailAndDownloadContent(req,res){

    //Creación variables de la redirección de playwright para redirigir a la página de checkeo de emails

        const browser = await webkit.launch();
        const page = await browser.newPage();


        try{

            //Llamada al último email recibido

            const email =  await mailslurp.waitController.waitForLatestEmail({
    
            //Parámetros de la API para poder recoger el último correo

                    inboxId: process.env.INBOX_ID,
                    timeout:10000,
                    unreadOnly: false,
    
    
                
            });

            //Comprobamos que el correo tiene archivos adjuntos y obtenemos todos los archivos

            const attachments = await mailslurp.emailController.getEmailAttachments({

                inboxId: process.env.INBOX_ID,
                emailId: email.id,
    
            });

            
            //Creamos una variable para en caso de que haya un archivo pdf, descargue solo el archivo pdf

            let pdfFile = null;

            //Revisamos en el array de archivos si existe un pdf, en caso de que si lo guardamos en la variable pdfFile

            attachments.forEach((attachment)=>{

                if(attachment.contentType == "application/pdf"){

                    console.log(attachment.contentType);
                     pdfFile = attachment;
                     
                }

            })

           

        //Comprobaciones para saber si descargamos archivos o el cuerpo del correo

        //Hacemos un checkeo de que el archivo es un PDF, sino se descarga el cuerpo del correo
            
            if(attachments.length > 0 &&  pdfFile !== null && pdfFile.contentType == 'application/pdf' ){
                
            
            //Descarga del archivo 
                
            //Descarga del archivo en base64 que es la forma de descargarlo de la API

               const file = await mailslurp.emailController.downloadAttachmentBase64({

                //Parámetros para saber que email y que archivo hay que descargar, en este caso el id del archivo y el id del email

                    attachmentId:pdfFile.id,
                    emailId: email.id,
                
               
                });

        
                
            //Variable para crear el contenido del archivo

                const content = file.base64FileContents;

            //Conversión de Base64 a binario

                const emailcontent = Buffer.from(content,'base64').toString('binary');

            //Creación del archivo

            //Creamos la variable archivo e indicamos ruta y nombre del archivo con su extensión, contenido del archivo y extensión de la que viene el archivo

            const archivo = fs.writeFile("../../PrinterCornerFiles/" + Math.floor(Math.random() * 10000) + ".pdf",emailcontent,"binary",function(err){
             
            //Si salta un error la consola mostrará el problema

                if(err){
                    console.log(err);
                }

            });

            //Respuesta que se envía al cliente y autodescarga del archivo a la carpeta dirigida

                res.send(archivo);   

            //Comprobación de que el archivo se ha descargado

                console.log("Archivo descargado correctamente");
            
            //Redirección a la página de checkeo de emails tras descargar el archivo

                console.log("Redireccionando");
         
                await page.goto('http://localhost:3000/');

            
        
       

        }else{
            
            //CUERPO DEL CORREO
            //Llamamos a la función que descarga el cuerpo del correo

              const body = await mailslurp.emailController.downloadBody({

            //Parámetro de la API para saber que correo es el que se va a descargar, en este caso solo la id del email

                emailId: email.id,
                
               
            });
            
            
            //Variable opciones de la librería de conversión a pdf con el formato que se le va a dar al cuerpo del correo

            const options = {
                
                "width" : "280mm",
                "height" :"396mm",

                
            }

            //Conversión y creación del archivo con el cuerpo del correo a PDF y descarga del mismo

            //Llamamos a la libería html-pdf para convertir el cuerpo a archivo PDF 

                const file = pdf.create(body,options).toFile("../../PrinterCornerFiles/" + Math.floor(Math.random()* 10000) + ".pdf",(err,res) => {


                //Si existe un error la consola mostrará que error hay

                    if(err){
                        console.log(err);
                    }

                })

                //Enviamos el archivo

                    res.send(file);


                //Generamos un correo de confirmación de que se ha descargado el archivo y que en breves se imprimirá

                

                //Comprobamos que el archivo se descarga correctamente

                    console.log("Archivo descargado correctamente.Redireccionando");
                    
                    //Redireccionamos para que el programa sigo funcionando automáticamente
                    await page.goto('http://localhost:3000/');

            }
            
            
        }catch(err){

        //Se muestra el error en caso de que la función falle

            console.log(err);
            //console.log("No hay correos entrantes.Redireccionando");
            //await page.goto('http://localhost:3000/');
            
            
        }

    
    }

      //Función para mostrar la página principal de la aplicación

      function index(req,res){


        //Envío de un archivo html que muestra la vista general de la página index

        res.sendFile(path.join(__dirname + '/../html/index.html'));

        }


    //Función para mostrar todos los emails de la bandeja de entrada

    async function getEmails(req,res){


        //Creamos la variable emails, que llama a la función getEmails y devuelve todos los emails de la bandeja de entrada

            const emails = await mailslurp.inboxController.getEmails({ 
                
            //Parámetros para obtener los correos, en este caso el id de la bandeja de entrada

                inboxId: process.env.INBOX_ID,
                sort: "DESC", 
            
            });


        //Envío de los emails 

            res.send(emails);
    

        }

    //Función implementada para borrar los correos de la bandeja de entrada

    async function deleteEmail(req,res){

        try{

            //Llamada a la API para borrar el correo

            const deleteEmail = await mailslurp.deleteEmail(req.params.id);
            
            //Enviamos la función eliminando el correo

            res.send(deleteEmail);

            //Comprobación de que el correo se ha borrado correctamente

            console.log("Correo borrado correctamente");

        }catch(err){

            //Se muestra el error en caso de que la función falle

            console.log(err);

        }
    }

    //Función que muestra todos los archivos de cada correo

    async function getEmailFiles(req,res){


        try {

        //LLamada a la API para obtener los archivos de cada correo

        const files = await mailslurp.emailController.getEmailAttachments({

            inboxId: process.env.INBOX_ID,
            emailId: req.params.id
        });

        //Envío de los archivos
        
        res.send(files);

        }catch(err){

            console.log(err);
        }
    }



//Exportamos cada una de las funciones del controlador para ser utilizado en el resto de la aplicación 

    module.exports = {

        index,
        createInbox,
        getEmails,
        getLatestEmailAndDownloadContent,
        deleteEmail,
        getEmailFiles

    }


