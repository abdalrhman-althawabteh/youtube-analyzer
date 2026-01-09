import React, { useState } from 'react';
import { OnboardingData, ChannelData, AIAnalysis, ViewState } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { fetchChannelData } from './services/youtubeService';
import { generateAudit } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('onboarding');
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingText, setLoadingText] = useState("جارِ الاتصال بـ YouTube...");

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setUserData(data);
    setView('loading');

    try {
      // 1. Fetch YouTube Data
      setLoadingText("جارِ سحب بيانات القناة والفيديوهات...");
      const cData = await fetchChannelData(data.channelId, data.youtubeApiKey);
      setChannelData(cData);

      // 2. Generate AI Audit using the provided Gemini Key
      setLoadingText("الذكاء الاصطناعي يحلل المحتوى والتعليقات...");
      // Pass the Gemini Key from the form data
      const aiResults = await generateAudit(data, cData, data.geminiApiKey);
      setAnalysis(aiResults);

      // 3. Show Dashboard
      setView('dashboard');

    } catch (error) {
      console.error("Error during setup:", error);
      alert("حدث خطأ أثناء التحليل. يرجى التأكد من البيانات والمحاولة مرة أخرى.");
      setView('onboarding');
    }
  };

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#272727] border-t-[#FF0000] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#FF0000]/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
        <h2 className="mt-8 text-xl font-bold animate-pulse">{loadingText}</h2>
        <p className="text-gray-500 mt-2 text-sm">قد يستغرق هذا بضع ثوانٍ...</p>
      </div>
    );
  }

  if (view === 'dashboard' && channelData && analysis && userData) {
    return <Dashboard channelData={channelData} analysis={analysis} userData={userData} />;
  }

  return <Onboarding onComplete={handleOnboardingComplete} />;
};

export default App;