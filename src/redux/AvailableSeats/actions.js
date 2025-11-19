
// src/redux/actions.js
import {  FETCH_AVAILABLESEATS_REQUEST, FETCH_AVAILABLESEATS_SUCCESS, FETCH_AVAILABLESEATS_FAILURE} from "./actionTypes";


export const AvailableTicket_Request = () => ({ type: FETCH_AVAILABLESEATS_REQUEST });
export const AvailableTicket_Success = (data) => ({ type: FETCH_AVAILABLESEATS_SUCCESS, payload: data });
export const AvailableTicket_Failure = (error) => ({ type: FETCH_AVAILABLESEATS_FAILURE, payload: error });

// Thunk for API call
// export const fetchAvailableSeats = () => async (dispatch) => {
//   dispatch(AvailableTicket_Request());
//   try {
//     const res = await fetch("https://seatn-sync-production.up.railway.app/infy/seats/availability");  //for bok a seat
//     const data = await res.json();
//     await dispatch(AvailableTicket_Success(data)); 
//     console.log("AvailableSeats",data)
//   } catch (err) {
//     dispatch(AvailableTicket_Failure(err.message));
//   }
// };