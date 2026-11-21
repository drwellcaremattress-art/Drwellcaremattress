"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CollectionItem {
  name: string;
  slug: string;
  image: string;
  tag?: string;
}

const DEFAULT_COLLECTIONS: CollectionItem[] = [
  {
    name: "Mona Lite",
    slug: "mona-lite",
    image: "https://res.cloudinary.com/m1dy2af4/image/upload/v1795163588/file_ysbqpy.png",
    tag: "Budget Ortho"
  },
  {
    name: "Mona Softy",
    slug: "mona-softy",
    image: "https://res.cloudinary.com/m1dy2af4/image/upload/v1785320994/file_longd2.png",
    tag: "Plush Soft"
  },
  {
    name: "Eco Latex",
    slug: "ecolatex-6",
    image: "https://res.cloudinary.com/m1dy2af4/image/upload/v1795150603/file_jjwt50.png",
    tag: "Organic Latex"
  },
  {
    name: "Luxoria",
    slug: "luxoria",
    image: "https://res.cloudinary.com/m1dy2af4/image/upload/v1785323152/file_u74ptq.png",
    tag: "Luxury HR"
  },
  {
    name: "Luxoria Latex",
    slug: "luxoria-latex",
    image: "https://res.cloudinary.com/m1dy2af4/image/upload/v1785320341/file_jhpros.png",
    tag: "HR + Latex"
  },
  {
    name: "Memory Dump",
    slug: "memory-dump-6",
    image: "https://res.cloudinary.com/m1dy2af4/image/upload/v1785320691/file_bjjscn.png",
    tag: "Deep Memory"
  },
  {
    name: "Softy Bond",
    slug: "softy-bond",
    image: "https://res.cloudinary.com/m1dy2af4/image/upload/v1785320022/file_d5dfha.png",
    tag: "Dual Comfort"
  },
  {
    name: "Memory Bond",
    slug: "memory-bond",
    image: "https://res.cloudinary.com/m1dy2af4/image/upload/v1785319908/file_dohqir.png",
    tag: "Memory + Bonded"
  },
  {
    name: "Lax-o-Bond",
    slug: "lax-o-bond",
    image: "https://res.cloudinary.com/m1dy2af4/image/upload/v1785319695/file_bcj6d8.png",
    tag: "Heavy Weight Ortho"
  },
  {
    name: "Natural Latex",
    slug: "natural-latex",
    image: "https://res.cloudinary.com/m1dy2af4/image/upload/v1785320199/file_lonbmq.png",
    tag: "100% Organic"
  }
];

export function CollectionsGrid() {
  const [items, setItems] = useState<CollectionItem[]>(DEFAULT_COLLECTIONS);

  // Sync latest product images from DB so changes in Admin appear dynamically
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const cleanName = (n: string) =>
            (n || '').replace(/\s*-\s*\d+\s*(inch|")?|\s+\d+\s*(inch|")?$/i, '').replace(/\s+plus$/i, '').trim().toLowerCase();

          setItems(prevItems =>
            prevItems.map(item => {
              const matched = data.find((p: any) => cleanName(p.name) === cleanName(item.name) || p.slug === item.slug);
              if (matched && matched.images && matched.images.length > 0) {
                const imgUrl = typeof matched.images[0] === 'string' ? matched.images[0] : matched.images[0]?.url;
                if (imgUrl) return { ...item, image: imgUrl };
              }
              return item;
            })
          );
        }
      })
      .catch(() => {
        // Fall back to DEFAULT_COLLECTIONS
      });
  }, []);

  return (
    <section className="py-14 sm:py-20 bg-white relative z-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
        {/* Section Heading matching reference image style */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1A2A] tracking-tight mb-3"
          >
            Our Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm sm:text-base font-medium max-w-xl mx-auto"
          >
            Explore our signature range of orthopaedic, bonded, memory foam, and natural latex mattresses.
          </motion.p>
        </div>

        {/* Collections Grid (5 columns on desktop = 2 rows of 5 cards, cleanly balanced) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                href={`/product/${item.slug}`}
                className="group flex flex-col items-center cursor-pointer text-center"
              >
                {/* Rounded Image Container matching reference */}
                <div className="w-full aspect-[4/3] rounded-2xl sm:rounded-3xl bg-[#f5f6f8] group-hover:bg-[#ebf0f7] p-3 sm:p-5 flex items-center justify-center border border-gray-100 group-hover:border-[#0682E4]/30 shadow-sm group-hover:shadow-md transition-all duration-300 relative overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                  </div>
                </div>

                {/* Name Label Underneath */}
                <span className="mt-3 text-sm sm:text-base font-bold text-[#0B1A2A] group-hover:text-[#0682E4] transition-colors leading-tight">
                  {item.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
