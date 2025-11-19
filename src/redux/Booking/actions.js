// src/redux/actions.js
import { SET_FORM_DATA, RESET_FORM, FETCH_DC_REQUEST, FETCH_DC_SUCCESS, FETCH_DC_FAILURE,  
  FETCH_AVAILABLE_SEATS_REQUEST, FETCH_AVAILABLE_SEATS_SUCCESS, FETCH_AVAILABLE_SEATS_FAILURE

} from "./actionTypes";
import axios from "axios";


export const setFormData = (field, value) => ({
  type: SET_FORM_DATA,
  payload: { field, value },
});

export const resetForm = () => ({
  type: RESET_FORM,
});

export const fetchDcRequest = () => ({ type: FETCH_DC_REQUEST });
export const fetchDcSuccess = (data) => ({ type: FETCH_DC_SUCCESS, payload: data });
export const fetchDcFailure = (error) => ({ type: FETCH_DC_FAILURE, payload: error });

// Action Creators
export const fetchAvailableSeatsRequest = () => ({
  type: FETCH_AVAILABLE_SEATS_REQUEST,
});

export const fetchAvailableSeatsSuccess = (data) => ({
  type: FETCH_AVAILABLE_SEATS_SUCCESS,
  payload: data,
});

export const fetchAvailableSeatsFailure = (error) => ({
  type: FETCH_AVAILABLE_SEATS_FAILURE,
  payload: error,
});

// Thunk for API call
export const fetchDcDetails = () => async (dispatch) => {
  dispatch(fetchDcRequest());
  try {
    const res = await fetch("https://seatn-sync-production.up.railway.app/infy/dc/details");
    const data = await res.json();
    await dispatch(fetchDcSuccess(data.cityList)); // store only cityList
    console.log("data",data)
  } catch (err) {
    dispatch(fetchDcFailure(err.message));
  }
};


// Thunk Action (async)
export const fetchAvailableSeats = (wingId, duration, dates, timeSlot) => async (dispatch) => {
  dispatch(fetchAvailableSeatsRequest());
  try {
    const response = await axios.post(
      "https://seatn-sync-production.up.railway.app/infy/seats/availability",
      {
        wingId,
        duration,
        dates,
        timeSlot,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // ✅ Extract only the relevant data
    const { fullDayAvailability, slotAvailability } = response.data;

    dispatch(
      fetchAvailableSeatsSuccess({
        fullDayAvailability,
        slotAvailability,
      })
    );
       console.log("AvailableSeats Action:", response.data);
  } catch (error) {
    dispatch(fetchAvailableSeatsFailure(error.message));
  }
};
