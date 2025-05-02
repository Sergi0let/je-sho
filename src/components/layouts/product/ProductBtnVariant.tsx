import { cn } from "@/lib/utils";

type AttributeType = "Колір" | "Розмір"; // Обмежуємо типи атрибутів

interface ProductBtnVariantProps {
  variant: string;
  type: AttributeType;
  isSelected: boolean;
  onClick: (type: AttributeType, value: string) => void;
  className?: string;
}

const ProductBtnVariant = ({
  variant,
  type,
  isSelected,
  onClick,
  className,
}: ProductBtnVariantProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(type, variant)}
      className={cn(
        "inline-block cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors md:text-base",
        isSelected
          ? "border-blue-main bg-blue-main text-white"
          : "border-stroke-main hover:bg-stroke-main bg-white",
        className,
      )}
      aria-pressed={isSelected}
      aria-label={`${type}: ${variant}`}
    >
      {variant}
    </button>
  );
};

export default ProductBtnVariant;
