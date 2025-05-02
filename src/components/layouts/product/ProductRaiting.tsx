import Staricon from "@/components/icons/Staricon";
import { cn } from "@/lib/utils";

interface Props {
  raiting: string | number;
  size: "sm" | "lg";
}

const ProductRaiting = ({ raiting, size }: Props) => {
  return (
    <div
      className={cn(
        "flex",
        { "gap-1.5": size === "lg" },
        { "gap-0.5": size === "sm" },
      )}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Staricon
          key={i}
          className={cn(
            { "size-5": size === "lg" },
            { "size-4": size == "sm" },
            { "fill-blue-light": i >= +raiting },
          )}
        />
      ))}
    </div>
  );
};

export default ProductRaiting;
