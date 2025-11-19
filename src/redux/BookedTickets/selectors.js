// ticketsLists selectors
// selector are functions
export const selectTicketsLists = (state) => state.ticketsLists;
 
export const BookedTickets = (state) => state.ticketsLists.bookedData;
export const selectLoading = (state) => state.ticketsLists.loading;
export const selectError = (state) => state.ticketsLists.error;