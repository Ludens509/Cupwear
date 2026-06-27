import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './routes/router.tsx';
import { ProductsProvider } from './contexts/products-context/index.tsx';
import { CartProvider } from './contexts/cartContext/index.tsx';
import { AuthProvider } from './contexts/authContext/index.ts';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <AppRouter />
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
