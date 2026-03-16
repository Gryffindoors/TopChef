import { useState, useEffect } from "react"
import { uploadProductImage } from "../../api/supabase"

// Hardcoded options based on your JSON
const PRODUCT_OPTIONS = {
    "بقري": {
        unit: "kg",
        subcategories: ["قطعيات", "قطعيات_بالعظم"]
    },
    "ضاني": {
        unit: "kg",
        subcategories: ["قطعيات"]
    },
    "مصنعات_اللحوم": {
        unit: "kg",
        subcategories: ["مصنعات"]
    },
    "تسويات_جاهزة": {
        unit: "plate",
        subcategories: ["طواجن", "مشويات"]
    },
    "سندوتشات": {
        unit: "sandwich",
        subcategories: ["سندوتشات"]
    },
    "فواكه_اللحوم": {
        unit: "kg",
        subcategories: ["احشاء"]
    },
    "محاشي": {
        unit: "kg",
        subcategories: ["محاشي"]
    }
}

export default function ProductForm({ product, onSave, onCancel }) {
    const [form, setForm] = useState({
        name: "", category: "", subcategory: "", description: "",
        price_regular: "", price_offer: "", is_offer: false,
        unit: "kg", image_url: "", video_url: "", active: true
    })

    const [imageFile, setImageFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [imageError, setImageError] = useState("")

    useEffect(() => {
        if (product) setForm(product)
    }, [product])

    const sanitizeNumbers = (val) => {
        return val.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
            .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target
        let finalValue = type === "checkbox" ? checked : value

        if (name.includes("price") && typeof finalValue === "string") {
            finalValue = sanitizeNumbers(finalValue)
        }

        // Cascading Logic: Default unit is set, but can be changed later
        if (name === "category") {
            const selectedOption = PRODUCT_OPTIONS[value]
            setForm(prev => ({
                ...prev,
                category: value,
                // Only auto-update the unit if we have a match in PRODUCT_OPTIONS
                unit: selectedOption ? selectedOption.unit : prev.unit,
                subcategory: ""
            }))
            return
        }

        setForm(prev => ({ ...prev, [name]: finalValue }))
    }

    function handleImage(e) {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) {
            setImageError("حجم الصورة يجب أن يكون أقل من 2MB")
            return
        }
        setImageError("")
        setImageFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(file)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let imageUrl = form.image_url
        if (imageFile) imageUrl = await uploadProductImage(imageFile)
        onSave({ ...form, image_url: imageUrl })
    }

    const inputBase = "w-full p-3 rounded-2xl bg-white/5 border border-white/10 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm text-white appearance-none"

    return (
        <form onSubmit={handleSubmit} className="space-y-5 text-right">
            <header className="mb-2">
                <h2 className="text-2xl font-black text-white">
                    {product ? "تعديل المنتج" : "إضافة منتج جديد"}
                </h2>
                <p className="text-neutral-500 text-xs">اختر الفئة وأدخل تفاصيل المنتج</p>
            </header>

            <div className="space-y-4">
                <div>
                    <label className="block mb-1.5 text-xs font-bold text-neutral-400 mr-1">اسم المنتج</label>
                    <input name="name" value={form.name} onChange={handleChange} className={inputBase} placeholder="مثال: ريب آي ستيك" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Category Select */}
                    <div>
                        <label className="block mb-1.5 text-xs font-bold text-neutral-400 mr-1">الفئة</label>
                        <select name="category" value={form.category} onChange={handleChange} className={inputBase} required>
                            <option value="" className="bg-neutral-900 text-white">اختر الفئة</option>
                            {Object.keys(PRODUCT_OPTIONS).map(cat => (
                                <option key={cat} value={cat} className="bg-neutral-900 text-white">
                                    {cat.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory Select */}
                    <div>
                        <label className="block mb-1.5 text-xs font-bold text-neutral-400 mr-1">الفئة الفرعية</label>
                        <select
                            name="subcategory"
                            value={form.subcategory}
                            onChange={handleChange}
                            className={inputBase}
                            disabled={!form.category}
                        >
                            <option value="" className="bg-neutral-900 text-white">اختر الفئة الفرعية</option>
                            {form.category && PRODUCT_OPTIONS[form.category].subcategories.map(sub => (
                                <option key={sub} value={sub} className="bg-neutral-900 text-white">
                                    {sub.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Unit (Locked to Category) */}
                    <div>
                        <label className="block mb-1.5 text-xs font-bold text-neutral-400 mr-1">وحدة القياس</label>
                        <select
                            name="unit"
                            value={form.unit}
                            onChange={handleChange}
                            className={inputBase}
                        >
                            <option value="kg" className="bg-neutral-900 text-white">كيلو (kg)</option>
                            <option value="plate" className="bg-neutral-900 text-white">طبق (plate)</option>
                            <option value="sandwich" className="bg-neutral-900 text-white">ساندوتش (sandwich)</option>
                            <option value="pc" className="bg-neutral-900 text-white">قطعة (pc)</option>
                            <option value="jar" className="bg-neutral-900 text-white">برطمان (jar)</option>
                        </select>
                        <p className="text-[10px] text-neutral-600 mt-1 mr-1">
                            يتم التغيير تلقائياً عند اختيار الفئة، ويمكنك تعديله هنا.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-3xl bg-white/3 border border-white/5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1.5 text-xs font-bold text-neutral-400 mr-1">السعر العادي</label>
                        <input type="text" inputMode="decimal" name="price_regular" value={form.price_regular} onChange={handleChange} className={inputBase} />
                    </div>
                    <div>
                        <label className="block mb-1.5 text-xs font-bold text-neutral-400 mr-1">سعر العرض</label>
                        <input type="text" inputMode="decimal" name="price_offer" value={form.price_offer} onChange={handleChange} className={inputBase} />
                    </div>
                </div>
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-neutral-300">تفعيل العرض الترويجي</span>
                    <input type="checkbox" name="is_offer" checked={form.is_offer} onChange={handleChange} className="w-5 h-5 accent-red-600 rounded-lg" />
                </label>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block mb-1.5 text-xs font-bold text-neutral-400 mr-1">صورة المنتج</label>
                    <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-white/10 hover:border-red-600/40 transition-colors bg-white/2">
                        <div className="p-8 flex flex-col items-center justify-center text-center">
                            {preview || form.image_url ? (
                                <img src={preview || form.image_url} alt="preview" className="w-24 h-24 object-cover rounded-xl shadow-2xl" />
                            ) : (
                                <span className="text-xs text-neutral-500">انقر لرفع صورة</span>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    {imageError && <p className="text-red-500 text-[10px] mt-2">{imageError}</p>}
                </div>

                <div>
                    <label className="block mb-1.5 text-xs font-bold text-neutral-400 mr-1">رابط الفيديو</label>
                    <input name="video_url" value={form.video_url} onChange={handleChange} className={inputBase} placeholder="https://..." />
                </div>
            </div>

            <div>
                <label className="block mb-1.5 text-xs font-bold text-neutral-400 mr-1">الوصف</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="3" className={`${inputBase} resize-none`} />
            </div>

            <div className="flex gap-3 pt-4 sticky bottom-0 bg-neutral-950 py-2 mt-4 border-t border-white/5">
                <button type="submit" className="flex-2 bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-900/20">
                    حفظ البيانات
                </button>
                <button type="button" onClick={onCancel} className="flex-1 bg-white/5 hover:bg-white/10 text-neutral-400 py-4 rounded-2xl transition-colors">
                    إلغاء
                </button>
            </div>
        </form>
    )
}