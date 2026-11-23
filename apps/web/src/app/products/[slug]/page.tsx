import { redirect } from 'next/navigation';

export default function ProductsRedirectPage({ params }: { params: { slug: string } }) {
  redirect(`/product/${params.slug}`);
}
