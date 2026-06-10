const express = require('express');
const { stkPush, mpesaCallback, getPaymentStatus, getOrganizerBookings, getOrganizerBookingsSummary, getEventBookingsDetails } = require('../controllers/mpesaController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/stkpush', auth,stkPush);
router.get('/status/:checkoutRequestId', auth, getPaymentStatus);
router.post('/callback', mpesaCallback);
router.get('/organizer-bookings', auth, getOrganizerBookings);
router.get("/organizer/summary", auth, getOrganizerBookingsSummary);
router.get("/organizer/event/:eventId", auth, getEventBookingsDetails);

module.exports = router;