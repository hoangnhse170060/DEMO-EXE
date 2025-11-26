import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localAuth } from '../lib/localAuth';

type FormState = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: FormState = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Password validation
  const passwordChecks = {
    length: form.password.length >= 6,
    hasLetter: /[a-zA-Z]/.test(form.password),
    hasNumber: /[0-9]/.test(form.password),
    match: form.password === form.confirmPassword && form.confirmPassword.length > 0,
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (form.password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: data.user.id,
                display_name: form.displayName,
                email: form.email,
              },
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }
      } else {
        const { user, error } = await localAuth.register({
          email: form.email,
          password: form.password,
          display_name: form.displayName,
        });

        if (error || !user) {
          throw new Error(error || 'Đăng ký thất bại');
        }
      }

      setSuccessMessage('Đăng ký thành công! Chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Đăng ký thất bại. Vui lòng thử lại.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
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
            backgroundImage: `url("https://images.unsplash.com/photo-1461360370896-922624d12a74?w=1920")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D]/90 via-[#1A1A1A]/80 to-[#0D0D0D]/90" />
        
        {/* Decorative lines */}
        <div className="absolute top-0 left-16 w-px h-full bg-gradient-to-b from-transparent via-[#F4D03F]/30 to-transparent" />
        <div className="absolute top-0 right-16 w-px h-full bg-gradient-to-b from-transparent via-[#F4D03F]/30 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-[#9CA3AF] hover:text-[#E5E5E5] transition-colors group mb-16"
              type="button"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-sans text-sm">Quay lại Trang chủ</span>
            </button>

            <div className="w-16 h-1 bg-[#F4D03F] mb-8" />
            <h1 className="font-serif font-bold text-5xl text-[#F4D03F] leading-tight mb-6">
              Gia nhập<br />cộng đồng
            </h1>
            <p className="text-[#E5E5E5]/80 text-lg font-sans max-w-md leading-relaxed">
              Tạo tài khoản để tham gia thảo luận, lưu trữ những ký ức 
              và chia sẻ câu chuyện của bạn cùng cộng đồng đam mê lịch sử.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={14} className="text-[#F4D03F]" />
              </div>
              <span className="text-[#E5E5E5]/70 font-sans">Bảo tồn ký ức và giá trị lịch sử Việt Nam</span>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={14} className="text-[#F4D03F]" />
              </div>
              <span className="text-[#E5E5E5]/70 font-sans">Kết nối với các nhà sưu tầm và nghiên cứu</span>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={14} className="text-[#F4D03F]" />
              </div>
              <span className="text-[#E5E5E5]/70 font-sans">Khám phá thư viện tư liệu độc quyền</span>
            </div>
          </div>

          <p className="text-[#9CA3AF]/50 font-sans text-sm">
            © 2025 Echoes of Việt Nam. Bảo tồn di sản văn hóa.
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile back button */}
          <button
            onClick={() => navigate('/')}
            className="lg:hidden flex items-center space-x-2 text-[#9CA3AF] hover:text-[#E5E5E5] transition-colors mb-12 group"
            type="button"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-sans text-sm">Quay lại Trang chủ</span>
          </button>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-[#F4D03F]" />
              <div className="h-px flex-1 bg-gradient-to-r from-[#F4D03F]/30 to-transparent" />
            </div>
            <h2 className="font-serif font-bold text-4xl text-[#F4D03F] mb-3">
              Tạo Tài Khoản
            </h2>
            <p className="text-[#9CA3AF] font-sans">
              Bắt đầu hành trình khám phá lịch sử cùng chúng tôi.
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#E5E5E5] font-sans text-sm mb-2">
                Tên hiển thị
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={handleChange('displayName')}
                className="w-full px-4 py-3.5 bg-[#1A1A1A] border border-[#333333] text-[#E5E5E5] font-sans placeholder:text-[#6B7280] focus:border-[#F4D03F] focus:ring-2 focus:ring-[#F4D03F]/20 outline-none transition-all duration-300"
                placeholder="Ví dụ: Nguyễn Văn A"
                required
              />
            </div>

            <div>
              <label className="block text-[#E5E5E5] font-sans text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
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
                  value={form.password}
                  onChange={handleChange('password')}
                  className="w-full px-4 py-3.5 pr-12 bg-[#1A1A1A] border border-[#333333] text-[#E5E5E5] font-sans placeholder:text-[#6B7280] focus:border-[#F4D03F] focus:ring-2 focus:ring-[#F4D03F]/20 outline-none transition-all duration-300"
                  placeholder="Tối thiểu 6 ký tự"
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
              
              {/* Password strength indicators */}
              {form.password && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-sans">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordChecks.length ? 'bg-green-500' : 'bg-[#333333]'}`}>
                      {passwordChecks.length && <Check size={10} className="text-white" />}
                    </div>
                    <span className={passwordChecks.length ? 'text-green-400' : 'text-[#6B7280]'}>Ít nhất 6 ký tự</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-sans">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordChecks.hasLetter ? 'bg-green-500' : 'bg-[#333333]'}`}>
                      {passwordChecks.hasLetter && <Check size={10} className="text-white" />}
                    </div>
                    <span className={passwordChecks.hasLetter ? 'text-green-400' : 'text-[#6B7280]'}>Có chữ cái</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-sans">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordChecks.hasNumber ? 'bg-green-500' : 'bg-[#333333]'}`}>
                      {passwordChecks.hasNumber && <Check size={10} className="text-white" />}
                    </div>
                    <span className={passwordChecks.hasNumber ? 'text-green-400' : 'text-[#6B7280]'}>Có số</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[#E5E5E5] font-sans text-sm mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  className="w-full px-4 py-3.5 pr-12 bg-[#1A1A1A] border border-[#333333] text-[#E5E5E5] font-sans placeholder:text-[#6B7280] focus:border-[#F4D03F] focus:ring-2 focus:ring-[#F4D03F]/20 outline-none transition-all duration-300"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#E5E5E5] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {form.confirmPassword && (
                <div className="mt-3 flex items-center space-x-2 text-xs font-sans">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordChecks.match ? 'bg-green-500' : 'bg-red-500'}`}>
                    {passwordChecks.match && <Check size={10} className="text-white" />}
                  </div>
                  <span className={passwordChecks.match ? 'text-green-400' : 'text-red-400'}>
                    {passwordChecks.match ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                  </span>
                </div>
              )}
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
              {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-[#333333]">
            <p className="text-center text-[#E5E5E5] font-sans text-sm">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-semibold text-[#F4D03F] hover:text-[#E6BE8A] transition-colors"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
