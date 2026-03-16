import { createContext, useContext, useState } from "react"
import OrderModal from "./OrderModal"

const OrderModalContext = createContext()

export function OrderModalProvider({ children }) {

  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState(null)

  function openOrderModal(productData) {
    setProduct(productData)
    setIsOpen(true)
  }

  function closeOrderModal() {
    setIsOpen(false)
    setProduct(null)
  }

  return (
    <OrderModalContext.Provider
      value={{ openOrderModal }}
    >
      {children}

      {isOpen && (
        <OrderModal
          product={product}
          close={closeOrderModal}
        />
      )}

    </OrderModalContext.Provider>
  )
}

export function useOrderModal() {
  return useContext(OrderModalContext)
}