
// src/redux/actions.js
import { SET_FORM_DATA, RESET_FORM, FETCH_TICKET_REQUEST, FETCH_TICKET_SUCCESS, FETCH_TICKET_FAILURE} from "./actionTypes";
import axios from "axios";

export const setFormData = (field, value) => ({
  type: SET_FORM_DATA,
  payload: { field, value },
});

export const resetForm = () => ({
  type: RESET_FORM,
});

export const fetchTicketRequest = () => ({ type: FETCH_TICKET_REQUEST });
export const fetchTicketSuccess = (data) => ({ type: FETCH_TICKET_SUCCESS, payload: data });
export const fetchTicketFailure = (error) => ({ type: FETCH_TICKET_FAILURE, payload: error });

// Thunk for API call
// Thunk action
export const fetchTicketDetails = () => async (dispatch) => {
  dispatch(fetchTicketRequest());
  try {
    const res = await axios.post(
      "https://seatn-sync-production.up.railway.app/infy/emp/101/seat",
      {
        // ✅ payload goes here
        empId: 101,   // dynamic if needed
        seat: "A1",   // example field, replace with actual booking data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // axios auto-parses JSON → use res.data
    dispatch(fetchTicketSuccess(res.data));
    console.log("BookedTickets", res.data);
  } catch (err) {
    dispatch(fetchTicketFailure(err.message));
  }
};