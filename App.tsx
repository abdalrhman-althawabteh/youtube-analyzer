import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { OnboardingData, ChannelData, AIAnalysis } from './types';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { fetchChannelData } from './services/youtubeService';
import { generateAudit } from './services/geminiService';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingText, setLoadingText] = useState("جارِ الاتصال بـ YouTube...");
  const [isLoading, setIsLoading] = useState(false);

  // Check for session and load data on mount
  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_data')
        .eq('id', session.user.id)
        .single();

      if (profile?.onboarding_data) {
        const { onboarding, channel, analysis: savedAnalysis } = profile.onboarding_data;
        if (onboarding && channel && savedAnalysis) {
          setUserData(onboarding);
          setChannelData(channel);
          setAnalysis(savedAnalysis);
          navigate('/dashboard');
        } else {
          // User logged in but no data yet (maybe stopped at onboarding)
          navigate('/onboarding');
        }
      } else {
        navigate('/onboarding');
      }
    };

    checkSession();
  }, [navigate]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setUserData(data);
    setIsLoading(true);
    setLoadingText("جارِ سحب بيانات القناة والفيديوهات...");

    try {
      // 1. Fetch YouTube Data
      const cData = await fetchChannelData(data.channelId, data.youtubeApiKey);
      setChannelData(cData);

      // 2. Generate AI Audit using the provided Gemini Key
      setLoadingText("الذكاء الاصطناعي يحلل المحتوى والتعليقات...");
      const aiResults = await generateAudit(data, cData, data.geminiApiKey);
      setAnalysis(aiResults);

      // 3. Save Session Data to Supabase (Persistence)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('profiles')
          .update({
            onboarding_data: {
              onboarding: data,
              channel: cData,
              analysis: aiResults
            }
          })
          .eq('id', session.user.id);
      }

      // 4. Navigate to Dashboard
      setIsLoading(false);
      navigate('/dashboard');

    } catch (error) {
      console.error("Error during setup:", error);
      alert("حدث خطأ أثناء التحليل. يرجى التأكد من البيانات والمحاولة مرة أخرى.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white font-sans" dir="rtl">
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

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
      <Route
        path="/dashboard"
        element={
          channelData && analysis && userData ? (
            <Dashboard channelData={channelData} analysis={analysis} userData={userData} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;