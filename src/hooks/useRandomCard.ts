import { useState } from "react";

const useRandomCard = (slug: string, data: any[]) => {
  const [products, setProducts] = useState([]);

  return {
    products,
  };
};
