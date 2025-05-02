"use client";

import { useEffect, useRef, useState } from "react";
import ProductPreview from "./ProductPreview";
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
const ProductNav = ({
  mainImg = "http://crm.newtrend.team/media/shop//a7/26/a72683081024a881c947578842dec557.jpg",
  title,
  isDiscount,
  oldprice,
  price,
}: Props) => {
  const [activeAnchor, setActiveAnchor] = useState<string>("");
  const navRef = useRef<HTMLUListElement>(null);

  // Відстежування видимості секцій
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin:
        window.innerWidth < 768 ? "0px 0px -70% 0px" : "-20% 0px -20% 0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveAnchor(entry.target.id);
        }
      });
    }, observerOptions);

    linkData.forEach(({ anchor }) => {
      const element = document.getElementById(anchor);

      if (!element) {
        console.warn(`Element with id "${anchor}" not found`);
      } else {
        observer.observe(element);
      }
    });

    return () => {
      linkData.forEach(({ anchor }) => {
        const element = document.getElementById(anchor);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  // Центрування активного пункту навігації з затримкою
  useEffect(() => {
    if (window.innerWidth > 840) {
      return;
    }
    if (navRef.current) {
      const activeItem = navRef.current.querySelector(
        `a[href="#${activeAnchor}"]`,
      );
      if (activeItem) {
        // Затримка для завершення вертикальної прокрутки
        const timeoutId = setTimeout(() => {
          activeItem.scrollIntoView({ behavior: "smooth", inline: "center" });
        }, 500);
        return () => clearInterval(timeoutId);
      }
    }
  }, [activeAnchor]);

  return (
    <nav className="flex items-center justify-between overflow-hidden rounded-t-2xl bg-white shadow-xs">
      <ul
        ref={navRef}
        className="scrollbar flex flex-nowrap overflow-x-auto md:-mx-4"
      >
        {linkData.map(({ id, name, anchor }) => (
          <li
            key={id}
            className="group relative py-3 not-last:*:border-r md:py-4"
            aria-current={activeAnchor === anchor ? "true" : "false"}
          >
            <span className="group-hover:text-blue-main border-gray-light-ultra text-gray-dark px-3 font-semibold uppercase transition-colors duration-500 sm:px-5 md:px-8">
              <a
                className="text-sm text-nowrap md:text-base"
                href={`#${anchor}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveAnchor(anchor);
                  const element = document.getElementById(anchor);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {name}
              </a>
            </span>
            <div
              className={`absolute bottom-0 h-[3px] w-full rounded-t-full transition-colors duration-500 ${
                activeAnchor === anchor
                  ? "bg-blue-main"
                  : "transparent group-hover:bg-blue-dark"
              }`}
            />
          </li>
        ))}
      </ul>
      <ProductPreview
        isDiscount={isDiscount}
        className="mr-4 hidden min-[1160px]:flex"
        imgUrl={mainImg}
        title={title}
        price={price}
        oldprice={oldprice}
      />
    </nav>
  );
};

export default ProductNav;
