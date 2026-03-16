import { useState } from "react"
import { useData } from "../../../data/dataProvider"
import ProductFilters from "./ProductFilters"
import { useProductFilters } from "./useProductFilters"
import ProductCarousel from "./ProductCarousel"

export default function MainShopPage() {

  const { products, loading } = useData()

  const [category, setCategory] = useState("all")
  const [subcategory, setSubcategory] = useState("all")
  const [offersOnly, setOffersOnly] = useState(false)

  const filteredProducts = useProductFilters(
    products,
    category,
    subcategory,
    offersOnly
  )

  if (loading) return <div>Loading...</div>

  return (
    <div className="container">

      <ProductFilters
        products={products}
        category={category}
        setCategory={setCategory}
        subcategory={subcategory}
        setSubcategory={setSubcategory}
        offersOnly={offersOnly}
        setOffersOnly={setOffersOnly}
      />

      {/* carousel goes here */}
      <ProductCarousel products={filteredProducts} />

    </div>
  )
}