import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner} from 'html5-qrcode';
import axios from "axios"
import { apiUrl } from "../config/api"
import { AuthContext } from '../context/AuthContext';

const ScanTicket = () => {

    const [result, setResult] = useState(null);
    const {token} = useContext(AuthContext);

    const scannerRef = useRef(null);


      const verifyToken = useCallback(async (verificationCode) => {
    try {
        const res = await axios.post(
            apiUrl("/api/v1/payments/verify-ticket"),
            {
                verificationCode,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setResult({
            success: true,
            message: `${res.data.attendee} admitted`,
        });
    } catch (error) {
        setResult({
            success: false,
            message: error.response?.data?.message,
        });
    }
}, [token]);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: 250,
            },
            false
        );

        scanner.render(
            (decodedText) => {
                verifyToken(decodedText);
                console.log("QR code", decodedText);

                scanner.clear();
            },
            (error) => {
                console.log(error)
            }
        );

        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current){
                scannerRef.current.clear().catch(() => {});
            }
        };
    }, [verifyToken]);


 
 return (
    <div>
      <h2 className="text-center">Scan Ticket</h2>

      <div id="reader" />

      {result && (
        <div
          className={
            result.success
              ? "bg-green-100 text-green-700 p-4"
              : "bg-red-100 text-red-700 p-4"
          }
        >
          {result.message}
        </div>
      )}
    </div>
  );

}

export default ScanTicket