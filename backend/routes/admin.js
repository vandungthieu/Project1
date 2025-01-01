const express = require('express');
const { getAdmin, updatePin, sendPin,  } = require('../controllers/adminController');


const router = express.Router();


router.get('/', getAdmin); 
router.put('/update-pin',updatePin)
router.get('/sendpin', sendPin)
module.exports = router;
