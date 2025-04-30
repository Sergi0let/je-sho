import Basketicon from "@/components/icons/Basketicon";
import Image from "next/image";
type LinkType = { id: number; name: string; anchor: string };

const linkData: LinkType[] = [
  { id: 1, name: "Про товар", anchor: "about" },
  { id: 2, name: "Характеристики", anchor: "characteristics" },
  { id: 3, name: "Опис", anchor: "description" },
  { id: 4, name: "Доставка", anchor: "delivery" },
  { id: 5, name: "Оплата", anchor: "payment" },
  { id: 6, name: "Відгуки", anchor: "reviews" },
];

interface Props {
  mainImg: string;
  title: string;
  isDiscount: boolean;
  price?: number;
  oldprice?: number;
}
const ProductNav = ({ mainImg, title, isDiscount, oldprice, price }: Props) => {
  return (
    <nav className="flex items-center justify-between overflow-hidden rounded-t-2xl bg-white">
      <ul className="flex flex-nowrap overflow-x-auto md:-mx-4">
        {linkData.map(({ id, name, anchor }) => (
          <li
            key={id}
            className="group relative py-3 not-last:*:border-r md:py-4"
          >
            <span className="group-hover:text-blue-main border-gray-light-ultra text-gray-dark px-3 font-semibold uppercase transition-colors duration-500 sm:px-5 md:px-8">
              <a
                className="text-sm text-nowrap md:text-base"
                href={`#${anchor}`}
              >
                {name}
              </a>
            </span>
            <div className="transparent group-hover:bg-blue-dark absolute bottom-0 h-[3px] w-full rounded-t-full transition-colors duration-500" />
          </li>
        ))}
      </ul>
      <div className="mr-4 hidden items-center min-[1160px]:flex">
        {mainImg && mainImg !== "/assets/img/placeholder.png" && (
          <div className="mr-2 w-8 shrink-0">
            <Image src={mainImg} width={30} height={44} alt="preview" />
          </div>
        )}
        <div className="max-w-[150px]">
          <p className="line-clamp-2 text-[10px] leading-tight font-semibold">
            {title}
          </p>
          {isDiscount ? (
            <div className="leading-none">
              <span className="text-red-main text-xs font-bold">
                {price} грн
              </span>{" "}
              <span className="text-gray-middle ml-1 text-[10px] line-through">
                {oldprice} грн
              </span>
            </div>
          ) : (
            <span className="text-xs font-bold">{price} грн</span>
          )}
        </div>
        <div>
          <button className="hover:bg-blue-dark bg-green-main flex size-8 cursor-pointer items-center justify-center rounded-full text-sm font-bold text-white transition-colors duration-500">
            <Basketicon className="w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ProductNav;
