"use client";

import { ChevronDown } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  initialHeight?: number; // Початкова висота в згорнутому стані (за замовчуванням 150px)
  buttonClassName?: string; // Для стилізації кнопки
  gradientClassName?: string; // Для стилізації градієнта
};

const Collapsible = ({
  children,
  initialHeight = 260,
  buttonClassName = "",
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Вимірюємо висоту контенту для плавної анімації
  useEffect(() => {
    const currentRef = contentRef.current;
    if (currentRef) {
      const { scrollHeight } = currentRef;
      setContentHeight(scrollHeight); // Зберігаємо реальну висоту контенту
      setIsOverflowing(scrollHeight > initialHeight); // Перевіряємо, чи є переповнення
    }
  }, [children, initialHeight]);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : `${initialHeight}px`,
        }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        {children}
      </div>
      {/* Градієнт для ефекту затухання в згорнутому стані */}
      {!isExpanded && isOverflowing && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-t from-white to-transparent" />
      )}
      {isOverflowing && (
        <div className="relative mt-2">
          <button
            className={`text-blue-main flex cursor-pointer items-center text-base transition-opacity hover:opacity-60 ${buttonClassName}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Приховати" : "Показати ще"}
            <ChevronDown
              className={`ml-1.5 h-5 w-5 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Collapsible;
