
import React from 'react';
import { AppState, CoA } from '../types';
import { FileText, Calculator, TrendingUp, Landmark, Download } from 'lucide-react';

const AccountingReports: React.FC<{ state: AppState }> = ({ state }) => {
  const assets = state.coa.filter(c => c.type === 'Asset');
  const liabilities = state.coa.filter(c => c.type === 'Liability');
  const equity = state.coa.filter(c => c.type === 'Equity');
  const revenues = state.coa.filter(c => c.type === 'Revenue');
  const expenses = state.coa.filter(c => c.type === 'Expense');

  const totalAssets = assets.reduce((sum, c) => sum + c.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, c) => sum + c.balance, 0);
  const totalEquity = equity.reduce((sum, c) => sum + c.balance, 0);
  const totalRevenue = revenues.reduce((sum, c) => sum + c.balance, 0);
  const totalExpense = expenses.reduce((sum, c) => sum + c.balance, 0);
  const netProfit = totalRevenue - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Keuangan</h1>
          <p className="text-slate-500">Neraca, Laba Rugi, dan Arus Kas Koperasi</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold shadow-sm hover:bg-indigo-700">
          <Download size={18} />
          Ekspor PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Laba Rugi */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <TrendingUp size={20} />
            <h3 className="text-lg font-bold">Laporan Laba Rugi</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-3">Pendapatan Operasional</p>
              {revenues.map(c => (
                <div key={c.code} className="flex justify-between text-sm py-1">
                  <span className="text-slate-600">{c.name}</span>
                  <span className="font-semibold text-slate-800">Rp {c.balance.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between font-bold text-indigo-600">
                <span>Total Pendapatan</span>
                <span>Rp {totalRevenue.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-xs font-bold text-slate-400 uppercase mb-3">Beban-Beban</p>
              {expenses.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Belum ada beban tercatat</p>
              ) : expenses.map(c => (
                <div key={c.code} className="flex justify-between text-sm py-1">
                  <span className="text-slate-600">{c.name}</span>
                  <span className="font-semibold text-slate-800">Rp {c.balance.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between font-bold text-rose-600">
                <span>Total Beban</span>
                <span>Rp {totalExpense.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl mt-6 flex justify-between items-center">
              <span className="text-lg font-bold text-slate-800">Sisa Hasil Usaha (Laba)</span>
              <span className={`text-xl font-extrabold ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                Rp {netProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Neraca Ringkas */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <Landmark size={20} />
            <h3 className="text-lg font-bold">Neraca Keuangan</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase">Aktiva (Aset)</p>
              {assets.map(c => (
                <div key={c.code} className="flex justify-between text-sm py-1 border-b border-slate-50">
                  <span className="text-slate-600">{c.name}</span>
                  <span className="font-semibold text-slate-800">Rp {c.balance.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 flex justify-between font-bold text-indigo-600">
                <span>Total Aktiva</span>
                <span>Rp {totalAssets.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase">Pasiva (Kewajiban & Ekuitas)</p>
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest border-b border-slate-100">Kewajiban</p>
                {liabilities.map(c => (
                  <div key={c.code} className="flex justify-between text-sm py-1">
                    <span className="text-slate-600">{c.name}</span>
                    <span className="font-semibold text-slate-800">Rp {c.balance.toLocaleString()}</span>
                  </div>
                ))}
                
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest border-b border-slate-100 pt-4">Ekuitas</p>
                {equity.map(c => (
                  <div key={c.code} className="flex justify-between text-sm py-1">
                    <span className="text-slate-600">{c.name}</span>
                    <span className="font-semibold text-slate-800">Rp {c.balance.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-between font-bold text-slate-800 border-t-2 border-slate-200">
                <span>Total Pasiva</span>
                <span>Rp {(totalLiabilities + totalEquity).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingReports;
