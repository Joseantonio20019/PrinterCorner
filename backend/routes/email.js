const express = require('express');
const EmailController = require('../Emails/EmailsController')
const router = express.Router();


router.post('/inbox',EmailController.createInbox)
      .get('/emails',EmailController.getEmails)
      .get('/latestEmail',EmailController.getLatestEmail)
      .get('/notFound', EmailController.mailNotFound)
      .get('/readEmail',EmailController.getLatestEmailRead)


module.exports = router;
