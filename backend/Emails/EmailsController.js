//Importar y generar la función que permita recoger los datos del archivo .env
const dotenv= require('dotenv');
dotenv.config();

//Importe de modulos

const MailSlurp = require('mailslurp-client').default;
const path = require('path');
const fs = require('fs');
const playwright = require('playwright');
const { webkit } = require('playwright');
const pdf = require('html-pdf');


//Creación de Variables
const apiKey = process.env.API_KEY;
const mailslurp = new MailSlurp({ apiKey});


//Función para la creación de bandejas de entrada
async function createInbox(req,res){

    const inbox= await mailslurp.inboxController.createInbox({

        name: 'R2 Hotels Printer Corner',
        useDomainPool: true,
        expiresAt: null,

    });
    
    res.send(inbox);
    console.log('Bandeja creada correctamente');
    
}

//Función para mostrar todos los emails

    async function getEmails(req,res){


        const emails = await mailslurp.inboxController.getEmails({ inboxId: process.env.INBOX_ID });

        res.send(emails);
  

    }


//Función para mostrar el último email recibido, en caso de que no se reciba ninguno se creará un bucle infinito hasta que llegue un correo

  async function getLatestEmail(req,res){

        try{

        const email =  await mailslurp.waitController.waitForLatestEmail({

            inboxId: process.env.INBOX_ID,
            timeout:10000,
            unreadOnly: true,


            
        });

            //res.send(email);
    

            //Funciona pero no descarga el file entero

              if(email.attachments != undefined){

                
                const attachment = await mailslurp.emailController.downloadAttachmentBase64({
                    
                    emailId: email.id,
                    attachmentId: email.attachments[0],
                    
                });
            
                res.send(attachment);

            } 

             

        }catch(err){

            console.log("Correo Vacío");
            res.redirect("/notFound");
            

        }
    
    }


    /*FUNCIÓN EN PRUEBAS*/

    //Función para obtener el último correo de la bandeja de entrada, comprobación de archivos o cuerpo de correo y descarga del mismo

    async function getLatestEmailRead(req,res,next){

    //Creación variables de la redireccióon de playwright a la página de checkeo de emails

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

        //Comprobaciones para saber si descargamos archivos o el cuerpo del correo

            if(email.attachments != undefined){

            //Descarga del archivo 
            
            //Descarga del archivo en base64 que es la forma de descargarlo de la API

               const file = await mailslurp.emailController.downloadAttachmentBase64({

                //Parámetros para saber que email y que archivo hay que descargar

                    attachmentId: email.attachments[0],
                    emailId: email.id,
                
               
            });

            //Variable para crear el contenido del archivo
                const content = file.base64FileContents;

            //Conversión de Base64 a binario
                const emailcontent = Buffer.from(content,'base64').toString('binary');

            //Creación del archivo

            //Indicamos ruta y nombre del archivo con su extensión, contenido del archivo y extensión de la que viene el archivo

            const archivo= fs.writeFile("../../PrinterCornerFiles/"+Math.floor(Math.random()* 10000)+".pdf",emailcontent,"binary",function(err){
             
            //Si salta un error la consola mostrará el problema
                if(err){
                    console.log(err);
                }else{

                    
                }

            });

            //Respuesta que se envía al cliente y autodescarga del archivo a la carpeta dirigida
                res.send(archivo);   

            //Comprobación de que el archivo se ha descargado
                console.log("Archivo descargado correctamente");
            
            //Redirección a la página de checkeo de emails tras descargar el archivo
                await page.goto('http://localhost:3000/latestEmail');

        }else{

            

            
            //CUERPO DEL CORREO
            //Llamamos a la función que descarga el cuerpo del correo

              const body = await mailslurp.emailController.downloadBody({

            //Parámetro de la API para saber que correo es el que se va a descargar

                emailId: email.id,
                
               
            });
            

            //Conversión y creación del archivo con el cuerpo del correo a PDF y descarga del mismo

            //Llamamos a la libería html-pdf para convertir el cuerpo a archivo PDF 

                const file = pdf.create(body).toFile("../../PrinterCornerFiles/"+Math.floor(Math.random()* 10000)+".pdf",(err,res) => {

                //Si existe un error la consola mostrará que error hay

                    if(err){
                        console.log(err);
                    }

                });

                //Enviamos el archivo
                    res.send(file);

                //Comprobamos que el archivo se descarga correctamente

                    console.log("Archivo descargado correctamente");
            
         }
            

        }catch(err){


        //Se muestra el error en caso de que la función falle
            console.log(err);


        }




    }


    //Función que manda una vista que se encargará de reiniciar la página hasta que haya un correo entrante

    function mailNotFound(req,res){

        res.sendFile(path.join(__dirname + '/../html/EmailNotFound.html'));


    }



module.exports={

    createInbox,
    getEmails,
    getLatestEmail,
    getLatestEmailRead,
    mailNotFound,

}


