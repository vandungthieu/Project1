const express = require('express');
const { getAdmin, updatePin,  } = require('../controllers/adminController');


const router = express.Router();


router.get('/', getAdmin); 
router.put('/update-pin',updatePin)

module.exports = router;
