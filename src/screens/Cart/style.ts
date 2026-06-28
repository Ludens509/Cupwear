import styled from 'styled-components';

const cartSvgIcon = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ececec' d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h11v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.45 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E")`;

export const CartButton = styled.button`
  border: 0;
  padding: 0;
  width: 50px;
  height: 50px;
  color: #ececec;
  background-color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  line-height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 2;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
  }

  &:hover {
    filter: brightness(85%);
  }
`;

interface IContainer {
  $isOpen: boolean;
}
export const Container = styled.div<IContainer>`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  box-sizing: border-box;
  z-index: 99;

  transition: right 0.2s;

  ${CartButton} {
    left: ${({ $isOpen }) => ($isOpen ? '0' : '-50px')};
    background-color: ${({ theme, $isOpen }) =>
      $isOpen ? theme.colors.black : theme.colors.primary};
  }

  @media only screen and (min-width: ${({ theme: { breakpoints } }) =>
      breakpoints.tablet}) {
    width: 450px;
    right: ${({ $isOpen }) => ($isOpen ? '0' : '-450px')};

    ${CartButton} {
      left: -50px;
    }
  }
`;

interface ICartIcon {
  $large?: boolean;
}
export const CartIcon = styled.div<ICartIcon>`
  width: ${({ $large }) => ($large ? '60px' : '50px')};
  height: ${({ $large }) => ($large ? '60px' : '50px')};
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
  background-image: ${cartSvgIcon};
  background-repeat: no-repeat;
  background-size: 50%;
  background-position: center;
`;

export const CartQuantity = styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  color: #0c0b10;
  font-weight: bold;
  font-size: 0.7em;
  text-align: center;
  line-height: 18px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary};
  position: absolute;
  bottom: 0;
  right: 5px;
`;

export const CartContent = styled.div`
  height: 100%;
  overflow-y: scroll;

  /* MAC scrollbar para desktop*/
  @media screen and (min-width: 640px) {
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 10px;
      background-color: rgba(0, 0, 0, 0.2);
      padding: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: #0c0b10;
    }
  }
`;

export const CartContentHeader = styled.div`
  color: #ececec;
  box-sizing: border-box;
  text-align: center;
  padding: 45px 0;
`;

export const HeaderTitle = styled.span`
  font-weight: bold;
  font-size: 1.2em;
  vertical-align: middle;
`;

export const Sub = styled.p`
  width: 20%;
  color: #5b5a5e;
  vertical-align: middle;
  display: inline-block;
`;

export const SubPrice = styled.div`
  width: 80%;
  text-align: right;
  color: #5b5a5e;
  vertical-align: middle;
  display: inline-block;
`;

export const SubPriceValue = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 22px;
  margin: 0;
`;

export const SubPriceInstallment = styled.p`
  margin: 0;
`;

export const CheckoutButton = styled.button`
  width: 100%;
  border: 0;
  color: #ececec;
  text-transform: uppercase;
  background-color: #0c0b10;
  text-align: center;
  padding: 15px 0;
  margin-top: 40px;
  cursor: pointer;
  outline: none;

  transition: background-color 0.2s;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
  }

  &:hover {
    background-color: #000;
  }
`;

export const CartFooter = styled.div`
  box-sizing: border-box;
  padding: 5%;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 200px;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.primary};

  &::before {
    content: '';
    width: 100%;
    height: 20px;
    display: block;
    position: absolute;
    top: -20px;
    left: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent);
  }
`;
