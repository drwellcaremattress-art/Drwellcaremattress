content = open(r"g:\DR.WEll Mattress\apps\web\src\components\orders\OrderReceiptModal.tsx", encoding="utf-8").read()
checks = [
    ("orderNumber html var", "${order.orderNumber}</td>"),
    ("customerName html", "${order.customerName}</div>"),
    ("orderStatus processing html", "${order.orderStatus || 'Processing'}"),
    ("courier html", "${order.courier || 'Blue Dart Express'}"),
    ("trackingId html", "${order.trackingId || 'Awaiting Dispatch'}"),
    ("customerName jsx", "{order.customerName}"),
    ("customerPhone jsx", "{order.customerPhone}"),
    ("orderNumber jsx span", "order.orderNumber}</span>"),
    ("orderStatus jsx", "{order.orderStatus || 'Processing'}"),
    ("courier jsx", "{order.courier || 'Blue Dart Express'}"),
    ("trackingId jsx", "{order.trackingId || 'Awaiting Dispatch'}"),
]
for name, needle in checks:
    print(name + ":", needle in content)
