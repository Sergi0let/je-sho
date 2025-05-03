// Інтерфейс для вихідних даних
export interface Variant {
  title: string;
  offerId: string;
  attributes: Record<string, string>;
  price: number;
  oldprice: number;
  quantity: number;
  picture: string;
  barcode?: string;
  dimensions?: string;
  weight?: string;
}
// interface Variant {
//   title: string;
//   offerId: string;
//   attributes: Record<string, string>;
//   price: number;
//   quantity: number;
//   picture: string;
//   barcode?: string;
//   dimensions?: string;
//   weight?: string;
//   oldprice?: string;
// }

// export interface ParentProduct {
//   id: string;
//   title: string;
//   description: string;
//   mainPicture: string;
//   variants: Variant[];
// }

export interface IRandomProduct {
  id: string;
  title: string;
  imgUrl: string;
  price: number;
  oldprice: number;
}

export interface ParentProduct {
  id: string;
  title: string;
  description: string;
  mainPicture: string;
  variants: Variant[];
  selectedVariant?: Variant;
  randomProductData: IRandomProduct[];
  availableAttributes?: {
    [key: string]: string[];
  };
}

export interface OutputData {
  groupTitle: string;
  updatedAt: string;
  parentProducts: ParentProduct[];
}

export interface IOrderData {
  id: string;
  imgUrl: string;
  oldprice: number;
  price: number;
  title: string;
  isDiscount: boolean;
}

export interface IResponsesData {
  id: string | number;
  name: string;
  date: string;
  respond: string;
  raiting: string;
}
