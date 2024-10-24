const express = require('express');
const authControllers = require('../controllers/authconrollers');

const router = express.Router();

router.route('/register').post(authControllers.register);
router.route('/login').post(authControllers.login)
router.route('/findmessage').post(authControllers.findMessage)

module.exports = router;
