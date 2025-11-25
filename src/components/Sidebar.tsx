import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Facebook,
  Youtube,
  Instagram,
  Clock,
  LogIn,
  MessageSquare,
  User,
  Shield,
  LogOut,
  Settings,
  Home,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localAuth } from '../lib/localAuth';

type SidebarUser = {
  id: string;
  displayName: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string | null;
};

type NavItem = {
  id: string;
  label: string;
  path: string;
  subItems?: Array<{ label: string; path: string }>;
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SidebarUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCultureOpen, setIsCultureOpen] = useState(false);
  const [openPeriodId, setOpenPeriodId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const isAdminDashboard = location.pathname === '/admin-dashboard';
  // Hide the toggle button on EventDetail pages.
  // Matches common patterns: /event, /event-detail, /event/:id, /events/:id
  const pathLower = location.pathname.toLowerCase();
  const isEventDetailPage = /^\/event(-detail)?(\/|$)|^\/events?\/[^/]+/.test(pathLower);
  // Hide the toggle button on FigureDetail pages
  const isFigureDetailPage = /^\/culture\/historical-figures\/[^/]+/.test(location.pathname);

  const historyPeriods = [
    {
      id: 'prehistoric',
      label: '1. Thời Tiền Sử',
      subPeriods: [
        { label: 'Thời Đại Đồ Đá', path: '/history?era=prehistoric&phase=stone' },
        { label: 'Thời Đại Đồ Đồng Đá', path: '/history?era=prehistoric&phase=chalcolithic' },
        { label: 'Thời Đại Đồ Đồng', path: '/history?era=prehistoric&phase=bronze' },
        { label: 'Thời Đại Đồ Sắt', path: '/history?era=prehistoric&phase=iron' },
      ]
    },
    {
      id: 'ancient',
      label: '2. Thời Kỳ Cổ Đại',
      subPeriods: [
        { label: 'Hồng Bàng và Văn Lang', path: '/history?era=ancient&phase=hongbang' },
        { label: 'Nhà Thục', path: '/history?era=ancient&phase=thuc' },
      ]
    },
    {
      id: 'northern',
      label: '3. Thời Bắc Thuộc (180 TCN – 938)',
      subPeriods: [
        { label: 'Nhà Triệu (180 TCN – 111 TCN)', path: '/history?era=northern&phase=trieu' },
        { label: 'Bắc Thuộc Lần 1 (111 TCN – 40 SCN)', path: '/history?era=northern&phase=first' },
        { label: 'Hai Bà Trưng (40 – 43)', path: '/history?era=northern&phase=trungsisters' },
        { label: 'Bắc Thuộc Lần 2 (43 – 544)', path: '/history?era=northern&phase=second' },
        { label: 'Nhà Tiền Lý (544 – 602)', path: '/history?era=northern&phase=tienLy' },
        { label: 'Bắc Thuộc Lần 3 (602 – 905)', path: '/history?era=northern&phase=third' },
        { label: 'Thời Kỳ Tự Chủ (905 – 939)', path: '/history?era=northern&phase=khuc' },
      ]
    },
    {
      id: 'monarchy',
      label: '4. Thời Kỳ Quân Chủ (939 – 1945)',
      subPeriods: [
        { label: 'Thời Kỳ Độc Lập (939 – 1407)', path: '/history?era=monarchy&phase=independence' },
        { label: 'Bắc Thuộc Lần 4 (1407 – 1427)', path: '/history?era=monarchy&phase=fourthNorthern' },
        { label: 'Trung Hưng – Nhà Hậu Lê (1427 – 1527)', path: '/history?era=monarchy&phase=leLater' },
        { label: 'Thời Kỳ Chia Cắt (1527 – 1802)', path: '/history?era=monarchy&phase=division' },
        { label: 'Thời Kỳ Thống Nhất (1802 – 1858)', path: '/history?era=monarchy&phase=nguyen' },
      ]
    },
    {
      id: 'modern',
      label: '5. Thời Kỳ Hiện Đại (1858 – nay)',
      subPeriods: [
  { label: 'Pháp Thuộc (1858 – 1945)', path: '/history?era=modern&phase=french' },
        { label: 'Việt Nam Dân chủ Cộng hòa (1945 – 1976)', path: '/history?era=modern&phase=drvn' },
        { label: 'Việt Nam Cộng hòa (1955 – 1975) – phía Nam', path: '/history?era=modern&phase=rvn' },
        { label: 'Nước CHXHCN Việt Nam (1976 – nay)', path: '/history?era=modern&phase=socialist' },
        { label: '• Thời bao cấp (1976 – 1986)', path: '/history?era=modern&phase=subsidized' },
        { label: '• Thời kỳ Đổi Mới (1986 – nay)', path: '/history?era=modern&phase=renovation' },
      ]
    }
  ];

  const cultureItems = [
    { label: 'Nhân Vật Lịch Sử', path: '/culture/historical-figures' },
    { label: 'Tư Liệu', path: '/culture/archives' },
  ];

  const navItems: NavItem[] = [
    { id: 'home', label: 'TRANG CHỦ', path: '/' },
    { id: 'history', label: 'LỊCH SỬ', path: '/history' },
    { id: 'culture', label: 'VĂN HÓA', path: '/culture' },
    { id: 'forum', label: 'DIỄN ĐÀN', path: '/forum' },
    { id: 'services', label: 'DỊCH VỤ', path: '/services' },
    { id: 'contact', label: 'LIÊN HỆ', path: '/contact' },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', url: '#' },
    { icon: Facebook, label: 'Facebook', url: '#' },
    { icon: Youtube, label: 'YouTube', url: '#' },
    { icon: MessageSquare, label: 'TikTok', url: '#' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    if (location.pathname !== '/login') {
      sessionStorage.setItem('lastVisitedPath', location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isAdminDashboard) {
      setIsOpen(false);
    }
  }, [isAdminDashboard]);

  useEffect(() => {
    const updateUser = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { user: supaUser } } = await supabase.auth.getUser();
          if (!supaUser) {
            setUser(null);
            return;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('id, display_name, email, role, avatar_url')
            .eq('id', supaUser.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              displayName: profile.display_name || supaUser.email || 'Thành viên',
              email: profile.email || supaUser.email || '',
              role: (profile.role as SidebarUser['role']) || 'user',
              avatarUrl: (profile as any).avatar_url || null,
            });
          } else {
            setUser({
              id: supaUser.id,
              displayName: supaUser.email || 'Thành viên',
              email: supaUser.email || '',
              role: 'user',
              avatarUrl: null,
            });
          }
        } else {
          const currentUser = localAuth.getCurrentUser();
          if (!currentUser) {
            setUser(null);
            return;
          }

          const { profile } = await localAuth.getUserProfile(currentUser.id);
          if (profile) {
            const { password: _password, ...rest } = profile as any;
            setUser({
              id: rest.id,
              displayName: rest.display_name,
              email: rest.email,
              role: rest.role,
              avatarUrl: null,
            });
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Không thể tải thông tin người dùng:', error);
        setUser(null);
      }
    };

    void updateUser();
  }, [location.pathname]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      void (async () => {
        try {
          const { data: { user: supaUser } } = await supabase.auth.getUser();
          if (!supaUser) {
            setUser(null);
            return;
          }
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, display_name, email, role, avatar_url')
            .eq('id', supaUser.id)
            .single();
          if (profile) {
            setUser({
              id: profile.id,
              displayName: profile.display_name || supaUser.email || 'Thành viên',
              email: profile.email || supaUser.email || '',
              role: (profile.role as SidebarUser['role']) || 'user',
              avatarUrl: (profile as any).avatar_url || null,
            });
          }
        } catch (error) {
          setUser(null);
        }
      })();
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const event = new CustomEvent('sidebar:toggle', { detail: { isOpen } });
    window.dispatchEvent(event);
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }
    return () => {
      const event = new CustomEvent('sidebar:toggle', { detail: { isOpen: false } });
      window.dispatchEvent(event);
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      } else {
        localAuth.logout();
      }
    } catch (error) {
      console.error('Không thể đăng xuất:', error);
    } finally {
      setUser(null);
      setIsUserMenuOpen(false);
      navigate('/');
    }
  };

  const handleLoginClick = () => {
    const fromPath = location.pathname !== '/login'
      ? location.pathname
      : sessionStorage.getItem('lastVisitedPath') || '/';
    navigate('/login', { state: { from: fromPath } });
    setIsOpen(false);
  };

  const roleAccent = (role: SidebarUser['role']) => {
    switch (role) {
      case 'admin':
        return 'from-amber-500 via-amber-400 to-yellow-400';
      default:
        return 'from-blue-500 via-sky-500 to-cyan-500';
    }
  };

  const roleIcon = (role: SidebarUser['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3.5 w-3.5" />;
      default:
        return <User className="h-3.5 w-3.5" />;
    }
  };

  return (
    <>
      {!isAdminDashboard && !isEventDetailPage && !isFigureDetailPage && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-6 left-3 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/90 text-[#181818] shadow-lg hover:bg-amber-500 transition-all hover:scale-105"
          aria-label="Menu"
          type="button"
        >
          {isOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      )}

      <div className="fixed top-6 right-6 z-50 flex items-center gap-3" ref={userMenuRef}>
        {user ? (
          <div className="relative">
            <div
              className={`flex items-center gap-2 ${
                isAdminDashboard
                  ? 'rounded-full bg-slate-900/80 p-1 pl-1 pr-2 shadow-xl shadow-indigo-200/60 backdrop-blur'
                  : ''
              }`}
            >
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className={`flex items-center gap-3 rounded-full px-3 py-2 text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                  isAdminDashboard
                    ? 'bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 shadow-lg shadow-indigo-200/60 hover:shadow-xl'
                    : 'bg-[#181818] shadow-[0_4px_20px_rgba(251,191,36,0.3)] hover:bg-[#050505]'
                }`}
                type="button"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${roleAccent(user.role)} text-white font-semibold shadow-lg`}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    user.displayName.charAt(0).toUpperCase()
                  )}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold leading-4">{user.displayName}</p>
                  <span className={`flex items-center gap-1 text-xs uppercase tracking-wide ${isAdminDashboard ? 'text-white/80' : 'text-white/80'}`}>
                    {roleIcon(user.role)}
                    {user.role === 'admin' ? 'Quản Trị' : 'Thành Viên'}
                  </span>
                </div>
              </button>
              {isAdminDashboard && (
                <button
                  onClick={() => navigate('/')}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-indigo-600 shadow-lg shadow-indigo-200/60 transition hover:-translate-y-0.5 hover:bg-white"
                  aria-label="Quay về trang chủ"
                  type="button"
                >
                  <Home size={22} />
                </button>
              )}
            </div>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-slate-900/95 text-white shadow-xl backdrop-blur-md">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="text-sm font-semibold">{user.displayName}</p>
                  <p className="truncate text-xs text-white/70">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-white/10"
                  >
                    <Settings className="h-4 w-4" />
                    Hồ Sơ Cá Nhân
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => handleNavigation('/admin-dashboard')}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-white/10"
                    >
                      <Shield className="h-4 w-4" />
                      Quản Trị Viên
                    </button>
                  )}
                </div>
                <div className="border-t border-white/10 px-4 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 text-sm text-rose-300 hover:text-rose-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLoginClick}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#181818] backdrop-blur-sm border-2 border-amber-400/40 rounded-full text-amber-400 font-bold text-sm tracking-widest shadow-[0_4px_20px_rgba(251,191,36,0.3)] hover:bg-[#050505] hover:text-amber-300 hover:scale-105 hover:shadow-[0_6px_25px_rgba(251,191,36,0.5)] transition-all duration-300"
            aria-label="Đăng Nhập"
            type="button"
          >
            <LogIn className="transition-colors" size={20} />
            <span className="tracking-wide uppercase">Đăng Nhập</span>
          </button>
        )}
      </div>

      <aside
        className={`fixed top-0 left-0 z-[70] h-screen w-[30%] min-w-[320px] max-w-[400px] transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sidebar-elegant`}
      >
        <div className="flex h-full">
          <div className="relative flex flex-1 flex-col px-10 py-12">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 left-8 z-10 flex h-10 w-10 items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110 hover:text-amber-400"
              aria-label="Đóng Menu"
              type="button"
            >
              <X size={20} />
            </button>            <div
              className="cursor-pointer pt-12"
              onClick={() => handleNavigation('/')}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center">
                <Clock className="text-amber-400" size={32} />
              </div>
              <h1 className="text-xl font-display uppercase leading-snug tracking-wider text-amber-400">
                DÒNG SỬ
                <br />
                VIỆT NAM
              </h1>
            </div>

            <nav className="mt-12 flex-1 space-y-4 overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.id}>
                  {item.id === 'history' ? (
                    <>
                      <button
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        className={`group relative py-1.5 text-left font-serif text-base uppercase tracking-wide transition-all duration-300 ${
                          location.pathname === item.path
                            ? 'text-amber-400 font-bold menu-item-active-elegant'
                            : 'text-gray-300 hover:text-amber-400 menu-item-elegant'
                        }`}
                        type="button"
                      >
                        {item.label}
                      </button>
                      {isHistoryOpen && (
                        <div className="ml-4 mt-2 space-y-2">
                          {historyPeriods.map((period) => (
                            <div key={period.id}>
                              <button
                                onClick={() => setOpenPeriodId(openPeriodId === period.id ? null : period.id)}
                                className="block py-1 text-left text-sm text-gray-300 font-semibold transition-colors duration-300 hover:text-amber-400"
                                type="button"
                              >
                                ▸ {period.label}
                              </button>
                              {openPeriodId === period.id && (
                                <div className="ml-4 mt-1 space-y-1">
                                  {period.subPeriods.map((subPeriod) => (
                                    <button
                                      key={subPeriod.path}
                                      onClick={() => handleNavigation(subPeriod.path)}
                                      className="block py-0.5 text-left text-xs text-gray-400 transition-colors duration-300 hover:text-amber-400"
                                      type="button"
                                    >
                                      • {subPeriod.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : item.id === 'culture' ? (
                    <>
                      <button
                        onClick={() => setIsCultureOpen(!isCultureOpen)}
                        className={`group relative py-1.5 text-left font-serif text-base uppercase tracking-wide transition-all duration-300 ${
                          location.pathname === item.path || location.pathname.startsWith('/culture')
                            ? 'text-amber-400 font-bold menu-item-active-elegant'
                            : 'text-gray-300 hover:text-amber-400 menu-item-elegant'
                        }`}
                        type="button"
                      >
                        {item.label}
                      </button>
                      {isCultureOpen && (
                        <div className="ml-4 mt-2 space-y-1">
                          {cultureItems.map((cultureItem) => (
                            <button
                              key={cultureItem.path}
                              onClick={() => handleNavigation(cultureItem.path)}
                              className="block py-1 text-left text-sm text-gray-400 transition-colors duration-300 hover:text-amber-400"
                              type="button"
                            >
                              • {cultureItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`group relative py-1.5 text-left font-serif text-base uppercase tracking-wide transition-all duration-300 ${
                        location.pathname === item.path
                          ? 'text-amber-400 font-bold menu-item-active-elegant'
                          : 'text-gray-300 hover:text-amber-400 menu-item-elegant'
                      }`}
                      type="button"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </nav>

            <div className="space-y-6 pt-6">
              <div className="space-y-2 text-xs text-gray-400">
                <p>
                  Thứ 2–Thứ 5: <span className="font-medium text-amber-400">8:00–17:00</span>
                </p>
                <p>
                  Thứ 6–CN: <span className="font-medium text-amber-400">8:00–18:00</span>
                </p>
              </div>

              <div className="flex space-x-4 pt-2">
                {socialLinks.slice(0, 3).map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    aria-label={social.label}
                    className="text-gray-400 transition-all duration-300 hover:text-amber-400"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
