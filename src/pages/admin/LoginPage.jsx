import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, User, ChefHat } from "lucide-react";
import { login } from "../../api/supabase";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        try {
            // نستخدم الفانكشن الحقيقية بدل الـ IF الثابتة
            const data = await login(email, password);

            if (data.user) {
                navigate("/admin");
            }
        } catch (err) {
            alert("بيانات الدخول غلط يا شيف: " + err.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6" dir="rtl">
            <div className="w-full max-w-100 relative">

                {/* Decorative Background Glow */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-900/10 rounded-full blur-3xl" />

                <form
                    onSubmit={handleLogin}
                    className="relative bg-neutral-900/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8"
                >
                    {/* Brand Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center p-4 bg-red-600 rounded-2xl mb-4 shadow-lg shadow-red-900/20">
                            <ChefHat size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            شيف أحمد جودة
                        </h1>
                        <p className="text-neutral-500 text-sm font-bold italic uppercase tracking-widest">
                            Top Chef Admin
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Username Input */}
                        <div className="relative group">
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-red-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="اسم المستخدم"
                                className="w-full pr-12 pl-4 py-4 rounded-2xl bg-black border border-neutral-800 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-neutral-700 font-bold"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-red-500 transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="كلمة المرور"
                                className="w-full pr-12 pl-4 py-4 rounded-2xl bg-black border border-neutral-800 text-white focus:border-red-600 focus:outline-none transition-all placeholder:text-neutral-700 font-bold"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-900/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        <span>دخول لوحة التحكم</span>
                    </button>

                    <p className="text-center text-[10px] text-neutral-700 font-bold uppercase tracking-tighter">
                        Security Protected Section
                    </p>
                </form>
            </div>
        </div>
    );
}