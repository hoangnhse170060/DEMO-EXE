import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen bg-museum-beige flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-museum-black">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
        
        {/* Decorative lines */}
        <div className="absolute top-0 left-16 w-px h-full bg-gradient-to-b from-transparent via-museum-accent/20 to-transparent" />
        <div className="absolute top-0 right-16 w-px h-full bg-gradient-to-b from-transparent via-museum-accent/20 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div>
            <div className="w-12 h-1 bg-museum-accent mb-8" />
            <h1 className="font-serif font-bold text-5xl text-museum-beige leading-tight mb-6">
              Echoes of<br />Việt Nam
            </h1>
            <p className="text-museum-gray text-lg font-sans max-w-md leading-relaxed">
              Khám phá và lưu giữ những câu chuyện lịch sử, 
              kết nối quá khứ với hiện tại qua từng trang ký ức.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-museum-accent/20 flex items-center justify-center">
                <span className="text-museum-accent font-serif text-lg">01</span>
              </div>
              <span className="text-museum-gray font-sans">Thư viện tư liệu lịch sử</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-museum-accent/20 flex items-center justify-center">
                <span className="text-museum-accent font-serif text-lg">02</span>
              </div>
              <span className="text-museum-gray font-sans">Cộng đồng đam mê văn hóa</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-museum-accent/20 flex items-center justify-center">
                <span className="text-museum-accent font-serif text-lg">03</span>
              </div>
              <span className="text-museum-gray font-sans">Trải nghiệm học tập độc đáo</span>
            </div>
          </div>

          <p className="text-museum-gray/50 font-sans text-sm">
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
            className="flex items-center space-x-2 text-museum-black/60 hover:text-museum-black transition-colors mb-12 group"
            type="button"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-sans text-sm">Quay lại Trang chủ</span>
          </button>

          {/* Header */}
          <div className="mb-10">
            <div className="w-10 h-1 bg-museum-accent mb-6" />
            <h2 className="font-serif font-bold text-4xl text-museum-black mb-3">
              Đăng Nhập
            </h2>
            <p className="text-museum-black/60 font-sans">
              Chào mừng bạn quay lại. Đăng nhập để tiếp tục khám phá.
            </p>
          </div>

          {/* OAuth Buttons - Only show when Supabase is configured */}
          {isSupabaseConfigured && (
            <>
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  className="w-full py-3.5 bg-white border border-museum-gray/40 text-museum-black font-sans text-sm flex items-center justify-center space-x-3 hover:border-museum-black/40 hover:shadow-paper transition-all duration-300"
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
                  <div className="w-full border-t border-museum-gray/30"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-museum-beige text-museum-black/40 font-sans text-sm">hoặc</span>
                </div>
              </div>
            </>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-museum-black font-sans text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-museum-gray/40 text-museum-black font-sans placeholder:text-museum-black/30 focus:border-museum-accent focus:ring-2 focus:ring-museum-accent/20 outline-none transition-all duration-300"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-museum-black font-sans text-sm mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3.5 pr-12 bg-white border border-museum-gray/40 text-museum-black font-sans placeholder:text-museum-black/30 focus:border-museum-accent focus:ring-2 focus:ring-museum-accent/20 outline-none transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-museum-black/40 hover:text-museum-black transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 font-sans text-sm">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-museum-accent/10 border-l-4 border-museum-accent text-museum-black font-sans text-sm">
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-museum-black text-museum-beige font-sans text-sm tracking-wider uppercase transition-all duration-300 hover:bg-museum-black/90 hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-museum-gray/20 space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/register', { state: { from: loginState.from || sessionStorage.getItem('lastVisitedPath') || '/' } })}
                className="text-museum-black font-sans text-sm hover:text-museum-accent transition-colors"
              >
                Chưa có tài khoản? <span className="font-semibold">Đăng ký</span>
              </button>
              <button
                onClick={() => navigate('/forgot-password', { state: { from: loginState.from || sessionStorage.getItem('lastVisitedPath') || '/' } })}
                className="text-museum-black/60 font-sans text-sm hover:text-museum-black transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Demo account hint */}
            {!isSupabaseConfigured && (
              <div className="p-4 bg-museum-accent/10 border border-museum-accent/30 text-museum-black/80 font-sans text-sm">
                <p className="font-medium mb-1">Tài khoản demo:</p>
                <p>Email: <code className="bg-white px-1.5 py-0.5 text-museum-black">user1@echoes.vn</code></p>
                <p>Mật khẩu: <code className="bg-white px-1.5 py-0.5 text-museum-black">user123</code></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
