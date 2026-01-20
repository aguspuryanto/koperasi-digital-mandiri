
import React, { useState, useEffect } from 'react';
import { AppState, UserRole, Member, Loan, LoanStatus, TransactionType } from './types';
import { INITIAL_MEMBERS, INITIAL_COA } from './constants';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import MemberManagement from './components/MemberManagement';
import LoanManagement from './components/LoanManagement';
import AccountingReports from './components/AccountingReports';
import { LogIn, Landmark } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    members: INITIAL_MEMBERS,
    loans: [
      {
        id: 'LOAN001',
        memberId: 'MEM002',
        principal: 50000000,
        interestRate: 10,
        tenureMonths: 24,
        status: LoanStatus.ACTIVE,
        appliedDate: '2023-12-01',
        approvedDate: '2023-12-05',
        monthlyInstallment: 2500000,
        remainingBalance: 45000000
      }
    ],
    savingsTransactions: [
      {
        id: 'TRX001',
        memberId: 'MEM001',
        type: TransactionType.DEPOSIT,
        amount: 1000000,
        date: '2023-11-15',
        description: 'Setoran Awal'
      },
      {
        id: 'TRX002',
        memberId: 'MEM001',
        type: TransactionType.DEPOSIT,
        amount: 500000,
        date: '2023-12-01',
        description: 'Simpanan Sukarela'
      },
      {
        id: 'TRX003',
        memberId: 'MEM002',
        type: TransactionType.DEPOSIT,
        amount: 12500000,
        date: '2023-10-20',
        description: 'Simpanan Pokok & Wajib'
      }
    ],
    coa: INITIAL_COA,
    journal: []
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const login = (role: UserRole) => {
    setState(prev => ({
      ...prev,
      currentUser: {
        id: role === UserRole.ADMIN ? 'ADM01' : 'MEM001',
        role,
        name: role === UserRole.ADMIN ? 'Administrator' : 'Budi Santoso'
      }
    }));
    setActiveTab(role === UserRole.ADMIN ? 'dashboard' : 'member-dashboard');
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const addMember = (member: Member) => {
    setState(prev => ({
      ...prev,
      members: [...prev.members, member]
    }));
  };

  const updateLoanStatus = (loanId: string, status: LoanStatus) => {
    setState(prev => ({
      ...prev,
      loans: prev.loans.map(l => 
        l.id === loanId ? { 
          ...l, 
          approvedDate: status === LoanStatus.APPROVED ? new Date().toISOString().split('T')[0] : l.approvedDate,
          status: status === LoanStatus.APPROVED ? LoanStatus.ACTIVE : status
        } : l
      )
    }));
  };

  if (!state.currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl mb-4">
              <Landmark size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800">Koperasi Digital</h1>
            <p className="text-slate-500 mt-2">Sistem Informasi Simpan Pinjam Terpadu</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
            <div className="space-y-4">
              <button 
                onClick={() => login(UserRole.ADMIN)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white shadow-sm">
                    <LogIn size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Masuk sebagai Admin</p>
                    <p className="text-xs text-slate-500">Kelola operasional & akuntansi</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => login(UserRole.MEMBER)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white shadow-sm">
                    <LogIn size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Masuk sebagai Anggota</p>
                    <p className="text-xs text-slate-500">Cek simpanan & ajukan pinjaman</p>
                  </div>
                </div>
              </button>
            </div>
            
            <p className="text-xs text-center text-slate-400">
              © 2024 Koperasi Mandiri Digital. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (state.currentUser?.role === UserRole.ADMIN) {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard state={state} />;
        case 'members': return <MemberManagement state={state} addMember={addMember} />;
        case 'loans': return <LoanManagement state={state} updateLoanStatus={updateLoanStatus} />;
        case 'accounting': return <AccountingReports state={state} />;
        case 'savings': return (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <h2 className="text-xl font-bold text-slate-400">Modul Transaksi Simpanan</h2>
            <p className="text-slate-300">Modul ini dalam pengembangan di fase 2.</p>
          </div>
        );
        default: return <AdminDashboard state={state} />;
      }
    } else {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 rounded-3xl text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Selamat Datang, {state.currentUser.name}!</h2>
            <p className="text-emerald-50 opacity-90">Pantau perkembangan keuangan Anda secara transparan.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <p className="text-sm font-medium opacity-80 mb-1">Total Simpanan Saya</p>
                <h3 className="text-3xl font-bold">Rp 5.000.000</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <p className="text-sm font-medium opacity-80 mb-1">Pinjaman Aktif</p>
                <h3 className="text-3xl font-bold">Rp 0</h3>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Aktivitas Terakhir</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <div>
                      <p className="font-semibold text-slate-800">Setoran Sukarela</p>
                      <p className="text-xs text-slate-500">14 Des 2023</p>
                    </div>
                    <p className="text-emerald-600 font-bold">+ Rp 500.000</p>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-slate-800">Setoran Wajib</p>
                      <p className="text-xs text-slate-500">01 Des 2023</p>
                    </div>
                    <p className="text-emerald-600 font-bold">+ Rp 100.000</p>
                  </div>
                </div>
             </div>
             <div className="bg-indigo-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">Ingin menambah modal?</h3>
                  <p className="text-indigo-100 text-sm">Ajukan pinjaman secara online dengan bunga ringan mulai dari 0.8% flat per bulan.</p>
                </div>
                <button className="mt-6 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors w-fit">
                  Ajukan Sekarang
                </button>
             </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Layout 
      role={state.currentUser.role} 
      userName={state.currentUser.name}
      onLogout={logout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
