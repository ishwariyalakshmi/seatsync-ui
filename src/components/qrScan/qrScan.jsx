import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./QRScanner.css";

function QRScanner() {
  const { employeeId } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      async (decodedText) => {
        console.log("QR Scan Result:", decodedText);
        scanner.clear();

        setResult({ status: "loading" });

        try {
          const url = `https://seatn-sync-production.up.railway.app/infy/checkIn?seatHashCode=${decodedText}&empId=${employeeId}`;
          console.log("Calling API:", url);

          const response = await fetch(url, {
            method: "GET",
            headers: { accept: "*/*" },
          });

          if (!response.ok) {
            throw new Error("Check-in failed");
          }

          const data = await response.json();

          setResult({
            status: "success",
            seatCode: decodedText,
            message: data.message || "Check-in successful",
          });

          // Start countdown → redirect after 5 seconds
          let timer = 5;
          const interval = setInterval(() => {
            timer--;
            setCountdown(timer);

            if (timer === 0) {
              clearInterval(interval);
              navigate("/booked-seats"); // Redirect to BookedTickets
            }
          }, 1000);

        } catch (err) {
          console.error("Error:", err);
          setResult({
            status: "error",
            message: "Unable to complete check-in",
          });
        }
      },
      (scanError) => console.warn("Scan error:", scanError)
    );

    return () => scanner.clear();
  }, [employeeId, navigate]);

  return (
    <div className="qr-page">
      <div className="qr-header">
        <h1 className="qr-title">Seat Check-In</h1>
        <p className="qr-subtext">Scan the QR code placed on your seat</p>
      </div>

      <div className="qr-card">
        {result?.status === "success" ? (
          <div className="qr-result success">
            <h3>✅ {result.message}</h3>
            <p>Redirecting in <b>{countdown}</b> seconds...</p>

            <button className="qr-btn" onClick={() => navigate("/booked-seats")}>
              Go Now
            </button>
          </div>
        ) : result?.status === "loading" ? (
          <div className="qr-loading">Processing…</div>
        ) : result?.status === "error" ? (
          <div className="qr-result error">
            <h3>⚠️ Check-In Failed</h3>
            <p>{result.message}</p>

            <button className="qr-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="qr-scanner-wrapper">
            <div id="qr-reader" className="qr-scanner"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRScanner;
