import Basketicon from "@/components/icons/Basketicon";

const ProductBtnOrder = () => {
  return (
    <button className="bg-green-main flex w-full cursor-pointer items-center justify-center rounded-lg px-8 py-4 text-white transition-opacity hover:opacity-80">
      <Basketicon className="w-5" />
      <span className="ml-2 font-semibold uppercase">Замовити</span>
    </button>
  );
};

export default ProductBtnOrder;
