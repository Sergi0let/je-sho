interface Props {
  title: string;
  className?: string;
}

const ProductItemTitle = ({ title, className = "" }: Props) => {
  return (
    <h3 className={`flex items-center gap-2 ${className}`}>
      <span className="bg-blue-main size-2 rounded-full" />
      <span className="text-lg font-semibold uppercase md:text-xl">
        {title}
      </span>
    </h3>
  );
};

export default ProductItemTitle;
