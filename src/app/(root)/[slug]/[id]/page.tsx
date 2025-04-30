import Basketicon from "@/components/icons/Basketicon";
import Checkicon from "@/components/icons/Checkicon";
import Staricon from "@/components/icons/Staricon";
import Collapsible from "@/components/layouts/Colapsible";
import Navbar from "@/components/layouts/Navbar";
import ProductDelivery from "@/components/layouts/product/ProductDelivery";
import ProductItem from "@/components/layouts/product/ProductItem";
import ProductItemDescription from "@/components/layouts/product/ProductItemDescription";
import ProductItemTitle from "@/components/layouts/product/ProductItemTitle";
import ProductNav from "@/components/layouts/product/ProductNav";
import ProductPayment from "@/components/layouts/product/ProductPayment";
import Wrapper from "@/components/layouts/Wrapper";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { getOfferBySlugAndId } from "@/lib/getOffer";
import Image from "next/image";

export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: { slug: string; id: string } }) => {
  const { id, slug } = await params;
  const product = await getOfferBySlugAndId(slug, id);

  if (!product) {
    return <div>Товар не знайдено</div>;
  }

  const { name, price, oldprice, picture, param, description } = product;

  const paramRender = Array.isArray(param) ? param : [param];

  const isDiscount = !!oldprice && +oldprice > 0;
  const mainImg = picture[0] || "/assets/img/placeholder.png"; // Запасне зображення

  return (
    <>
      <Navbar />
      <main className="bg-gray-light-ultra space-y-1 pt-8">
        <Wrapper className="px-0 md:px-4">
          <ProductNav
            mainImg={mainImg}
            title={name}
            isDiscount={isDiscount}
            oldprice={oldprice}
            price={price}
          />
        </Wrapper>
        <Wrapper className="px-0 md:grid md:grid-cols-2 md:gap-1 md:px-4">
          <div className="mb-1 bg-white p-4">
            {mainImg ? (
              <div className="relative aspect-square w-full">
                <Image
                  src={mainImg}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  alt={name}
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full items-center justify-center bg-gray-200">
                <span className="text-gray-500">Зображення відсутнє</span>
              </div>
            )}
            {picture.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {picture.map(
                  (img, index) =>
                    img && (
                      <div key={index} className="relative h-16 w-16 shrink-0">
                        <Image
                          src={img}
                          fill
                          sizes="64px"
                          className="rounded-md object-cover"
                          alt={`${name} ${index + 1}`}
                        />
                      </div>
                    ),
                )}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <ProductItem>
              <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl xl:text-[40px]">
                {name}
              </h1>
              <div className="flex items-center justify-between gap-2 md:gap-6">
                <div className="flex items-center gap-3">
                  <div className="space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Staricon key={i} className="inline-block w-4" />
                    ))}
                  </div>
                  <a
                    href="#reviews"
                    className="text-blue-main hover:text-blue-dark text-sm underline decoration-dotted underline-offset-4 transition-colors duration-500 hover:decoration-solid md:text-base"
                  >
                    3 відгуки
                  </a>
                </div>
                <div className="text-sm md:text-base">
                  <span className="text-gray-main">Код: </span>
                  <span>{id}</span>
                </div>
              </div>
            </ProductItem>
            <ProductItem>
              <div className="absolute right-4 flex items-center gap-2 lg:static">
                <Checkicon className="w-4" />
                <span className="text-green-main text-sm font-medium md:text-base">
                  В наявності
                </span>
              </div>
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex-1">
                  {isDiscount ? (
                    <div className="space-y-1">
                      <div>
                        <span className="text-gray-main text-sm line-through md:text-base">
                          {oldprice}грн
                        </span>
                        <span className="bg-red-main ml-2 inline-block rounded-md px-[10px] py-1 text-[10px] font-bold text-white md:text-xs">
                          -{Math.round(((oldprice - price) / oldprice) * 100)}%
                        </span>
                      </div>
                      <div className="text-red-main font-bold">
                        <span className="text-3xl md:text-4xl"> {price}</span>
                        <span className="ml-2 text-lg md:text-2xl">грн</span>
                      </div>
                    </div>
                  ) : (
                    <div className="font-bold">
                      <span className="text-3xl md:text-4xl"> {price}</span>
                      <span className="ml-2 text-lg md:text-2xl">грн</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col items-center justify-end gap-3 xl:flex-row">
                  <div className="w-full">
                    <button className="bg-green-main flex w-full cursor-pointer items-center justify-center rounded-lg px-8 py-4 text-white transition-opacity hover:opacity-80">
                      <Basketicon className="w-5" />
                      <span className="ml-2 font-semibold uppercase">
                        Замовити
                      </span>
                    </button>
                  </div>
                  <div className="w-full">
                    <button className="bg-blue-light text-blue-main flex w-full cursor-pointer items-center justify-center rounded-lg px-8 py-4 transition-opacity hover:opacity-80">
                      <span className="ml-2 font-semibold uppercase">
                        Замовити
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </ProductItem>
            <ProductItem>
              <ProductItemTitle title="Характеристики" />
              <Collapsible initialHeight={250}>
                <Table>
                  <TableCaption>Список характеристик</TableCaption>
                  <TableBody>
                    {paramRender &&
                      paramRender.map((p, i) => (
                        <TableRow
                          key={i}
                          className={`${i % 2 !== 0 ? "bg-white" : "bg-gray-light-ultra"} border-b-0`}
                        >
                          <TableCell className="text-gray-main px-4 py-3 text-base">
                            {p.name}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-base">
                            {p["#text"]}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Collapsible>
            </ProductItem>
            <ProductItem>
              <ProductItemTitle title="Опис" />
              <Collapsible>
                <ProductItemDescription content={description} />
              </Collapsible>
            </ProductItem>
            <ProductItem>
              <ProductItemTitle title="Доставка" />
              <ProductDelivery />
            </ProductItem>
            <ProductItem>
              <ProductItemTitle title="Оплата" />
              <ProductPayment />
            </ProductItem>
            <ProductItem>
              <ProductItemTitle title="Гарантія" />
              <p className="text-gray-main text-sm md:text-base">
                Ви можете повернути або обміняти товар протягом 14 днів
              </p>
            </ProductItem>
          </div>
        </Wrapper>
        <Wrapper className="px-0 md:px-4">
          <ProductItem>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            dignissimos blanditiis dolores eveniet omnis cupiditate. Beatae,
            tempora repudiandae quo deleniti at nemo. Ratione molestiae amet
            voluptatum laudantium inventore vero quod.
          </ProductItem>
        </Wrapper>
      </main>
    </>
  );
};

export default Page;
