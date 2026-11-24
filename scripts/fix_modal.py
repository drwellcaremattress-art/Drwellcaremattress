content = open(r"g:\DR.WEll Mattress\apps\web\src\components\orders\OrderReceiptModal.tsx", encoding="utf-8").read()

# 1. Fix printable HTML: order.orderNumber -> displayOrderNumber
content = content.replace(
    '${order.orderNumber}</td>',
    '${displayOrderNumber}</td>'
)
content = content.replace(
    "Razorpay'} \n                       <span",
    "COD'} \n                       <span"
)
content = content.replace(
    "${order.isPaid ? 'PAID' : 'PENDING'}",
    "${order.isPaid ? 'PAID' : 'COD PENDING'}"
)

# 2. Fix printable HTML: customer name/phone/email/address
content = content.replace(
    '${order.customerName}</div>',
    '${customerName}</div>'
)
content = content.replace(
    '>${order.customerPhone}<',
    '>${customerPhone}<'
)
content = content.replace(
    'order.customerEmail && order.customerEmail !',
    'customerEmail && customerEmail !'
)
content = content.replace(
    "Email: <strong>${order.customerEmail}</strong>",
    "Email: <strong>${customerEmail}</strong>"
)
content = content.replace(
    "${formattedAddress || 'No address provided'}\n              </div>\n            </div>\n\n            <div class=\"info-cell\" style=\"padding-left: 15px;\">",
    "${formattedAddress || 'No address provided'}\n              </div>\n            </div>\n\n            <div class=\"info-cell\" style=\"padding-left: 15px;\">"
)

# 3. Fix printable HTML tracking
content = content.replace(
    "${order.orderStatus || 'Processing'}\n                   </td>",
    "${shipmentStatus}\n                   </td>"
)
content = content.replace(
    "${order.courier || 'Blue Dart Express'}\n                   </td>",
    "${courierPartner}\n                   </td>"
)
content = content.replace(
    "${order.trackingId || 'Awaiting Dispatch'}\n                  </td>",
    "${trackingCode}\n                  </td>"
)

# 4. Fix on-screen JSX: order.orderNumber -> displayOrderNumber
content = content.replace(
    "order.orderNumber}</span>",
    "displayOrderNumber}</span>"
)

# 5. Fix on-screen JSX: customer fields
content = content.replace(
    "{order.customerName}",
    "{customerName}"
)
content = content.replace(
    "<span>{order.customerPhone}</span>",
    "<span>{customerPhone || 'N/A'}</span>"
)
content = content.replace(
    "order.customerEmail && order.customerEmail !== 'N/A'",
    "customerEmail && customerEmail !== 'N/A'"
)
content = content.replace(
    "<span>{order.customerEmail}</span>",
    "<span>{customerEmail}</span>"
)

# 6. Fix on-screen JSX tracking
content = content.replace(
    "{order.orderStatus || 'Processing'}",
    "{shipmentStatus}"
)
content = content.replace(
    "{order.courier || 'Blue Dart Express'}",
    "{courierPartner}"
)
content = content.replace(
    "{order.trackingId || 'Awaiting Dispatch'}",
    "{trackingCode}"
)

open(r"g:\DR.WEll Mattress\apps\web\src\components\orders\OrderReceiptModal.tsx", "w", encoding="utf-8").write(content)
print("Done! Changes applied.")

# Verify
content2 = open(r"g:\DR.WEll Mattress\apps\web\src\components\orders\OrderReceiptModal.tsx", encoding="utf-8").read()
checks_after = [
    ("orderNumber jsx span is now displayOrderNumber", "displayOrderNumber}</span>"),
    ("customerName jsx", "{customerName}"),
    ("shipmentStatus jsx", "{shipmentStatus}"),
    ("courierPartner jsx", "{courierPartner}"),
    ("trackingCode jsx", "{trackingCode}"),
    ("customerName html", "${customerName}</div>"),
    ("shipmentStatus html", "${shipmentStatus}"),
]
for name, needle in checks_after:
    print(name + ":", needle in content2)
