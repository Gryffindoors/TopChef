import { useEffect, useRef } from "react"
import ProductForm from "./ProductForm"

/**
 * ProductModal: Refactored for inline/accordion use.
 * Now acts as a container that slides into view.
 */
export default function ProductModal({ product, onSave, onClose }) {
  const modalRef = useRef()

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div
      ref={modalRef}
      dir="rtl"
      className="w-full overflow-hidden bg-neutral-900/50 md:rounded-3xl rounded-xl border border-white/10 shadow-2xl animate-fade-in my-4"
    >
      <div className="md:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1" />
      <div className="p-6">
        <ProductForm product={product} onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  )
}