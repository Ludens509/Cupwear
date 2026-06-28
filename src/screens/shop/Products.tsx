import type { IProduct } from '../../types';
import Product from './Product';

interface IProps {
  products: IProduct[];
}

const Products = ({ products }: IProps) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', padding: '0 15px' }}>
    {products?.map((p) => <Product key={p.sku} product={p} />)}
  </div>
);

export default Products;
