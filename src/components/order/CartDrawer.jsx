import { useEffect, useRef, useState } from "react"
import { X, Trash2 } from "lucide-react"
import { useCart } from "../../pages/shop/cartProvider"

export default function CartDrawer() {

  const { cartItems = [], removeFromCart, clearCart } = useCart() || {}

  const [open, setOpen] = useState(false)

  /* drag state */

  const [dragY, setDragY] = useState(0)
  const [startY, setStartY] = useState(null)

  const drawerRef = useRef(null)


  /* open cart from navbar */

  useEffect(() => {

    function openDrawer() {
      setOpen(true)
    }

    window.addEventListener("open-cart", openDrawer)

    return () => window.removeEventListener("open-cart", openDrawer)

  }, [])


  /* drag handlers */

  function handleTouchStart(e) {
    setStartY(e.touches[0].clientY)
  }

  function handleTouchMove(e) {

    if (startY === null) return

    const currentY = e.touches[0].clientY
    const delta = currentY - startY

    if (delta > 0) {
      setDragY(Math.min(delta, 320))
    }

  }

  function handleTouchEnd() {

    if (dragY > 120) {
      setOpen(false)
    }

    setDragY(0)
    setStartY(null)

  }


  /* total */

  const total = cartItems.length
    ? cartItems.reduce((sum, item) => sum + item.price, 0)
    : 0


  /* WhatsApp order */

  function sendWhatsAppOrder() {

    if (!cartItems.length) return

    let message = "طلب جديد من موقع توب شيف:%0A%0A"

    cartItems.forEach((item, i) => {

      message += `${i + 1}- ${item.name} (${item.quantityLabel})%0A`

    })

    message += `%0Aالإجمالي التقريبي: ${total} جنيه`

    const url = `https://wa.me/201002650740?text=${message}`

    window.open(url, "_blank")

  }


  return (

    <>

      {/* overlay */}

      {open && (

        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />

      )}


      {/* drawer */}

      <div
        ref={drawerRef}
        className="
        fixed
        bottom-0
        left-0
        w-full
        bg-neutral-900
        rounded-t-2xl
        shadow-2xl
        z-50
        transition-transform
        duration-300
        ease-out
        touch-none
        "
        style={{
          transform: open
            ? `translateY(${dragY}px)`
            : "translateY(100%)"
        }}
      >

        <div className="max-w-3xl mx-auto p-5">


          {/* drag handle */}

          <div
            className="w-12 h-1.5 bg-gray-500 rounded-full mx-auto mb-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />


          {/* header */}

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-lg font-bold">
              طلبك
            </h2>

            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>

          </div>


          {/* empty state */}

          {cartItems.length === 0 && (

            <p className="text-gray-400 text-center py-10">
              السلة فارغة
            </p>

          )}


          {/* cart items */}

          <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">

            {cartItems.map((item, index) => (

              <div
                key={index}
                className="flex items-center gap-4 bg-neutral-800 p-3 rounded-lg"
              >

                <img
                  src={item.image}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">

                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-400">
                    {item.quantityLabel}
                  </p>

                </div>

                <div className="text-red-500 font-semibold">

                  {item.price} جنيه

                </div>


                <button
                  onClick={() => removeFromCart(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            ))}

          </div>


          {/* footer */}

          {cartItems.length > 0 && (

            <div className="mt-6 space-y-3">

              <div className="flex justify-between text-lg font-semibold">

                <span>الإجمالي</span>

                <span>{total} جنيه</span>

              </div>


              <button
                onClick={sendWhatsAppOrder}
                className="w-full bg-red-700 hover:bg-red-800 py-3 rounded-lg font-semibold"
              >
                إرسال الطلب عبر واتساب
              </button>


              <button
                onClick={clearCart}
                className="w-full bg-neutral-700 hover:bg-neutral-600 py-2 rounded-lg text-sm"
              >
                مسح السلة
              </button>


              {/* Continue shopping button */}

              {/*
              <button
                onClick={() => {
                  setOpen(false)
                  window.dispatchEvent(new Event("continue-shopping"))
                }}
                className="w-full text-sm text-gray-400 hover:text-white py-2"
              >
                متابعة التسوق
              </button>
              */}

            </div>

          )}

        </div>

      </div>

    </>

  )

}