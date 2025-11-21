// ticketsLists selectors
// selector are functions
export const selectTicketsLists = (state) => state.ticketsLists;
 
export const BookedTickets = (state) => state.ticketsLists.bookedData;
export const BookedSeatsLoading = (state) => state.ticketsLists.loading;
export const BookedSeatsError = (state) => state.ticketsLists.error;