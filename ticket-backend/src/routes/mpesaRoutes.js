const express = require('express');
const { stkPush, mpesaCallback, getPaymentStatus } = require('../controllers/mpesaController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/stkpush', auth,stkPush);
router.get('/status/:checkoutRequestId', auth, getPaymentStatus);
router.post('/callback', mpesaCallback);

module.exports = router;