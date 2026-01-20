
import React, { useState } from 'react';
import { Member, AppState, TransactionType, LoanStatus } from '../types';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  Filter, 
  Eye, 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  History,
  CreditCard
} from 'lucide-react';

interface MemberManagementProps {
  state: AppState;
  addMember: (member: Member) => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ state, addMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'savings' | 'loans'>('savings');
  
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });

  const filteredMembers = state.members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member: Member = {
      ...newMember as Member,
      id: `MEM${String(state.members.length + 1).padStart(3, '0')}`,
      joinedDate: new Date().toISOString().split('T')[0],
      balance: 0
    };
    addMember(member);
    setShowAddModal(false);
    setNewMember({ name: '', email: '', phone: '', address: '', status: 'active' });
  };

  const getMemberTransactions = (memberId: string) => {
    return state.savingsTransactions.filter(t => t.memberId === memberId);
  };

  const getMemberLoans = (memberId: string) => {
    return state.loans.filter(l => l.memberId === memberId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Anggota</h1>
          <p className="text-slate-500">Kelola data seluruh anggota koperasi aktif</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold shadow-sm"
        >
          <UserPlus size={18} />
          Tambah Anggota Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau ID anggota..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Filter size={16} />
            Filter Status
          </button>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Info Anggota</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bergabung</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Saldo Simpanan</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-500">ID: {member.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} /> {member.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone size={12} /> {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} />
                      {member.joinedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">Rp {member.balance.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {member.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedMember(member)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1 text-xs font-bold"
                        title="Lihat Detail Transaksi"
                      >
                        <Eye size={16} />
                        Detail
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Transaksi Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                  {selectedMember.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedMember.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span>ID: {selectedMember.id}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Anggota sejak {selectedMember.joinedDate}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-500">Total Simpanan</p>
                    <Wallet size={18} className="text-emerald-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Rp {selectedMember.balance.toLocaleString()}</h4>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-500">Sisa Pinjaman</p>
                    <CreditCard size={18} className="text-indigo-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">
                    Rp {getMemberLoans(selectedMember.id).filter(l => l.status === LoanStatus.ACTIVE).reduce((acc, curr) => acc + curr.remainingBalance, 0).toLocaleString()}
                  </h4>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-500">Status Anggota</p>
                    <div className={`w-2 h-2 rounded-full ${selectedMember.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 capitalize">{selectedMember.status}</h4>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-100">
                  <button 
                    onClick={() => setActiveHistoryTab('savings')}
                    className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
                      activeHistoryTab === 'savings' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : 'text-slate-400 border-transparent hover:text-slate-600'
                    }`}
                  >
                    Riwayat Simpanan
                  </button>
                  <button 
                    onClick={() => setActiveHistoryTab('loans')}
                    className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
                      activeHistoryTab === 'loans' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : 'text-slate-400 border-transparent hover:text-slate-600'
                    }`}
                  >
                    Riwayat Pinjaman
                  </button>
                </div>

                <div className="p-0">
                  {activeHistoryTab === 'savings' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tanggal</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Keterangan</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Jumlah</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {getMemberTransactions(selectedMember.id).length === 0 ? (
                            <tr>
                              <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">Belum ada riwayat transaksi simpanan</td>
                            </tr>
                          ) : (
                            getMemberTransactions(selectedMember.id).map(t => (
                              <tr key={t.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 text-sm text-slate-600">{t.date}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    {t.type === TransactionType.DEPOSIT ? (
                                      <div className="p-1 bg-emerald-100 text-emerald-600 rounded">
                                        <ArrowUpRight size={14} />
                                      </div>
                                    ) : (
                                      <div className="p-1 bg-rose-100 text-rose-600 rounded">
                                        <ArrowDownRight size={14} />
                                      </div>
                                    )}
                                    <span className="text-sm font-medium text-slate-800">{t.description}</span>
                                  </div>
                                </td>
                                <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === TransactionType.DEPOSIT ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {t.type === TransactionType.DEPOSIT ? '+' : '-'} Rp {t.amount.toLocaleString()}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tgl Pengajuan</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Plafon</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tenor</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Sisa</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {getMemberLoans(selectedMember.id).length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Belum ada riwayat pengajuan pinjaman</td>
                            </tr>
                          ) : (
                            getMemberLoans(selectedMember.id).map(l => (
                              <tr key={l.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 text-sm text-slate-600">{l.appliedDate}</td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-800">Rp {l.principal.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{l.tenureMonths} bln</td>
                                <td className="px-6 py-4 text-sm font-bold text-indigo-600">Rp {l.remainingBalance.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                  <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                    l.status === LoanStatus.ACTIVE ? 'bg-indigo-100 text-indigo-700' :
                                    l.status === LoanStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                                    l.status === LoanStatus.PAID_OFF ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-rose-100 text-rose-700'
                                  }`}>
                                    {l.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
              <button 
                onClick={() => setSelectedMember(null)}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Tutup
              </button>
              <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors">
                Cetak Laporan Anggota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Registrasi Anggota Baru</h3>
              <p className="text-sm text-slate-500">Lengkapi data untuk membuat akun anggota</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={newMember.name}
                  onChange={e => setNewMember({...newMember, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={newMember.email}
                    onChange={e => setNewMember({...newMember, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">No. HP</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={newMember.phone}
                    onChange={e => setNewMember({...newMember, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={newMember.address}
                  onChange={e => setNewMember({...newMember, address: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 shadow-sm transition-colors"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
