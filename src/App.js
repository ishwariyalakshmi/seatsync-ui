import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SeatBooking from './components/seatBooking/seatBooking';
import BookedTickets from './components/bookedTicket/bookedTickets';
import QRScanner from './components/qrScan/qrScan';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoginPage from './components/auth/auth';


function App() {
  return (
    <div className="App">
       <LocalizationProvider dateAdapter={AdapterDayjs}>
       <Router>
      <Routes>
        <Route path="/booked-seats" element={<BookedTickets/>} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/book-seat" element={<SeatBooking />} />
        <Route path="/scan-qr" element={<QRScanner/>} />
      </Routes>
    </Router>
    </LocalizationProvider>
    </div>
  );
}

export default App;