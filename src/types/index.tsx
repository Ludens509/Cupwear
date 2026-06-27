// export interface Jersey {
//   id: string;
//   country: string;
//   price: number;
//   size: string;
//   tag?: string;
// }

// export  interface NavLink{
//     label:string;
//     href:string;
// }

export interface Jersey {
  id: string;
  country: string;
  flag: string;
  homeColor: string;
  awayColor: string;
  accentColor: string;
  numberColor: string;
  number: string;
  playerName: string;
  price: number;
  group: string;
  tag?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Testimonials {
  id: number;
  segments:{text:string; muted:boolean}[];
  name:string;
  role:string;
  avatar:string;
}

export interface IProduct {
  id: number;
  sku: number;
  title: string;
  description: string;
  availableSizes: string[];
  style: string;
  price: number;
  installments: number;
  currencyId: string;
  currencyFormat: string;
  isFreeShipping: boolean;
}

export interface ICartProduct extends IProduct {
  quantity: number;
}

export interface ICartTotal {
  productQuantity: number;
  installments: number;
  totalPrice: number;
  currencyId: string;
  currencyFormat: string;
}

export interface IGetProductsResponse {
  data: {
    products: IProduct[];
  };
}
