import Basketicon from "@/components/icons/Basketicon";
import Checkicon from "@/components/icons/Checkicon";
import { IRandomProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";

const ProductCart = ({
  id,
  slug,
  imgUrl,
  oldprice,
  price,
  title,
}: IRandomProduct & { slug: string }) => {
  const isDiscount = !!oldprice;
  const oldPrice = oldprice ? +oldprice : 0;
  return (
    <Link href={`/${slug}/${id}`} className="flex h-full flex-col">
      <span className="bg-red-main absolute top-0 left-0 inline-block px-1.5 py-0.5 text-[10px] font-bold text-white sm:px-[10px] sm:py-1 md:text-xs">
        -{Math.round(((oldPrice - (price || 0)) / oldPrice) * 100)}%
      </span>
      <div className="">
        <Image
          src={imgUrl}
          width={320}
          height={320}
          alt={title}
          className="aspect-square size-full object-cover object-top"
        />
      </div>
      <div className="mt-2 mb-1 flex items-center px-2 md:mt-3 md:mb-2 lg:px-5">
        <div className="flex flex-1 items-center">
          <Checkicon className="mr-1 size-3" />
          <span className="hidden text-[8px] sm:block md:text-xs">
            В наявності
          </span>
        </div>
        <span className="text-gray-main text-[9px] md:text-xs">Код: {id}</span>
      </div>
      <h3 className="line-clamp-3 h-full flex-1 px-2 text-xs font-medium text-pretty sm:text-sm md:text-base lg:px-5">
        {title}
      </h3>

      <div className="mt-2 flex flex-col gap-4 px-2 md:mt-3 lg:flex-row lg:px-5">
        <div className="flex flex-1">
          {isDiscount ? (
            <div className="flex-1 -space-y-1">
              <div>
                <span className="text-gray-main text-xs line-through sm:text-sm md:text-base">
                  {oldPrice}грн
                </span>
              </div>
              <div className="text-red-main font-bold">
                <span className="text-sm sm:text-lg md:text-xl">
                  {" "}
                  {price || 0}
                </span>
                <span className="ml-1 text-xs sm:text-sm md:text-base">
                  грн
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 font-bold">
              <span className="text-lg md:text-xl"> {price || 0}</span>
              <span className="ml-1 text-sm md:text-base">грн</span>
            </div>
          )}
          <div>
            <div className="bg-blue-light flex size-8 items-center justify-center rounded-full sm:size-9 md:size-12">
              <Basketicon className="fill-green-main size-4 md:size-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCart;
