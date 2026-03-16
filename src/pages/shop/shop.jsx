import { useEffect, useState } from "react"
import { useData } from "../../data/dataProvider"

export default function Shop() {

  const { products, categories, loading } = useData()

  const [subcategories, setSubcategories] = useState([])

  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [selectedSubcategory, setSelectedSubcategory] = useState("الكل")

  const [offersOnly, setOffersOnly] = useState(false)



  /* ------------------------
     BUILD SUBCATEGORIES
     (from products instead of API)
  ------------------------- */

  useEffect(() => {

    if (selectedCategory === "الكل") {
      setSubcategories([])
      setSelectedSubcategory("الكل")
      return
    }

    const subs = [
      ...new Set(
        products
          .filter(p => p.category === selectedCategory)
          .map(p => p.subcategory)
          .filter(Boolean)
      )
    ]

    setSubcategories(subs)

  }, [selectedCategory, products])



  /* ------------------------
     FILTER LOGIC
  ------------------------- */

  const filteredProducts = products.filter(product => {

    if (!product.active) return false

    if (selectedCategory !== "الكل" && product.category !== selectedCategory)
      return false

    if (
      selectedSubcategory !== "الكل" &&
      product.subcategory !== selectedSubcategory
    )
      return false

    if (offersOnly && !product.is_offer)
      return false

    return true

  })



  /* ------------------------
     OFFER TOGGLE
  ------------------------- */

  function toggleOffers() {
    setOffersOnly(prev => !prev)
  }



  /* ------------------------
     RENDER
  ------------------------- */

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        جاري تحميل المنتجات...
      </div>
    )
  }



  return (

    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* CATEGORIES */}

      <div className="mb-6">

        <h2 className="text-xl mb-4">الفئات</h2>

        <div className="flex gap-3 flex-wrap">

          {["الكل", ...(categories || [])].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat)
                setSelectedSubcategory("الكل")
              }}
              className={`px-4 py-1 rounded
              ${selectedCategory === cat ? "bg-red-600" : "bg-neutral-800"}
              `}
            >
              {cat}
            </button>

          ))}

        </div>

      </div>



      {/* SUBCATEGORIES */}

      {subcategories.length > 0 && (

        <div className="mb-6">

          <h2 className="text-xl mb-4">الأنواع</h2>

          <div className="flex gap-3 flex-wrap">

            {["الكل", ...subcategories].map(sub => (

              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-4 py-1 rounded
                ${selectedSubcategory === sub ? "bg-red-600" : "bg-neutral-800"}
                `}
              >
                {sub}
              </button>

            ))}

          </div>

        </div>

      )}



      {/* OFFERS SWITCH */}

      <div className="mb-8">

        <button
          onClick={toggleOffers}
          className="bg-red-700 px-4 py-2 rounded"
        >
          {offersOnly ? "عرض الكل" : "العروض"}
        </button>

      </div>



      {/* PRODUCTS */}

      <div>

        <h2 className="text-xl mb-4">
          المنتجات ({filteredProducts.length})
        </h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filteredProducts.map(product => (

            <div
              key={product.id}
              className="bg-neutral-900 rounded-xl p-4"
            >

              <img
                src={product.image_url}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <h3 className="font-semibold">
                {product.name}
              </h3>

              <p className="text-gray-400 text-sm">
                {product.price_regular} جنيه
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}