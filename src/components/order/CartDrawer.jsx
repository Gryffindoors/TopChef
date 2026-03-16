import { useEffect, useRef, useState } from "react"
import { X, Trash2, User, Phone, MapPin } from "lucide-react"
import { useCart } from "../../pages/shop/cartProvider"

export default function CartDrawer() {
  const { cartItems = [], removeFromCart, clearCart } = useCart() || {}
  const [open, setOpen] = useState(false)
  
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    address: ""
  })

  const [dragY, setDragY] = useState(0)
  const [startY, setStartY] = useState(null)
  const drawerRef = useRef(null)

  useEffect(() => {
    function openDrawer() { setOpen(true) }
    window.addEventListener("open-cart", openDrawer)
    return () => window.removeEventListener("open-cart", openDrawer)
  }, [])

  function handleTouchStart(e) { setStartY(e.touches[0].clientY) }
  function handleTouchMove(e) {
    if (startY === null) return
    const currentY = e.touches[0].clientY
    const delta = currentY - startY
    if (delta > 0) setDragY(Math.min(delta, 320))
  }
  function handleTouchEnd() {
    if (dragY > 120) setOpen(false)
    setDragY(0)
    setStartY(null)
  }

  const normalizeDigits = (str) => {
    return str.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[0-9]/g, (d) => d);
  }

  const total = cartItems.length ? cartItems.reduce((sum, item) => sum + item.price, 0) : 0

  /* WhatsApp order */
  function sendWhatsAppOrder() {
    if (!cartItems.length) return
    if (!userData.name || !userData.phone || !userData.address) {
      alert("يرجى إكمال بيانات التوصيل")
      return
    }

    const cleanPhone = normalizeDigits(userData.phone)
    
    let message = `*طلب جديد من موقع توب شيف*%0A%0A`
    message += `*العميل:* ${userData.name}%0A`
    message += `*التليفون:* ${cleanPhone}%0A`
    message += `*العنوان:* ${userData.address}%0A%0A`
    message += `*الطلبات:*%0A`

    cartItems.forEach((item, i) => {
      // Corrected: using the keys passed by the modal
      message += `${i + 1}- ${item.name} (${item.quantity} ${item.unit || "كجم"})%0A`
    })

    // Updated: Removed "التقريبي"
    message += `%0A*الإجمالي:* ${total} جنيه`

    const url = `https://wa.me/201002650740?text=${message}`
    window.open(url, "_blank")

    // Timer: Clear basket after 1 minute
    setTimeout(() => {
      clearCart();
    }, 60000);
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />}

      <div
        ref={drawerRef}
        className="fixed bottom-0 left-0 w-full bg-neutral-900 rounded-t-2xl shadow-2xl z-50 transition-transform duration-300 ease-out"
        style={{ transform: open ? `translateY(${dragY}px)` : "translateY(100%)", touchAction: "none" }}
      >
        <div className="max-w-3xl mx-auto p-5 pb-8">
          <div className="w-12 h-1.5 bg-gray-500 rounded-full mx-auto mb-4 cursor-grab" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} />

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold">تأكيد الطلب</h2>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><X size={22} /></button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1" style={{ touchAction: "pan-y" }}>
            {cartItems.length > 0 && (
              <div className="bg-neutral-800/50 p-4 rounded-xl space-y-3 mb-6 border border-white/5">
                <div className="relative">
                  <User className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="الاسم بالكامل"
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pr-10 pl-3 focus:border-red-600 outline-none text-sm"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input 
                    type="tel" 
                    placeholder="رقم الموبايل"
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pr-10 pl-3 focus:border-red-600 outline-none text-sm text-right"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 text-gray-500" size={18} />
                  <textarea 
                    placeholder="عنوان التوصيل بالتفصيل"
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pr-10 pl-3 focus:border-red-600 outline-none text-sm min-h-[60px]"
                    value={userData.address}
                    onChange={(e) => setUserData({...userData, address: e.target.value})}
                  />
                </div>
              </div>
            )}

            {cartItems.length === 0 ? (
              <p className="text-gray-400 text-center py-10">السلة فارغة</p>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-neutral-800 p-3 rounded-lg border border-white/5">
                  <img src={item.image} className="w-14 h-14 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    {/* Fixed: item is now correctly scoped within the map function */}
                    <p className="text-xs text-gray-400">{item.quantity} {item.unit || "كجم"}</p>
                  </div>
                  <div className="text-red-500 font-bold text-sm">{item.price} ج</div>
                  <button onClick={() => removeFromCart(index)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي</span>
                <span className="text-red-500">{total} جنيه</span>
              </div>
              <button
                onClick={sendWhatsAppOrder}
                className="w-full bg-red-700 hover:bg-red-800 py-3 rounded-xl font-bold shadow-lg shadow-red-900/20 active:scale-[0.98] transition-all"
              >
                إرسال الطلب عبر واتساب
              </button>
              <button onClick={clearCart} className="w-full text-gray-500 hover:text-gray-300 text-xs py-2">
                مسح محتويات السلة
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}