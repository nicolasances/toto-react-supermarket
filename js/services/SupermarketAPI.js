import TotoAPI from './TotoAPI';
import moment from 'moment';

/**
 * API to access the /supermarket Toto API
 */
export default class SupermarketAPI {

  /**
   * Saves the provided item  in the current list.
   * Requires a {
   *  name: 'name of the item'
   * }
   */
  postItemInCurrentList(item) {

    let data = {
      name: item.name
    };

    // Post the data
    return new TotoAPI().fetch('/supermarket/currentList/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response => response.json()));
  }

  /**
   * Deletes the specified item from the current supermarket list
   */
  deleteItemFromCurrentList(id) {

    return new TotoAPI().fetch('/supermarket/currentList/items/' + id, {
      method: 'DELETE'
    });
  }

  /**
   * Updates an item of the current list
   */
  updateItemOfCurrentList(id, data) {

    return new TotoAPI().fetch('/supermarket/currentList/items/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  /**
   * Sets an item of the supermarket list as "grabbed!"
   */
  grabItem(id) {

    return new TotoAPI().fetch('/supermarket/currentList/items/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({grabbed: true})
    });
  }

  /**
   * Closes the list after execution
   */
  closeList(cost) {

    return new TotoAPI().fetch('/supermarket/currentList', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({cost: cost})
    });
  }

  /**
   * Retrieves the items of the current supermarket list
   */
  getItemsFromCurrentList(grabbed) {

    let filter = (grabbed != null) ? ('?grabbed=' + grabbed) : '';

    return new TotoAPI().fetch('/supermarket/currentList/items' + filter).then((response) => response.json());
  }

  /**
   * Retrieves the commonly used items
   */
  getCommonItems() {

    return new TotoAPI().fetch('/supermarket/commonItems').then((response) => response.json());
  }

  /**
   * Retrieves the last executed list
   */
  getLastList() {

    return new TotoAPI().fetch('/supermarket/pastLists?maxResults=1').then((response) => response.json());
  }

}
