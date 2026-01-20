
import React, { useState } from 'react';
import { AppState, Loan, LoanStatus, Member } from '../types';
import { 
  Calculator, 
  HandCoins, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';
import { simulateLoanRisk } from '../services/geminiService';

interface LoanManagementProps {
  state: AppState;
  updateLoanStatus: (loanId: string, status: LoanStatus) => void;
}

const LoanManagement: React.FC<LoanManagementProps> = ({ state, updateLoanStatus }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'simulator'>('pending');
  const [simulatorData, setSimulatorData] = useState({
    amount: 10000000,
    tenure: 12,
    interest: 12 // 12% per year
  });
  const [aiRiskResult, setAiRiskResult] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const pendingLoans = state.loans.filter(l => l.status === LoanStatus.PENDING);
  const activeLoansList = state.loans.filter(l => l.status === LoanStatus.ACTIVE);

  const getMemberName = (id: string) => state.members.find(m => m.id === id)?.name || 'Unknown';

  const monthlyInterest = (simulatorData.amount * (simulatorData.interest / 100)) / 12;
  const monthlyPrincipal = simulatorData.amount / simulatorData.tenure;
  const totalInstallment = monthlyInterest + monthlyPrincipal;

  const handleAnalyzeRisk = async (loan: Loan) => {
    setAnalyzingId(loan.id);
    const member = state.members.find(m => m.id === loan.memberId);
    const result = await simulateLoanRisk(loan, member);
    setAiRiskResult(result);
    setAnalyzingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pinjaman</h1>
          <p className="text-slate-500">Persetujuan, simulasi, dan monitoring piutang</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'pending', label: 'Antrean', count: pendingLoans.length },
            { id: 'active', label: 'Aktif', count: activeLoansList.length },
            { id: 'simulator', label: 'Simulator', count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label} {tab.count !== null && <span className="ml-1 opacity-50">({tab.count})</span>}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Calculator size={20} className="text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-800">Simulator Pinjaman</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Pinjaman</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">Rp</span>
                  <input 
                    type="number" 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20"
                    value={simulatorData.amount}
                    onChange={e => setSimulatorData({...simulatorData, amount: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tenor (Bulan)</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20"
                  value={simulatorData.tenure}
                  onChange={e => setSimulatorData({...simulatorData, tenure: Number(e.target.value)})}
                >
                  {[3, 6, 12, 24, 36].map(t => <option key={t} value={t}>{t} Bulan</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bunga Tahunan (%)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20"
                  value={simulatorData.interest}
                  onChange={e => setSimulatorData({...simulatorData, interest: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-8">Estimasi Angsuran</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-sm font-medium text-slate-500 mb-1">Angsuran per Bulan</p>
                <h4 className="text-3xl font-extrabold text-indigo-600">Rp {Math.round(totalInstallment).toLocaleString()}</h4>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-sm font-medium text-slate-500 mb-1">Total Pengembalian</p>
                <h4 className="text-3xl font-extrabold text-slate-800">Rp {Math.round(totalInstallment * simulatorData.tenure).toLocaleString()}</h4>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Info size={18} className="text-slate-400" />
                <h4 className="font-bold text-slate-800">Rincian Angsuran</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Pokok Pinjaman</span>
                  <span className="font-semibold text-slate-800">Rp {Math.round(monthlyPrincipal).toLocaleString()} / bulan</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Bunga Pinjaman ({simulatorData.interest}%)</span>
                  <span className="font-semibold text-slate-800">Rp {Math.round(monthlyInterest).toLocaleString()} / bulan</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-bold">
                  <span className="text-slate-800">Total Bulanan</span>
                  <span className="text-indigo-600">Rp {Math.round(totalInstallment).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Anggota</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Plafon</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tenor</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingLoans.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Tidak ada pengajuan pinjaman tertunda</td>
                    </tr>
                  ) : pendingLoans.map(loan => (
                    <tr key={loan.id} className="hover:bg-slate-50/50 cursor-pointer">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{getMemberName(loan.memberId)}</p>
                        <p className="text-xs text-slate-400">ID: {loan.memberId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">Rp {loan.principal.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Bunga {loan.interestRate}%</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{loan.tenureMonths} Bulan</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleAnalyzeRisk(loan)}
                            disabled={analyzingId === loan.id}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50"
                          >
                            <Sparkles size={18} />
                          </button>
                          <button 
                            onClick={() => updateLoanStatus(loan.id, LoanStatus.APPROVED)}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => updateLoanStatus(loan.id, LoanStatus.REJECTED)}
                            className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" />
              AI Credit Analysis
            </h3>
            {analyzingId ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 font-medium">Mengevaluasi risiko kredit...</p>
              </div>
            ) : aiRiskResult ? (
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{aiRiskResult}"
                </p>
              </div>
            ) : (
              <div className="text-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-xl">
                <Clock className="mx-auto text-slate-300 mb-3" size={32} />
                <p className="text-sm text-slate-500">Pilih pengajuan untuk memulai analisis risiko cerdas.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'active' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Anggota</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sisa Hutang</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Angsuran/Bln</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeLoansList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Belum ada pinjaman aktif</td>
                  </tr>
                ) : activeLoansList.map(loan => (
                  <tr key={loan.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{getMemberName(loan.memberId)}</p>
                      <p className="text-xs text-slate-400">Disetujui: {loan.approvedDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">Rp {loan.remainingBalance.toLocaleString()}</p>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ width: `${((loan.principal - loan.remainingBalance) / loan.principal) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">Rp {loan.monthlyInstallment.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;
