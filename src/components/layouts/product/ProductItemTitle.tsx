interface Props {
  title: string;
  className?: string;
  [key: string]: unknown;
}

const ProductItemTitle = ({ title, className = "", ...rest }: Props) => {
  return (
    <h3 {...rest} className={`flex items-center gap-2 ${className}`}>
      <span className="bg-blue-main size-2 rounded-full" />
      <span className="text-lg font-semibold uppercase md:text-xl">
        {title}
      </span>
    </h3>
  );
};

export default ProductItemTitle;
