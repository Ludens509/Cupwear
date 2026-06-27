import axios from 'axios';
import type { IGetProductsResponse } from '../types';
import productsData from '../static/json/products.json';

export const getProducts = async () => {
  let response: IGetProductsResponse;

  if (import.meta.env.PROD) {
    response = await axios.get(
      'https://react-shopping-cart-67954.firebaseio.com/products.json'
    );
  } else {
    response = productsData as unknown as IGetProductsResponse;
  }

  const { products } = response.data || { products: [] };

  return products;
};
