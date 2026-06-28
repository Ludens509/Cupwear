import { createContext, useContext, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

import type { IProduct } from '../../types';

export interface IProductsContext {
  isFetching: boolean;
  setIsFetching(state: boolean): void;
  products: IProduct[];
  setProducts(products: IProduct[]): void;
  filters: string[];
  setFilters(filters: string[]): void;
}

const ProductsContext = createContext<IProductsContext | undefined>(undefined);
const useProductsContext = (): IProductsContext => {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      'useProductsContext must be used within a ProductsProvider'
    );
  }

  return context;
};

const ProductsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filters, setFilters] = useState<string[]>([]);

  const ProductContextValue: IProductsContext = {
    isFetching,
    setIsFetching,
    products,
    setProducts,
    filters,
    setFilters,
  };

  return <ProductsContext.Provider value={ProductContextValue}>{children}</ProductsContext.Provider>;
};

export { ProductsProvider, useProductsContext };
