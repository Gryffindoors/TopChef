import { Routes, Route, useLocation } from "react-router";
import Navbar from "./components/navbar";
import Home from "./pages/shop/home";
import MainShopPage from "./pages/shop/main/MainShopPage";
import MenuPage from "./pages/shop/MenuPage";
import ProductPage from "./pages/shop/ProductPage";

import CartDrawer from "./components/order/CartDrawer";
import FlyingItem from "./components/order/FlyingItem";
import LoginPage from "./pages/admin/LoginPage";
import ProductAdminPage from "./pages/admin/ProductAdminPage";
import ProtectedRoute from "./api/ProtectedRoute";

function App() {
  const location = useLocation();
  
  // Check if we are in the admin section
  const isAdmin = location.pathname.startsWith("/admin") || location.pathname.startsWith("/login");

  return (
    <div className={`min-h-screen ${isAdmin ? "bg-zinc-950" : "bg-black"} text-white`}>
      {/* Only show Shop Navbar if NOT in admin mode */}
      {!isAdmin && <Navbar />}

      <Routes>
        {/* SHOP SPA ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<MainShopPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/product/:id" element={<ProductPage />} />

        {/* ADMIN SPA ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <ProductAdminPage />
            </ProtectedRoute>
          }
        />

        {/* CATCH ALL - Redirect unknown to Home */}
        <Route path="*" element={<Home />} />
      </Routes>

      {/* Only show Shop overlays if NOT in admin mode */}
      {!isAdmin && (
        <>
          <CartDrawer />
          <FlyingItem />
        </>
      )}
    </div>
  );
}

export default App;