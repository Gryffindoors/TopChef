import { useEffect, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import ProductCard from "./ProductCard"

export default function ProductCarousel({ products }) {
  // Added duration to the global options to smooth out all programmatic scrolls
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
    direction: "rtl",
    duration: 30, // Default is 25, 30-35 makes it feel weightier and smoother
  })

  const hintPlayed = useRef(false)

  // Smooth hint animation
  useEffect(() => {
    if (!emblaApi || hintPlayed.current || products.length < 2) return

    const timer = setTimeout(() => {
      // scrollNext(false) ensures it uses the animation duration
      emblaApi.scrollNext(false)

      setTimeout(() => {
        emblaApi.scrollPrev(false)
        hintPlayed.current = true
      }, 900) // Space out the movements so they don't overlap

    }, 1200)

    return () => clearTimeout(timer)
  }, [emblaApi, products.length])

  if (!products.length) {
    return (
      <div className="text-center text-neutral-400 py-10">
        لا توجد منتجات
      </div>
    )
  }

  return (
    /* added 'w-full' and 'relative' to ensure the viewport has a reference point */
    <div className="overflow-hidden mt-6 w-full relative" ref={emblaRef}>
      
      {/* The 'flex' container. 
         Using -ml-4 (or -mr-4 for RTL) and ml-4 on items is the safest way 
         to handle gaps in Embla without breaking the loop logic.
      */}
      <div className="flex touch-pan-y">
        {products.map((product) => (
          <div
            key={product.id}
            className="
              relative
              min-w-0 
              flex-[0_0_85%] 
              sm:flex-[0_0_50%]
              lg:flex-[0_0_25%]
              px-2
            "
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}