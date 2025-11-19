import React from "react";
import { Box, Typography, Card, CardContent, Grid, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectBooking } from "../../redux/Booking/selectors";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useEffect } from "react";
import { fetchTicketDetails } from "../../redux/BookedTickets/actions";  //Booked tickets
import { selectTicketsLists } from "../../redux/BookedTickets/selectors";

function BookedTicketsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ticketList = useSelector(selectTicketsLists);
     const { employeeId} = useSelector((state) => state.auth);
  console.log("ticketList", ticketList);
  const booking = useSelector(selectBooking);

    // Fetch API data on mount
    useEffect(() => {
       
          console.log("Employee ID in QRScanner:", employeeId);
      const fetchData = async () => {
        try {
          console.log("fetchTicketDetails func fired");
          dispatch(fetchTicketDetails());
        }
        catch {
          console.log("error");
        }
      }
      fetchData();
    }, [dispatch]);

  const handleAddClick = () => {
    navigate("/book-seat");
  };
  const handleQRScan = () => {
   navigate("/scan-qr");
  }
  return (
    <Box sx={{ p: 2, position: "relative", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Typography variant="h5" gutterBottom>
        Your Booked Tickets
      </Typography>

      {ticketList?.dates?.length ? (
        ticketList.dates.map((date, idx) => (
          <Card key={idx} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{date}</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2">Start: {booking.startTime || "09:00"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">End: {booking.endTime || "18:00"}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    Location: {booking.city}, {booking.branch}, {booking.block}, {booking.wing}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    Seat No: {booking.seatNumber} ({booking.seatType || "Standard"})
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No tickets booked yet.
        </Typography>
      )}

      {/* Floating + icon */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddClick}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      <Fab 
      onClick={handleQRScan}
      sx={{ position: "fixed", bottom: 16, right: 80 }}>
  <QrCodeScannerIcon />
</Fab>
    </Box>
  );
}

export default BookedTicketsPage;
