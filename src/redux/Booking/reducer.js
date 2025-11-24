import {
  FETCH_DC_REQUEST,
  FETCH_DC_SUCCESS,
  FETCH_DC_FAILURE,
  SET_FORM_DATA,
  RESET_FORM,FETCH_AVAILABLE_SEATS_REQUEST, FETCH_AVAILABLE_SEATS_SUCCESS, FETCH_AVAILABLE_SEATS_FAILURE, BOOK_SEAT_REQUEST,
  BOOK_SEAT_SUCCESS,
  BOOK_SEAT_FAILURE,CLEAR_BOOKING_MESSAGE,RESET_FORM_EXCEPT_DATES
} from "./actionTypes";

const initialState = {
  loading: false,
  error: null,
  dcData: [],   // API response stored here
  dates:[],
  fullDayAvailability:{},
  slotAvailability:null,
  bookingType: "",
  city: "",
  branch: "",
  block: "",
  wing: "",
  // seatType: "",
  // row: "",
  seatNumber: "",
  // startTime: "",
  // endTime: ""
  bookings: [],
  bookingLoading: false,
  bookingError: null,
  bookingSuccess: null,
};


export const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DC_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_DC_SUCCESS:
      return { ...state, loading: false, dcData: action.payload };
    case FETCH_DC_FAILURE:
      return { ...state, loading: false, error: action.payload };
      case FETCH_AVAILABLE_SEATS_REQUEST:
      return { ...state, loadingSeats: true, errorSeats: null };
    case FETCH_AVAILABLE_SEATS_SUCCESS:
      return { ...state, 
      loading: false,
      fullDayAvailability: action.payload.fullDayAvailability,
      slotAvailability: action.payload.slotAvailability,
    };
    case FETCH_AVAILABLE_SEATS_FAILURE:
      return { ...state, loadingSeats: false, errorSeats: action.payload };

        case BOOK_SEAT_REQUEST:
      return { ...state, bookingLoading: true, bookingError: null, bookingSuccess: null };
    case BOOK_SEAT_SUCCESS:
      return {
        ...state,
        bookingLoading: false,
        bookingSuccess: true,
        bookings: [...state.bookings, action.payload],        
      };
    case BOOK_SEAT_FAILURE:
      return { ...state, bookingLoading: false, bookingError: true };
    case CLEAR_BOOKING_MESSAGE:
      return { ...state, bookingSuccess: false, bookingError: false };  
    case SET_FORM_DATA:
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case RESET_FORM:
      return initialState;
    case RESET_FORM_EXCEPT_DATES:
  return {
    ...state,
    city: "",
    branch: "",
    block: "",
    wing: "",
    bookingType: "",
    // keep only dates
    dates: action.payload,
  };
  
    default:
      return state;
  }
};