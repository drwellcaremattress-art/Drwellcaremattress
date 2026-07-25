import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const productCatalog = [
      { 
        slug: 'ecolatex-6', name: 'Ecolatex', category: 'latex', status: 'active', firmness: 'Medium Firm', description: '100% Organic Latex Core. Advanced spine support, pressure relief, and eco-friendly natural materials.',
        benefits: ['Advanced spine support', 'Pressure relief', 'Eco-friendly materials'],
        images: [{ url: "/images/products/ecolatex 6'.png", alt: 'Ecolatex 6 Inch' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 15, price: 12999, mrp: 16999, stock: 15, sku: 'ECO-6-Q' }]
      },
      { 
        slug: 'luxoria-latex', name: 'Luxoria Latex', category: 'latex', status: 'active', firmness: 'Medium Soft', description: 'Luxury HR & Natural Latex Hybrid. Experience luxury with 100% natural latex and pocket springs for ultimate comfort.',
        benefits: ['100% Natural Latex', 'Pocket Spring Core', 'Zero Partner Disturbance'],
        images: [{ url: "/images/products/luxoria.png", alt: 'Luxoria Latex' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 20, price: 17999, mrp: 23999, stock: 10, sku: 'LUXL-8-Q' }]
      },
      { 
        slug: 'natural-latex', name: 'Natural Latex', category: 'latex', status: 'active', firmness: 'Medium Firm', description: '100% Pure Organic Latex Core providing zero chemical emissions and responsive spinal support.',
        benefits: ['Pure Organic Latex', 'Hypoallergenic & Antimicrobial', 'Pin-core Ventilation'],
        images: [{ url: "/images/products/ecolatex 8'.png", alt: 'Natural Latex' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 20, price: 16999, mrp: 21999, stock: 12, sku: 'NATL-8-Q' }]
      },
      { 
        slug: 'lax-o-bond-6', name: 'Lax-o-Bond 6"', category: 'bonded', status: 'active', firmness: 'Firm', description: 'High-Density Bonded Foam - 6 Inch. Specially designed for individuals weighing above 80 kg with strong & durable support.',
        benefits: ['Strong & Durable Support', 'Excellent Weight Distribution', 'Orthopaedic Back Support', 'Ideal for Heavy Weight Sleepers'],
        images: [{ url: "/images/products/lax-o-bond.png", alt: 'Lax-o-Bond 6 Inch' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 15, price: 11999, mrp: 15999, stock: 20, sku: 'LAXB-6-Q' }]
      },
      { 
        slug: 'lax-o-bond-8', name: 'Lax-o-Bond 8"', category: 'bonded', status: 'active', firmness: 'Firm', description: 'High-Density Bonded Foam - 8 Inch. Extra deep orthopaedic back support and excellent weight distribution for heavy weight sleepers.',
        benefits: ['Strong & Durable Support', 'Excellent Weight Distribution', 'Orthopaedic Back Support', 'Long-Lasting Comfort'],
        images: [{ url: "/images/products/lax-o-bond.png", alt: 'Lax-o-Bond 8 Inch' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 20, price: 14999, mrp: 19999, stock: 15, sku: 'LAXB-8-Q' }]
      },
      { 
        slug: 'memory-dump-6', name: 'Memory Dump', category: 'memory-foam', status: 'active', firmness: 'Soft', description: 'Cooling Gel Memory Foam. Cloud-like comfort that contours to your body shape and relieves pressure points.',
        benefits: ['Cloud-like comfort', 'Pressure relief', 'Cooling Gel Memory Foam'],
        images: [{ url: "/images/products/Memory Dump 6'.png", alt: 'Memory Dump 6 Inch' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 15, price: 13999, mrp: 17999, stock: 14, sku: 'MEMD-6-Q' }]
      },
      { 
        slug: 'memory-bond', name: 'Memory Bond', category: 'bonded', status: 'active', firmness: 'Medium', description: 'Bonded Core & Plush Memory Top. Specially designed for heavy weight sleepers above 80 kg with cloud-like memory contour.',
        benefits: ['Adapts to body shape', 'Relieves pressure points', 'Heavy Weight Support above 80 kg'],
        images: [{ url: "/images/products/memory bond.png", alt: 'Memory Bond' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 15, price: 15999, mrp: 20999, stock: 10, sku: 'MEMB-Q' }]
      },
      { 
        slug: 'memory-bond-plus', name: 'Memory Bond Plus', category: 'bonded', status: 'active', firmness: 'Medium', description: 'Enhanced Memory Contour & Bonded Core. Long-lasting comfort combined with high-density bonded support for deep sleep.',
        benefits: ['Deep Plush Memory Top', 'Heavy Weight Ortho Support', 'Zero Partner Disturbance'],
        images: [{ url: "/images/products/Memory Dump 8'.png", alt: 'Memory Bond Plus' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 20, price: 17999, mrp: 22999, stock: 9, sku: 'MEMBP-8-Q' }]
      },
      { 
        slug: 'softy-bond', name: 'Softy Bond', category: 'bonded', status: 'active', firmness: 'Medium Soft', description: 'Orthopaedic Bonded Mattress. Engineered with High-Density Bonded Foam for strong spine alignment and soft top feel.',
        benefits: ['Orthopaedic alignment', 'Plush comfort layer', 'Zero Partner Disturbance'],
        images: [{ url: "/images/products/softy bond 6'.png", alt: 'Softy Bond' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 15, price: 12499, mrp: 16499, stock: 11, sku: 'SOFTB-6-Q' }]
      },
      { 
        slug: 'softy-bond-plus', name: 'Softy Bond Plus', category: 'bonded', status: 'active', firmness: 'Medium', description: 'Premium Bonded Ortho Support. Superior weight distribution and orthopaedic support for long-lasting durability.',
        benefits: ['Enhanced orthopaedic support', 'Deep plush feel', 'Cooling technology', 'Heavy Weight Support'],
        images: [{ url: "/images/products/softybond plus 8'.png", alt: 'Softy Bond Plus' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 20, price: 15499, mrp: 20499, stock: 7, sku: 'SOFTBP-8-Q' }]
      },
      { 
        slug: 'luxoria', name: 'Luxoria', category: 'pocket-spring', status: 'active', firmness: 'Medium Soft', description: 'Luxury HR Pocket Spring. Crafted with premium pocket springs and HR foam to deliver exceptional hotel comfort.',
        benefits: ['Cloud-like comfort', 'Independent Pocket Springs', 'Premium quilting', 'Zero Partner Disturbance'],
        images: [{ url: "/images/products/luxoria.png", alt: 'Luxoria' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 20, price: 18999, mrp: 24999, stock: 8, sku: 'LUX-Q' }]
      },
      { 
        slug: 'mona-lite', name: 'Mona Lite', category: 'budget', status: 'active', firmness: 'Medium Firm', description: 'Comfort Budget Mattress. Quality sleep at an unbeatable price point with durable orthopaedic foam support.',
        benefits: ['Unbeatable Value', 'Durable Foam Core', 'Breathable Fabric'],
        images: [{ url: "/images/products/mono softy.png", alt: 'Mona Lite' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 12, price: 7999, mrp: 10999, stock: 25, sku: 'MONL-5-Q' }]
      },
      { 
        slug: 'mona-softy', name: 'Mona Softy', category: 'budget', status: 'active', firmness: 'Medium Soft', description: 'Plush Comfort Budget Mattress. Soft, breathable comfort layer designed for daily rest and relaxation at a budget price.',
        benefits: ['Plush Cloud Feel', 'Pressure Relief', 'Budget Friendly'],
        images: [{ url: "/images/products/mono softy.png", alt: 'Mona Softy' }],
        variants: [{ size: 'Queen', dimensions: '78x60', thickness_cm: 15, price: 8999, mrp: 12999, stock: 20, sku: 'MONS-6-Q' }]
      }
    ];

    // Clear any partially inserted or old products and cleanly seed the catalog items
    await Product.deleteMany({});
    await Product.insertMany(productCatalog);
    return NextResponse.json({ message: 'Database cleared and successfully seeded with all 13 products!' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
