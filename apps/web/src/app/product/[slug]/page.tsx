import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Product as ProductModel } from '@/lib/models/Product';
import { ImageGallery } from '@/components/ui/product/ImageGallery';
import { ProductInfo } from '@/components/ui/product/ProductInfo';
import { ProductDetails } from '@/components/ui/product/ProductDetails';
import { PriceList } from '@/components/ui/product/PriceList';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  // Use params.slug directly in Next.js 14 App Router
  const { slug } = params;
  
  const productCatalog = [
    { 
      slug: 'ecolatex-6', title: 'Ecolatex', subtitle: '100% Organic Latex Core', price: 12999, originalPrice: 16999, rating: 4.8, reviews: 1240, firmness: 'Medium Firm',
      features: ['Advanced spine support', 'Pressure relief', 'Eco-friendly materials'],
      images: ["/images/products/ecolatex 6'.png", "/images/products/ecolatex 6'.png", "/images/products/ecolatex 6'.png"] 
    },
    { 
      slug: 'luxoria-latex', title: 'Luxoria Latex', subtitle: 'Luxury HR & Natural Latex Hybrid', price: 17999, originalPrice: 23999, rating: 4.9, reviews: 920, firmness: 'Medium Soft',
      features: ['100% Natural Latex', 'Pocket Spring Core', 'Zero Partner Disturbance'],
      images: ["/images/products/luxoria.png", "/images/products/luxoria.png", "/images/products/luxoria.png"] 
    },
    { 
      slug: 'natural-latex', title: 'Natural Latex', subtitle: '100% Pure Organic Latex Core', price: 16999, originalPrice: 21999, rating: 4.9, reviews: 1100, firmness: 'Medium Firm',
      features: ['Pure Organic Latex', 'Hypoallergenic & Antimicrobial', 'Pin-core Ventilation'],
      images: ["/images/products/ecolatex 8'.png", "/images/products/ecolatex 8'.png", "/images/products/ecolatex 8'.png"] 
    },
    { 
      slug: 'lax-o-bond-6', title: 'Lax-o-Bond 6"', subtitle: 'High-Density Bonded Foam - 6 Inch', price: 11999, originalPrice: 15999, rating: 4.7, reviews: 980, firmness: 'Firm',
      features: ['Strong & Durable Support', 'Excellent Weight Distribution', 'Orthopaedic Back Support', 'Ideal for Heavy Weight Sleepers'],
      images: ["/images/products/lax-o-bond.png", "/images/products/lax-o-bond.png", "/images/products/lax-o-bond.png"] 
    },
    { 
      slug: 'lax-o-bond-8', title: 'Lax-o-Bond 8"', subtitle: 'High-Density Bonded Foam - 8 Inch', price: 14999, originalPrice: 19999, rating: 4.8, reviews: 850, firmness: 'Firm',
      features: ['Strong & Durable Support', 'Excellent Weight Distribution', 'Orthopaedic Back Support', 'Long-Lasting Comfort'],
      images: ["/images/products/lax-o-bond.png", "/images/products/lax-o-bond.png", "/images/products/lax-o-bond.png"] 
    },
    { 
      slug: 'memory-dump-6', title: 'Memory Dump', subtitle: 'Cooling Gel Memory Foam', price: 13999, originalPrice: 17999, rating: 4.7, reviews: 620, firmness: 'Soft',
      features: ['Cloud-like comfort', 'Pressure relief', 'Cooling Gel Memory Foam'],
      images: ["/images/products/Memory Dump 6'.png", "/images/products/Memory Dump 6'.png", "/images/products/Memory Dump 6'.png"] 
    },
    { 
      slug: 'memory-bond', title: 'Memory Bond', subtitle: 'Bonded Core & Plush Memory Top', price: 15999, originalPrice: 20999, rating: 4.8, reviews: 1540, firmness: 'Medium',
      features: ['Adapts to body shape', 'Relieves pressure points', 'Heavy Weight Support above 80 kg'],
      images: ["/images/products/memory bond.png", "/images/products/memory bond.png", "/images/products/memory bond.png"] 
    },
    { 
      slug: 'memory-bond-plus', title: 'Memory Bond Plus', subtitle: 'Enhanced Memory Contour & Bonded Core', price: 17999, originalPrice: 22999, rating: 4.9, reviews: 1240, firmness: 'Medium',
      features: ['Deep Plush Memory Top', 'Heavy Weight Ortho Support', 'Zero Partner Disturbance'],
      images: ["/images/products/Memory Dump 8'.png", "/images/products/Memory Dump 8'.png", "/images/products/Memory Dump 8'.png"] 
    },
    { 
      slug: 'softy-bond', title: 'Softy Bond', subtitle: 'Orthopaedic Bonded Mattress', price: 12499, originalPrice: 16499, rating: 4.7, reviews: 920, firmness: 'Medium Soft',
      features: ['Orthopaedic alignment', 'Plush comfort layer', 'Zero Partner Disturbance'],
      images: ["/images/products/softy bond 6'.png", "/images/products/softy bond 6'.png", "/images/products/softy bond 6'.png"] 
    },
    { 
      slug: 'softy-bond-plus', title: 'Softy Bond Plus', subtitle: 'Premium Bonded Ortho Support', price: 15499, originalPrice: 20499, rating: 4.9, reviews: 1120, firmness: 'Medium',
      features: ['Enhanced orthopaedic support', 'Deep plush feel', 'Cooling technology', 'Heavy Weight Support'],
      images: ["/images/products/softybond plus 8'.png", "/images/products/softybond plus 8'.png", "/images/products/softybond plus 8'.png"] 
    },
    { 
      slug: 'luxoria', title: 'Luxoria', subtitle: 'Luxury HR Pocket Spring', price: 18999, originalPrice: 24999, rating: 4.9, reviews: 850, firmness: 'Medium Soft',
      features: ['Cloud-like comfort', 'Independent Pocket Springs', 'Premium quilting', 'Zero Partner Disturbance'],
      images: ["/images/products/luxoria.png", "/images/products/luxoria.png", "/images/products/luxoria.png"] 
    },
    { 
      slug: 'mona-lite', title: 'Mona Lite', subtitle: 'Comfort Budget Mattress', price: 7999, originalPrice: 10999, rating: 4.6, reviews: 1450, firmness: 'Medium Firm',
      features: ['Unbeatable Value', 'Durable Foam Core', 'Breathable Fabric'],
      images: ["/images/products/mono softy.png", "/images/products/mono softy.png", "/images/products/mono softy.png"] 
    },
    { 
      slug: 'mona-softy', title: 'Mona Softy', subtitle: 'Plush Comfort Budget Mattress', price: 8999, originalPrice: 12999, rating: 4.7, reviews: 1620, firmness: 'Medium Soft',
      features: ['Plush Cloud Feel', 'Pressure Relief', 'Budget Friendly'],
      images: ["/images/products/mono softy.png", "/images/products/mono softy.png", "/images/products/mono softy.png"] 
    }
  ];

  let dbProduct: any = null;
  try {
    await connectDB();
    dbProduct = await ProductModel.findOne({ slug }).lean();
  } catch (err) {
    console.error("Error fetching product from DB:", err);
  }

  let product: any = null;
  if (dbProduct) {
    const firstVariant = dbProduct.variants && dbProduct.variants[0] ? dbProduct.variants[0] : null;
    const priceVal = firstVariant ? firstVariant.price : 12999;
    const mrpVal = firstVariant ? firstVariant.mrp : 16999;
    
    product = {
      id: dbProduct.slug,
      slug: dbProduct.slug,
      title: dbProduct.name,
      subtitle: dbProduct.description ? dbProduct.description.split('.')[0] : 'Premium Mattress',
      price: priceVal,
      originalPrice: mrpVal,
      rating: dbProduct.ratingAvg || 4.8,
      reviews: dbProduct.ratingCount || 120,
      firmness: dbProduct.firmness || 'Medium Firm',
      features: dbProduct.benefits || ['Advanced spine support', 'Pressure relief', 'Eco-friendly materials'],
      images: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images.map((i: any) => i.url) : ["/images/products/ecolatex 6'.png", "/images/products/ecolatex 6'.png", "/images/products/ecolatex 6'.png"]
    };
  } else {
    const foundProduct = productCatalog.find(p => p.slug === slug);
    product = foundProduct ? { id: slug, ...foundProduct } : null;
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
          <span className="text-[#0B1A2A]">{product.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-[55%]">
            <ImageGallery images={product.images} />
          </div>

          {/* Right Column: Product Info & Configuration */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <PriceList />
      </div>

      <hr className="my-16 border-gray-100" />

      {/* Bottom Section: Product Details & Specs */}
      <div className="container mx-auto px-4 lg:px-8">
        <ProductDetails />
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
          {productCatalog.filter(p => p.slug !== slug).slice(0, 4).map((relatedProduct, i) => {
            return (
              <div key={i} className="bg-white rounded-3xl p-5 flex flex-col shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-shadow duration-500 border border-gray-100">
                {/* Image */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-50 mb-4">
                  <Image src={relatedProduct.images[0]} alt={relatedProduct.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4 text-[#64748b]" />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-grow flex flex-col">
                  <h3 className="font-heading font-bold text-lg text-[#0B1A2A] mb-1">{relatedProduct.title}</h3>
                  <p className="text-blue-500 text-xs font-medium mb-3">
                    {relatedProduct.subtitle}
                  </p>
                  
                  <div className="flex flex-col gap-3 mt-auto pt-4">
                    <div className="text-sm font-medium text-[#0B1A2A]">
                      From <span className="text-xl font-bold text-[#7cb93e]">₹{relatedProduct.price.toLocaleString('en-IN')}</span>
                    </div>
                    <Link href={`/product/${relatedProduct.slug}`}>
                      <button className="w-full bg-[#0B1A2A] hover:bg-gray-800 text-white rounded-lg py-3 font-semibold transition-colors">
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
