import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
    Users, Search, Filter, TrendingUp, TrendingDown,
    Shield, LogOut, LayoutDashboard, ChevronDown, ExternalLink
} from 'lucide-react';
import { OnboardingData, ChannelData } from '../types';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    created_at: string;
    onboarding_data: {
        onboarding: OnboardingData;
        channel: ChannelData;
    } | null;
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterAndSortUsers();
    }, [searchTerm, users, sortOrder]);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
            setFilteredUsers(data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            // If unauthorized, likely not admin
            alert('غير مصرح لك بالوصول لهذه الصفحة');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortUsers = () => {
        let result = [...users];

        // Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.email?.toLowerCase().includes(lowerTerm) ||
                u.full_name?.toLowerCase().includes(lowerTerm) ||
                u.onboarding_data?.channel.title.toLowerCase().includes(lowerTerm)
            );
        }

        // Sort by Subscribers
        result.sort((a, b) => {
            const subsA = parseInt(a.onboarding_data?.channel.subscriberCount as any) || 0;
            const subsB = parseInt(b.onboarding_data?.channel.subscriberCount as any) || 0;
            return sortOrder === 'desc' ? subsB - subsA : subsA - subsB;
        });

        setFilteredUsers(result);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    // Stats
    const totalUsers = users.length;
    const totalSubscribers = users.reduce((acc, curr) => {
        const subs = parseInt(curr.onboarding_data?.channel.subscriberCount as any) || 0;
        return acc + subs;
    }, 0);
    const usersWithChannels = users.filter(u => u.onboarding_data?.channel).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center text-white">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white font-sans" dir="rtl">
            {/* Header */}
            <nav className="bg-[#1A1A1A] border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-red-500/10 p-2 rounded-lg">
                        <Shield className="text-red-500" size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">لوحة تحكم المشرف (CRM)</h1>
                        <p className="text-xs text-gray-400">RedAudit AI Admin</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-400 hover:text-white text-sm"
                    >
                        العودة للوحة القيادة
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm font-bold"
                    >
                        <LogOut size={16} />
                        تسجيل خروج
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
                                <Users size={24} />
                            </div>
                            <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">+100%</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{totalUsers}</h3>
                        <p className="text-gray-400 text-sm">إجمالي المستخدمين المسجلين</p>
                    </div>

                    <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-[#FF0000]/10 p-3 rounded-xl text-[#FF0000]">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{(totalSubscribers / 1000000).toFixed(2)}M+</h3>
                        <p className="text-gray-400 text-sm">مجموع المشتركين المُدارين</p>
                    </div>

                    <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-[#F39C12]/10 p-3 rounded-xl text-[#F39C12]">
                                <LayoutDashboard size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{usersWithChannels}</h3>
                        <p className="text-gray-400 text-sm">قنوات تم ربطها وتحليلها</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-[#1A1A1A] p-4 rounded-xl border border-white/5">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="ابحث عن اسم، بريد، أو قناة..."
                            className="w-full bg-[#0F0F0F] border border-[#333] rounded-lg pl-4 pr-10 py-2.5 text-white focus:border-[#FF0000] outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-gray-400 text-sm">ترتيب حسب المشتركين:</span>
                        <button
                            onClick={() => setSortOrder('desc')}
                            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${sortOrder === 'desc' ? 'bg-[#FF0000]/10 border-[#FF0000] text-[#FF0000]' : 'border-[#333] text-gray-400'}`}
                        >
                            الأعلى
                        </button>
                        <button
                            onClick={() => setSortOrder('asc')}
                            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${sortOrder === 'asc' ? 'bg-[#FF0000]/10 border-[#FF0000] text-[#FF0000]' : 'border-[#333] text-gray-400'}`}
                        >
                            الأقل
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="bg-[#252525] text-gray-400 text-sm border-b border-[#333]">
                                    <th className="p-4 font-medium">المستخدم</th>
                                    <th className="p-4 font-medium">القناة</th>
                                    <th className="p-4 font-medium">المشتركين</th>
                                    <th className="p-4 font-medium">عدد الفيديوهات</th>
                                    <th className="p-4 font-medium">تاريخ التسجيل</th>
                                    <th className="p-4 font-medium">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#333]">
                                {filteredUsers.map((user) => {
                                    const channel = user.onboarding_data?.channel;
                                    return (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold">
                                                        {user.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{user.full_name || 'بدون اسم'}</div>
                                                        <div className="text-gray-500 text-xs">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {channel ? (
                                                    <div className="flex items-center gap-2">
                                                        <img src={channel.thumbnail} alt="" className="w-8 h-8 rounded-full" />
                                                        <span className="text-sm text-gray-300 truncate max-w-[150px]" dir="ltr">{channel.title}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-600 text-xs italic">لم يتم الربط</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {channel ? (
                                                    <span className="font-mono text-[#F39C12]">{parseInt(channel.subscriberCount as any).toLocaleString()}</span>
                                                ) : '-'}
                                            </td>
                                            <td className="p-4">
                                                {channel ? (
                                                    <span className="font-mono text-gray-300">{channel.videoCount}</span>
                                                ) : '-'}
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">
                                                {new Date(user.created_at).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="p-4">
                                                {channel && (
                                                    <a
                                                        href={`https://youtube.com/${channel.customUrl || 'channel/' + channel.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            لا توجد نتائج مطابقة للبحث.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;
