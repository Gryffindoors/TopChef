import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

import ProductTable from "../../components/admin/ProductTable"
import ProductModal from "../../components/admin/ProductModal"

import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../../api/supabase"

export default function ProductAdminPage() {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")

  // Inside ProductAdminPage component
  const [showOffersOnly, setShowOffersOnly] = useState(false);

  // modalOpen is used specifically for the "Add New" inline form
  const [modalOpen, setModalOpen] = useState(false)
  // editingProduct stores the product object when editing a specific row
  const [editingProduct, setEditingProduct] = useState(null)

  /* -------------------------
      LOAD PRODUCTS
  -------------------------- */
  async function loadProducts() {
    try {
      setLoading(true)
      const result = await getAdminProducts(1, 100)
      setProducts(result.products)
      setFilteredProducts(result.products)
    } catch (err) {
      console.error(err)
      setError("فشل تحميل المنتجات")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  /* -------------------------
      SEARCH
  -------------------------- */
  /* -------------------------
    SEARCH & FILTER LOGIC
-------------------------- */
  useEffect(() => {
    let filtered = [...products];

    // Apply Offer Filter
    if (showOffersOnly) {
      filtered = filtered.filter(p => p.is_offer);
    }

    // Apply Search Term Filter
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.subcategory?.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  }, [search, products, showOffersOnly]);

  /* -------------------------
      HANDLERS
  -------------------------- */
  function handleAdd() {
    // If we were editing a row, close it first
    setEditingProduct(null)
    setModalOpen(!modalOpen)
  }

  function handleEdit(product) {
    // If the same product is clicked again, close it (toggle)
    if (editingProduct?.id === product.id) {
      setEditingProduct(null)
    } else {
      // Close "Add New" form if it's open
      setModalOpen(false)
      setEditingProduct(product)
    }
  }

  function handleClose() {
    setModalOpen(false)
    setEditingProduct(null)
  }

  async function handleSave(data) {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data)
      } else {
        await createProduct(data)
      }
      await loadProducts()
      handleClose()
    } catch (err) {
      console.error(err)
      alert("فشل حفظ المنتج")
    }
  }

  async function handleDelete(product) {
    const confirmDelete = confirm(`حذف المنتج: ${product.name} ؟`)
    if (!confirmDelete) return

    try {
      await deleteProduct(product.id)
      await loadProducts()
    } catch (err) {
      console.error(err)
      alert("فشل حذف المنتج")
    }
  }

  function logout() {
    localStorage.removeItem("adminAuth")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-red-500/30" dir="rtl">
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 rounded-full block"></span>
              إدارة المنتجات
            </h1>
            <p className="text-neutral-500 text-xs mt-1 mr-4">تحديث المخزون والأسعار مباشرة</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 ${modalOpen
                ? "bg-white/10 text-white"
                : "bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-900/20"
                }`}
            >
              {modalOpen ? "إغلاق النموذج" : "إضافة منتج جديد"}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 transition-colors"
            >
              خروج
            </button>
          </div>
        </div>

        {/* INLINE ADD FORM - Slides down under header */}
        {modalOpen && (
          <div className="max-w-4xl mx-auto px-4 pb-6 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-neutral-900/40 rounded-3xl border border-white/5 p-1">
              <ProductModal
                product={null}
                onSave={handleSave}
                onClose={handleClose}
              />
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* SEARCH BAR */}
          <div className="relative group flex-1 max-w-md">
            <input
              type="text"
              placeholder="ابحث بالاسم أو الفئة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pr-10 rounded-2xl bg-white/5 border border-white/10 focus:border-red-600/50 focus:ring-4 focus:ring-red-600/10 outline-none transition-all placeholder:text-neutral-600 text-white"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </span>
          </div>

          {/* OFFERS FILTER TOGGLE */}
          <button
            onClick={() => setShowOffersOnly(!showOffersOnly)}
            className={`
      flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all font-bold text-sm
      ${showOffersOnly
                ? "bg-red-600/10 border-red-600/50 text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
                : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
              }
    `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            العروض فقط
          </button>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-neutral-900/20 rounded-3xl border border-white/5 overflow-hidden">
          <ProductTable
            products={filteredProducts}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            // Props for inline row editing
            editingProduct={editingProduct}
            onSave={handleSave}
            onClose={handleClose}
          />
        </div>
      </main>
    </div>
  )
}