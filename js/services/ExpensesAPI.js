import TotoAPI from './TotoAPI';
import moment from 'moment';

/**
 * API to access the /expenses Toto API
 */
export default class ExpensesAPI {

  /**
   *
   * ATTENTION!!!! THE API IS NOT AVAILABLE ANYMORE!!!
   *
   * Retrieves the supermarket expenses.
   * Parameters:
   * - numberOfWeeks
   */
  getSupermarketExpensesPerWeek(numberOfWeeks) {

    if (numberOfWeeks == null) numberOfWeeks = 52;

    let start = moment().startOf('week').subtract(numberOfWeeks, 'weeks');

    return new TotoAPI().fetch('/expenses/stats/expensesPerWeek?category=SUPERMERCATO&dateGte=' + start.format('YYYYMMDD')).then((response) => response.json());
  }

  /**
   * Retrieves the supermarket expenses.
   * Parameters:
   * - numberOfWeeks
   */
  getSupermarketExpensesPerMonth(user, yearMonthGte) {

    return new TotoAPI().fetch('/expenses/stats/expensesPerMonth?user=' + user + '&category=SUPERMERCATO&yearMonthGte=' + yearMonthGte).then((response) => response.json());
  }

  /**
   * Retrieve the specified expense
   */
  getExpense(expenseId) {

    return new TotoAPI().fetch('/expenses/expenses/' + expenseId).then((response) => response.json());
  }

}
