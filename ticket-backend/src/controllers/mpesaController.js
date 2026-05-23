const moment = require('moment');
const axios = require('axios');
const { getAccessToken } = require('../services/mpesaService');


const stkPush = async (req,res) =>{
    try {
        const userId = req.user.id;
        let { phoneNumber, amount, eventId } = req.body;

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
                CallBackURL:process.env.MPESA_CALLBACK_URL,
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
            phone_number,
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

        res.status(500).json({
            error: 'Failed to initiate payment',
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
                mpesa_receipt_number = $2
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

            await pool.query(
                `INSERT INTO tickets
                (
                    user_id,
                    event_id,
                    quantity,)
                    VALUES ($1, $2, $3)`,
                    [
                        payment.user_id,
                        payment.event_id,
                        1,
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

module.exports = { stkPush, mpesaCallback};