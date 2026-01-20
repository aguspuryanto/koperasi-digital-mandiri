
import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  PiggyBank, 
  HandCoins, 
  BookText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  UserCircle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, userName, onLogout, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Anggota', icon: Users },
    { id: 'savings', label: 'Simpanan', icon: PiggyBank },
    { id: 'loans', label: 'Pinjaman', icon: HandCoins },
    { id: 'accounting', label: 'Akuntansi', icon: BookText },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const memberMenu = [
    { id: 'member-dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'member-savings', label: 'Simpanan Saya', icon: PiggyBank },
    { id: 'member-loans', label: 'Pinjaman Saya', icon: HandCoins },
    { id: 'member-profile', label: 'Profil', icon: UserCircle },
  ];

  const menuItems = role === UserRole.ADMIN ? adminMenu : memberMenu;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
            <span className="font-bold text-lg text-slate-800">Koperasi Digital</span>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-4 px-4 py-2 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <UserCircle size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                <p className="text-xs text-slate-500 capitalize">{role.toLowerCase()}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut size={20} />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="sticky top-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-6">
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-500" />
              Sistem Terenkripsi
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
