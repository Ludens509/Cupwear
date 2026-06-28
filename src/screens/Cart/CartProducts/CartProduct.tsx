import type { ICartProduct } from '../../../types';
import useCart from '../../../contexts/cartContext/useCart';
import formatPrice from '../../../utils/fortmatPrice/formatPrice';

import * as S from './style';

interface IProps {
  product: ICartProduct;
}

const CartProduct = ({ product }: IProps) => {
  const { removeProduct, increaseProductQuantity, decreaseProductQuantity } = useCart();
  const { sku, title, price, currencyFormat, currencyId, quantity } = product;

  return (
    <S.ProductWrapper>
      <S.ProductImage $sku={sku} />
      <S.ProductDetails>
        <S.ProductTitle>{title}</S.ProductTitle>
        <S.ProductPrice>{currencyFormat}{formatPrice(price, currencyId)}</S.ProductPrice>
        <S.ProductControls>
          <S.QtyButton onClick={() => decreaseProductQuantity(product)}>-</S.QtyButton>
          <S.QtyValue>{quantity}</S.QtyValue>
          <S.QtyButton onClick={() => increaseProductQuantity(product)}>+</S.QtyButton>
          <S.RemoveButton onClick={() => removeProduct(product)}>Remove</S.RemoveButton>
        </S.ProductControls>
      </S.ProductDetails>
    </S.ProductWrapper>
  );
};

export default CartProduct;
