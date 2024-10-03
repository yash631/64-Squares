const express = require('express');
const crtCont = require('../Controllers/Create/newUser');
const readCont = require('../Controllers/Create/newUser');
const updCont = require('../Controllers/Create/newUser');
const delCont = require('../Controllers/Create/newUser');


const router = express.Router();

// Route to fetch all users
router.get('/users', crtCont.getUsers);

module.exports = router;
