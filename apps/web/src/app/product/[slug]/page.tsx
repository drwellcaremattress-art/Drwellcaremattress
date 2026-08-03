import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Product as ProductModel } from '@/lib/models/Product';
import { ImageGallery } from '@/components/ui/product/ImageGallery';
import { ProductInfo } from '@/components/ui/product/ProductInfo';
import { ProductMainDisplay } from '@/components/ui/product/ProductMainDisplay';
import { ProductDetails } from '@/components/ui/product/ProductDetails';
import { Heart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCT_CATALOG } from '@/lib/catalog';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  // Use params.slug directly in Next.js 14 App Router
  const { slug } = params;
  
  const productCatalog = [...PRODUCT_CATALOG];
  let dbProduct: any = null;
  let allDbProducts: any[] = [];

  try {
    await connectDB();
    dbProduct = await ProductModel.findOne({ slug }).lean();
    allDbProducts = await ProductModel.find({ status: 'active' }).lean();
  } catch (err) {
    console.error("Error fetching product from DB:", err);
  }

  // Update productCatalog with latest images from DB so "You May Also Like" is accurate
  const mergedCatalog = productCatalog.map(p => {
    const dbMatch = allDbProducts.find(db => db.slug === p.slug);
    if (dbMatch && dbMatch.images && dbMatch.images.length > 0) {
      const dbImage = typeof dbMatch.images[0] === 'string' ? dbMatch.images[0] : dbMatch.images[0].url;
      if (dbImage) {
        return { ...p, images: [dbImage, ...p.images.slice(1)] };
      }
    }
    return p;
  });

  let product: any = null;
  if (dbProduct) {
    const cleanName = (n: string) => (n || '').replace(/\s*-\s*\d+\s*(inch|")?|\s+\d+\s*(inch|")?$/i, '').replace(/\s+plus$/i, '').trim().toLowerCase();
    const targetBase = cleanName(dbProduct.name);
    const siblingProducts = allDbProducts.filter(p => cleanName(p.name) === targetBase);

    const getInchVal = (tCm?: number, tStr?: string) => {
      if (tStr) {
        const m = tStr.match(/(\d+)\s*inch/i);
        if (m) return parseInt(m[1]);
      }
      if (tCm) return Math.round(tCm / 2.54);
      return 6;
    };

    const thicknessMap = new Map<number, any>();

    // 1. Seed from matching catalog product if available
    const matchInCatalog = productCatalog.find(p => p.slug === dbProduct.slug || cleanName(p.name) === targetBase);
    if (matchInCatalog && matchInCatalog.thicknessVariants) {
      matchInCatalog.thicknessVariants.forEach((cv: any) => {
        const inch = getInchVal(cv.thickness_cm, cv.thickness);
        thicknessMap.set(inch, {
          ...cv,
          thickness: `${inch} Inch`,
          thickness_cm: inch * 2.54,
          slug: dbProduct.slug
        });
      });
    }

    // 2. Add/override with actual sibling DB products (these contain the user's uploaded images per thickness!)
    siblingProducts.forEach((sp: any) => {
      const firstV = sp.variants && sp.variants[0] ? sp.variants[0] : null;
      const inch = getInchVal(firstV?.thickness_cm, sp.thickness);
      const thickness_cm = inch * 2.54;
      const priceVal = sp.price || (firstV ? firstV.price : (sp.sqftPrice ? sp.sqftPrice * 18 : 12999));
      const origPrice = sp.originalPrice || (firstV ? firstV.mrp : Math.round(priceVal * 1.3));
      const spImages = sp.images && sp.images.length > 0 ? sp.images.map((i: any) => typeof i === 'string' ? i : i.url) : [];

      thicknessMap.set(inch, {
        thickness: `${inch} Inch`,
        thickness_cm,
        priceValue: priceVal,
        price: `₹${priceVal.toLocaleString('en-IN')}`,
        originalPrice: origPrice,
        sqftPrice: sp.sqftPrice || Math.round(priceVal / 18),
        image: spImages[0] || undefined,
        images: spImages.length > 0 ? spImages : undefined,
        layersImage: sp.layersImage || undefined,
        slug: dbProduct.slug, // Keep slug consistent to prevent navigation resets
        warranty: sp.warranty_years || sp.warranty || 10,
        warranty_years: sp.warranty_years || sp.warranty || 10
      });
    });

    const dbThicknessVariants = Array.from(thicknessMap.values()).sort((a: any, b: any) => a.thickness_cm - b.thickness_cm);
    
    // Primary display defaults to the LEAST THICKNESS variant (index 0)
    const leastVariant = dbThicknessVariants[0] || null;
    const defaultImages = leastVariant?.images || (dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images.map((i: any) => typeof i === 'string' ? i : i.url) : ["/images/products/ecolatex-6.jpeg"]);
    const defaultPrice = leastVariant?.priceValue || dbProduct.price || 12999;
    const defaultOriginalPrice = leastVariant?.originalPrice || dbProduct.originalPrice || Math.round(defaultPrice * 1.3);

    product = {
      id: dbProduct.slug,
      slug: dbProduct.slug,
      title: cleanName(dbProduct.name) ? dbProduct.name.replace(/\s*-\s*\d+\s*(inch|")?|\s+\d+\s*(inch|")?$/i, '').replace(/\s+plus$/i, '').trim() : dbProduct.name,
      subtitle: dbProduct.description ? dbProduct.description.split('.')[0] : 'Premium Mattress',
      price: defaultPrice,
      originalPrice: defaultOriginalPrice,
      rating: dbProduct.ratingAvg || 4.8,
      reviews: dbProduct.ratingCount || 120,
      firmness: dbProduct.firmness || 'Medium Firm',
      thickness: leastVariant?.thickness || dbProduct.thickness || '6 Inch',
      sqftPrice: leastVariant?.sqftPrice || dbProduct.sqftPrice || 546,
      warranty: dbProduct.warranty_years || dbProduct.warranty || 10,
      features: dbProduct.benefits || ['Advanced spine support', 'Pressure relief', 'Eco-friendly materials'],
      images: defaultImages,
      layersImage: dbProduct.layersImage || null,
      thicknessVariants: dbThicknessVariants.length > 0 ? dbThicknessVariants : undefined,
      // Pass full variants so ProductInfo can read custom subDimensions from the admin
      // Need to stringify/parse to strip out Mongoose ObjectIds and internal properties
      variants: dbProduct.variants ? JSON.parse(JSON.stringify(dbProduct.variants)) : [],
    };
  } else {
    const foundProduct = productCatalog.find(p => p.slug === slug || p.slug === `${slug}-6` || p.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase());
    product = foundProduct ? Object.assign({}, foundProduct, {
      id: foundProduct.id || slug,
      originalPrice: foundProduct.originalPrice || Math.round((foundProduct.priceValue || 12999) * 1.3),
      price: foundProduct.priceValue || 12999,
      warranty: foundProduct.warranty_years || foundProduct.warranty || 10,
      thicknessVariants: foundProduct.thicknessVariants
    }) : null;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      
      {/* Top Section: Breadcrumb + Gallery + Product Info */}
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] text-[#64748b] mb-6 font-medium">
          <a href="/" className="hover:text-[#7cb93e] transition-colors">Home</a>
          <span>/</span>
          <a href="/collections" className="hover:text-[#7cb93e] transition-colors">Mattresses</a>
          <span>/</span>
          <span className="text-[#0B1A2A] font-semibold">{product.title}</span>
        </div>

        {/* Main Product Display: 2 Columns */}
        <ProductMainDisplay product={product} />
      </div>


      
      {/* RELATED PRODUCTS SECTION */}
      <section className="container mx-auto px-4 lg:px-8 pt-20 pb-10 border-t border-gray-100">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-[#0B1A2A]">You May Also Like</h2>
          <Link href="/collections" className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
            View All Products &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mergedCatalog.filter(p => p.slug !== slug).slice(0, 4).map((relatedProduct, i) => {
            return (
              <div key={i} className="bg-white rounded-3xl p-5 flex flex-col shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-shadow duration-500 border border-gray-100">
                {/* Image */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-50 mb-4">
                  <Image src={relatedProduct.images[0]} alt={relatedProduct.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4 text-[#64748b]" />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-grow flex flex-col">
                  <h3 className="font-heading font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#0682E4] to-[#7cb93e] mb-1">{relatedProduct.title}</h3>
                  <p className="text-blue-500 text-xs font-medium mb-3">
                    {relatedProduct.subtitle}
                  </p>
                  
                  <div className="flex flex-col gap-3 mt-auto pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#7cb93e]" />
                      <span>{relatedProduct.warranty || 10}-Year Warranty</span>
                    </div>
                    <div className="text-sm font-medium text-[#0B1A2A] flex items-baseline gap-1.5">
                      <span>From</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-xs font-semibold text-gray-400 line-through">
                          ₹{relatedProduct.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-xl font-bold text-[#7cb93e]">
                        {relatedProduct.price || (relatedProduct.priceValue ? `₹${relatedProduct.priceValue.toLocaleString('en-IN')}` : '₹12,999')}
                      </span>
                    </div>
                    <Link href={`/product/${relatedProduct.slug}`}>
                      <button className="w-full bg-[#0682E4] hover:bg-[#7cb93e] text-white rounded-lg py-3 font-semibold transition-colors shadow-sm hover:shadow-md">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      
    </div>
  );
}
