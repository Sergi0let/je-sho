import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";

type WrapperTag = "div" | "section" | "article";

interface WrapperProps<T extends WrapperTag = "div"> {
  as?: T; //
  children: ReactNode;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Для додаткових пропсів, таких як id, aria-label тощо
}

const Wrapper = forwardRef<HTMLElement, WrapperProps>(
  ({ as: Tag = "div", className = "", children, ...rest }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn("mx-auto max-w-[1360px] px-4", className)}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

Wrapper.displayName = "Wrapper";

export default Wrapper;
