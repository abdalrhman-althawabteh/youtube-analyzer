import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) navigate('/onboarding');
        });
    }, [navigate]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        // Note: Google Auth requires configuring the redirect URL in Supabase Dashboard
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/onboarding`
            }
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/onboarding');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0], // Default name
                        }
                    }
                });
                if (error) throw error;
                alert('تم إرسال رابط التأكيد إلى بريدك الإلكتروني!');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 font-sans" dir="rtl">
            <div className="w-full max-w-md bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 relative">
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
                        Red<span className="text-[#FF0000]">Audit</span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isLogin ? 'مرحباً بعودتك، المبدع!' : 'انضم إلينا وابدأ رحلة النجاح'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-6 text-center border border-red-500/20">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        <span>المتابعة باستخدام Google</span>
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#1A1A1A] text-gray-500">أو باستخدام البريد الإلكتروني</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0F0F0F] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF0000] transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="كلمة المرور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0F0F0F] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF0000] transition-colors"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF0000] text-white font-bold py-3 px-4 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-gray-500 text-sm hover:text-white transition-colors"
                        >
                            {isLogin ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' : 'لديك حساب بالفعل؟ سجل الدخول'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
