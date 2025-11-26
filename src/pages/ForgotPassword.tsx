import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/?page=reset-password'
      });

      if (error) throw error;
      setSuccessMessage('Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể gửi email đặt lại mật khẩu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-[#1A1A1A] border border-[#333333] p-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 text-[#9CA3AF] hover:text-[#F4D03F] transition-colors"
            type="button"
          >
            <ArrowLeft size={18} />
            <span>Quay lại Đăng nhập</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 flex items-center justify-center">
            <Mail className="text-[#F4D03F]" size={20} />
          </div>
        </div>

        <h1 className="text-4xl font-serif text-[#F4D03F] mb-2">Quên Mật Khẩu</h1>
        <p className="text-[#9CA3AF] mb-8">Nhập email để nhận liên kết đặt lại mật khẩu.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#E5E5E5] mb-2 font-sans">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3.5 bg-[#0D0D0D] border border-[#333333] text-[#E5E5E5] focus:border-[#F4D03F] outline-none placeholder:text-[#6B7280]"
              placeholder="email@example.com"
              required
            />
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#F4D03F] text-[#0D0D0D] font-semibold uppercase hover:bg-[#E6BE8A] disabled:opacity-50"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/login')} className="text-[#9CA3AF] hover:text-[#F4D03F] transition-colors">
            Quay lại Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
