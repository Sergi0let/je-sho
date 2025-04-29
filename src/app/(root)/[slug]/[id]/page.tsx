import { getOfferBySlugAndId } from "@/lib/getOffer";

// Define the data types
// type Offer = {
//   id: string;
//   name: string;
//   description: string;
// };

// type Data = {
//   offers: Offer[];
// };

export const dynamic = "force-dynamic"; // або можна ISR через revalidate

const Page = async ({ params }: { params: { slug: string; id: string } }) => {
  const { id, slug } = await params;
  console.log(id, slug);
  const product = await getOfferBySlugAndId(slug, id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main className="bg-[var(--secondary-light)] px-4 py-6 md:py-9">
      <div className="container mx-auto max-w-7xl">
        <h1>{product.name}</h1>
      </div>
    </main>
  );
};

export default Page;
