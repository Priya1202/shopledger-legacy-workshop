'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const invoice = require('../lib/invoice');
const pricing = require('../lib/pricing');

function verifyCurrentFigures(items, coupon, expectedInvoice, expectedCheckout) {
  const order = { items, coupon };
  const invoiceFigures = invoice.computeInvoiceFigures(order);
  const checkoutFigures = pricing.computeTotals(items, coupon);

  assert.deepEqual(
    {
      subtotal: invoiceFigures.subtotal,
      discount: invoiceFigures.discount,
      tax: invoiceFigures.tax,
      cgst: invoiceFigures.cgst,
      sgst: invoiceFigures.sgst,
      total: invoiceFigures.total,
      rows: invoiceFigures.rows.map(({ hsn, gstPercent, line, lineTax }) => ({
        hsn, gstPercent, line, lineTax
      }))
    },
    expectedInvoice
  );
  assert.deepEqual(
    {
      subtotal: checkoutFigures.subtotal,
      discount: checkoutFigures.discount,
      tax: checkoutFigures.tax,
      cgst: checkoutFigures.cgst,
      sgst: checkoutFigures.sgst,
      total: checkoutFigures.total
    },
    expectedCheckout
  );
}

test('CURRENT BEHAVIOUR: order #1001 with 5% and 12% items and no coupon', () => {
  verifyCurrentFigures([
    { name: 'Rice', sku: 'GRN-001', hsn: '1006', price: 640, qty: 1, gstRate: 5 },
    { name: 'Ghee', sku: 'DRY-001', hsn: '0405', price: 450, qty: 1, gstRate: 12 }
  ], '', {
    subtotal: 1090,
    discount: 0,
    tax: 86,
    cgst: 43,
    sgst: 43,
    total: 1176,
    rows: [
      { hsn: '1006', gstPercent: 5, line: 640, lineTax: 32 },
      { hsn: '0405', gstPercent: 12, line: 450, lineTax: 54 }
    ]
  }, {
    subtotal: 1090,
    discount: 0,
    tax: 86,
    cgst: 43,
    sgst: 43,
    total: 1176
  });
});

test('CURRENT BEHAVIOUR: order #1002 SAVE10 figures match checkout', () => {
  verifyCurrentFigures([
    { name: 'Rice', sku: 'GRN-001', hsn: '1006', price: 640, qty: 1, gstRate: 5 },
    { name: 'Sunflower oil', sku: 'OIL-001', hsn: '1512', price: 190, qty: 2, gstRate: 5 }
  ], 'SAVE10', {
    subtotal: 1020,
    discount: 102,
    tax: 45.9,
    cgst: 22.95,
    sgst: 22.95,
    total: 963.9,
    rows: [
      { hsn: '1006', gstPercent: 5, line: 640, lineTax: 28.8 },
      { hsn: '1512', gstPercent: 5, line: 380, lineTax: 17.1 }
    ]
  }, {
    subtotal: 1020,
    discount: 102,
    tax: 45.9,
    cgst: 22.95,
    sgst: 22.95,
    total: 963.9
  });
});

test('CURRENT BEHAVIOUR: order #1004 SAVE10 cap applies before tax', () => {
  verifyCurrentFigures([
    { name: 'Groundnut oil', sku: 'OIL-002', hsn: '1508', price: 1120, qty: 2, gstRate: 5 }
  ], 'SAVE10', {
    subtotal: 2240,
    discount: 150,
    tax: 104.5,
    cgst: 52.25,
    sgst: 52.25,
    total: 2194.5,
    rows: [
      { hsn: '1508', gstPercent: 5, line: 2240, lineTax: 104.5 }
    ]
  }, {
    subtotal: 2240,
    discount: 150,
    tax: 104.5,
    cgst: 52.25,
    sgst: 52.25,
    total: 2194.5
  });
});

test('CURRENT BEHAVIOUR: order #1008 all 18% items and no coupon', () => {
  verifyCurrentFigures([
    { name: 'Tea', sku: 'BEV-001', hsn: '0902', price: 140, qty: 1, gstRate: 18 },
    { name: 'Sherbet', sku: 'BEV-003', hsn: '2106', price: 180, qty: 2, gstRate: 18 }
  ], '', {
    subtotal: 500,
    discount: 0,
    tax: 90,
    cgst: 45,
    sgst: 45,
    total: 590,
    rows: [
      { hsn: '0902', gstPercent: 18, line: 140, lineTax: 25.2 },
      { hsn: '2106', gstPercent: 18, line: 360, lineTax: 64.8 }
    ]
  }, {
    subtotal: 500,
    discount: 0,
    tax: 90,
    cgst: 45,
    sgst: 45,
    total: 590
  });
});

test('invoice figures use the checkout HSN slab and capped pre-tax discount', () => {
  verifyCurrentFigures([
    { name: 'Groundnut oil', sku: 'OIL-002', hsn: '1508', price: 1120, qty: 2 }
  ], 'SAVE10', {
    subtotal: 2240,
    discount: 150,
    tax: 104.5,
    cgst: 52.25,
    sgst: 52.25,
    total: 2194.5,
    rows: [
      { hsn: '1508', gstPercent: 5, line: 2240, lineTax: 104.5 }
    ]
  }, {
    subtotal: 2240,
    discount: 150,
    tax: 104.5,
    cgst: 52.25,
    sgst: 52.25,
    total: 2194.5
  });
});
