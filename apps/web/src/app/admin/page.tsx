import React from 'react';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import AdminProductTable from '@/components/admin/AdminProductTable';
import { Package } from 'lucide-react';

// Force dynamic rendering since we are fetching from DB directly
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Connect to DB
  await connectDB();

  // Fetch all products
  const productsRaw = await Product.find({}).sort({ createdAt: -1 }).lean();
  
  // Serialize for passing to client component
  const products = productsRaw.map((p: any) => ({
    _id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    description: p.description,
    benefits: p.benefits || [],
    images: p.images || [],
    variants: p.variants || [],
    firmness: p.firmness,
    warranty_years: p.warranty_years,
    trialNights: p.trialNights,
    ratingAvg: p.ratingAvg,
    ratingCount: p.ratingCount,
    seo: p.seo || { title: '', description: '', keywords: '' },
    status: p.status,
    createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-600/20">
                <Package size={24} />
              </div>
              Product Inventory
            </h1>
            <p className="mt-2 text-gray-500">
              Manage and view all existing products in your store.
            </p>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95">
            + Add New Product
          </button>
        </div>

        {/* Product Table */}
        <AdminProductTable products={products} />
        
      </div>
    </div>
  );
}
