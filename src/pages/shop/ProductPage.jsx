import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useData } from "../../data/dataProvider";
import { ShoppingCart, Flame, ChevronRight, ChevronDown, Award, ShieldCheck, Beef, Zap, Utensils, Gem, UserCheck } from "lucide-react";
import OrderModal from "../../components/order/OrderModal";

export default function ProductPage() {
  const { id } = useParams();
  const { products, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(0);

  // 1. Master Butcher Features
  const features = [
    { text: "لحم بلدي طازج يومياً", icon: <Beef size={16} className="text-red-500" /> },
    { text: "تقطيع احترافي على طريقة الجزارين", icon: <Award size={16} className="text-amber-500" /> },
    { text: "تشفية وتنضيف على الشعرة", icon: <Zap size={16} className="text-blue-400" /> },
    { text: "وزن دقيق بالجرام", icon: <ShieldCheck size={16} className="text-emerald-500" /> },
    { text: "تجهيز حسب الطلب", icon: <Utensils size={16} className="text-slate-400" /> },
    { text: "اختيار أجود الذبائح", icon: <Gem size={16} className="text-purple-400" /> },
    { text: "جزارين بخبرة في الصنعة", icon: <UserCheck size={16} className="text-indigo-500" /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 2 >= features.length ? 0 : prev + 2));
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><div className="size-10 border-4 border-red-900 border-t-red-600 rounded-full animate-spin" /></div>;

  const product = products.find((p) => String(p.id) === String(id));
  if (!product) return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center" dir="rtl"><h2 className="text-xl mb-4">المنتج غير موجود</h2><a href="/" className="text-red-500 underline">العودة للرئيسية</a></div>;

  const isOffer = product.is_offer && product.price_offer > 0;
  const displayPrice = isOffer ? product.price_offer : product.price_regular;

  let videoEmbed = null;
  if (product.video_url && product.video_url.includes("youtube")) {
    const vidId = product.video_url.split("v=")[1]?.split("&")[0];
    videoEmbed = `https://www.youtube.com/embed/${vidId}`;
  }

  const defaultButcherRemark = "الاسم توب شيف بس الصنعة جزارة بجد، اللحمة بتتكلم عن نفسها.";

  return (
    <div className="min-h-screen bg-black text-white pb-32 relative font-sans" dir="rtl">

      {/* MEDIA HEADER - Restored Responsive Width */}
      <div className="relative w-full flex justify-center bg-neutral-950">
        <div className="w-full lg:w-1/2 aspect-square md:aspect-video overflow-hidden border-b border-white/5 shadow-2xl">
          {videoEmbed ? (
            <iframe
              src={videoEmbed}
              className="w-full h-full"
              allowFullScreen
              title={product.name}
            />
          ) : (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Back Button Overlay */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-start pointer-events-none">
          <button
            onClick={() => window.history.back()}
            className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 pointer-events-auto cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {!scrolled && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-80">
            <ChevronDown size={32} className="text-red-500" />
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-2xl mx-auto px-6 -mt-8 relative z-10 bg-black rounded-t-4xl pt-8 shadow-[0_-20px_40px_rgba(0,0,0,0.9)] border-t border-white/5">

        {/* OFFER BANNER */}
        {isOffer && (
          <div className="mb-6 overflow-hidden rounded-xl bg-red-600/10 border border-red-500/20 p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-red-500 animate-pulse" />
                <span className="text-red-500 text-xs font-black italic">خصم خاص من توب شيف</span>
              </div>
              {/* <span className="text-gray-400 text-[10px] font-mono tracking-tighter">
                وفر {product.price_regular - product.price_offer} ج.م
              </span> */}
            </div>
          </div>
        )}

        {/* Title & Price */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-4xl font-black tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-mono font-black text-red-500">
              {displayPrice} <span className="text-sm font-sans">ج.م</span>
            </span>
            {isOffer && (
              <span className="text-lg text-gray-600 line-through decoration-red-900/40">
                {product.price_regular}
              </span>
            )}
          </div>
        </div>

        {/* ROTATING FEATURES */}
        <div className="flex gap-4 mb-10 h-10 items-center overflow-hidden border-b border-white/5 pb-2">
          {features.slice(featureIndex, featureIndex + 2).map((feat) => (
            <div
              key={feat.text}
              className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-1000"
            >
              {feat.icon}
              <span className="text-sm text-gray-400 font-bold whitespace-nowrap">{feat.text}</span>
            </div>
          ))}
        </div>

        {/* Description / Butcher Remark */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-100 italic border-r-4 border-red-600 pr-3">أصول الصنعة</h3>
          <p className="text-gray-400 leading-relaxed text-lg">
            {product.description || defaultButcherRemark}
          </p>
        </div>
      </div>

      {/* FLOATING ACTION BAR */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${scrolled ? "w-[90%] max-w-md" : "w-[65%] max-w-xs"}`}>
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-between bg-red-600 hover:bg-red-500 text-white p-2 pl-6 rounded-2xl shadow-2xl active:scale-95 transition-all group cursor-pointer border border-white/10"
        >
          <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
            <ShoppingCart size={24} />
          </div>
          <span className="text-xl font-black uppercase italic tracking-widest">
            {scrolled ? "اطلب فوراً" : "اطلب"}          </span>
          <div className="w-4" />
        </button>
      </div>

      {showModal && <OrderModal product={product} close={() => setShowModal(false)} />}
    </div>
  );
}