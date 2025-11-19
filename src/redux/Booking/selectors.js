// Booking selectors
// selector are functions
export const selectBooking = (state) => state.booking;

export const selectCity = (state) => state.booking.city;
export const selectBranch = (state) => state.booking.branch;
export const selectBlock = (state) => state.booking.block;

export const selectWing = (state) => state.booking.wing;
export const selectDates = (state) => state.booking.dates;

export const selectSeatType = (state) => state.booking.seatType;
export const selectRow = (state) => state.booking.row;
export const selectSeatNumber = (state) => state.booking.seatNumber;
export const selectBookingType = (state) => state.booking.bookingType;
export const selectStartTime = (state) => state.booking.startTime;
export const selectEndTime = (state) => state.booking.EndTime;
 
export const selectDcData = (state) => state.booking.dcData;
export const selectLoading = (state) => state.booking.loading;
export const selectError = (state) => state.booking.error;


export const loadingSeats = (state) => state.booking.loadingSeats;
export const errorSeats = (state) => state.booking.errorSeats;

export const selectFullDayAvailability = (state) =>  state.booking.fullDayAvailability;



// Derived selector: flatten into array for easy mapping
export const selectAvailabilityList = (state) => {
  const fullDay = state.booking.fullDayAvailability || {};
  console.log("FullDayAvailability Selector:", fullDay);
  console.log("FullDayAvailability Selector Entries:", Object.entries(fullDay));
  return Object.entries(fullDay).map(([date, info]) => ({
    date,
    availableSeats: info.availableSeats,
    totalSeats: info.totalSeats,
    status: info.currentStatus,
    wingId: info.wingId,
  }));
};
