import { useEffect, useState } from "react"

export default function FlyingItem() {

  const [image, setImage] = useState(null)

  useEffect(() => {

    function fly(e) {

      setImage(e.detail.image)

      setTimeout(() => setImage(null), 700)

    }

    window.addEventListener("cart-fly", fly)

    return () => window.removeEventListener("cart-fly", fly)

  }, [])

  if (!image) return null

  return (
    <img
      src={image}
      className="fixed bottom-24 right-10 w-16 h-16 rounded-lg object-cover pointer-events-none animate-flyToCart z-100"
    />
  )

}