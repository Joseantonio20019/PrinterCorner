const dotenv= require('dotenv');
dotenv.config();

const { ReloadRouter } = require('express-route-reload');
const MailSlurp = require('mailslurp-client').default;
const path = require('path');
const fs = require('fs');


//Creación de Variables
const apiKey = process.env.API_KEY;
const mailslurp = new MailSlurp({ apiKey});



async function downloadAttachment() {
   
  
    const email = await waitForController.waitForLatestEmail(process.env.INBOX_ID, 10000, false);
  
    
    const emailController = mailslurp.emailController;
    const attachmentDto = await emailController.downloadAttachmentBase64(email.attachments[0], email.id)
  
    return attachmentDto;
  }
  
  module.exports = downloadAttachment;
