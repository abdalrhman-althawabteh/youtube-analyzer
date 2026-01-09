import React, { useState } from 'react';
import { OnboardingData } from '../types';
import { ArrowLeft, ArrowRight, Youtube, Target, Clock, AlertCircle, PlayCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (data: OnboardingData) => void;
}

const steps = [
  { id: 1, title: 'التحديات', icon: <AlertCircle /> },
  { id: 2, title: 'الأهداف', icon: <Target /> },
  { id: 3, title: 'الربط', icon: <Youtube /> },
];

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    ideaSources: [],
    weeklyHours: 5,
    // Pre-filling the key as requested by the user to fix the issue immediately
    geminiApiKey: "AIzaSyDoWtwmCZmkNkGPlulBKUz0PVkYy0yGV3A", 
    // Assuming the user might want to use the same key for YouTube if applicable, 
    // or they can enter a different one. Leaving it blank or pre-filling if they use the same project.
    youtubeApiKey: "" 
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (field: 'ideaSources', value: string) => {
    const current = formData[field] || [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    updateField(field, updated);
  };

  const handleSubmit = () => {
    if (formData.channelId && formData.youtubeApiKey && formData.geminiApiKey) {
      onComplete(formData as OnboardingData);
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!formData.mainProblem && !!formData.consistencyBlocker;
    if (step === 2) return !!formData.weeklyHours && !!formData.primaryGoal;
    return true;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[#272727] -z-10 rounded-full"></div>
          <div 
            className="absolute top-1/2 right-0 h-1 bg-gradient-to-l from-[#FF0000] to-[#F39C12] -z-10 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {steps.map((s) => (
            <div key={s.id} className={`flex flex-col items-center gap-2 transition-colors duration-300 ${step >= s.id ? 'text-white' : 'text-gray-600'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-[#0F0F0F] ${
                step >= s.id ? 'border-[#FF0000] text-[#FF0000]' : 'border-[#272727] text-gray-600'
              }`}>
                {step > s.id ? <CheckCircle2 size={20} /> : s.icon}
              </div>
              <span className="text-xs font-bold">{s.title}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#1A1A1A] border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
           {/* Decorative Elements */}
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF0000]/5 rounded-full blur-3xl pointer-events-none"></div>
           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#F39C12]/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Step 1: Challenges */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-white">ما هي أكبر مشكلة تواجهك حالياً؟</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "ما عندي أفكار محتوى كافية 💡",
                  "المشاهدات قليلة 📉",
                  "ما أقدر أنزل بانتظام ⏰",
                  "ما أعرف كيف أطور القناة 📈"
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField('mainProblem', opt)}
                    className={`p-4 rounded-xl border-2 text-right transition-all ${
                      formData.mainProblem === opt 
                      ? 'border-[#FF0000] bg-[#FF0000]/10 text-white' 
                      : 'border-[#272727] hover:border-[#F39C12] text-gray-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">ما هو العائق الرئيسي للانتظام؟</label>
                <select 
                  className="w-full bg-[#272727] text-white rounded-lg p-3 border-none focus:ring-2 focus:ring-[#FF0000]"
                  value={formData.consistencyBlocker || ''}
                  onChange={(e) => updateField('consistencyBlocker', e.target.value)}
                >
                  <option value="">اختر...</option>
                  <option value="no_time">ما عندي وقت كافي ⏰</option>
                  <option value="editing">المونتاج ياخذ وقت طويل 🎬</option>
                  <option value="ideas">ما ألاقي أفكار 💡</option>
                  <option value="motivation">فقدان الشغف/الحماس 😔</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-white">أهدافك ووقتك</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">كم ساعة تقدر تخصص لليوتيوب أسبوعياً؟</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" max="40" 
                    value={formData.weeklyHours || 5}
                    onChange={(e) => updateField('weeklyHours', parseInt(e.target.value))}
                    className="w-full h-2 bg-[#272727] rounded-lg appearance-none cursor-pointer accent-[#FF0000]"
                  />
                  <span className="bg-[#FF0000] px-3 py-1 rounded-lg font-bold min-w-[3rem] text-center">
                    {formData.weeklyHours}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="block text-sm font-medium text-gray-400">الهدف الرئيسي</label>
                {[
                  "أوصل 1000 مشترك (الربح) 💰",
                  "بناء جمهور متفاعل 💬",
                  "التسويق لخدماتي/عملي 🏪"
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField('primaryGoal', opt)}
                    className={`p-4 rounded-xl border text-right transition-all ${
                      formData.primaryGoal === opt 
                      ? 'border-[#F39C12] bg-[#F39C12]/10 text-white' 
                      : 'border-[#272727] hover:border-[#F39C12]/50 text-gray-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Connect */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">اربط أدوات التحليل</h2>
                <p className="text-gray-400 text-sm">نحتاج مفاتيح الربط لتحليل القناة واستخدام الذكاء الاصطناعي.</p>
              </div>

              <div className="space-y-4">
                {/* Channel ID */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Channel ID</label>
                  <input 
                    type="text" 
                    placeholder="UC..."
                    className="w-full bg-[#0F0F0F] border border-[#272727] rounded-lg p-3 text-white focus:border-[#FF0000] focus:outline-none"
                    value={formData.channelId || ''}
                    onChange={(e) => updateField('channelId', e.target.value)}
                  />
                </div>

                {/* YouTube API Key */}
                <div className="bg-[#272727]/30 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center gap-2 text-sm text-white font-bold">
                       <Youtube size={16} className="text-red-500"/>
                       YouTube API Key
                    </label>
                    <a 
                      href="https://console.cloud.google.com/apis/credentials" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#F39C12] hover:underline"
                    >
                      الحصول على المفتاح
                    </a>
                  </div>
                  <input 
                    type="password" 
                    placeholder="لجلب بيانات القناة..."
                    className="w-full bg-[#0F0F0F] border border-[#272727] rounded-lg p-3 text-white focus:border-[#FF0000] focus:outline-none"
                    value={formData.youtubeApiKey || ''}
                    onChange={(e) => updateField('youtubeApiKey', e.target.value)}
                  />
                </div>

                {/* Gemini API Key */}
                <div className="bg-[#272727]/30 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center gap-2 text-sm text-white font-bold">
                       <Sparkles size={16} className="text-blue-400"/>
                       Gemini API Key
                    </label>
                    <span className="text-[10px] text-green-500 font-bold">
                      تم الربط تلقائياً ✅
                    </span>
                  </div>
                  <input 
                    type="password" 
                    placeholder="للتحليل الذكي واقتراح الأفكار..."
                    className="w-full bg-[#0F0F0F] border border-[#272727] rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    value={formData.geminiApiKey || ''}
                    onChange={(e) => updateField('geminiApiKey', e.target.value)}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">لقد قمت بإدخال المفتاح الذي زودتني به مسبقاً.</p>
                </div>

              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/5 relative z-10">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ArrowRight size={18} />
                سابق
              </button>
            ) : <div></div>}

            {step < 3 ? (
              <button 
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all shadow-lg ${
                  isStepValid()
                    ? 'bg-[#FF0000] hover:bg-[#CC0000] text-white shadow-[#FF0000]/20'
                    : 'bg-[#272727] text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                التالي
                <ArrowLeft size={18} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={!formData.channelId || !formData.youtubeApiKey || !formData.geminiApiKey}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-[#FF0000]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ابدا التحليل
                <PlayCircle size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;