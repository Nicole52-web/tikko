const moment = require('moment');
const axios = require('axios');
const pool = require('../db');
const { getAccessToken } = require('../services/mpesaService');
const { isValidUuid } = require('../utils/uuid');
const crypto = require("crypto");
const QRCode = require("qrcode")

const stkPush = async (req,res) =>{
    try {
        const userId = req.user.id;
        let { phoneNumber, amount, eventId } = req.body;

        if (!phoneNumber || !amount || !eventId) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        if (!isValidUuid(eventId)) {
            return res.status(400).json({ error: 'Invalid eventId' });
        }

        const parsedAmount = parseInt(amount, 10);

        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: 'Invalid payment amount' });
        }

        amount = parsedAmount;

        if (phoneNumber.startsWith('0')){
            phoneNumber = '254' + phoneNumber.substring(1);
        }

        const token = await getAccessToken();

        console.log("TOKEN:", token);

        const timestamp = moment().format('YYYYMMDDHHmmss');

        const password = Buffer.from(
            process.env.MPESA_SHORTCODE +
            process.env.MPESA_PASSKEY +
            timestamp
        ).toString('base64');

        console.log("TIMESTAMP:", timestamp);
        console.log("PASSWORD:", password);

        const respond = await axios.post (
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: process.env.MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: process.env.MPESA_SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: process.env.MPESA_CALLBACK_URL,
                AccountReference: `Event - ${eventId} Ticket`,
                TransactionDesc: 'Payment for ticket',
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        const checkoutRequestId = respond.data.CheckoutRequestID;


        await pool.query(


            `INSERT INTO payments
            (

            user_id,
            event_id,
            phonenumber,
            amount,
            status,
            checkout_request_id
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            `,
            [
                userId,
                eventId,
                phoneNumber,
                amount,
                'PENDING',
                checkoutRequestId,
            ]
        );

        res.status(200).json({
            success: true,
            message: 'STK Push sent',
            data: respond.data, 
        });

    } catch (error) {
        console.log(error.response?.data || error.message);

        const message =
            error.response?.data?.errorMessage ||
            error.response?.data?.error ||
            error.message ||
            'Failed to initiate payment';

        res.status(error.response?.status || 500).json({
            error: message,
        });
    }
}


const mpesaCallback = async (req, res) => {
    try {
        console.log(JSON.stringify(req.body, null, 2));

        const callback = req.body.Body.stkCallback;

        const checkoutRequestId = callback.CheckoutRequestID;

        if (callback.ResultCode === 0){

            const metadata =
                callback.CallbackMetadata.Item;

            const amount = 
                metadata.find(i => i.Name === 'Amount')?.Value;
            
            const mpesaReceiptNumber = 
                metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;

            const phoneNumber = 
                metadata.find(i => i.Name === 'PhoneNumber')?.Value;

            await pool.query(
                `UPDATE payments
                SET 
                status = $1,
                mpesareceiptnumber = $2
                WHERE checkout_request_id = $3`,
                [
                    "SUCCESS",
                    mpesaReceiptNumber,
                    checkoutRequestId,
                ]
            );


            const paymentResult = await pool.query(
                `SELECT * FROM payments
                WHERE checkout_request_id = $1`,
                [checkoutRequestId]
            );

            const payment = paymentResult.rows[0];

            const verificationCode = crypto.randomUUID();

            await pool.query(
                `INSERT INTO tickets
                (
                    user_id,
                    event_id,
                    quantity,
                    verification_code
                )
                VALUES ($1, $2, $3, $4)`,
                [
                    payment.user_id,
                    payment.event_id,
                    1,
                    verificationCode
                ]
            );

            console.log(`Payment successful for ${phoneNumber}, amount: ${amount}, receipt: ${mpesaReceiptNumber}`);

        } else {


            await pool.query(
                `UPDATE payments
                SET status = $1
                WHERE checkout_request_id = $2`,
                [
                    "FAILED",
                    checkoutRequestId,
                ]
            )
        }

        res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted"})
    } catch (error){
        console.log(error.message);
        res.status(500).json({
            error: 'Failed to process callback',
        })
    }
}

const getPaymentStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { checkoutRequestId } = req.params;

        const paymentResult = await pool.query(
            `SELECT * FROM payments
            WHERE checkout_request_id = $1 AND user_id = $2`,
            [checkoutRequestId, userId]
        );

        if (!paymentResult.rows[0]) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        const payment = paymentResult.rows[0];
        let ticket = null;

        if (payment.status === 'SUCCESS') {
            const { getLatestTicketForEvent } = require('../models/TicketModel');
            ticket = await getLatestTicketForEvent(userId, payment.event_id);
        }

        res.status(200).json({
            status: payment.status,
            ticket,
            eventId: payment.event_id,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Failed to fetch payment status' });
    }
};


const verifyTicket = async (req,res) => {
    try {

        const { verificationCode } = req.body;

        const result = await pool.query(
            `SELECT
                t.*,
                u.firstname,
                u.lastname,
                e.eventname
            FROM tickets t
            JOIN users u ON u.id = t.user_id
            JOIN events e ON e.id = t.event_id
            WHERE t.verification_code = $1    
            `,
            [verificationCode]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                valid: false,
                message: "Invalid ticket"
            });
        }

        const ticket = result.rows[0];

        if (ticket.checked_in) {
            return res.status(400).json({
                valid: false,
                message: "Ticket already used"
            });
        }

        await pool.query(
            `UPDATE tickets
             SET checked_in = TRUE,
                 checked_in_at = NOW()
            WHERE id = $1        
            `,
            [ticket.id]
        );

        res.json({
            valid: true,
            attendee: `${ticket.firstname} ${ticket.lastname}`,
            event: ticket.eventname
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            message: "Verification failed"
        })
    }
}

// const qrCodeImage = await QRCode.toDataURL(
//     verificationCode
// );

const getOrganizerBookings = async (req, res) => {
    try {
        const organizerId = req.user.id;

        const result = await pool.query(
            `SELECT
            p.id,
            p.amount,
            p.phonenumber,
            p.mpesareceiptnumber,
            p.created_at,
            e.eventname,
            e.date,
            e.location,
            e.place,
            u.firstname,
            u.lastname,
            u.email
            FROM payments p
            INNER JOIN events e
              ON p.event_id = e.id
            INNER JOIN users u
              ON p.user_id = u.id
            WHERE e.user_id = $1
              AND p.status = 'PENDING'
            ORDER BY p.created_at DESC      
            `,
            [organizerId]
        );

        res.status(200).json({
            success: true,
            bookings: result.rows,
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
        });
    }
};


const getOrganizerBookingsSummary = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        e.id AS event_id,
        e.eventname,
        e.date,
        e.location,
        e.ticketprice,
        COUNT(p.id) AS total_bookings
      FROM events e
      LEFT JOIN payments p
        ON p.event_id = e.id
        AND p.status = 'PENDING'
      WHERE e.user_id = $1
      GROUP BY e.id
      ORDER BY e.date DESC
      `,
      [organizerId]
    );

    res.json({ events: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};


const getEventBookingsDetails = async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await pool.query(
      `
      SELECT
        u.firstname,
        u.lastname,
        u.email,
        p.amount,
        p.mpesareceiptnumber,
        p.created_at
      FROM payments p
      JOIN users u ON u.id = p.user_id
      WHERE p.event_id = $1
        AND p.status = 'PENDING'
      ORDER BY p.created_at DESC
      `,
      [eventId]
    );

    res.json({ attendees: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch attendees" });
  }
};


module.exports = { stkPush, mpesaCallback, getPaymentStatus, getOrganizerBookings, getOrganizerBookingsSummary, getEventBookingsDetails, verifyTicket };