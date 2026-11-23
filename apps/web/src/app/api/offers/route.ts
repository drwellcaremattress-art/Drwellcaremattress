import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Offer } from '@/lib/models/Offer';

export const dynamic = 'force-dynamic';

const DEFAULT_OFFER = {
  title: 'BIG Festival SALE',
  subtitle: 'Festival Special Discount',
  couponCode: 'FESTIVAL25',
  discountPercentage: 25,
  buttonText: 'Shop Festive Deals',
  linkUrl: '/collections',
  isActive: true,
  cardLayout: 'capsule' as const,

  // Hero Section Customization Defaults
  festiveCardImage: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1795244625/file_gxwthh.png',
  festiveBadgeTitle: 'BIG Festival SALE',
  festiveDiscount: 25,
  festiveCouponCode: 'FESTIVAL25',
  festiveLinkUrl: '/collections',

  mainBannerImage: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1795244653/file_ahpmyj.png',
  mainBannerLink: '/collections',
  mainBannerSlides: [
    {
      image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1795244653/file_ahpmyj.png',
      alt: 'Enhance Your Bedroom with Orthopaedic Comfort',
      link: '/collections',
    },
    {
      image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1795244667/file_rxcmbo.png',
      alt: 'Banner Slide 2',
      link: '/collections',
    },
    {
      image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1795244687/file_fym4tj.png',
      alt: 'Banner Slide 3',
      link: '/collections',
    }
  ],

  showcaseCardImage: '/images/products/ecolatex-6.jpeg',
  showcaseCardVideoUrl: 'https://res.cloudinary.com/m1dy2af4/video/upload/v1795245939/file_r9wbsi.mp4',
  showcaseCardTitle: 'DR wellcare',
  showcaseCardBrand: 'Dr. Well Care Mattress',
  showcaseCardLinkUrl: '/collections',
};

// GET: Retrieve active offer or default
export async function GET() {
  try {
    await connectDB();
    let offer = await Offer.findOne({}).sort({ updatedAt: -1 }).lean();

    if (!offer) {
      const created = await Offer.create(DEFAULT_OFFER);
      offer = created.toObject();
    }

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error('Error fetching offer:', error);
    return NextResponse.json(
      { success: true, offer: DEFAULT_OFFER, fallback: true },
      { status: 200 }
    );
  }
}

// PUT / POST: Update or create offer
export async function PUT(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    let offer = await Offer.findOne({}).sort({ updatedAt: -1 });

    if (offer) {
      Object.assign(offer, {
        tag: data.tag ?? offer.tag,
        badgeText: data.badgeText ?? offer.badgeText,
        title: data.title ?? offer.title,
        subtitle: data.subtitle ?? offer.subtitle,
        couponCode: data.couponCode ?? offer.couponCode,
        discountPercentage: Number(data.discountPercentage ?? offer.discountPercentage),
        rating: Number(data.rating ?? offer.rating),
        reviewsCount: data.reviewsCount ?? offer.reviewsCount,
        buttonText: data.buttonText ?? offer.buttonText,
        linkUrl: data.linkUrl ?? offer.linkUrl,
        theme: data.theme ?? offer.theme,
        cardLayout: data.cardLayout ?? offer.cardLayout ?? 'showcase',
        showRatingBadge: data.showRatingBadge !== undefined ? Boolean(data.showRatingBadge) : (offer.showRatingBadge ?? true),
        trustPoint1: data.trustPoint1 ?? offer.trustPoint1 ?? 'Orthopaedic Certified',
        trustPoint2: data.trustPoint2 ?? offer.trustPoint2 ?? 'Loved by 10,000+ Indians',
        trustPoint3: data.trustPoint3 ?? offer.trustPoint3 ?? '10,000+ Sleepers',
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : offer.isActive,
        showParticles: data.showParticles !== undefined ? Boolean(data.showParticles) : offer.showParticles,

        // Hero Customization fields
        festiveCardImage: data.festiveCardImage ?? offer.festiveCardImage ?? 'https://res.cloudinary.com/m1dy2af4/image/upload/v1795244625/file_gxwthh.png',
        festiveBadgeTitle: data.festiveBadgeTitle ?? offer.festiveBadgeTitle ?? 'BIG Festival SALE',
        festiveDiscount: Number(data.festiveDiscount ?? data.discountPercentage ?? offer.festiveDiscount ?? 25),
        festiveCouponCode: data.festiveCouponCode ?? data.couponCode ?? offer.festiveCouponCode ?? 'FESTIVAL25',
        festiveLinkUrl: data.festiveLinkUrl ?? data.linkUrl ?? offer.festiveLinkUrl ?? '/collections',

        mainBannerImage: data.mainBannerImage ?? offer.mainBannerImage ?? 'https://res.cloudinary.com/m1dy2af4/image/upload/v1795244653/file_ahpmyj.png',
        mainBannerLink: data.mainBannerLink ?? offer.mainBannerLink ?? '/collections',
        mainBannerSlides: data.mainBannerSlides ?? offer.mainBannerSlides ?? DEFAULT_OFFER.mainBannerSlides,

        showcaseCardImage: data.showcaseCardImage ?? offer.showcaseCardImage ?? '/images/products/ecolatex-6.jpeg',
        showcaseCardVideoUrl: data.showcaseCardVideoUrl ?? offer.showcaseCardVideoUrl ?? 'https://res.cloudinary.com/m1dy2af4/video/upload/v1795245939/file_r9wbsi.mp4',
        showcaseCardTitle: data.showcaseCardTitle ?? offer.showcaseCardTitle ?? 'DR wellcare',
        showcaseCardBrand: data.showcaseCardBrand ?? offer.showcaseCardBrand ?? 'Dr. Well Care Mattress',
        showcaseCardLinkUrl: data.showcaseCardLinkUrl ?? offer.showcaseCardLinkUrl ?? '/collections',
      });
      await offer.save();
    } else {
      offer = await Offer.create({
        ...DEFAULT_OFFER,
        ...data,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Offer updated successfully',
      offer: offer.toObject(),
    });
  } catch (error: any) {
    console.error('Error updating offer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update offer' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return PUT(req);
}

