"use client";

import { ResponsesProvider } from "@/components/context/ResponsesContext";
import Basketicon from "@/components/icons/Basketicon";
import Checkicon from "@/components/icons/Checkicon";
import Collapsible from "@/components/layouts/Colapsible";
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
import { IOrderData, IRandomProduct, ParentProduct, Variant } from "@/types";
import { useEffect, useState } from "react";
import ProductBtnVariant from "./ProductBtnVariant";
import ProductDialog from "./ProductDialog";
import ProductImgSlider from "./ProductImgSlider";
import ProductRaiting from "./ProductRaiting";
import ProductResponses from "./ProductResponses";
import ProductResponsesSlider from "./ProductResponsesSlider";

interface Props {
  product: ParentProduct;
  slug: string;
}

const ProductPage = ({ product, slug }: Props) => {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<
    string,
    string
  > | null>(null);

  const [randomProducts, setRandomProducts] = useState<IRandomProduct[] | null>(
    null,
  );

  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.selectedVariant!,
  );

  useEffect(() => {
    if (product.selectedVariant) {
      setSelectedAttributes(product.selectedVariant.attributes);
    }
  }, []);

  useEffect(() => {
    if (product.randomProductData) {
      setRandomProducts(product.randomProductData);
    }
  }, []);

  const getAvailableAttributes = () => {
    const availableAttributes = {
      Колір: new Set<string>(),
      Розмір: new Set<string>(),
    };
    if (!selectedAttributes) return;
    product.variants.forEach((variant) => {
      // Якщо вибрано розмір, показуємо тільки кольори для цього розміру
      if (
        selectedAttributes["Розмір"] &&
        selectedAttributes["Розмір"] === variant.attributes["Розмір"]
      ) {
        if (variant.attributes["Колір"]) {
          availableAttributes["Колір"].add(variant.attributes["Колір"]);
        }
      }
      // Якщо вибрано колір, показуємо тільки розміри для цього кольору
      if (
        selectedAttributes["Колір"] &&
        selectedAttributes["Колір"] === variant.attributes["Колір"]
      ) {
        if (variant.attributes["Розмір"]) {
          availableAttributes["Розмір"].add(variant.attributes["Розмір"]);
        }
      }
      // Якщо нічого не вибрано, додаємо всі значення
      if (!selectedAttributes["Розмір"] && !selectedAttributes["Колір"]) {
        if (variant.attributes["Колір"]) {
          availableAttributes["Колір"].add(variant.attributes["Колір"]);
        }
        if (variant.attributes["Розмір"]) {
          availableAttributes["Розмір"].add(variant.attributes["Розмір"]);
        }
      }
    });

    return {
      Колір: Array.from(availableAttributes["Колір"]),
      Розмір: Array.from(availableAttributes["Розмір"]),
    };
  };

  const availableAttributes = getAvailableAttributes();

  // Обробка вибору атрибута
  const handleAttributeChange = (attribute: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attribute]: value };
    setSelectedAttributes(newAttributes);

    // Знаходимо новий варіант
    const newVariant =
      product.variants.find((variant) =>
        Object.entries(newAttributes).every(
          ([key, val]) => variant.attributes[key] === val,
        ),
      ) || product.variants[0];

    setSelectedVariant(newVariant);
  };

  const mainImg = Array.isArray(selectedVariant.picture)
    ? selectedVariant.picture[0]
    : selectedVariant.picture ||
      product.mainPicture ||
      "https://placehold.co/800?text=%D0%A4%D0%BE%D1%82%D0%BE+%D0%9D%D0%B5%D0%BC%D0%B0%D1%94&font=roboto";

  const variantPictures = Array.isArray(selectedVariant.picture)
    ? selectedVariant.picture
    : [selectedVariant.picture];

  const isDiscount = !!selectedVariant.oldprice;
  const oldprice = selectedVariant.oldprice ? +selectedVariant.oldprice : 0;

  const orderData: IOrderData = {
    price: selectedVariant.price,
    id: selectedVariant.offerId,
    title: selectedVariant.title,
    imgUrl: mainImg,
    oldprice,
    isDiscount,
  };

  return (
    <>
      <Wrapper className="sticky top-0 z-20 px-0 md:px-4">
        <ProductNav
          mainImg={mainImg}
          title={selectedVariant.title}
          isDiscount={isDiscount}
          oldprice={oldprice}
          price={selectedVariant.price || 0}
        />
      </Wrapper>
      <Wrapper className="px-0 md:grid md:grid-cols-2 md:gap-1 md:px-4">
        <div>
          <div className="top-[60px] bg-white px-6 pt-6 pb-8 md:sticky xl:px-9 xl:pb-12">
            <ProductImgSlider
              images={variantPictures}
              productTitle="product"
              className="product-page"
            />
          </div>
        </div>
        <div className="space-y-1">
          <ProductItem>
            <h1
              id="about"
              className="scroll-mt-20 text-xl font-semibold sm:text-2xl md:scroll-mt-24 md:text-3xl lg:text-4xl xl:text-[40px]"
            >
              {selectedVariant.title}
            </h1>
            <div className="flex items-center justify-between gap-2 md:gap-6">
              <div className="flex items-center gap-3">
                <ProductRaiting size="sm" raiting={4} />
                <a
                  href="#reviews"
                  className="text-blue-main hover:text-blue-dark text-sm underline decoration-dotted underline-offset-4 transition-colors duration-500 hover:decoration-solid md:text-base"
                >
                  3 відгуки
                </a>
              </div>
              <div className="text-sm md:text-base">
                <span className="text-gray-main">Код: </span>
                <span>{selectedVariant.offerId}</span>
              </div>
            </div>
          </ProductItem>
          <ProductItem>
            <div className="absolute right-4 flex items-center gap-2 lg:static">
              <Checkicon className="w-4" />
              <span className="text-green-main text-sm font-medium md:text-base">
                {selectedVariant.quantity > 0
                  ? "В наявності"
                  : "Немає в наявності"}
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
                        -
                        {Math.round(
                          ((oldprice - (selectedVariant.price || 0)) /
                            oldprice) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="text-red-main font-bold">
                      <span className="text-3xl md:text-4xl">
                        {" "}
                        {selectedVariant.price || 0}
                      </span>
                      <span className="ml-2 text-lg md:text-2xl">грн</span>
                    </div>
                  </div>
                ) : (
                  <div className="font-bold">
                    <span className="text-3xl md:text-4xl">
                      {" "}
                      {selectedVariant.price || 0}
                    </span>
                    <span className="ml-2 text-lg md:text-2xl">грн</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col items-center justify-end gap-3 xl:flex-row">
                <div className="w-full">
                  <ProductDialog
                    isPreview={true}
                    productData={orderData}
                    backdropClass="bg-[#1862B166] backdrop-blur-xs"
                    icon={<Basketicon className="w-5" />}
                    title="Замовити"
                    className="bg-green-main flex w-full cursor-pointer items-center justify-center rounded-lg px-8 py-4 text-white transition-opacity hover:opacity-80"
                  />
                </div>
                <div className="w-full">
                  <ProductDialog
                    productData={orderData}
                    backdropClass="bg-[#1862B166] backdrop-blur-xs"
                    title="Купити в 1 клік"
                    className="bg-blue-light text-blue-main flex w-full cursor-pointer items-center justify-center rounded-lg px-8 py-4 transition-opacity hover:opacity-80"
                  />
                </div>
              </div>
            </div>
          </ProductItem>
          {availableAttributes && selectedAttributes && (
            <ProductItem>
              <ProductItemTitle title="Розмір" />
              <div className="flex flex-wrap gap-2">
                {availableAttributes["Розмір"].map((size) => {
                  const isSelected = selectedAttributes["Розмір"] === size;
                  return (
                    <ProductBtnVariant
                      key={size}
                      onClick={handleAttributeChange}
                      variant={size}
                      type="Розмір"
                      isSelected={isSelected}
                    />
                  );
                })}
              </div>
            </ProductItem>
          )}
          {availableAttributes && selectedAttributes && (
            <ProductItem>
              <ProductItemTitle title="Колір" />
              <div className="flex flex-wrap gap-2">
                {availableAttributes["Колір"].map((color) => {
                  const isSelected = selectedAttributes["Колір"] === color;
                  return (
                    <ProductBtnVariant
                      key={color}
                      onClick={handleAttributeChange}
                      variant={color}
                      type="Колір"
                      isSelected={isSelected}
                    />
                  );
                })}
              </div>
            </ProductItem>
          )}
          <ProductItem>
            <ProductItemTitle
              id="characteristics"
              className="scroll-mt-20 md:scroll-mt-24"
              title="Характеристики"
            />
            <Collapsible initialHeight={250}>
              <Table>
                <TableCaption>Список характеристик</TableCaption>
                <TableBody>
                  {selectedVariant &&
                    Object.entries(selectedVariant.attributes).map(
                      ([name, value], i) => (
                        <TableRow
                          key={i}
                          className={`${i % 2 !== 0 ? "bg-white" : "bg-gray-light-ultra"} border-b-0 max-[480px]:flex max-[480px]:flex-col`}
                        >
                          <TableCell className="text-gray-main px-4 py-3 text-sm max-[480px]:pb-1 md:text-base">
                            {name}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-sm max-[480px]:pt-0 md:text-base">
                            {value}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                </TableBody>
              </Table>
            </Collapsible>
          </ProductItem>
          <ProductItem>
            <ProductItemTitle
              id="description"
              className="scroll-mt-20 md:scroll-mt-24"
              title="Опис"
            />
            <Collapsible>
              <ProductItemDescription
                content={product.description || "Опис відсутній"}
              />
            </Collapsible>
          </ProductItem>
          <ProductItem>
            <ProductItemTitle
              id="delivery"
              className="scroll-mt-20 md:scroll-mt-24"
              title="Доставка"
            />
            <ProductDelivery />
          </ProductItem>
          <ProductItem>
            <ProductItemTitle
              id="payment"
              className="scroll-mt-20 md:scroll-mt-24"
              title="Оплата"
            />
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
      <Wrapper className="mb-20 px-0 md:px-4">
        <ProductItem className="mb-10 rounded-b-[20px] md:mb-20">
          <ResponsesProvider>
            <ProductResponses />
          </ResponsesProvider>
        </ProductItem>
        <ProductItem className="bg-transparent px-4 py-0 md:p-0">
          <h2 className="scroll-mt-20 text-2xl font-semibold md:scroll-mt-24 md:text-3xl">
            Схожі товари зі знижкою
          </h2>

          {randomProducts ? (
            <ProductResponsesSlider slug={slug} products={randomProducts} />
          ) : null}
        </ProductItem>
      </Wrapper>
    </>
  );
};

export default ProductPage;
