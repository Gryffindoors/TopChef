export function useProductFilters(products, category, subcategory, offersOnly) {
  return products.filter((product) => {
    if (!product.active) return false

    if (category !== "all" && product.category !== category) return false

    if (subcategory !== "all" && product.subcategory !== subcategory) return false

    if (offersOnly && !product.is_offer) return false

    return true
  })
}