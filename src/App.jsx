import { Routes, Route } from "react-router"

import Navbar from "./components/navbar"
import Home from "./pages/shop/home"
import MainShopPage from "./pages/shop/main/MainShopPage"
import MenuPage from "./pages/shop/MenuPage"
import ProductPage from "./pages/shop/ProductPage"

import CartDrawer from "./components/order/CartDrawer"
import FlyingItem from "./components/order/FlyingItem"
import LoginPage from "./pages/admin/LoginPage"
import ProductAdminPage from "./pages/admin/ProductAdminPage"
import ProtectedRoute from "./api/ProtectedRoute"

function App() {
  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<MainShopPage />} />

        <Route path="/menu" element={<MenuPage />} />

        <Route path="/product/:id" element={<ProductPage />} />

      </Routes>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <ProductAdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <CartDrawer />
      <FlyingItem />

    </div>
  )
}

export default App