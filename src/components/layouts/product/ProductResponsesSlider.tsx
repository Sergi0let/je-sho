"use client";

import { cn } from "@/lib/utils";
import { IRandomProduct } from "@/types";
import { Options, Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/splide/css";
import debounce from "lodash.debounce";
import { useEffect, useRef } from "react";
import ProductCart from "./ProductCart";

interface Props {
  products: IRandomProduct[];
  slug: string;
  className?: string;
}

const ProductResponsesSlider = ({ products = [], className, slug }: Props) => {
  const mainRef = useRef<Splide>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  // Функція для перенесення пагінації
  const movePagination = () => {
    if (mainRef.current && paginationRef.current) {
      const splidePagination = mainRef.current.splide?.root.querySelector(
        ".splide__pagination",
      );
      if (splidePagination && paginationRef.current.childNodes.length === 0) {
        paginationRef.current.appendChild(splidePagination);
      }
    }
  };

  // Дебонсинг для перенесення пагінації
  const debouncedMovePagination = debounce(movePagination, 100);

  // Ініціалізація та обробка подій
  useEffect(() => {
    movePagination(); // Перенести пагінацію при завантаженні

    const splide = mainRef.current?.splide;
    if (splide) {
      splide.on("resize", debouncedMovePagination);
    }

    return () => {
      if (splide) {
        splide.off("resize");
      }
      debouncedMovePagination.cancel();
    };
  }, []);

  // Налаштування основної каруселі
  const mainOptions: Options = {
    type: "loop",
    perPage: 5,
    perMove: 1,
    gap: "2px",
    pagination: true,
    height: "auto",
    arrows: false,
    breakpoints: {
      768: {
        perPage: 3,
      },
      1024: {
        perPage: 4,
      },
    },
  };

  const goPrev = () => {
    if (mainRef.current?.splide) {
      mainRef.current.splide.go("<");
    }
  };

  const goNext = () => {
    if (mainRef.current?.splide) {
      mainRef.current.splide.go(">");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Splide
        options={mainOptions}
        ref={mainRef}
        aria-labelledby="product-image-carousel"
      >
        {products.map((product, index) => (
          <SplideSlide key={index} className="relative bg-white">
            <ProductCart slug={slug} {...product} />
          </SplideSlide>
        ))}
      </Splide>
      <div className="mt-0.5 flex items-center justify-center bg-white md:py-3">
        <button
          onClick={goPrev}
          className="hover:text-red-main flex size-10 cursor-pointer items-center justify-start rounded-full transition-colors"
          aria-label="Попередній товар"
        >
          <svg
            className="stroke-blue-main group-hover:stroke-green-main transition-colors"
            width="9"
            height="16"
            viewBox="0 0 9 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 15L0.999999 8L8 1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="response-block" ref={paginationRef} />
        <button
          onClick={goNext}
          className="group bottom-4 flex size-10 cursor-pointer items-center justify-end rounded-full transition-colors"
          aria-label="Наступна мініатюра"
        >
          <svg
            className="stroke-blue-main group-hover:stroke-green-main transition-colors"
            width="9"
            height="16"
            viewBox="0 0 9 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L8 8L1 15"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductResponsesSlider;
