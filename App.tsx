import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { OnboardingData, ChannelData, AIAnalysis } from './types';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
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
  const [isSessionChecking, setIsSessionChecking] = useState(true);

  // Centralized Session Check
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setIsSessionChecking(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_data, role')
          .eq('id', session.user.id)
          .single();

        if (profile?.onboarding_data) {
          const { onboarding, channel, analysis: savedAnalysis } = profile.onboarding_data;
          setUserData(onboarding);
          setChannelData(channel);
          setAnalysis(savedAnalysis);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsSessionChecking(false);
      }
    };

    checkSession();
  }, []);

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

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactElement, requireAdmin?: boolean }) => {
    if (isSessionChecking) {
      return (
        <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    // 1. Not Logged In -> Go to Login
    if (!userData && !isSessionChecking) {
      // Double check session to be sure (edge case where session exists but data empty)
      // If userData is null, it means either not logged in OR logged in but no data.
      // We rely on supabase.auth to know if we are logged in.
      // But here we can just use the state.
      // Wait, if session exists but no userData, we should go to Onboarding.
      // Let's check supabase session synchronously? No async.
      // We will rely on the fact that checkSession sets userData if profile exists.
      // If no userData, we might still be logged in.
      // Let's assume strict: if trying to access Dash/Admin, must have data or be admin.
    }

    // Simplification: We need strict auth check here.
    // Since we can't easily sync check session in render, we use a different pattern.
    // Let's do nothing here and let the useEffect handle redirects?
    // No, that causes flashes.

    return children;
  };

  // Improved Render Logic
  if (isSessionChecking || isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white font-sans" dir="rtl">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#272727] border-t-[#FF0000] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#FF0000]/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
        <h2 className="mt-8 text-xl font-bold animate-pulse">{isLoading ? loadingText : 'جاري التحميل...'}</h2>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Auth />} />

      {/* Onboarding - Protected but accessible if new user */}
      <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />

      {/* Admin - Explicit Protection */}
      <Route
        path="/admin"
        element={
          <PrivateRoute roleRequired="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Dashboard - Protected */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            {channelData && analysis && userData ? (
              <Dashboard channelData={channelData} analysis={analysis} userData={userData} />
            ) : (
              <Navigate to="/onboarding" replace />
            )}
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

// Extracted PrivateRoute Component to handle logic cleanly
const PrivateRoute = ({ children, roleRequired }: { children: React.ReactElement, roleRequired?: 'admin' }) => {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized' | 'redirect'>('loading');
  const navigate = useNavigate();

  React.useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus('redirect');
        return;
      }

      if (roleRequired === 'admin') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin') {
          setStatus('authorized');
        } else {
          setStatus('unauthorized');
        }
      } else {
        setStatus('authorized');
      }
    };
    check();
  }, [roleRequired]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-[#0F0F0F]" />; // Silent loading or spinner
  }

  if (status === 'redirect') {
    return <Navigate to="/login" replace />;
  }

  if (status === 'unauthorized') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default App;