import { useState, useMemo, useRef, useEffect } from "react";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "../../pages/shop/cartProvider";
import { X, ShoppingBasket, Edit3, PlusCircle } from "lucide-react";

const UNIT_MAP = { kg: "كيلو", tray: "طبق", piece: "قطعة" };

export default function OrderModal({ product, close }) {
  // 1. Correct destructuring to match your provider's variable name: cartItems
  const { cartItems = [], addToCart } = useCart() || {}; 

  const modalRef = useRef(null);
  
  const isKilo = !product.unit || product.unit === "kg";
  const step = isKilo ? 0.25 : 1;
  const minAmount = step; 

  // 2. Search using cartItems
  const existingItem = useMemo(() => {
    if (!Array.isArray(cartItems)) return null; 
    return cartItems.find(
      (item) => item.id === product.id && item.unit === (product.unit || "kg")
    );
  }, [cartItems, product.id, product.unit]);

  // 3. State initialization
  const [quantity, setQuantity] = useState(existingItem ? existingItem.quantity : minAmount);

  // 4. Sync state if cartItems loads after modal opens (hydration safety)
  useEffect(() => {
    if (existingItem) {
      setQuantity(existingItem.quantity);
    }
  }, [existingItem]);

  const activePrice = Number(
    product.is_offer && product.price_offer > 0 
      ? product.price_offer 
      : product.price_regular
  ) || 0;

  const totalPrice = useMemo(() => {
    return (activePrice * quantity).toFixed(2);
  }, [activePrice, quantity]);

  // Handle Close on Outside Click
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) close();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  function handleAdd() {
    addToCart({
      id: product.id,
      name: product.name,
      unit: product.unit || "kg",
      quantity: Number(quantity),
      price: activePrice,
      image: product.image_url
    });

    window.dispatchEvent(new CustomEvent("cart-fly", { detail: { image: product.image_url } }));
    close();
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4" dir="rtl">
      <div ref={modalRef} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95">
        
        {/* Header Image with "Editing" Badge */}
        <div className="relative h-44 bg-neutral-800">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover opacity-80" />
          
          {existingItem && (
            <div className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Edit3 size={12} />
              تعديل في السلة
            </div>
          )}

          <button onClick={close} className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white cursor-pointer hover:bg-red-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white mb-2">{product.name}</h2>
            <p className="text-xs text-gray-500 font-bold">
              {existingItem 
                ? `لديك ${existingItem.quantity} ${UNIT_MAP[product.unit] || 'كيلو'} حالياً` 
                : "جزارة توب شيف - طازج يومياً"}
            </p>
          </div>

          <div className="bg-neutral-800/50 p-6 rounded-3xl border border-white/5 mb-8">
            <QuantitySelector
              unit={product.unit || "kg"}
              value={quantity}
              step={step}
              min={minAmount}
              onChange={setQuantity}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-4 py-4 bg-neutral-800 rounded-2xl border-r-4 border-red-600">
              <span className="text-gray-400 text-sm font-bold">الإجمالي التقديري</span>
              <div className="text-left">
                <span className="text-white font-black text-2xl font-mono italic">{totalPrice}</span>
                <span className="text-[10px] text-gray-500 mr-1 font-bold">ج.م</span>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className={`w-full font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl
                ${existingItem ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-red-600 text-white hover:bg-red-500 shadow-red-900/20"}`}
            >
              {existingItem ? <Edit3 size={22} /> : <PlusCircle size={22} />}
              <span className="text-lg">{existingItem ? "تحديث الكمية" : "إضافة للطلب"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}