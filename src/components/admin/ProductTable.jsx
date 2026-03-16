import ProductModal from "./ProductModal"
import React from "react"

export default function ProductTable({
  products,
  loading,
  error,
  onEdit,
  onDelete,
  // New props needed for inline rendering
  editingProduct,
  onSave,
  onClose
}) {

  if (loading) return <p className="p-4 text-gray-400">جاري تحميل المنتجات...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>
  if (!products.length) return <p className="p-4 text-gray-400">لا يوجد منتجات</p>

  return (
    <div className="overflow-x-auto">
      <table dir="rtl" className="w-full text-right border-collapse">
        <thead className="bg-neutral-800">
          <tr>
            <th className="p-3">الصورة</th>
            <th className="p-3">الاسم</th>
            <th className="p-3">الفئة</th>
            <th className="p-3">السعر</th>
            <th className="p-3">العرض</th>
            <th className="p-3">الحالة</th>
            <th className="p-3">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <React.Fragment key={product.id}>
              <tr className="border-b border-neutral-800 hover:bg-neutral-900 transition-colors">
                <td className="p-3">
                  {product.image_url ? (
                    <img src={product.image_url} className="w-14 h-14 object-cover rounded" alt="" />
                  ) : (
                    <div className="w-14 h-14 bg-neutral-700 rounded flex items-center justify-center text-xs">لا صورة</div>
                  )}
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.price_regular}</td>
                <td className="p-3">{product.is_offer ? product.price_offer : "-"}</td>
                <td className="p-3">
                  {product.active ? <span className="text-green-400">نشط</span> : <span className="text-red-400">متوقف</span>}
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => onEdit(product)} className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-500">تعديل</button>
                  <button onClick={() => onDelete(product)} className="bg-red-700 px-3 py-1 rounded text-sm hover:bg-red-600">حذف</button>
                </td>
              </tr>
              {/* Inline Edit Row */}
              <tr key={`${product.id}-edit`}>
                <td colSpan="7" className="p-0 border-none">
                  <div
                    className={`
        grid overflow-hidden
        transition-[grid-template-rows,opacity] duration-700 ease-in-out
        ${editingProduct?.id === product.id
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"}
      `}
                  >
                    <div className="overflow-hidden">
                      {editingProduct?.id === product.id && (
                        <div className="px-4 pb-4">
                          <ProductModal
                            product={product}
                            onSave={onSave}
                            onClose={onClose}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}