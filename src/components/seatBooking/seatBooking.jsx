import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Grid, Typography, Card, CardContent,
  RadioGroup,
  Radio,
  TextField
} from "@mui/material";
import {
  selectCity,
  selectBranch,
  selectBlock,
  selectWing,
  selectSeatType,
  selectRow,
  selectSeatNumber,
  selectLoading,
  selectDcData,
  selectError,
  selectDates,
  selectBookingType,
  selectStartTime,
  selectEndTime, selectBooking, availableSeats, loadingSeats, errorSeats, selectAvailabilityList
} from "../../redux/Booking/selectors";
import { setFormData, resetForm, fetchDcDetails, fetchAvailableSeats } from "../../redux/Booking/actions";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


function SeatBooking() {
  const formData = useSelector((state) => state);
  const dispatch = useDispatch();
  const bookings = useSelector(selectBooking)

  const city = useSelector(selectCity);
  const branch = useSelector(selectBranch);
  const block = useSelector(selectBlock);
  const wing = useSelector(selectWing);
  // const seatType = useSelector(selectSeatType);
  // const row = useSelector(selectRow);
  const seatNumber = useSelector(selectSeatNumber);
  const dates = useSelector(selectDates);
  const bookingType = useSelector(selectBookingType);
  const availableSeats = useSelector((state) => state.booking.availableSeats);
  const loadingSeats = useSelector((state) => state.booking.loadingSeats);
  const errorSeats = useSelector((state) => state.booking.errorSeats);
  const availabilityList = useSelector(selectAvailabilityList);
   console.log("FullDayAvailability availableList:", availabilityList);
  
  // const endTime = useSelector(selectEndTime);
  // const startTime = useSelector(selectStartTime);


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
  const booking = useSelector((state) => state.booking);
  console.log("Full booking state:", booking);


 
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
    if ( dates && block) {
      setWingOptions(selectedBlock?.wings || []);
    } else {
      setWingOptions([]);
      dispatch(setFormData("wing", ""));
    }
  }, [city, branch, block, dcData, dispatch]);

 if (loading) {
    return <p>Loading data centers...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // if (!dcData || dcData.length === 0) {
  //   return <p>No data available</p>;
  // }

 const handleChange = (field) => (event) => {
  const value = event.target.value;

  // Update Redux form data
  dispatch(setFormData(field, value));

  // If the field is "wing", trigger the API call
  if (field === "wing") {
    // Find the selected wing object (to get wingId)
    const selectedWing = wingOptions.find((w) => w.wingName === value);

    if (selectedWing) {
      dispatch(fetchAvailableSeats(
        selectedWing.wingId,                        // wingId
        bookingType || "FullDay",                   // duration
        dates.length ? dates : [dayjs().format("YYYY-MM-DD")], // dates
        { startTime:  "09:00", endTime:  "11:00" } // timeSlot
      ));
    }
  }
};


  const handleSubmit = () => {
    console.log("Booking Details:", formData);
    alert(`Booking confirmed!\n${JSON.stringify(formData, null, 2)}`);
    dispatch(resetForm());
  };

  const getNext7Days = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toISOString().split("T")[0]; // YYYY-MM-DD
    });
  };
  const next7Days = getNext7Days();

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


  return ( loading ? (<div>Loading data centers... </div> ):

    <Box sx={{ flexGrow: 1, p: 3 ,height: "100%"}}>
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

      
         {/* <Grid item xs={4}>
  <FormControl fullWidth>
    <InputLabel shrink>Available Seats</InputLabel>
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: 1,
        padding: 1.5,
        textAlign: "center",
        fontSize: "1.2rem",
        fontWeight: "bold",
        backgroundColor: "#f9f9f9",
        width: "30px",
        height: "30px"
      }}
    >
      {availableSeats ?? 0}
    </Box>
  </FormControl>
</Grid>
       */}

        {/* Seat Type Dropdown */}
        {/* <Grid item size={4}>
          <FormControl fullWidth>
            <InputLabel>Seat Type</InputLabel>
            <Select value={seatType} label="Seat Type" onChange={handleChange("seatType")}>
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}

        {/* Row Dropdown */}
        {/* <Grid item size={4}>
          <FormControl fullWidth>
            <InputLabel>Row</InputLabel>
            <Select value={row} label="Row" onChange={handleChange("row")}>
              <MenuItem value="A">Row A</MenuItem>
              <MenuItem value="B">Row B</MenuItem>
              <MenuItem value="C">Row C</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}

        {/* Seat Number Dropdown */}
        {/* <Grid item size={4}>
          <FormControl fullWidth>
            <InputLabel>Seat Number</InputLabel>
            <Select value={seatNumber} onChange={handleChange("seatNumber")}>
              {[1, 2, 3, 4].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid> */}

     {/* <Box sx={{ mt: 3 }}> */}
  {/* Radio buttons */}
  {/* <Grid container>
    <Grid item xs={6}>
      <FormControl component="fieldset">
        <RadioGroup
          row               // stack vertically if you want, or keep row for side-by-side
          value={bookingType}
          onChange={handleChange("bookingType")}
        >
          <FormControlLabel
            value="fullDay"
            control={<Radio />}
            label="Full Day"
          />
          <FormControlLabel
            value="timeSlot"
            control={<Radio />}
            label="Time Slot"
          />
        </RadioGroup>
      </FormControl>
  </Grid> */}
</Grid>
  {/* Time Slot Inputs */}
  {/* {bookingType === "timeSlot" && (
    <Grid
      container
      spacing={2}
      direction="row"           
      style={{ marginTop: "10px" }}
    >
      <Grid item xs={6}>
        <TextField
          type="time"
          label="Start Time"
          value={startTime}
          onChange={handleChange("startTime")}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        </Grid>
    <Grid item xs={6}>
        <TextField
          type="time"
          label="End Time"
          value={endTime}
          onChange={handleChange("endTime")}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Grid>
    </Grid>
  )} */}
{/* </Box> */}

<Box sx={{ mt: 3 }}>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : availabilityList && availabilityList.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",   // ✅ horizontal layout
            gap: 2,                 // spacing between cards
            overflowX: "auto",      // scroll if too many cards
            p: 2,
          }}
        >
          {availabilityList.map((item) => (
            <>
            <Card
              key={item.date}
              sx={{
                minWidth: 200,
                backgroundColor:item.availableSeats == 0 ? "yellow" :"green",
                color: "white",
                borderRadius: "8px",
                flexShrink: 0, // prevents card from shrinking in flexbox
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
      ) : (
        <Typography>No availability data</Typography>
      )}
    </Box>
    

      {/* Submit Button */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Book Seat
        </Button>
      </Box>
    </Box>
  
  );
}

export default SeatBooking;
