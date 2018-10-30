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
   * Retrieves the items of the current supermarket list
   */
  getItemsFromCurrentList() {

    return new TotoAPI().fetch('/supermarket/currentList/items').then((response) => response.json());
  }

  /**
   * Retrieves the commonly used items
   */
  getCommonItems() {

    return new TotoAPI().fetch('/supermarket/commonItems').then((response) => response.json());
  }

}
