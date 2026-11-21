import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
  tag: string;
  badgeText: string;
  title: string;
  subtitle: string;
  couponCode: string;
  discountPercentage: number;
  rating: number;
  reviewsCount: string;
  buttonText: string;
  linkUrl: string;
  theme: string;
  cardLayout: 'showcase' | 'capsule';
  showRatingBadge: boolean;
  trustPoint1: string;
  trustPoint2: string;
  trustPoint3: string;
  isActive: boolean;
  showParticles: boolean;

  // Hero Section Customization Fields
  festiveCardImage: string;
  festiveBadgeTitle: string;
  festiveDiscount: number;
  festiveCouponCode: string;
  festiveLinkUrl: string;

  mainBannerImage: string;
  mainBannerLink: string;
  mainBannerSlides: { image: string; alt?: string; link?: string }[];

  showcaseCardImage: string;
  showcaseCardVideoUrl: string;
  showcaseCardTitle: string;
  showcaseCardBrand: string;
  showcaseCardLinkUrl: string;

  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema: Schema = new Schema(
  {
    tag: { type: String, default: 'TOP RATED' },
    badgeText: { type: String, default: 'SPECIAL OFFER' },
    title: { type: String, default: 'BIG Festival SALE' },
    subtitle: { type: String, default: 'Festival Special Discount' },
    couponCode: { type: String, default: 'FESTIVAL25' },
    discountPercentage: { type: Number, default: 25 },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: String, default: '10,000+ Indians' },
    buttonText: { type: String, default: 'Shop Festive Deals' },
    linkUrl: { type: String, default: '/collections' },
    theme: {
      type: String,
      default: 'emerald'
    },
    cardLayout: {
      type: String,
      enum: ['showcase', 'capsule'],
      default: 'showcase'
    },
    showRatingBadge: {
      type: Boolean,
      default: true
    },
    trustPoint1: {
      type: String,
      default: 'Orthopaedic Certified'
    },
    trustPoint2: {
      type: String,
      default: 'Loved by 10,000+ Indians'
    },
    trustPoint3: {
      type: String,
      default: '10,000+ Sleepers'
    },
    isActive: { type: Boolean, default: true },
    showParticles: { type: Boolean, default: false },

    // Hero Section Customization Fields
    festiveCardImage: { type: String, default: '/images/hero_recliner_sale.png' },
    festiveBadgeTitle: { type: String, default: 'BIG Festival SALE' },
    festiveDiscount: { type: Number, default: 25 },
    festiveCouponCode: { type: String, default: 'FESTIVAL25' },
    festiveLinkUrl: { type: String, default: '/collections' },

    mainBannerImage: { type: String, default: '/images/hero_banner_bedroom.png' },
    mainBannerLink: { type: String, default: '/collections' },
    mainBannerSlides: {
      type: [
        {
          image: { type: String, default: '/images/hero_banner_bedroom.png' },
          alt: { type: String, default: 'Enhance Your Bedroom with Orthopaedic Comfort' },
          link: { type: String, default: '/collections' },
        }
      ],
      default: [
        {
          image: '/images/hero_banner_bedroom.png',
          alt: 'Enhance Your Bedroom with Orthopaedic Comfort',
          link: '/collections',
        },
        {
          image: '/images/luxury_mattress_hero.png',
          alt: 'Luxury Bedroom with Dr Well Care Mattress',
          link: '/collections?type=Luxury+HR+Series',
        },
        {
          image: '/images/bonded_section_main.png',
          alt: 'Bonded Orthopaedic Support Mattress',
          link: '/collections?type=Bonded+Series',
        }
      ]
    },

    showcaseCardImage: { type: String, default: '/images/hero_dining_showcase.png' },
    showcaseCardVideoUrl: { type: String, default: '' },
    showcaseCardTitle: { type: String, default: 'Denzen Marble Top Dining Set' },
    showcaseCardBrand: { type: String, default: 'DAMRO Internationally Trusted Furniture' },
    showcaseCardLinkUrl: { type: String, default: '/collections' },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Offer) {
  delete mongoose.models.Offer;
}

export const Offer = mongoose.model<IOffer>('Offer', OfferSchema);


