import { useEffect } from 'react';

import Loader from '../Loader';
import PageLayout from '../layout/PageLayout';

import Filter from '../Filter';
import Products from '../../screens/shop/Products';
import Cart from '../../screens/Cart/Cart';

import { useProducts } from '../../contexts/products-context';

import * as S from './style';

function App() {
  const { isFetching, products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <PageLayout>
      <S.Container>
        {isFetching && <Loader />}

        <S.TwoColumnGrid>
          <S.Side>
            <Filter />
          </S.Side>
          <S.Main>
            <S.MainHeader>
              <p>{products?.length} Product(s) found</p>
            </S.MainHeader>
            <Products products={products} />
          </S.Main>
        </S.TwoColumnGrid>
        <Cart />
      </S.Container>
    </PageLayout>
  );
}

export default App;
