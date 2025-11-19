import { combineReducers } from "redux";
import { bookingReducer } from "./Booking/reducer";
import { ticketsListsReducer } from "./BookedTickets/reducer";
import { authReducer } from "./Auth/reducer";

const rootReducer = combineReducers({
  booking: bookingReducer,
  ticketsLists: ticketsListsReducer,
  auth: authReducer
//   user: userReducer,
});

export default rootReducer;
