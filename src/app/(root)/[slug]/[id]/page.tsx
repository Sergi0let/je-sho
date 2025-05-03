import Navbar from "@/components/layouts/Navbar";
import ProductPage from "@/components/layouts/product/ProductPage";
import { getOfferAndVariants } from "@/lib/getOffer";

export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: { slug: string; id: string } }) => {
  const { id, slug } = await params;

  const product = await getOfferAndVariants(slug, id);

  if (!product || !product.selectedVariant) {
    return <div>Товар не знайдено</div>;
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-light-ultra space-y-1 pt-8">
        <ProductPage product={product} slug={slug} />
      </main>
    </>
  );
};

export default Page;
