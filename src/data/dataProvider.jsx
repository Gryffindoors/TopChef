import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { getProducts } from "../api/supabase"

const DataContext = createContext()

export function DataProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) // Added error state

  const loadProducts = useCallback(async (isMounted = true) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getProducts()
      
      if (isMounted) {
        setProducts(data || [])
      }
    } catch (err) {
      if (isMounted) {
        setError("فشل تحميل البيانات. حاول مرة أخرى.")
        console.error("Supabase Error:", err)
      }
    } finally {
      if (isMounted) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    loadProducts(isMounted)
    
    return () => { isMounted = false } // Cleanup to prevent memory leaks
  }, [loadProducts])

  return (
    <DataContext.Provider
      value={{
        products,
        loading,
        error, // Now components can show an error message
        reloadProducts: () => loadProducts(true)
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}