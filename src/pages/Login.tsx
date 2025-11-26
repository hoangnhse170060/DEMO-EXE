import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localAuth } from '../lib/localAuth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginState = (location.state as { from?: string } | undefined) || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { user, error } = await localAuth.login(email, password);
        if (error || !user) {
          throw new Error(error || 'Đăng nhập thất bại');
        }
        console.log('✅ Local login successful for:', user.email);
      }

      setSuccessMessage('Đăng nhập thành công.');
      console.log('✅ Stored user in localStorage');

      let redirectPath = '/';
      const after = sessionStorage.getItem('afterLogin');
      if (after) {
        try {
          const payload = JSON.parse(after) as { page?: string };
          sessionStorage.removeItem('afterLogin');
          if (payload?.page && payload.page !== 'home') {
            redirectPath = `/${payload.page}`;
          } else {
            redirectPath = '/';
          }
        } catch {
          redirectPath = loginState.from && loginState.from !== '/login'
            ? loginState.from
            : sessionStorage.getItem('lastVisitedPath') || '/';
        }
      } else {
        const fallbackPath = loginState.from && loginState.from !== '/login'
          ? loginState.from
          : sessionStorage.getItem('lastVisitedPath');
        if (fallbackPath && fallbackPath !== '/login') {
          redirectPath = fallbackPath;
        }
      }

      setTimeout(() => navigate(redirectPath), 800);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Không thể đăng nhập. Vui lòng thử lại.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/?page=home'
        }
      });
      if (error) throw error;
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : `Không thể đăng nhập bằng ${provider}.`;
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1A1A1A]">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url("https://woodencore.com/wp-content/uploads/2022/12/ban-do-go-viet-nam-1.jpg")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D]/90 via-[#1A1A1A]/80 to-[#0D0D0D]/90" />
        
        {/* Decorative lines */}
        <div className="absolute top-0 left-16 w-px h-full bg-gradient-to-b from-transparent via-[#F4D03F]/30 to-transparent" />
        <div className="absolute top-0 right-16 w-px h-full bg-gradient-to-b from-transparent via-[#F4D03F]/30 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div>
            <div className="w-16 h-1 bg-[#F4D03F] mb-8" />
            <h1 className="font-serif font-bold text-5xl text-[#F4D03F] leading-tight mb-6">
              Echoes of<br />Việt Nam
            </h1>
            <p className="text-[#E5E5E5]/80 text-lg font-sans max-w-md leading-relaxed">
              Khám phá và lưu giữ những câu chuyện lịch sử, 
              kết nối quá khứ với hiện tại qua từng trang ký ức.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 flex items-center justify-center">
                <span className="text-[#F4D03F] font-serif text-lg">01</span>
              </div>
              <span className="text-[#E5E5E5]/70 font-sans">Thư viện tư liệu lịch sử</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 flex items-center justify-center">
                <span className="text-[#F4D03F] font-serif text-lg">02</span>
              </div>
              <span className="text-[#E5E5E5]/70 font-sans">Cộng đồng đam mê văn hóa</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 flex items-center justify-center">
                <span className="text-[#F4D03F] font-serif text-lg">03</span>
              </div>
              <span className="text-[#E5E5E5]/70 font-sans">Trải nghiệm học tập độc đáo</span>
            </div>
          </div>

          <p className="text-[#9CA3AF]/50 font-sans text-sm">
            © 2025 Echoes of Việt Nam. Bảo tồn di sản văn hóa.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-[#9CA3AF] hover:text-[#E5E5E5] transition-colors mb-12 group"
            type="button"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-sans text-sm">Quay lại Trang chủ</span>
          </button>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 flex items-center justify-center">
                <LogIn size={20} className="text-[#F4D03F]" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-[#F4D03F]/30 to-transparent" />
            </div>
            <h2 className="font-serif font-bold text-4xl text-[#F4D03F] mb-3">
              Đăng Nhập
            </h2>
            <p className="text-[#9CA3AF] font-sans">
              Chào mừng bạn quay lại. Đăng nhập để tiếp tục khám phá.
            </p>
          </div>

          {/* OAuth Buttons - Only show when Supabase is configured */}
          {isSupabaseConfigured && (
            <>
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  className="w-full py-3.5 bg-[#1A1A1A] border border-[#333333] text-[#E5E5E5] font-sans text-sm flex items-center justify-center space-x-3 hover:border-[#F4D03F]/50 hover:bg-[#262626] transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Tiếp tục với Google</span>
                </button>

                <button
                  onClick={() => handleOAuthLogin('facebook')}
                  className="w-full py-3.5 bg-[#1877F2] text-white font-sans text-sm flex items-center justify-center space-x-3 hover:bg-[#166FE5] transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Tiếp tục với Facebook</span>
                </button>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#333333]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[#0D0D0D] text-[#6B7280] font-sans text-sm">hoặc</span>
                </div>
              </div>
            </>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#E5E5E5] font-sans text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3.5 bg-[#1A1A1A] border border-[#333333] text-[#E5E5E5] font-sans placeholder:text-[#6B7280] focus:border-[#F4D03F] focus:ring-2 focus:ring-[#F4D03F]/20 outline-none transition-all duration-300"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-[#E5E5E5] font-sans text-sm mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3.5 pr-12 bg-[#1A1A1A] border border-[#333333] text-[#E5E5E5] font-sans placeholder:text-[#6B7280] focus:border-[#F4D03F] focus:ring-2 focus:ring-[#F4D03F]/20 outline-none transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#E5E5E5] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 font-sans text-sm rounded">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-[#F4D03F]/10 border border-[#F4D03F]/30 text-[#F4D03F] font-sans text-sm rounded">
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#F4D03F] text-[#0D0D0D] font-sans font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-[#E6BE8A] hover:shadow-[0_0_20px_rgba(244,208,63,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-[#333333] space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/register', { state: { from: loginState.from || sessionStorage.getItem('lastVisitedPath') || '/' } })}
                className="text-[#E5E5E5] font-sans text-sm hover:text-[#F4D03F] transition-colors"
              >
                Chưa có tài khoản? <span className="font-semibold text-[#F4D03F]">Đăng ký</span>
              </button>
              <button
                onClick={() => navigate('/forgot-password', { state: { from: loginState.from || sessionStorage.getItem('lastVisitedPath') || '/' } })}
                className="text-[#9CA3AF] font-sans text-sm hover:text-[#E5E5E5] transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Demo account hint */}
            {!isSupabaseConfigured && (
              <div className="p-4 bg-[#1A1A1A] border border-[#F4D03F]/30 rounded">
                <p className="font-sans text-sm text-[#E6BE8A] font-medium mb-2">📌 Tài khoản demo:</p>
                <div className="space-y-1 text-sm font-sans">
                  <p className="text-[#9CA3AF]">Email: <code className="bg-[#262626] px-2 py-0.5 text-[#F4D03F] rounded">user1@echoes.vn</code></p>
                  <p className="text-[#9CA3AF]">Mật khẩu: <code className="bg-[#262626] px-2 py-0.5 text-[#F4D03F] rounded">user123</code></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
