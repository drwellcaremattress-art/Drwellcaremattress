export type Product = {
  _id: string;
  slug: string;
  name: string;
  brand: "Dr Well Care";
  category: "orthopaedic" | "memory-foam" | "hybrid" | "pocket-spring";
  description: string;
  benefits: string[];
  images: { url: string; alt: string; position: number }[];
  variants: {
    size: "Single" | "Double" | "Queen" | "King";
    dimensions: string;
    thickness_cm: number;
    price: number;
    mrp: number;
    sku: string;
    stock: number;
  }[];
  firmness: "Soft" | "Medium" | "Firm" | "Orthopaedic Firm";
  warranty_years: number;
  trialNights: number;
  ratingAvg: number;
  ratingCount: number;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  status: "active" | "draft";
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  _id: string;
  orderNumber: string;
  userId: string;
  items: { productId: string; variantSku: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentGateway: "razorpay" | "stripe";
  orderStatus: "placed" | "confirmed" | "packed" | "shipped" | "delivered" | "returned" | "cancelled";
  createdAt: string;
  updatedAt: string;
};
