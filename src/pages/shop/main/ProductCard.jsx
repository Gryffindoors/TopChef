import { useState } from "react";
import { Link } from "react-router";
import { ShoppingBasket, Eye } from "lucide-react";
import OrderModal from "../../../components/order/OrderModal"; // Adjust path as needed

export default function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);

  const hasOffer =
    product.is_offer &&
    product.price_offer &&
    Number(product.price_offer) < Number(product.price_regular);

  return (
    <>
      <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl transition-transform hover:scale-[1.02] duration-300 group" dir="rtl">
        
        {/* Top Section: Name & Badge */}
        <div className="relative">
          {hasOffer && (
            <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[10px] font-black italic px-2 py-1 rounded-lg shadow-lg animate-pulse">
              OFFER
            </div>
          )}
          
          <Link to={`/product/${product.id}`} className="block aspect-square bg-black overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
          </Link>
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-3">
          <h3 className="text-right font-black text-gray-100 text-lg leading-tight truncate">
            {product.name}
          </h3>

          {/* Price Display */}
          <div className="flex flex-col items-start min-h-13">
            {hasOffer ? (
              <>
                <span className="text-xs text-neutral-500 line-through decoration-red-900/50">
                  {product.price_regular} ج.م
                </span>
                <span className="text-xl font-mono font-black text-red-500 tracking-tighter">
                  {product.price_offer} <span className="text-[10px] font-sans">ج.م</span>
                </span>
              </>
            ) : (
              <span className="text-xl font-mono font-black text-gray-200 pt-4">
                {product.price_regular} <span className="text-[10px] font-sans">ج.م</span>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex-2 bg-red-600 hover:bg-red-500 text-white font-black py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-900/20"
            >
              <ShoppingBasket size={18} />
              <span>اطلب</span>
            </button>

            <Link
              to={`/product/${product.id}`}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-gray-300 flex items-center justify-center rounded-xl transition-colors border border-white/5"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Render Modal if showModal is true */}
      {showModal && (
        <OrderModal 
          product={product} 
          close={() => setShowModal(false)} 
        />
      )}
    </>
  );
}