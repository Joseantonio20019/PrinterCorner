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


    async function getLatestEmailRead(req,res,next){

        const browser = await webkit.launch();
        const page = await browser.newPage();


        try{

            const email =  await mailslurp.waitController.waitForLatestEmail({
    
                inboxId: process.env.INBOX_ID,
                timeout:10000,
                unreadOnly: false,
    
    
                
            });


            //Archivo
            
              /* const file = await mailslurp.emailController.downloadAttachmentBase64({
                attachmentId: email.attachments[0],
                emailId: email.id,
                
               
            });

            const content = file.base64FileContents;
            const emailcontent = Buffer.from(content,'base64').toString('binary');

            const archivo= fs.writeFile("../../PrinterCornerFiles/"+Math.floor(Math.random()* 10000)+".emailcontent",emailcontent,"binary",function(err){
             
                if(err){
                    console.log(err);
                }else{

                    console.log("Archivo descargado correctamente");
                }

            });

            res.send(archivo);   */

            
            //await page.goto('http://localhost:3000/latestEmail');

            

            
               
        
            
            


            //CUERPO DEL CORREO
              const body = await mailslurp.emailController.downloadBody({
                emailId: email.id,
                
               
            });
            

            
            
/* 
           const file = fs.writeFile("../../PrinterCornerFiles/"+Math.floor(Math.random()* 10000)+".pdf",body,function(err){

                if(err){
                    console.log(err);
                }
            });  */


            const file = pdf.create(body).toFile("../../PrinterCornerFiles/"+Math.floor(Math.random()* 10000)+".pdf",(err,res) => {

                if(err){
                    console.log(err);
                }

            });

            res.send(file);
            console.log("Archivo descargado correctamente");
            

            

        }catch(err){


            console.log(err);


        }




    }


    //Función que manda una vista que se encargará de reiniciar la página hasta que haya un correo entrante
    function mailNotFound(req,res){

        res.sendFile(path.join(__dirname + '/../html/EmailNotFound.html'));


    }

    function prueba(req,res){

        res.sendFile(path.join(__dirname + '/../html/prueba.html'));

    }


   /*  
    if(email.attachments != ''){


        res.send(email.attachments);

    }else{

        res.send(email.body);
        res.status(200);
        console.log("Correo devuelto correctamente");
        
    }
    
    }catch(error){
        console.log("Correo vacío");
        //Función para la recarga de la página constantemente y no      
        res.sendFile(__dirname,'/html/EmailNotFound.html');
    } */

    




module.exports={

    createInbox,
    getEmails,
    getLatestEmail,
    getLatestEmailRead,
    mailNotFound,
    prueba

}


