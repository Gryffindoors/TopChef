import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DataProvider } from './data/dataProvider.jsx'
import { CartProvider } from './pages/shop/cartProvider.jsx'
import { OrderModalProvider } from './components/order/orderModalProvider.jsx'
import { BrowserRouter, HashRouter } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <DataProvider>
        <CartProvider>
          <OrderModalProvider>
            <App />
          </OrderModalProvider>
        </CartProvider>
      </DataProvider>
    </HashRouter>
  </StrictMode>,
)
