const express = require('express');
const EmailController = require('../Emails/EmailsController')
const router = express.Router();


router.post('/inbox',EmailController.createInbox)
      .get('/emails',EmailController.getEmails)
      .post('/latestEmail',EmailController.getLatestEmail)
      .get('/notFound', EmailController.mailNotFound)
      .get('/readEmail',EmailController.getLatestEmailRead)
      .post('/prueba',EmailController.prueba)


module.exports = router;
