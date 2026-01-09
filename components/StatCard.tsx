import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, trend, trendValue, icon }) => {
  return (
    <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#FF0000]/30 transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF0000]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#FF0000]/10 transition-all"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#0F0F0F] rounded-xl text-[#FF0000]">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'text-green-400 bg-green-400/10' : 
            trend === 'down' ? 'text-red-400 bg-red-400/10' : 'text-gray-400 bg-gray-400/10'
          }`}>
            <span>{trendValue}</span>
            {trend === 'up' && <TrendingUp size={12} />}
            {trend === 'down' && <TrendingDown size={12} />}
            {trend === 'neutral' && <Minus size={12} />}
          </div>
        )}
      </div>
      
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white mb-1 font-[Cairo]">{value}</div>
      {subValue && <div className="text-xs text-gray-500">{subValue}</div>}
    </div>
  );
};

export default StatCard;