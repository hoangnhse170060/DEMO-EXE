import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

type HeaderProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'TRANG CHỦ' },
    { id: 'history', label: 'LỊCH SỬ' },
    { id: 'services', label: 'DỊCH VỤ' },
    { id: 'contact', label: 'LIÊN HỆ' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0D0D0D]/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="relative w-12 h-12 mr-3">
              <div className="absolute inset-0 bg-[#F4D03F] rounded-full animate-glow" />
              <div className="absolute inset-2 bg-[#0D0D0D] rounded-full" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-wider text-[#E5E5E5]">
                ECHOES OF
              </h1>
              <p className="text-xs font-serif text-[#F4D03F] tracking-widest">
                VIỆT NAM
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-sans tracking-wide transition-all duration-300 hover:text-[#F4D03F] ${
                  currentPage === item.id
                    ? 'text-[#F4D03F] border-b-2 border-[#F4D03F]'
                    : 'text-[#E5E5E5]'
                }`}
              >
                {item.label}
              </button>
            ))}
          
          </nav>

          <button
            className="md:hidden text-[#E5E5E5] hover:text-[#F4D03F] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0D0D0D]/98 animate-slide-in">
          <nav className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-lg font-sans tracking-wide py-2 transition-all duration-300 ${
                  currentPage === item.id
                    ? 'text-[#F4D03F] border-l-4 border-[#F4D03F] pl-4'
                    : 'text-[#E5E5E5] hover:text-[#F4D03F] hover:pl-4'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
