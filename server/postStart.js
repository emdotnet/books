import frappe from 'frappejs';
import naming from 'frappejs/model/naming';
import registerServerMethods from './registerServerMethods';

import SalesInvoiceServer from '../models/doctype/SalesInvoice/SalesInvoiceServer.js'
import PaymentServer from '../models/doctype/Payment/PaymentServer.js'
import PartyServer from '../models/doctype/Party/PartyServer.js'
import PurchaseInvoiceServer from '../models/doctype/PurchaseInvoice/PurchaseInvoiceServer.js'
import JournalEntryServer from '../models/doctype/JournalEntry/JournalEntryServer.js'
import GSTR3BServer from '../models/doctype/GSTR3B/GSTR3BServer.js'

export default async function postStart() {
  // set server-side modules
  frappe.models.SalesInvoice.documentClass = SalesInvoiceServer;
  frappe.models.Payment.documentClass = PaymentServer;
  frappe.models.Party.documentClass = PartyServer;
  frappe.models.PurchaseInvoice.documentClass = PurchaseInvoiceServer;
  frappe.models.JournalEntry.documentClass = JournalEntryServer;
  frappe.models.GSTR3B.documentClass = GSTR3BServer;

  frappe.metaCache = {};

  // init naming series if missing
  await naming.createNumberSeries('SINV-', 'SalesInvoiceSettings');
  await naming.createNumberSeries('PINV-', 'PurchaseInvoiceSettings');
  await naming.createNumberSeries('PAY-', 'PaymentSettings');
  await naming.createNumberSeries('JV-', 'JournalEntrySettings');
  await naming.createNumberSeries('QTN-', 'QuotationSettings');
  await naming.createNumberSeries('SO-', 'SalesOrderSettings');
  await naming.createNumberSeries('OF-', 'FulfillmentSettings');
  await naming.createNumberSeries('PO-', 'PurchaseOrderSettings');
  await naming.createNumberSeries('PREC-', 'PurchaseReceiptSettings');

  // fetch singles
  // so that they are available synchronously
  await frappe.getSingle('SystemSettings');
  await frappe.getSingle('AccountingSettings');
  await frappe.getSingle('GetStarted');

  // cache currency symbols for frappe.format
  frappe.currencySymbols = await getCurrencySymbols();

  registerServerMethods();
};

function getCurrencySymbols() {
  return frappe.db
    .getAll({
      doctype: 'Currency',
      fields: ['name', 'symbol']
    })
    .then(data => {
      return data.reduce((obj, currency) => {
        obj[currency.name] = currency.symbol;
        return obj;
      }, {});
    });
}
