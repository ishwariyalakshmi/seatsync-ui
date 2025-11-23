import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FormControl,  
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Grid, Typography, Card, CardContent, Tooltip,  
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  selectCity,
  selectBranch,
  selectBlock,
  selectWing,  
  selectSeatNumber,
  selectLoading,
  selectDcData,
  selectError,
  selectDates,
  selectBookingType,
  selectBooking, selectAvailabilityList, selectBookingSuccess, selectBookingError
} from "../../redux/Booking/selectors";
import { setFormData, resetForm, fetchDcDetails, fetchAvailableSeats, bookSeat } from "../../redux/Booking/actions";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoadingOverlay from '../../sharedComponent/Loading/loading';
import CustomSnackbar from "../../sharedComponent/snackBar/CustomSnackbar";
import { CLEAR_BOOKING_MESSAGE } from "../../redux/Booking/actionTypes";

function SeatBooking() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const city = useSelector(selectCity);
  const branch = useSelector(selectBranch);
  const block = useSelector(selectBlock);
  const wing = useSelector(selectWing); 
  const dates = useSelector(selectDates);
  const bookingType = useSelector(selectBookingType);
  const bookingSuccessful = useSelector(selectBookingSuccess);
  const bookingErrors = useSelector(selectBookingError);
  const availabilityList = useSelector(selectAvailabilityList);
  const dcData = useSelector(selectDcData);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const today = dayjs();
  const maxDate = today.add(7, "day");
  // Local state for dropdown options
  const [cityOptions, setCityOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [wingOptions, setWingOptions] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const booking = useSelector((state) => state.booking); 
  const { employeeId } = useSelector((state) => state.auth);  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (bookingSuccessful) {
      setSnackbarMessage("Booking Successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (bookingErrors) {
      setSnackbarMessage("Unable to book seat. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [bookingSuccessful, bookingErrors]);

  // Fetch API data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetchData func fired");
        dispatch(fetchDcDetails());
      }
      catch {
        console.log("error", error)
      }
    }
    fetchData();
  }, [dispatch]);

  // Populate city options once
  useEffect(() => {
    console.log("Full booking state:", booking);
    setCityOptions(dcData?.map((c) => c.cityName));
  }, [dcData]);

  // Update branch options when city changes
  useEffect(() => {
    // Always start from the selected city
    const selectedCity = dcData?.find((c) => c.cityName === city);
    // Branch options depend on city
    if (city) {
      setBranchOptions(selectedCity?.dataCenters || []);
    } else {
      setBranchOptions([]);
      dispatch(setFormData("branch", ""));
    }
    // Block options depend on branch
    const selectedBranch = selectedCity?.dataCenters.find(
      (b) => b.dcName === branch
    );
    if (branch) {
      setBlockOptions(selectedBranch?.blocks || []);
    } else {
      setBlockOptions([]);
      dispatch(setFormData("block", ""));
    }

    // Wing options depend on block
    const selectedBlock = selectedBranch?.blocks.find(
      (bl) => bl.blockName === block
    );
    if (dates && block) {
      setWingOptions(selectedBlock?.wings || []);
    } else {
      setWingOptions([]);
      dispatch(setFormData("wing", ""));
    }
  }, [city, branch, block, dcData, dispatch]);  

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleChange = (field) => (event) => {
    const value = event.target.value;   
    dispatch(setFormData(field, value));
    // If the field is "wing", trigger the API call
    if (field === "wing") {      
      const selectedWing = wingOptions.find((w) => w.wingName === value);
      if (selectedWing) {
        dispatch(fetchAvailableSeats(
          selectedWing.wingId,                        
          bookingType || "FullDay",                   
          dates.length ? dates : [dayjs().format("YYYY-MM-DD")], 
          { startTime: "09:00", endTime: "11:00" } 
        ));
      }
    }
  };
  const handleSubmit = () => {
    const selectedWing = wingOptions.find((w) => w.wingName === wing);
    if (!selectedWing) {
      alert("Please select a wing before booking!");
      return;
    }
    const payload = {
      wingId: selectedWing.wingId,
      employee_id: employeeId,
      dates: selectedDates,
    };
    dispatch(bookSeat(payload, navigate));
    dispatch(resetForm());
  };  

  const handleDateChange = (newDate) => {
    console.log("newDate", newDate)
    const formatted = newDate.format("YYYY-MM-DD");
    // allow multiple selection
    let updatedDates = [...dates];
    if (updatedDates.includes(formatted)) {
      updatedDates = updatedDates.filter((d) => d !== formatted);
    } else {
      updatedDates.push(formatted);
      console.log("dates", formatted)
    }
    console.log("dates1", formatted)
    dispatch(setFormData("dates", updatedDates));
    console.log("dates2", formatted)
  };

  return (loading ? (<div><LoadingOverlay loading={loading} /> </div>) :
    <Box sx={{ flexGrow: 1, p: 3, height: "100%" }}>
      <Grid container spacing={3}>
        <Grid item size={4}>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select dates (next 7 days)"
                value={null}                 // keep null to enable multi-select behavior
                onChange={handleDateChange}
                disablePast
                minDate={today}
                maxDate={maxDate}
                // v6 signature: (day, _value, DayComponentProps)
                renderDay={(day, _value, DayComponentProps) => {
                  const formatted = day.format("YYYY-MM-DD");
                  const isSelected = dates.includes(formatted);

                  return (
                    <PickersDay
                      {...DayComponentProps}
                      // Use sx styling instead of forcing `selected`
                      sx={
                        isSelected
                          ? {
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            "&:hover": { bgcolor: "primary.dark" },
                          }
                          : undefined
                      }
                    />
                  );
                }}
                // Extra guard: disable dates outside range (works with keyboard entry)
                shouldDisableDate={(day) =>
                  day.isBefore(today, "day") || day.isAfter(maxDate, "day")
                }
              />
            </LocalizationProvider>
            <Box sx={{ mt: 1 }}>
              Selected: {dates.join(", ")}
            </Box>
          </FormControl>
        </Grid>
        {/* City Dropdown */}
        <Grid item size={4}>
          <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Select value={booking.city || ""} label="City" onChange={handleChange("city")}>
              {cityOptions?.map((c, idx) => (
                <MenuItem key={idx} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Branch Dropdown */}
        <Grid item size={4}>
          <FormControl fullWidth>
            <InputLabel>Branch</InputLabel>
            <Select value={branch || ""} label="Branch" onChange={handleChange("branch")}>
              {branchOptions?.map((b) => (
                <MenuItem key={b.dcId} value={b.dcName}>
                  {b.dcName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Block Dropdown */}
        <Grid item size={4}>
          <FormControl fullWidth>
            <InputLabel>Block</InputLabel>
            <Select value={block || ""} label="Block" onChange={handleChange("block")}>
              {blockOptions?.map((bl) => (
                <MenuItem key={bl.blockId} value={bl.blockName}>
                  {bl.blockName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Wing Dropdown */}
        <Grid item size={4}>
          <FormControl fullWidth>
            <InputLabel>Wing</InputLabel>
            <Select
              value={wing || ""}
              label="Wing"
              onChange={handleChange("wing")}
            >
              {wingOptions?.map((w) => (
                <MenuItem key={w.wingId} value={w.wingName}>
                  {w.wingName} ({w.accessType})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>  
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : availabilityList && availabilityList.length > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", 
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Select the dates to book a seat
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",  
                  gap: 2,                 
                  overflowX: "auto",      
                  p: 2,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  }
                }}
              >
                {availabilityList.map((item) => (
                  <>
                    <Card
                      key={item.date}
                      onClick={() => {
                        setSelectedDates((prev) =>
                          prev.includes(item.date)
                            ? prev.filter((d) => d !== item.date) // remove if already selected
                            : [...prev, item.date]               // add if not selected
                        );
                      }}
                      sx={{
                        minWidth: 200,
                        backgroundColor: selectedDates.includes(item.date)
                          ? "blue" // highlight if selected
                          : item.availableSeats === 0
                            ? "#e4b521"
                            : "green",
                        color: "white",
                        borderRadius: "8px",
                        flexShrink: 0,
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6">{item.date}</Typography>
                        <Typography>Available Seats: {item.availableSeats}</Typography>
                        {item.availableSeats === 0 && (<Typography>CurrentStatus: {item.status}</Typography>)}
                      </CardContent>
                    </Card>
                  </>
                )
                )}
              </Box>
            </Box>
          </>
        ) : (
          <Typography>No availability data</Typography>
        )}
      </Box>
      {/* Submit Button */}
      <Tooltip title="Select the dates to book a seat">
        <span>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            //disabled={!(availabilityList && availabilityList.length > 0)}
            disabled={selectedDates.length === 0}
          >
            Book Seat
          </Button>
        </span>
      </Tooltip>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => {
          setSnackbarOpen(false);
          dispatch({ type: CLEAR_BOOKING_MESSAGE }); // ✅ clear Redux message
        }}
      />
    </Box>
  );
}

export default SeatBooking;
