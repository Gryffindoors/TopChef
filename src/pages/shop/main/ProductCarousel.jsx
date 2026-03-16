import { useEffect, useRef } from "react"
import ProductCard from "./ProductCard"

export default function ProductCarousel({ products }) {
  const scrollRef = useRef(null)

  // Smooth hint animation using native scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el || products.length < 2) return

    const timer = setTimeout(() => {
      // Scroll slightly to the left (negative for RTL) to show more items
      el.scrollTo({ left: -100, behavior: "smooth" })

      setTimeout(() => {
        el.scrollTo({ left: 0, behavior: "smooth" })
      }, 800)
    }, 1200)

    return () => clearTimeout(timer)
  }, [products.length])

  if (!products.length) {
    return (
      <div className="text-center text-neutral-400 py-10">
        لا توجد منتجات
      </div>
    )
  }

  return (
    <div className="relative w-full mt-6">
      {/* Native CSS Carousel:
          - overflow-x-auto: enables horizontal scroll
          - snap-x snap-mandatory: forces cards to stop perfectly in view
          - no-scrollbar: utility to hide scrollbar (optional)
      */}
      <div 
        ref={scrollRef}
        className="
          flex 
          overflow-x-auto 
          snap-x 
          snap-mandatory 
          scroll-smooth 
          pb-4
          gap-4
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
        "
        dir="rtl"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="
              flex-[0_0_75%] 
              sm:flex-[0_0_45%]
              lg:flex-[0_0_22%]
              snap-start
              snap-always
            "
          >
            <ProductCard product={product} />
          </div>
        ))}
        
        {/* Invisible spacer to ensure padding-left/right is respected in the scroll */}
        <div className="flex-[0_0_1px] invisible" />
      </div>
    </div>
  )
}