import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard, ShoppingBag } from "lucide-react";
import { useCart } from "../pages/shop/cartProvider";
import { supabase } from "../api/supabase"; // Import your supabase client
import { logout } from "../api/supabase";   // Import your logout function
import logo from "../assets/logo.jpg";
import VersionBadge from "./VersionBadge";
import { Link, useNavigate } from "react-router";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { cartCount } = useCart();

    // Listen for Auth Changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/");
        setMenuOpen(false);
    };

    function openCart() {
        window.dispatchEvent(new Event("open-cart"));
    }

    return (
        <nav dir="rtl" className="w-full bg-black/80 backdrop-blur-md border-b border-red-700 text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    
                    {/* Logo + Title */}
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                        <img
                            src={logo}
                            alt="Top Chef logo"
                            className="w-12 h-12 rounded-full object-cover border border-red-700"
                        />
                        <h1 className="text-xl font-bold tracking-wide group-hover:text-red-500 transition-colors">
                            توب شيف
                        </h1>
                    </Link>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Shopping Link (Visible if logged in) */}
                        {user && (
                            <Link to="/" className="text-sm font-medium hover:text-red-500 flex items-center gap-1 transition">
                                <ShoppingBag size={16} />
                                تسوق
                            </Link>
                        )}

                        <a
                            href="https://wa.me/201002650740?text=مرحبا"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium hover:text-red-500 transition"
                        >
                            تواصل
                        </a>

                        {user ? (
                            <>
                                <Link to="/admin" className="text-sm font-medium hover:text-red-500 flex items-center gap-1 transition">
                                    <LayoutDashboard size={16} />
                                    لوحة التحكم
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-red-500 hover:text-red-400 flex items-center gap-1 transition cursor-pointer"
                                >
                                    <LogOut size={16} />
                                    خروج
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-sm font-medium hover:text-red-500 transition">
                                تسجيل الدخول
                            </Link>
                        )}

                        <button
                            onClick={openCart}
                            className={`relative transition-all active:scale-90 ${cartCount > 0 ? "text-red-500 animate-pulse" : "hover:text-red-500"}`}
                        >
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -left-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <VersionBadge />
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={26} className="text-red-500" /> : <Menu size={26} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`grid transition-all duration-300 ease-in-out md:hidden ${menuOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                    <div className="overflow-hidden flex flex-col gap-5 border-t border-red-800 pt-4">
                        {user && (
                            <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm hover:text-red-500 transition">تسوق</Link>
                        )}
                        
                        <a href="https://wa.me/201002650740" target="_blank" className="text-sm hover:text-red-500 transition">تواصل</a>

                        {user ? (
                            <>
                                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm hover:text-red-500 transition">لوحة التحكم</Link>
                                <button onClick={handleLogout} className="text-sm text-red-500 text-right font-bold transition">تسجيل خروج</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm hover:text-red-500 transition">تسجيل الدخول</Link>
                        )}

                        <button onClick={openCart} className="flex items-center gap-3 hover:text-red-500 transition">
                            <ShoppingCart size={20} />
                            <span>السلة ({cartCount})</span>
                        </button>
                        
                        <VersionBadge />
                    </div>
                </div>
            </div>
        </nav>
    );
}