
export const API_URL = 'https://imatzdev.it/apis';
export const AUTH = 'Basic c3RvOnRvdG8=';

export const EVENTS = {
  itemAdded: 'itemAdded', // Item added to the current supermarket list
  itemRemoved: 'itemRemoved', // Item removed from the current supermarket list
  commonItemsRequested: 'commonItemsRequested', // Show the common items picker
  commonItemsDismissed: 'commonItemsDismissed', // Hide the common items picker
  currentListItemDeleted: 'currentListItemDeleted', // An item has been removed from the current supermarket list
  currentListItemUpdated: 'currentListItemUpdated', // An item has been updated in the current supermarket list
  itemGrabbed: 'itemGrabbed', // An item has been grabbed at the supermarket
  listClosed: 'listClosed', // The current list has been closed
  listPaid: 'listPaid', // The list has been paid
  itemCategorized: 'itemCategorized', // The list has been paid
  grocerySelected: 'grocerySelected', // The list has been paid
}
