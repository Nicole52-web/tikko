const express = require('express');
const { stkPush, mpesaCallback } = require('../controllers/mpesaController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/stkpush', auth,stkPush);
router.post('/callback', mpesaCallback);

module.exports = router;