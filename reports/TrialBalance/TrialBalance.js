import frappe from 'frappejs';
import { getTrialBalance } from '../FinancialStatements/FinancialStatements';

export default class TrialBalance {
  async run({ fromDate, toDate }) {
    if (!fromDate && !toDate) {
      return { rows: [] };
    }
    const promises = ['Asset', 'Expense', 'Income', 'Liability', 'Equity'].map(
      rootType => {
        return getTrialBalance({ rootType, fromDate, toDate });
      }
    );

    const values = await Promise.all(promises);
    let rows = values.reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

    rows = rows.filter(r => r.debit !== 0 || r.credit !== 0);
    return { rows };
  }
};
