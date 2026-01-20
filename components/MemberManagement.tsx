
import React, { useState } from 'react';
import { Member, AppState } from '../types';
import { Search, UserPlus, MoreVertical, Mail, Phone, Calendar, Filter } from 'lucide-react';

interface MemberManagementProps {
  state: AppState;
  addMember: (member: Member) => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ state, addMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
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
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
