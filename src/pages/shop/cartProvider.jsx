import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([])


  /* LOAD CART */

  useEffect(() => {

    const savedCart = localStorage.getItem("cart")

    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

  }, [])


  /* SAVE CART */

  useEffect(() => {

    localStorage.setItem("cart", JSON.stringify(cartItems))

  }, [cartItems])


  /* ADD ITEM */

  function addToCart(item) {

    setCartItems(prev => {

      const existing = prev.find(
        p =>
          p.id === item.id &&
          p.quantityLabel === item.quantityLabel
      )

      if (existing) return prev

      return [...prev, item]

    })

  }


  /* REMOVE ITEM */

  function removeFromCart(index) {

    setCartItems(prev => prev.filter((_, i) => i !== index))

  }


  /* CLEAR CART */

  function clearCart() {
    setCartItems([])
  }


  /* DERIVED DATA */

  const cartCount = cartItems.length

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price,
    0
  )


  return (

    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >

      {children}

    </CartContext.Provider>

  )

}


export function useCart() {
  return useContext(CartContext)
}