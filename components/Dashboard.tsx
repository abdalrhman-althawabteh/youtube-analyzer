import React, { useState } from 'react';
import { ChannelData, AIAnalysis, OnboardingData } from '../types';
import StatCard from './StatCard';
import { 
  Users, Eye, Video, Activity, Zap, Star, 
  ExternalLink, Calendar, LayoutDashboard, Lightbulb, TrendingUp, MessageCircle
} from 'lucide-react';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area 
} from 'recharts';

interface DashboardProps {
  channelData: ChannelData;
  analysis: AIAnalysis;
  userData: OnboardingData;
}

type Tab = 'overview' | 'ideas' | 'strategy';

const Dashboard: React.FC<DashboardProps> = ({ channelData, analysis, userData }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  const chartData = channelData.recentVideos.slice().reverse().map(v => ({
    name: v.title.substring(0, 15) + '...',
    views: v.viewCount,
    likes: v.likeCount
  }));

  const renderOverview = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeIn">
        <StatCard 
          title="المشتركين" 
          value={channelData.subscriberCount.toLocaleString()} 
          icon={<Users size={20} />}
          trend="up" trendValue="+12%"
        />
        <StatCard 
          title="إجمالي المشاهدات" 
          value={channelData.viewCount.toLocaleString()} 
          icon={<Eye size={20} />}
          trend="up" trendValue="+5.4%"
        />
        <StatCard 
          title="الفيديوهات" 
          value={channelData.videoCount} 
          icon={<Video size={20} />}
          subValue="آخر فيديو: قبل يومين"
        />
        <StatCard 
          title="صحة القناة" 
          value={`${analysis.channelHealthScore}%`} 
          icon={<Activity size={20} />}
          trend={analysis.channelHealthScore > 70 ? 'up' : 'neutral'}
          trendValue={analysis.channelHealthScore > 70 ? 'ممتاز' : 'يحتاج تحسين'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-lg">أداء آخر الفيديوهات</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF0000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF0000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} interval={0} />
                <YAxis stroke="#666" tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="views" stroke="#FF0000" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#F39C12] to-[#FF0000]"></div>
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <Zap size={18} className="text-[#F39C12]" />
            أولوية التنفيذ
          </h3>
          <div className="space-y-3 overflow-y-auto max-h-[250px] pr-1 custom-scrollbar">
            {analysis.actionItems.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#0F0F0F] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    item.priority === 'High' ? 'bg-red-500/20 text-red-500' : 
                    item.priority === 'Medium' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'
                  }`}>
                    {item.priority === 'High' ? 'عاجل' : item.priority === 'Medium' ? 'متوسط' : 'عادي'}
                  </span>
                </div>
                <h4 className="text-white text-sm font-bold mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 mb-8">
        <h3 className="font-bold text-white text-lg mb-4">تحليلات الذكاء الاصطناعي العميقة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.keyInsights.map((insight, idx) => (
            <div key={idx} className="bg-[#0F0F0F] p-4 rounded-xl border-r-2 border-[#FF0000]">
              <p className="text-gray-300 text-sm leading-relaxed">"{insight}"</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderContentIdeas = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">بنك أفكار المحتوى</h2>
          <p className="text-gray-400 text-sm">أفكار تم توليدها بناءً على طلبات جمهورك في التعليقات وأداء القناة.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analysis.contentIdeas.map((idea, idx) => (
          <div key={idx} className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 hover:border-[#FF0000] hover:shadow-lg hover:shadow-[#FF0000]/10 transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                idea.format === 'Video' ? 'bg-red-500/10 text-red-500' : 
                idea.format === 'Short' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                {idea.format === 'Video' ? 'فيديو طويل' : idea.format === 'Short' ? 'Shorts' : 'منتدى'}
              </span>
              <div className="flex gap-0.5">
                {Array.from({length: 5}).map((_, i) => (
                  <Star key={i} size={14} className={i < idea.score ? "text-[#F39C12] fill-[#F39C12]" : "text-gray-700"} />
                ))}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FF0000] transition-colors">
              {idea.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 flex-grow">
              {idea.whyItWorks}
            </p>

            {idea.basedOnComment && (
              <div className="bg-[#0F0F0F] p-3 rounded-lg border border-white/5 mt-auto">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <MessageCircle size={12} />
                  <span>بناءً على طلب متابع:</span>
                </div>
                <p className="text-gray-300 text-xs italic">"{idea.basedOnComment}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStrategy = () => (
    <div className="space-y-6 animate-fadeIn">
       <div>
          <h2 className="text-2xl font-bold text-white mb-2">استراتيجية النمو المخصصة</h2>
          <p className="text-gray-400 text-sm">خطة عمل مصممة لوقتك المتاح ({userData.weeklyHours} ساعات/أسبوعياً) وأهدافك.</p>
        </div>

      <div className="relative border-r-2 border-[#272727] mr-4 space-y-12 py-4">
        {analysis.strategyPlan?.map((step, idx) => (
          <div key={idx} className="relative pr-8">
            {/* Timeline Dot */}
            <div className="absolute -right-[9px] top-0 w-4 h-4 rounded-full bg-[#FF0000] border-4 border-[#0F0F0F]"></div>
            
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 hover:border-[#FF0000]/30 transition-all">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-white">{step.phase}</h3>
                  <span className="text-[#F39C12] text-sm font-bold">{step.timeline}</span>
                </div>
                <div className="bg-[#272727] px-4 py-2 rounded-lg text-center">
                  <div className="text-gray-500 text-xs">التركيز</div>
                  <div className="text-white font-bold">{step.focus}</div>
                </div>
              </div>

              <div className="space-y-3">
                {step.actions.map((action, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-[#FF0000]/10 text-[#FF0000] w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-gray-300 text-sm">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {(!analysis.strategyPlan || analysis.strategyPlan.length === 0) && (
             <div className="text-center text-gray-500">لا توجد خطة متاحة حالياً. تأكد من جودة التحليل.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0F0F0F] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F0F0F] border-l border-white/5 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-black text-white tracking-tighter">
            Red<span className="text-[#FF0000]">Audit</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-[#1A1A1A] text-white border border-[#FF0000]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={20} className={activeTab === 'overview' ? "text-[#FF0000]" : ""} />
            <span className="font-bold">لوحة التحكم</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('ideas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ideas' ? 'bg-[#1A1A1A] text-white border border-[#FF0000]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Lightbulb size={20} className={activeTab === 'ideas' ? "text-[#FF0000]" : ""} />
            <span>أفكار المحتوى</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('strategy')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'strategy' ? 'bg-[#1A1A1A] text-white border border-[#FF0000]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <TrendingUp size={20} className={activeTab === 'strategy' ? "text-[#FF0000]" : ""} />
            <span>الاستراتيجية</span>
          </button>
        </nav>

        <div className="p-4 m-4 bg-[#1A1A1A] rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <img src={channelData.thumbnail} className="w-8 h-8 rounded-full" alt="Channel" />
            <div className="truncate">
               <div className="text-white text-xs font-bold truncate">{channelData.title}</div>
               <div className="text-gray-500 text-[10px]">{channelData.customUrl}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Header Mobile Only */}
        <div className="md:hidden mb-6 flex justify-between items-center">
             <h1 className="text-xl font-black text-white">Red<span className="text-[#FF0000]">Audit</span></h1>
             <img src={channelData.thumbnail} className="w-8 h-8 rounded-full" alt="Channel" />
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'ideas' && renderContentIdeas()}
        {activeTab === 'strategy' && renderStrategy()}
      </main>
    </div>
  );
};

export default Dashboard;