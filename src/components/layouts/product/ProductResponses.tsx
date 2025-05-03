"use client";

import { useResponses } from "@/components/context/ResponsesContext";
import { IResponsesData } from "@/types";
import { useEffect, useState } from "react";
import ProductDialog from "./ProductDialog";
import ProductRaiting from "./ProductRaiting";

const responsesData: IResponsesData[] = [
  {
    id: 1,
    name: "Марина Шевченко",
    date: "10 травня 2024",
    respond:
      "Тут придбала збірник віршів мого однофамільця, досить задоволена товаром та сервісом. Все прийло вчасно та охайно запаковано. Рекомендую усім",
    raiting: "5",
  },
  {
    id: 2,
    name: "В'ячеслав Чорновіл",
    date: "24 серпня 1991",
    respond:
      "Тут товари для справжнії Українців. Любіть Україну, як сонце любіть, нашу Україну Єдину... Нумо браття єднаймося",
    raiting: "4",
  },
  {
    id: 3,
    name: "Григорій Сковорада",
    date: "1 січня 2025",
    respond:
      "Маючи 500 гривень на цьому сайті я знайшов для себе що купити, а ще памятаю як за мого товриша Шевченка можна було шапку Адідас придбати. Нажаль часи змінилися почали друковати його без шапки. Бо на теперешній час це пачка Прилук та єдненьке Чернігівсье. Єднаймося, зігріваймося покажемо роду що ми...",
    raiting: "2",
  },
];

const ProductResponses = () => {
  const { respondData } = useResponses();
  const [displayState, setDisplayState] = useState<IResponsesData[]>([]);

  useEffect(() => {
    if (respondData.length) {
      setDisplayState([...respondData, ...responsesData]);
    } else {
      setDisplayState(responsesData);
    }
  }, [respondData]);

  return (
    <>
      <div className="flex">
        <div className="flex-1 space-y-1 md:space-y-4">
          <h2
            id="reviews"
            className="scroll-mt-20 text-2xl font-semibold md:scroll-mt-24 md:text-3xl"
          >
            Відгуки{" "}
            <b className="text-blue-main font-semibold">
              {displayState.length > 0 ? displayState.length : ""}
            </b>
          </h2>
          <div className="space-y-1 min-[690px]:flex">
            <p className="mr-4 line-clamp-2 font-semibold">
              Загальний рейтинг товару:
            </p>
            <div className="flex gap-1.5">
              <ProductRaiting
                size="lg"
                raiting={Math.floor(
                  displayState.reduce((acc, el) => acc + +el.raiting, 0) /
                    displayState.length,
                )}
              />
            </div>
          </div>
        </div>
        <div>
          <ProductDialog
            isRespond={true}
            backdropClass="bg-[#1862B166] backdrop-blur-xs"
            title="Залишити відгук"
            className="bg-blue-light text-blue-main inline-flex w-fit cursor-pointer items-center justify-center rounded-lg px-5 py-3 transition-opacity *:text-xs hover:opacity-80 md:px-8 md:py-4 *:md:text-base"
          />
        </div>
      </div>

      <ul className="border-stroke-main rounded-2xl border">
        {displayState.map(
          ({ id, date, name, raiting, respond }: IResponsesData, i) => (
            <li
              key={`${id}${i}`}
              className="space-y-1 p-3 not-last:border-b md:space-y-2 md:p-5"
            >
              <div className="flex gap-4">
                <div className="flex-1 items-center min-[620px]:flex">
                  <p className="text-lg font-semibold min-[620px]:mr-3 md:text-xl">
                    {name}
                  </p>
                  <span className="text-gray-main text-xs md:text-sm">
                    {date}
                  </span>
                </div>
                <ProductRaiting size="sm" raiting={raiting} />
              </div>
              <p className="text-sm md:text-base">{respond}</p>
            </li>
          ),
        )}
      </ul>
    </>
  );
};

export default ProductResponses;
