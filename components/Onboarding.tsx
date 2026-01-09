import React, { useState } from 'react';
import { OnboardingData } from '../types';
import { ArrowLeft, ArrowRight, Youtube, Target, Sparkles, Heart, Rocket, Video } from 'lucide-react';

interface Props {
  onComplete: (data: OnboardingData) => void;
}

const steps = [
  { id: 1, title: 'الشغف', icon: <Heart /> },
  { id: 2, title: 'المستوى', icon: <Rocket /> },
  { id: 3, title: 'الهدف', icon: <Target /> },
  { id: 4, title: 'القدرات', icon: <Sparkles /> }, // New Step: "Connect" is now part of capabilities unleashing
];

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    weeklyHours: 5,
    geminiApiKey: "",
    youtubeApiKey: ""
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    if (step === 1) return !!formData.passionNiche && !!formData.contentStyle;
    if (step === 2) return !!formData.creatorLevel;
    if (step === 3) return !!formData.primaryGoal && !!formData.weeklyHours;
    return true;
  };

  const handleSubmit = () => {
    if (formData.channelId && formData.youtubeApiKey && formData.geminiApiKey) {
      onComplete(formData as OnboardingData);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative px-10">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#272727] -z-10 rounded-full mx-10"></div>
          <div
            className="absolute top-1/2 right-0 h-1 bg-gradient-to-l from-[#FF0000] to-[#F39C12] -z-10 rounded-full transition-all duration-500 mx-10"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>

          {steps.map((s) => (
            <div key={s.id} className={`flex flex-col items-center gap-2 transition-all duration-300 ${step >= s.id ? 'scale-110' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 bg-[#0F0F0F] transition-colors ${step >= s.id ? 'border-[#FF0000] text-[#FF0000] shadow-lg shadow-red-500/20' : 'border-[#272727] text-gray-500'
                }`}>
                {s.icon}
              </div>
              <span className={`text-xs font-bold ${step >= s.id ? 'text-white' : 'text-gray-600'}`}>{s.title}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#1A1A1A] border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
          {/* Decorative Elements */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#FF0000]/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#F39C12]/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex-grow">
            {/* Step 1: Passion & Style - The Hook */}
            {step === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">إيش هو شغفك؟ 🔥</h2>
                  <p className="text-gray-400">خلينا نعرف إيش النوع المحتوى اللي بتستمتع بصناعته عشان نساعدك تبدع فيه.</p>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">عن إيش بتحب تحكي؟ (مجالك/النيش)</label>
                  <input
                    type="text"
                    placeholder="مثلاً: جيمنج، طبخ، تعليم برمجة، قصص رعب..."
                    className="w-full bg-[#0F0F0F] border border-[#272727] rounded-xl p-4 text-white focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition-all placeholder:text-gray-600"
                    value={formData.passionNiche || ''}
                    onChange={(e) => updateField('passionNiche', e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">إيش ستايل الفيديوهات اللي ببالك؟</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Vlogs & Lifestyle', 'Educational / Tutorials', 'Gaming / Commentary', 'Stories & Documentary', 'Shorts Only'].map((style) => (
                      <button
                        key={style}
                        onClick={() => updateField('contentStyle', style)}
                        className={`p-4 rounded-xl border text-right transition-all hover:scale-[1.02] ${formData.contentStyle === style
                          ? 'border-[#F39C12] bg-[#F39C12]/10 text-white shadow-lg shadow-orange-500/10'
                          : 'border-[#272727] hover:border-[#F39C12]/50 text-gray-400'
                          }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Experience - The Reality Check */}
            {step === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">وين إنت هسا في عالم اليوتيوب؟ 🚀</h2>
                  <p className="text-gray-400">عشان نعطيك نصائح تناسب مرحلتك الحالية.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-8">
                  {[
                    { val: 'Beginner', icon: '🌱', title: 'مبتدئ (Beginner)', desc: 'لسه ببلش، بدي أتعلم الأساسيات وكيف أجيب أول 1000 مشترك.' },
                    { val: 'Intermediate', icon: '📈', title: 'متوسط (Intermediate)', desc: 'عندي قناة وفيها حركة، بس بدي أكبر أسرع وأحسن الأرقام.' },
                    { val: 'Pro', icon: '👑', title: 'محترف (Pro)', desc: 'عندي جمهور كبير، بدور على استراتيجيات متقدمة وتنويع دخل.' }
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      onClick={() => updateField('creatorLevel', lvl.val)}
                      className={`p-6 rounded-2xl border text-right transition-all group relative overflow-hidden ${formData.creatorLevel === lvl.val
                        ? 'border-[#FF0000] bg-[#FF0000]/5 text-white'
                        : 'border-[#272727] hover:border-gray-500 text-gray-300'
                        }`}
                    >
                      <div className="flex items-start gap-4 relative z-10">
                        <span className="text-4xl bg-[#0F0F0F] p-3 rounded-full border border-white/5">{lvl.icon}</span>
                        <div>
                          <div className="font-bold text-lg mb-1">{lvl.title}</div>
                          <div className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">{lvl.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Goals & Constraints - The Plan */}
            {step === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">إيش هدفك الكبير؟ 🎯</h2>
                  <p className="text-gray-400">خلينا نحدد بوصلتنا عشان نوصل أسرع.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    "دخل مادي (Business & Money) 💰",
                    "شهرة وتأثير (Fame & Influence) ✨",
                    "بناء مجتمع (Community Building) 🤝",
                    "توثيق رحلة (Personal Archive) 📔"
                  ].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => updateField('primaryGoal', goal)}
                      className={`p-4 rounded-xl border text-right transition-all ${formData.primaryGoal === goal
                        ? 'border-[#F39C12] bg-[#F39C12]/10 text-white'
                        : 'border-[#272727] hover:border-[#F39C12]/50 text-gray-300'
                        }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>

                <div className="bg-[#272727]/30 p-6 rounded-2xl border border-white/5 mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    قد ايه وقت مستعد تعطي القناة أسبوعياً؟ <span className="text-[#F39C12] font-bold">{formData.weeklyHours} ساعات</span>
                  </label>
                  <input
                    type="range"
                    min="1" max="40"
                    value={formData.weeklyHours || 5}
                    onChange={(e) => updateField('weeklyHours', parseInt(e.target.value))}
                    className="w-full h-2 bg-[#0F0F0F] rounded-lg appearance-none cursor-pointer accent-[#FF0000]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>هواية (1 ساعة)</span>
                    <span>دوام جزئي (20 ساعة)</span>
                    <span>دوام كامل (40 ساعة)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Unleash AI - Connection */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">أطلق العنان لمحللك الذكي 🧠</h2>
                  <p className="text-gray-400">اربط قناتك عشان الـ AI يقدر يقرأ بياناتك ويعطيك النصائح السحرية.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="bg-[#0F0F0F] relative border border-[#272727] rounded-xl p-6 transition-colors group-hover:border-red-500/50">
                      <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Youtube className="text-red-500" /> رابط القناة (Channel ID)
                      </label>
                      <input
                        type="text"
                        placeholder="UC..."
                        className="w-full bg-[#1A1A1A] border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-[#FF0000] placeholder:text-gray-600"
                        value={formData.channelId || ''}
                        onChange={(e) => updateField('channelId', e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-2">يمكنك إيجاده في إعدادات القناة المتقدمة في يوتيوب.</p>
                    </div>
                  </div>

                  <div className="bg-[#0F0F0F] border border-[#272727] rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="bg-[#272727] p-1 rounded">API Keys</span> مفاتيح الربط
                      </label>
                      <a href="#" className="text-xs text-[#F39C12] hover:underline">ما عندك مفاتيح؟ اضغط هنا</a>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="password"
                        placeholder="YouTube Data API Key"
                        className="w-full bg-[#1A1A1A] border border-[#272727] rounded-lg p-3 text-white focus:border-[#FF0000] outline-none transition-colors"
                        value={formData.youtubeApiKey || ''}
                        onChange={(e) => updateField('youtubeApiKey', e.target.value)}
                      />
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="Gemini API Key"
                          className="w-full bg-[#1A1A1A] border border-blue-900/30 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors pr-10"
                          value={formData.geminiApiKey || ''}
                          onChange={(e) => updateField('geminiApiKey', e.target.value)}
                        />
                        <Sparkles size={16} className="absolute top-3.5 right-3 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/5 relative z-10 items-center">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
              >
                رجوع
              </button>
            ) : <div></div>}

            <div className="flex gap-2">
              {steps.map(s => (
                <div key={s.id} className={`h-1.5 rounded-full transition-all duration-300 ${s.id === step ? 'w-8 bg-white' : 'w-1.5 bg-[#272727]'}`}></div>
              ))}
            </div>

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${isStepValid()
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-[#272727] text-gray-500 cursor-not-allowed'
                  }`}
              >
                التالي
                <ArrowLeft size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.channelId || !formData.youtubeApiKey || !formData.geminiApiKey}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#FF0000]/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                يلا نبدأ 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;