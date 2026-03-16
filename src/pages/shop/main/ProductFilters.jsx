import { useMemo } from "react";
import { Link } from "react-router";
import { LayoutGrid, Flame } from "lucide-react";

export default function ProductFilters({
  products = [],
  category,
  setCategory,
  subcategory,
  setSubcategory,
  offersOnly,
  setOffersOnly
}) {
  // 1. Extract categories dynamically
  const categories = useMemo(() => {
    const unique = new Set(products.map(p => p.category));
    return ["all", ...Array.from(unique)];
  }, [products]);

  // 2. Extract subcategories based on selected category
  const subcategories = useMemo(() => {
    if (category === "all") return [];
    const unique = new Set(
      products
        .filter(p => p.category === category)
        .map(p => p.subcategory)
    );
    return ["all", ...Array.from(unique)];
  }, [products, category]);

  return (
    <div className="space-y-6 py-4 px-1" dir="rtl">
      
      {/* SECTION 1: Main Categories (Scrollable Pills) */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setSubcategory("all");
            }}
            className={`
              px-6 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all duration-300 border-2
              ${category === cat
                ? "bg-red-600 border-red-600 text-white shadow-[0_8px_15px_-5px_rgba(220,38,38,0.5)] scale-105"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"}
              cursor-pointer active:scale-95
            `}
          >
            {cat === "all" ? "القائمة الرئيسية" : cat}
          </button>
        ))}
      </div>

      {/* SECTION 2: Subcategories (Secondary Row - only visible when a category is picked) */}
      {category !== "all" && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar animate-in fade-in slide-in-from-right-2">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubcategory(sub)}
              className={`
                px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                ${subcategory === sub
                  ? "bg-red-950/40 text-red-400 border border-red-800/50"
                  : "bg-transparent text-neutral-500 border border-transparent hover:text-neutral-300"}
                cursor-pointer
              `}
            >
              {sub === "all" ? "الكل" : sub}
            </button>
          ))}
        </div>
      )}

      {/* SECTION 3: Action Bar (Show All + Offers Toggle) */}
      <div className="flex justify-between items-center pt-2 border-t border-white/5">
        
        {/* The "Show All" Link */}
        <Link
          to="/menu"
          className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-all"
        >
          <div className="bg-neutral-900 p-2 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner">
            <LayoutGrid size={16} />
          </div>
          <span className="text-xs font-black italic tracking-tight">عرض الكل</span>
        </Link>

        {/* The Offers Toggle */}
        <button
          onClick={() => setOffersOnly(!offersOnly)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-500 cursor-pointer
            ${offersOnly 
              ? "bg-red-600/10 border-red-600 text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.15)]" 
              : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"}
          `}
        >
          <Flame size={14} className={offersOnly ? "animate-pulse" : "opacity-30"} fill={offersOnly ? "currentColor" : "none"} />
          <span className="text-xs font-black italic">العروض فقط</span>
        </button>

      </div>

    </div>
  );
}