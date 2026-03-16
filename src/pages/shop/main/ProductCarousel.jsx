import { useEffect, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import ProductCard from "./ProductCard"

export default function ProductCarousel({ products }) {

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
    direction: "rtl"
  })

  const hintPlayed = useRef(false)

  // Small hint animation so user knows carousel is swipeable
  useEffect(() => {
    if (!emblaApi || hintPlayed.current) return

    const timer = setTimeout(() => {
      emblaApi.scrollNext()

      setTimeout(() => {
        emblaApi.scrollPrev()
        hintPlayed.current = true
      }, 450)

    }, 700)

    return () => clearTimeout(timer)
  }, [emblaApi])

  if (!products.length) {
    return (
      <div className="text-center text-neutral-400 py-10">
        لا توجد منتجات
      </div>
    )
  }

  return (
    <div className="overflow-hidden mt-6" ref={emblaRef}>

      <div className="flex">

        {products.map((product) => (
          <div
            key={product.id}
            className="
              flex-[0_0_100%]
              lg:flex-[0_0_33.333%]
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