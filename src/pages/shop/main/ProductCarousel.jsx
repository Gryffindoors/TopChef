import { useEffect, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import ProductCard from "./ProductCard"

export default function ProductCarousel({ products }) {
  // Added 'watchSlides' to help Embla track dynamic changes for the loop
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
    direction: "rtl",
    containScroll: false // Vital for infinite loops to prevent snapping to ends
  })

  const hintPlayed = useRef(false)

  // Smooth hint animation
  useEffect(() => {
    if (!emblaApi || hintPlayed.current || products.length < 2) return

    const timer = setTimeout(() => {
      // scrollNext(jump) - using false for jump ensures animation
      // We use a custom duration for the hint to make it elegant
      emblaApi.scrollNext() 

      setTimeout(() => {
        emblaApi.scrollPrev()
        hintPlayed.current = true
      }, 1800) // Increased delay to allow the first move to finish

    }, 1000)

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
    <div className="overflow-hidden mt-6" ref={emblaRef}>
      {/* Note: Embla requires the 'flex' container to be the direct child of the ref.
          The 'flex' property on items handles the width.
      */}
      <div className="flex -mr-4"> {/* Negative margin to offset item padding */}
        {products.map((product) => (
          <div
            key={product.id}
            className="
              flex-[0_0_80%] 
              sm:flex-[0_0_50%]
              lg:flex-[0_0_25%]
              pr-4 
            "
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}