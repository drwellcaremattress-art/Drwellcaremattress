'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, ShieldCheck, Truck, Phone, Mail, MapPin } from 'lucide-react';

interface Props {
  order: any | null;
  open: boolean;
  onClose: () => void;
}

// Convert amount to words in Indian Rupees
function numberToWords(num: number): string {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  const rounded = Math.round(num);
  return `${inWords(rounded)} Rupees Only`;
}

export default function OrderReceiptModal({ order, open, onClose }: Props) {
  if (!open || !order) return null;

  const addr = order.shippingAddress || {};
  const formattedAddress = [
    addr.street || addr.address || addr.addressLine1,
    addr.addressLine2,
    addr.city,
    addr.state,
    addr.pincode || addr.pin || addr.zip,
    addr.country || 'India'
  ].filter(Boolean).join(', ');

  const items = order.items || order.orderItems || [];
  const totalAmount = Number(order.totalPrice || order.total || 0);
  const advanceAmount = Math.max(0, Number(order.advanceAmount || 0));
  const balanceAmount = order.balanceAmount !== undefined ? Math.max(0, Number(order.balanceAmount)) : Math.max(0, totalAmount - advanceAmount);
  const gstAmount = Math.round((totalAmount * 18) / 118); // 18% GST component
  const basePrice = totalAmount - gstAmount;
  const wordsAmount = balanceAmount > 0 ? balanceAmount : totalAmount;

  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const invoiceNumber = `INV-${(order.orderNumber || '0000').replace('DRWELL-ORD-', '')}`;

  // Generate self-contained, standalone printable HTML
  const generatePrintableHtml = () => {
    const itemsRows = items.length > 0 ? items.map((it: any, idx: number) => {
      const itemPrice = Number(it.price || it.priceValue || (totalAmount / (it.qty || 1)));
      const itemTotal = itemPrice * (it.qty || 1);
      return `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #64748b; font-size: 11px;">${idx + 1}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">
            <div style="font-weight: 800; color: #0f172a; font-size: 13px;">${it.name || 'Dr.Well Care Mattress'}</div>
            <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-top: 2px;">SKU: ${it.variantSku || 'DW-MATTRESS'}</div>
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #334155; font-size: 12px;">
            ${it.dimensions || it.size || it.variantSku || 'Standard'}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #334155; font-size: 12px;">
            ${it.color || 'Standard'}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: 800; color: #0f172a; font-size: 12px;">
            ${it.qty || 1}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; color: #334155; font-size: 12px;">
            ₹${itemPrice.toLocaleString('en-IN')}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-weight: 800; color: #0f172a; font-size: 13px;">
            ₹${itemTotal.toLocaleString('en-IN')}
          </td>
        </tr>
      `;
    }).join('') : `
      <tr>
        <td colspan="7" style="padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
          No items listed.
        </td>
      </tr>
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Receipt_${order.orderNumber}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 20px;
              line-height: 1.5;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .brand-logo {
              display: inline-block;
              background: #0682E4;
              color: #ffffff;
              font-weight: 900;
              font-size: 13px;
              padding: 4px 8px;
              border-radius: 6px;
              margin-right: 6px;
              vertical-align: middle;
            }
            .brand-title {
              font-size: 24px;
              font-weight: 900;
              color: #0B1A2A;
              letter-spacing: -0.5px;
              display: inline-block;
              vertical-align: middle;
            }
            .brand-tagline {
              color: #7cb93e;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 2px;
            }
            .brand-address {
              font-size: 11px;
              color: #64748b;
              margin-top: 8px;
              line-height: 1.4;
            }
            .badge-invoice {
              background: #0f172a;
              color: #ffffff;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              padding: 4px 10px;
              border-radius: 6px;
              display: inline-block;
              margin-bottom: 8px;
            }
            .meta-table {
              font-size: 11px;
              color: #475569;
              text-align: right;
            }
            .meta-table td {
              padding: 2px 0;
            }
            .info-grid {
              display: table;
              width: 100%;
              margin-bottom: 20px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 20px;
            }
            .info-cell {
              display: table-cell;
              width: 50%;
              vertical-align: top;
            }
            .info-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 12px;
              font-size: 11px;
            }
            .section-title {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #64748b;
              margin-bottom: 8px;
            }
            .customer-name {
              font-size: 14px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 4px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 12px;
            }
            .items-table th {
              background: #f8fafc;
              border-bottom: 1px solid #cbd5e1;
              padding: 10px 12px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              color: #64748b;
              text-align: left;
            }
            .summary-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 12px;
            }
            .warranty-banner {
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 10px;
              padding: 10px 14px;
              font-size: 11px;
              color: #166534;
              margin-bottom: 12px;
            }
            .grand-total {
              font-size: 22px;
              font-weight: 900;
              font-family: monospace;
              color: #0B1A2A;
            }
            .footer-table {
              width: 100%;
              border-top: 1px solid #e2e8f0;
              padding-top: 16px;
              font-size: 10px;
              color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td style="vertical-align: top;">
                <div>
                  <span class="brand-logo">DW</span>
                  <span class="brand-title">DR.WELL CARE</span>
                </div>
                <div class="brand-tagline">Certified Orthopaedic Sleep Systems</div>
                <div class="brand-address">
                  <strong style="color: #0f172a; font-size: 13px; font-weight: 900; letter-spacing: 0.3px;">VKS ENTERPRISES</strong><br />
                  No: 551, Sivapragasam Nagar, Surapet, Chennai - 600066, Tamil Nadu<br />
                  <strong style="color: #0f172a;">GSTIN: 33MNVPK5897H1ZV</strong> • Support: +91 93429 22044 / +91 9843240703
                </div>
              </td>
              <td style="vertical-align: top; text-align: right;">
                <div class="badge-invoice">Tax Invoice / Receipt</div>
                <table class="meta-table" style="margin-left: auto;">
                  <tr>
                    <td style="color: #64748b; padding-right: 8px;">Invoice No:</td>
                    <td style="font-weight: 800; font-family: monospace; color: #0f172a;">${invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding-right: 8px;">Order ID:</td>
                    <td style="font-weight: 800; font-family: monospace; color: #0682E4;">${order.orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding-right: 8px;">Date:</td>
                    <td style="font-weight: 700; color: #0f172a;">${orderDate}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding-right: 8px;">Payment:</td>
                    <td style="font-weight: 800; text-transform: uppercase;">
                      ${order.paymentMethod || 'Razorpay'} 
                      <span style="font-size: 9px; padding: 1px 5px; border-radius: 4px; background: ${order.isPaid ? '#dcfce7; color: #166534;' : '#fef3c7; color: #92400e;'} font-weight: 800;">
                        ${order.isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <div class="info-grid">
            <div class="info-cell" style="padding-right: 15px;">
              <div class="section-title">Customer & Delivery Address</div>
              <div class="customer-name">${order.customerName}</div>
              <div style="font-size: 11px; color: #475569; margin-bottom: 2px;">Phone: <strong>${order.customerPhone}</strong></div>
              ${order.customerEmail && order.customerEmail !== 'N/A' ? `<div style="font-size: 11px; color: #475569; margin-bottom: 6px;">Email: <strong>${order.customerEmail}</strong></div>` : ''}
              <div style="font-size: 11px; color: #475569; line-height: 1.4; margin-top: 4px;">
                ${formattedAddress || 'No address provided'}
              </div>
            </div>

            <div class="info-cell" style="padding-left: 15px;">
              <div class="info-box">
                <div class="section-title" style="color: #0682E4; margin-bottom: 6px;">Dispatch & Live Tracking</div>
                <table style="width: 100%; font-size: 11px; color: #334155;">
                  <tr>
                    <td style="color: #64748b; padding: 2px 0;">Status:</td>
                    <td style="font-weight: 800; color: #0682E4; text-align: right;">${order.orderStatus || 'Processing'}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 2px 0;">Courier Partner:</td>
                    <td style="font-weight: 700; text-align: right;">${order.courier || 'Blue Dart Express'}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 2px 0;">Tracking Code / AWB:</td>
                    <td style="font-family: monospace; font-weight: 800; text-align: right;">${order.trackingId || 'Awaiting Dispatch'}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 30px;">#</th>
                <th>Mattress Description</th>
                <th>Dimension / Specs</th>
                <th style="text-align: center;">Color</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <table class="summary-table">
            <tr>
              <td style="width: 55%; vertical-align: top; padding-right: 20px;">
                <div class="warranty-banner">
                  <div style="font-weight: 800; font-size: 12px; margin-bottom: 2px;">
                    ✓ 10-Year Comprehensive Warranty Attached
                  </div>
                  <div style="font-size: 10.5px; opacity: 0.9;">
                    Keep this tax invoice safe as official proof for 10-year warranty claims and 100-night trial benefits.
                  </div>
                </div>
                <div style="font-size: 11px; color: #64748b;">
                  <strong>Amount in Words:</strong><br />
                  <span style="font-style: italic; color: #334155;">${numberToWords(wordsAmount)}</span>
                  ${advanceAmount > 0 && balanceAmount > 0 ? `<div style="font-size: 10px; color: #0682E4; font-weight: 700; margin-top: 2px;">(Balance Payable on Delivery)</div>` : ''}
                  ${advanceAmount >= totalAmount && totalAmount > 0 ? `<div style="font-size: 10px; color: #166534; font-weight: 700; margin-top: 2px;">(Paid in Full)</div>` : ''}
                </div>
              </td>

              <td style="width: 45%; vertical-align: top;">
                <table style="width: 100%; font-size: 11.5px; color: #475569;">
                  <tr>
                    <td style="padding: 3px 0;">Taxable Amount:</td>
                    <td style="text-align: right; font-family: monospace;">₹${basePrice.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0;">GST (18% Included):</td>
                    <td style="text-align: right; font-family: monospace;">₹${gstAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0;">Doorstep Delivery:</td>
                    <td style="text-align: right; font-weight: 800; color: #166534;">FREE (₹0)</td>
                  </tr>
                  ${order.discount > 0 ? `
                  <tr>
                    <td style="padding: 3px 0; color: #166534;">Discount:</td>
                    <td style="text-align: right; font-family: monospace; font-weight: 800; color: #166534;">-₹${Number(order.discount).toLocaleString('en-IN')}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 4px 0; border-top: 1px dashed #cbd5e1; font-weight: 700; color: #1e293b;">Total Order Value:</td>
                    <td style="text-align: right; font-family: monospace; font-weight: 800; border-top: 1px dashed #cbd5e1; color: #1e293b;">₹${totalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  ${advanceAmount > 0 ? `
                  <tr>
                    <td style="padding: 4px 0; color: #166534; font-weight: 700;">Less: Advance Paid:</td>
                    <td style="text-align: right; font-family: monospace; font-weight: 800; color: #166534;">-₹${advanceAmount.toLocaleString('en-IN')}</td>
                  </tr>` : ''}
                  <tr>
                    <td colspan="2" style="border-top: 2px solid #0f172a; padding-top: 6px; margin-top: 4px;">
                      <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <span style="font-size: 13px; font-weight: 900; text-transform: uppercase; color: #0f172a;">
                          ${advanceAmount > 0 ? 'Balance Due on Delivery:' : 'Grand Total Due:'}
                        </span>
                        <span class="grand-total" style="color: ${balanceAmount > 0 ? '#0B1A2A' : '#166534'};">
                          ₹${balanceAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      ${advanceAmount >= totalAmount && totalAmount > 0 ? `
                        <div style="text-align: right; font-size: 10px; font-weight: 800; color: #166534; margin-top: 2px;">
                          ✓ PAID IN FULL (Zero Balance)
                        </div>
                      ` : ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table class="footer-table">
            <tr>
              <td>
                <div style="font-weight: 700; color: #475569;">Thank you for choosing Dr.Well Care Mattress!</div>
                <div>Questions or support: drwellcaremattress@gmail.com • drwellmattress.com</div>
              </td>
              <td style="text-align: right;">
                <div style="font-family: monospace; font-size: 9px; color: #94a3b8;">AUTHENTICATED DIGITAL TAX INVOICE</div>
                <div style="font-weight: 800; color: #0f172a; font-size: 11px;">For VKS ENTERPRISES</div>
                <div style="font-size: 10px; color: #64748b;">(Authorized Signatory)</div>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  };

  // Bulletproof print using an isolated iframe
  const handlePrint = () => {
    const htmlContent = generatePrintableHtml();

    // Create an invisible iframe for isolated, clean printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.error('Print iframe error:', e);
          window.print();
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 2000);
        }
      }, 350);
    } else {
      window.print();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7cb93e] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Official Tax Receipt & Order Summary
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0682E4] hover:bg-[#0571c7] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Printer size={15} />
                Print / Save as PDF
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* On-Screen Receipt Preview */}
          <div className="p-6 sm:p-10 font-sans text-slate-800 bg-white max-h-[80vh] overflow-y-auto">
            {/* Header: Logo, Brand & Invoice Details */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0682E4] flex items-center justify-center text-white font-extrabold text-sm">
                    DW
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-[#0B1A2A]">
                    DR.WELL CARE
                  </h1>
                </div>
                <p className="text-[11px] font-bold text-[#7cb93e] uppercase tracking-wider mt-0.5">
                  Certified Orthopaedic Sleep Systems
                </p>
                <div className="text-xs text-slate-600 mt-2 leading-relaxed">
                  <span className="font-extrabold text-slate-900 block text-sm">VKS ENTERPRISES</span>
                  <span>No: 551, Sivapragasam Nagar, Surapet, Chennai - 600066, Tamil Nadu</span>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold text-[11px]">
                      GSTIN: 33MNVPK5897H1ZV
                    </span>
                    <span className="text-slate-500 font-medium">Support: +91 93429 22044 / +91 9843240703</span>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-extrabold uppercase tracking-wider mb-2">
                  Tax Invoice / Receipt
                </span>
                <div className="text-xs space-y-1 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-500">Invoice No: </span>
                    <span className="font-mono font-bold text-slate-900">{invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Order ID: </span>
                    <span className="font-mono font-bold text-[#0682E4]">{order.orderNumber}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Order Date: </span>
                    <span className="font-bold text-slate-900">{orderDate}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Payment: </span>
                    <span className="font-bold uppercase text-slate-900">{order.paymentMethod}</span>
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-extrabold ${order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {order.isPaid ? 'PAID' : 'COD PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billed To / Shipped To & Tracking info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#0682E4]" /> Customer & Delivery Address
                </h3>
                <div className="text-xs space-y-1 text-slate-700">
                  <p className="font-bold text-sm text-slate-900">{order.customerName}</p>
                  <p className="flex items-center gap-1.5">
                    <Phone size={11} className="text-slate-400" />
                    <span>{order.customerPhone}</span>
                  </p>
                  {order.customerEmail && order.customerEmail !== 'N/A' && (
                    <p className="flex items-center gap-1.5">
                      <Mail size={11} className="text-slate-400" />
                      <span>{order.customerEmail}</span>
                    </p>
                  )}
                  <p className="text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {formattedAddress || 'No address provided'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Truck size={14} className="text-[#7cb93e]" /> Dispatch & Live Tracking
                </h3>
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipment Status:</span>
                    <span className="font-extrabold text-[#0682E4]">{order.orderStatus || 'Processing'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Courier Partner:</span>
                    <span className="font-bold text-slate-800">{order.courier || 'Blue Dart Express'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Tracking Code / AWB:</span>
                    <span className="font-mono font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {order.trackingId || 'Awaiting Dispatch'}
                    </span>
                  </div>
                  {order.trackingUrl && (
                    <div className="pt-1 text-[11px] text-[#0682E4] truncate">
                      <span>Live URL: </span>
                      <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="underline font-mono">
                        {order.trackingUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Itemized Order Table */}
            <div className="py-6 border-b border-slate-200">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                Purchased Products & Specifications
              </h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Mattress Description</th>
                    <th className="py-2.5 px-3">Dimension / Specs</th>
                    <th className="py-2.5 px-3 text-center">Color</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.length > 0 ? (
                    items.map((it: any, idx: number) => {
                      const itemPrice = Number(it.price || it.priceValue || (totalAmount / (it.qty || 1)));
                      const itemTotal = itemPrice * (it.qty || 1);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-3">
                            <span className="font-extrabold text-slate-900 block text-xs">{it.name || 'Dr.Well Care Mattress'}</span>
                            <span className="text-[10px] text-slate-400 font-mono">SKU: {it.variantSku || 'DW-MATTRESS'}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">
                            {it.dimensions || it.size || it.variantSku || 'Standard'}
                          </td>
                          <td className="py-3 px-3 text-center text-slate-600 font-medium">
                            {it.color || 'Standard'}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-800">
                            {it.qty || 1}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-700">
                            ₹{itemPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-slate-400">
                        No item details listed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations & Price Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200">
              <div className="space-y-3">
                <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    10-Year Comprehensive Warranty Attached
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    This receipt serves as your official warranty proof. Keep safe for warranty claims & 100-night trial benefits.
                  </p>
                </div>

                <div className="text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">Amount in Words: </span>
                  <span className="italic">{numberToWords(wordsAmount)}</span>
                  {advanceAmount > 0 && balanceAmount > 0 && (
                    <span className="text-[10px] text-[#0682E4] font-extrabold block mt-0.5">
                      (Balance Payable on Delivery / COD)
                    </span>
                  )}
                  {advanceAmount >= totalAmount && totalAmount > 0 && (
                    <span className="text-[10px] text-emerald-700 font-extrabold block mt-0.5">
                      (Paid in Full)
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Taxable Base Amount:</span>
                  <span className="font-mono">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18% Included):</span>
                  <span className="font-mono">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doorstep Freight / Delivery:</span>
                  <span className="font-bold text-emerald-600 uppercase">FREE (₹0)</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promotional Discount:</span>
                    <span className="font-mono font-bold">-₹{Number(order.discount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-dashed border-slate-200 font-bold text-slate-800">
                  <span>Total Order Value:</span>
                  <span className="font-mono font-extrabold">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                {advanceAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Less: Advance Paid:</span>
                    <span className="font-mono font-extrabold">-₹{advanceAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-slate-900 uppercase block">
                      {advanceAmount > 0 ? 'Balance Due on Delivery:' : 'Grand Total Due:'}
                    </span>
                    {advanceAmount > 0 && balanceAmount > 0 && (
                      <span className="text-[10px] font-bold text-[#0682E4]">Cash / UPI on Doorstep</span>
                    )}
                  </div>
                  <span className="text-2xl font-black font-mono text-[#0B1A2A]">
                    ₹{balanceAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                {advanceAmount >= totalAmount && totalAmount > 0 && (
                  <div className="text-right text-[11px] font-extrabold text-emerald-700">
                    ✓ PAID IN FULL (Zero Balance)
                  </div>
                )}
              </div>
            </div>

            {/* Footer: Authorized stamp & Notice */}
            <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left text-[11px] text-slate-400">
              <div>
                <p className="font-semibold text-slate-600">Thank you for sleeping with Dr.Well Care!</p>
                <p>For questions or assistance: drwellcaremattress@gmail.com • drwellmattress.com</p>
              </div>

              <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
                <div className="font-mono text-[10px] text-slate-400">AUTHENTICATED DIGITAL TAX INVOICE</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5">For VKS ENTERPRISES</div>
                <div className="text-[10px] text-slate-500">(Authorized Signatory)</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
