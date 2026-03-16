import { useState, useMemo } from "react";
import { Link } from "react-router";
import { ShoppingCart, UtensilsCrossed, ChevronRight } from "lucide-react";
import { useData } from "../../data/dataProvider";
import OrderModal from "../../components/order/OrderModal";
import { useNavigate } from "react-router";

export default function MenuPage() {
    const navigate = useNavigate();
    const { products, loading, error } = useData();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const grouped = useMemo(() => {
        const result = {};
        if (!Array.isArray(products)) return result;

        products.forEach((p) => {
            if (!p.active) return;
            if (!result[p.category]) result[p.category] = {};
            if (!result[p.category][p.subcategory]) {
                result[p.category][p.subcategory] = [];
            }
            result[p.category][p.subcategory].push(p);
        });
        return result;
    }, [products]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" dir="rtl">
                <div className="size-12 border-4 border-red-900 border-t-red-500 rounded-full animate-spin" />
                <p className="text-gray-400 font-mono animate-pulse">جاري تحميل القائمة...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-20 p-6 bg-red-900/20 border border-red-800 rounded-2xl text-center" dir="rtl">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 px-4 py-2 rounded-lg text-white text-sm cursor-pointer"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black" dir="rtl">
            {/* TOP NAVIGATION BAR */}
            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/5 px-4 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link
                        to="/shop"
                        className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group"
                    >
                        <div className="bg-neutral-900 p-2 rounded-lg group-hover:bg-red-600/20 transition-all">
                            <ChevronRight size={18} />
                        </div>
                        <span className="font-bold text-sm">العودة</span>
                    </Link>

                    <h1 className="text-xl font-black italic text-white tracking-tighter">قائمة الطعام</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 pb-32">
                {Object.entries(grouped).map(([category, subs]) => (
                    <section key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Category Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl font-black text-red-500 uppercase italic tracking-tighter">
                                {category}
                            </h2>
                            <div className="h-0.5 flex-1 bg-linear-to-r from-red-600/30 via-red-900/50 to-transparent" />
                            <UtensilsCrossed className="text-red-900" size={20} />
                        </div>

                        {Object.entries(subs).map(([subcategory, items]) => (
                            <div key={subcategory} className="mb-10 last:mb-0">

                                {/* Subcategory Label */}
                                <h3 className="text-xs font-bold mb-5 text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                                    {subcategory}
                                </h3>

                                {/* Product Grid: 3 columns on small/medium, 6 on large */}
                                <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                                    {items.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => navigate(`/product/${product.id}`)}
                                            className="group flex flex-col justify-between items-center text-center bg-neutral-900/40 hover:bg-neutral-800/60 border border-white/5 p-4 rounded-2xl transition-all duration-300 hover:border-red-900/50 cursor-pointer"
                                        >
                                            <div className="flex flex-col items-center gap-2 mb-4">
                                                {product.is_offer && (
                                                    <span className="inline-block text-[8px] bg-red-600 text-white px-2 py-0.5 rounded-md font-black italic tracking-tighter uppercase">
                                                        OFFER
                                                    </span>
                                                )}
                                                <h4 className="font-bold text-sm text-gray-100 group-hover:text-red-400 transition-colors line-clamp-2 min-h-10">
                                                    {product.name}
                                                </h4>

                                                {/* Price Display */}
                                                <div className="flex items-baseline justify-center gap-0.5">
                                                    <span className="text-red-500 font-mono font-bold text-lg">
                                                        {product.is_offer ? product.price_offer : product.price_regular}
                                                    </span>
                                                    <span className="text-[8px] text-gray-500 font-bold">ج.م</span>
                                                </div>
                                            </div>

                                            {/* Order Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedProduct(product);
                                                }} className="w-full h-10 flex items-center justify-center bg-red-600 hover:bg-red-500 rounded-xl text-white shadow-lg shadow-red-900/20 active:scale-90 transition-all cursor-pointer"
                                                aria-label="إضافة إلى السلة"
                                            >
                                                <ShoppingCart size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                ))}

                {/* Empty State */}
                {Object.keys(grouped).length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-600 italic">لا توجد منتجات متاحة حالياً.</p>
                    </div>
                )}
            </div>

            {/* Order Modal */}
            {selectedProduct && (
                <OrderModal
                    product={selectedProduct}
                    close={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}