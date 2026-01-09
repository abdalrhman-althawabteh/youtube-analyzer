import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { generateImage } from 'react-image-gen-placeholder'; // Using placeholder for now

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white font-sans" dir="rtl">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-black tracking-tighter">
                    Red<span className="text-[#FF0000]">Audit</span>
                </h1>
                <button
                    onClick={() => navigate('/login')}
                    className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                    تسجيل الدخول
                </button>
            </nav>

            {/* Hero Section */}
            <header className="relative py-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF0000]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF0000]/5 rounded-full blur-3xl -z-10"></div>

                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block bg-[#FF0000]/10 text-[#FF0000] px-4 py-1.5 rounded-full font-bold text-sm mb-6 border border-[#FF0000]/20 animate-bounce">
                        🚀 الذكاء الاصطناعي وصل إلى يوتيوب
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        حول قناتك إلى <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] to-[#F39C12]">
                            آلة مشاهدات
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        توقف عن التخمين. احصل على خطة نمو مخصصة بالكامل، أفكار محتوى فيروسية، وتحليل دقيق لقناتك باستخدام الذكاء الاصطناعي.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="group bg-[#FF0000] text-white text-xl font-bold px-10 py-5 rounded-full shadow-[0_0_30px_rgba(255,0,0,0.4)] hover:shadow-[0_0_50px_rgba(255,0,0,0.6)] hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                    >
                        ابدأ التحليل المجاني الآن
                        <ArrowRight className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <p className="text-xs text-gray-600 mt-4">لا يحتاج بطاقة ائتمان • انضم إلى +5,000 صانع محتوى</p>
                </div>
            </header>

            {/* Stats/Social Proof */}
            <section className="py-10 border-y border-white/5 bg-[#1A1A1A]/30">
                <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 text-gray-400 grayscale opacity-70">
                    {/* Logos placeholders */}
                    <span className="font-black text-xl">YouTube</span>
                    <span className="font-black text-xl">VidIQ</span>
                    <span className="font-black text-xl">TubeBuddy</span>
                    <span className="font-black text-xl">Shopify</span>
                </div>
            </section>

            {/* Feature Section: The Problem */}
            <section className="py-24 px-6 bg-[#0F0F0F]">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">هل تعاني من هذه المشاكل؟</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4 p-4 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-[#FF0000]/30 transition-colors">
                                <div className="bg-red-500/10 p-3 rounded-lg h-fit">
                                    <TrendingUp className="text-red-500" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">المشاهدات متوقفة</h3>
                                    <p className="text-gray-400 text-sm">تبذل مجهوداً خرافياً في المونتاج، لكن الفيديو يتوقف عند ٢٠٠ مشاهدة.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-[#FF0000]/30 transition-colors">
                                <div className="bg-red-500/10 p-3 rounded-lg h-fit">
                                    <Zap className="text-red-500" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">نفاد الأفكار</h3>
                                    <p className="text-gray-400 text-sm">تقضي ساعات تفكر في "فكرة الفيديو القادم" وتنتظر الإلهام.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000] to-[#F39C12] rounded-2xl blur-2xl opacity-20 transform rotate-3"></div>
                        <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/10 relative transform -rotate-1">
                            <div className="h-64 flex items-center justify-center text-gray-600 font-mono text-sm border-2 border-dashed border-gray-700 rounded-xl">
                                [صورة توضيحية للداشبورد]
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section: The Solution */}
            <section className="py-24 px-6 bg-[#1A1A1A]/20">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">الحل: مدير أعمال ذكي لقناتك</h2>
                    <p className="text-gray-400">نظام متكامل يحلل، يخطط، ويعطيك خارطة طريق.</p>
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-[#FF0000]/10 rounded-xl flex items-center justify-center mb-6 text-[#FF0000]">
                            <Users size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">تحليل الجمهور</h3>
                        <p className="text-gray-400">نفهم من هم متابعوك وماذا يريدون حقاً، بناءً على تعليقاتهم وسلوكهم.</p>
                    </div>
                    <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-[#F39C12]/10 rounded-xl flex items-center justify-center mb-6 text-[#F39C12]">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">خطة نمو مخصصة</h3>
                        <p className="text-gray-400">لا نصائح عامة. ستحصل على خطة (Foundation &rarr; Growth &rarr; Expansion) تناسب وقتك.</p>
                    </div>
                    <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">بنك أفكار لانهائي</h3>
                        <p className="text-gray-400">توليد أفكار فيديوهات فيروسية بضغطة زر، مخصصة لمجالك وشغفك.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] p-12 rounded-3xl border border-white/10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#FF0000] to-[#F39C12]"></div>

                    <h2 className="text-4xl font-bold mb-6">جاهز لتفجير قناتك؟</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        انضم الآن وابدأ في استخدام أقوى أداة تحليل قنوات يوتيوب في الشرق الأوسط.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-[#FF0000] text-white text-xl font-bold px-12 py-4 rounded-xl shadow-lg shadow-red-900/20 hover:bg-red-600 transition-colors"
                    >
                        أنشئ حسابك المجاني
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5">
                &copy; 2024 RedAudit AI. جميع الحقوق محفوظة.
            </footer>
        </div>
    );
};

export default LandingPage;
