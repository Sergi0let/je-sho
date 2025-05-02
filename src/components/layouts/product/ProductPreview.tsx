import Basketicon from "@/components/icons/Basketicon";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  imgUrl: string;
  title: string;
  price?: number;
  oldprice?: number;
  isDiscount: boolean;
  className?: string;
  isPreview?: boolean;
}

const ProductPreview = ({
  imgUrl,
  oldprice,
  price,
  title,
  isDiscount,
  className,
  isPreview = false,
}: Props) => {
  return (
    <div className={cn("items-center", className)}>
      {!!imgUrl &&
        imgUrl !==
          "http://crm.newtrend.team/media/shop//a7/26/a72683081024a881c947578842dec557.jpg" && (
          <div
            className={cn("mr-2 w-8 shrink-0", { "size-[100px]": isPreview })}
          >
            <Image
              src={imgUrl}
              width={30}
              height={44}
              alt="preview"
              className="size-full object-cover"
            />
          </div>
        )}
      <div className={cn("max-w-[150px]", { "max-w-full": isPreview })}>
        <p
          className={cn(
            "line-clamp-2 text-[10px] leading-tight font-semibold",
            { "text-left text-base": isPreview },
          )}
        >
          {title}
        </p>
        {isDiscount ? (
          <div
            className={cn("text-left leading-none", {
              "mt-2 flex flex-col-reverse": isPreview,
            })}
          >
            <span
              className={cn("text-red-main text-xs font-bold", {
                "text-2xl": isPreview,
              })}
            >
              {price} грн
            </span>{" "}
            <span className="text-gray-middle ml-1 text-[10px] line-through">
              {oldprice || 0} грн
            </span>
          </div>
        ) : (
          <span className={cn("text-xs font-bold", { "text-2xl": isPreview })}>
            {price} грн
          </span>
        )}
      </div>
      {isPreview ? null : (
        <div>
          <button className="hover:bg-blue-dark bg-green-main flex size-8 cursor-pointer items-center justify-center rounded-full text-sm font-bold text-white transition-colors duration-500">
            <Basketicon className="w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPreview;
