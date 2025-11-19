// ticketsLists selectors
// selector are functions
export const selectTicketsLists = (state) => state.ticketsLists;
 
export const selectDcData = (state) => state.ticketsLists.dcData;
export const selectLoading = (state) => state.ticketsLists.loading;
export const selectError = (state) => state.ticketsLists.error;