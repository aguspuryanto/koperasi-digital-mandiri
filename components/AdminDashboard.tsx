
import React, { useEffect, useState } from 'react';
import { AppState } from '../types';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { getFinancialAdvice } from '../services/geminiService';

const AdminDashboard: React.FC<{ state: AppState }> = ({ state }) => {
  const [aiInsight, setAiInsight] = useState<string>('Menganalisis data keuangan...');
  
  const totalBalance = state.members.reduce((sum, m) => sum + m.balance, 0);
  const activeLoans = state.loans.filter(l => l.status === 'ACTIVE').length;
  const totalLoanPrincipal = state.loans.filter(l => l.status === 'ACTIVE').reduce((sum, l) => sum + l.remainingBalance, 0);

  const chartData = [
    { name: 'Jan', revenue: 4000, savings: 2400 },
    { name: 'Feb', revenue: 3000, savings: 1398 },
    { name: 'Mar', revenue: 2000, savings: 9800 },
    { name: 'Apr', revenue: 2780, savings: 3908 },
    { name: 'May', revenue: 1890, savings: 4800 },
    { name: 'Jun', revenue: 2390, savings: 3800 },
  ];

  const distributionData = [
    { name: 'Simpanan Pokok', value: 100000000, color: '#4f46e5' },
    { name: 'Simpanan Wajib', value: 50000000, color: '#10b981' },
    { name: 'Simpanan Sukarela', value: 17500000, color: '#f59e0b' },
  ];

  useEffect(() => {
    const fetchInsight = async () => {
      const summary = {
        totalAssets: totalBalance + totalLoanPrincipal,
        totalSavings: totalBalance,
        loanCount: activeLoans,
        outstandingLoans: totalLoanPrincipal
      };
      const advice = await getFinancialAdvice(summary);
      setAiInsight(advice);
    };
    fetchInsight();
  }, [totalBalance, totalLoanPrincipal, activeLoans]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Ringkasan</h1>
          <p className="text-slate-500">Pantau performa koperasi secara real-time</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-400 uppercase">Status Sistem</p>
          <div className="flex items-center gap-2 text-emerald-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online & Terhubung
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Anggota', value: state.members.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
          { label: 'Total Simpanan', value: `Rp ${totalBalance.toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5.4%' },
          { label: 'Pinjaman Aktif', value: activeLoans, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '-2.1%' },
          { label: 'Outstanding', value: `Rp ${totalLoanPrincipal.toLocaleString()}`, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+8%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h3 className="text-xl font-bold text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* AI Insights Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-amber-300" />
            <h2 className="text-lg font-semibold uppercase tracking-wider">AI Financial Insights</h2>
          </div>
          <p className="text-indigo-50 leading-relaxed max-w-4xl text-lg italic">
            "{aiInsight}"
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Pertumbuhan Keuangan (6 Bulan)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Pendapatan" />
                <Bar dataKey="savings" fill="#10b981" radius={[4, 4, 0, 0]} name="Simpanan" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Distribusi Aset</h3>
          <div className="h-80 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/2 space-y-4">
              {distributionData.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">{d.name}</p>
                    <p className="text-xs text-slate-400">Rp {d.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
