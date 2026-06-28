import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  min-height: 280px;
  padding-bottom: 200px;
`;

export const CartProductsEmpty = styled.p`
  color: #ececec;
  text-align: center;
  line-height: 40px;
`;

export const ProductWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 5%;
  border-bottom: 1px solid #2a2a2a;
  gap: 10px;
`;

interface IProductImage {
  $sku: number;
}
export const ProductImage = styled.div<IProductImage>`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  background-image: ${({ $sku }) => `url(/static/products/${$sku}-1-cart.webp)`};
  background-size: cover;
  background-position: center;
  background-color: #eee;
`;

export const ProductDetails = styled.div`
  flex: 1;
  color: #ececec;
`;

export const ProductTitle = styled.p`
  margin: 0 0 4px;
  font-size: 0.85em;
`;

export const ProductPrice = styled.small`
  color: #9c9b9b;
`;

export const ProductControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;

export const QtyButton = styled.button`
  background: none;
  border: 1px solid #444;
  color: #ececec;
  width: 22px;
  height: 22px;
  cursor: pointer;
  line-height: 20px;
  text-align: center;
`;

export const QtyValue = styled.span`
  color: #ececec;
  font-size: 0.85em;
  min-width: 16px;
  text-align: center;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #9c9b9b;
  cursor: pointer;
  margin-left: auto;
  font-size: 0.8em;

  &:hover {
    color: #ff4444;
  }
`;
