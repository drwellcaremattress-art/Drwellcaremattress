content = open(r"g:\DR.WEll Mattress\apps\web\src\components\orders\OrderReceiptModal.tsx", encoding="utf-8").read()

# Remove all the debug 045386 fallback hacks (they were scaffolding)
# Replace entire resolver block with clean version
old_customer_name = """  // 2. Resolve Customer Name
  const customerName =
    order.customerName ||
    (order.shippingAddress?.firstName
      ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ''}`.trim()
      : '') ||
    order.shippingAddress?.name ||
    order.customer ||
    (displayOrderNumber.includes('045386') ? 'testing Murugan' : '') ||
    'Customer';

  // 3. Resolve Customer Phone
  const customerPhone =
    order.customerPhone ||
    order.shippingAddress?.phone ||
    order.phone ||
    (displayOrderNumber.includes('045386') ? '+91 9843240703' : '');

  // 4. Resolve Customer Email
  const customerEmail =
    order.customerEmail ||
    order.userEmail ||
    order.shippingAddress?.email ||
    order.email ||
    (displayOrderNumber.includes('045386') ? 'testing@gmail.com' : '');

  // 5. Resolve Customer Address
  const addr = order.shippingAddress || {};
  const street = addr.street || addr.address || addr.addressLine1 || (displayOrderNumber.includes('045386') ? 'Big Street' : '');
  const city = addr.city || (displayOrderNumber.includes('045386') ? 'Davikapuram' : '');
  const state = addr.state || (displayOrderNumber.includes('045386') ? 'Tamil Nadu' : '');
  const pin = addr.pincode || addr.pin || addr.zip || addr.postalCode || (displayOrderNumber.includes('045386') ? '606807' : '');
  const country = addr.country || 'India';

  const addressParts = [
    street,
    addr.addressLine2,
    city,
    state,
    pin ? `${pin}` : '',
    country
  ].filter(Boolean);

  const formattedAddress = addressParts.length > 1
    ? addressParts.join(', ')
    : (street || city || state ? [street, city, state, pin, country].filter(Boolean).join(', ') : 'Big Street, Davikapuram, Tamil Nadu, India');

  // 6. Resolve Items and Financials
  const items = (order.items && order.items.length > 0) ? order.items : (order.orderItems || []);
  const totalAmount = Number(order.totalPrice || order.total || 0);

  // If advance was saved, use it. If order is 045386 or COD with total 11340, match advance 2000 & balance 9340
  const rawAdvance = order.advanceAmount !== undefined
    ? Number(order.advanceAmount)
    : (displayOrderNumber.includes('045386') || (order.paymentMethod?.toLowerCase().includes('cod') && totalAmount >= 2000) ? 2000 : 0);
  const advanceAmount = Math.max(0, rawAdvance);
  const balanceAmount = order.balanceAmount !== undefined
    ? Math.max(0, Number(order.balanceAmount))
    : Math.max(0, totalAmount - advanceAmount);

  const gstAmount = Math.round((totalAmount * 18) / 118); // 18% GST component
  const basePrice = totalAmount - gstAmount;
  const wordsAmount = balanceAmount > 0 ? balanceAmount : totalAmount;

  // 7. Resolve Tracking & Dispatch
  const shipmentStatus = order.orderStatus || order.status || (displayOrderNumber.includes('045386') ? 'Shipped' : 'Processing');
  const courierPartner = order.courier || (displayOrderNumber.includes('045386') ? 'Shadowfax' : (shipmentStatus === 'Shipped' || shipmentStatus === 'Out for Delivery' ? 'Shadowfax' : 'Blue Dart Express'));
  const trackingCode = order.trackingId || (displayOrderNumber.includes('045386') ? '123456' : (shipmentStatus === 'Shipped' || shipmentStatus === 'Out for Delivery' ? '123456' : 'Awaiting Dispatch'));"""

new_customer_name = """  // 2. Resolve Customer Name
  const customerName =
    order.customerName ||
    (order.shippingAddress?.firstName
      ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ''}`.trim()
      : '') ||
    order.shippingAddress?.name ||
    order.customer ||
    'Valued Customer';

  // 3. Resolve Customer Phone
  const customerPhone =
    order.customerPhone ||
    order.shippingAddress?.phone ||
    order.phone ||
    '';

  // 4. Resolve Customer Email
  const customerEmail =
    order.customerEmail ||
    order.userEmail ||
    order.shippingAddress?.email ||
    order.email ||
    '';

  // 5. Resolve Customer Address
  const addr = order.shippingAddress || {};
  const street = addr.street || addr.address || addr.addressLine1 || '';
  const city = addr.city || '';
  const state = addr.state || '';
  const pin = addr.pincode || addr.pin || addr.zip || addr.postalCode || '';
  const country = addr.country || 'India';

  const addressParts = [
    street,
    addr.addressLine2,
    city,
    state,
    pin,
    country
  ].filter(Boolean);

  const formattedAddress = addressParts.length > 1
    ? addressParts.join(', ')
    : (city || state ? [city, state, country].filter(Boolean).join(', ') : '');

  // 6. Resolve Items and Financials
  const items = (order.items && order.items.length > 0) ? order.items : (order.orderItems || []);
  const totalAmount = Number(order.totalPrice || order.total || 0);

  const advanceAmount = Math.max(0, Number(order.advanceAmount || 0));
  const balanceAmount = order.balanceAmount !== undefined
    ? Math.max(0, Number(order.balanceAmount))
    : Math.max(0, totalAmount - advanceAmount);

  const gstAmount = Math.round((totalAmount * 18) / 118); // 18% GST component
  const basePrice = totalAmount - gstAmount;
  const wordsAmount = balanceAmount > 0 ? balanceAmount : totalAmount;

  // 7. Resolve Tracking & Dispatch
  const shipmentStatus = order.orderStatus || order.status || 'Processing';
  const courierPartner = order.courier || (shipmentStatus === 'Shipped' || shipmentStatus === 'Out for Delivery' || shipmentStatus === 'Delivered' ? 'Shadowfax' : 'Blue Dart Express');
  const trackingCode = order.trackingId || 'Awaiting Dispatch';"""

if old_customer_name in content:
    content = content.replace(old_customer_name, new_customer_name)
    print("Clean replacement done!")
else:
    print("WARNING: Could not find debug block to clean")

open(r"g:\DR.WEll Mattress\apps\web\src\components\orders\OrderReceiptModal.tsx", "w", encoding="utf-8").write(content)
print("File saved.")
