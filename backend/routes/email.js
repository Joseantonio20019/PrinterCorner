const express = require('express');
const EmailController = require('../Emails/EmailsController')
const router = express.Router();


router.post('/inbox',EmailController.createInbox)
      .post('/deleteEmail/:id',EmailController.deleteEmail)
      .get('/',EmailController.index)
      .get('/emails',EmailController.getEmails)
      .get('/checkNewEmail',EmailController.getEmailAndDownloadInfo)
      .get('/inboxEmpty', EmailController.inboxEmpty)
      .get('/readEmail',EmailController.getLatestEmailRead)



module.exports = router;
