import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Contact() {
  useScrollAnimation();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ full_name: '', email: '', message: '' });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-0">
      <div className="relative h-80 bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(rgba(13, 13, 13, 0.7), rgba(13, 13, 13, 0.85)), url(https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg)',
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#F4D03F] mb-4">
              LIÊN HỆ
            </h1>
            <p className="text-xl text-[#E6BE8A] font-serif italic">
              Kết nối cùng chúng tôi
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="scroll-animate">
            <h2 className="text-3xl font-serif text-[#F4D03F] mb-6">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>
            <p className="text-[#9CA3AF] mb-8 leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp, câu hỏi và phản hồi từ bạn.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#E5E5E5] mb-2 font-sans">Họ Tên *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] text-[#E5E5E5] focus:border-[#F4D03F] outline-none"
                  placeholder="Nhập họ tên của bạn"
                  required
                />
              </div>

              <div>
                <label className="block text-[#E5E5E5] mb-2 font-sans">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] text-[#E5E5E5] focus:border-[#F4D03F] outline-none"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[#E5E5E5] mb-2 font-sans">Nội Dung *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] text-[#E5E5E5] focus:border-[#F4D03F] outline-none resize-none"
                  placeholder="Nhập nội dung tin nhắn..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#F4D03F] text-[#0D0D0D] font-semibold uppercase hover:bg-[#E6BE8A] disabled:opacity-50"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Send size={20} />
                  <span>{isSubmitting ? 'Đang Gửi...' : 'Gửi Tin Nhắn'}</span>
                </span>
              </button>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded">
                  Cảm ơn bạn đã liên hệ!
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded">
                  Có lỗi xảy ra. Vui lòng thử lại.
                </div>
              )}
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-serif text-[#F4D03F] mb-6">Thông Tin Liên Hệ</h2>
              <p className="text-[#9CA3AF] mb-8 leading-relaxed">
                Kết nối với chúng tôi qua các kênh thông tin dưới đây.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-[#1A1A1A] border border-[#333333] hover:border-[#F4D03F]/50 transition-colors">
                <div className="w-12 h-12 bg-[#F4D03F] flex items-center justify-center">
                  <Mail className="text-[#0D0D0D]" size={24} />
                </div>
                <div>
                  <h3 className="text-[#E5E5E5] font-serif text-lg mb-1">Email</h3>
                  <p className="text-[#F4D03F]">contact@echoesvietnam.vn</p>
                  <p className="text-[#6B7280] text-sm mt-1">Phản hồi trong vòng 24 giờ</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-[#1A1A1A] border border-[#333333] hover:border-[#F4D03F]/50 transition-colors">
                <div className="w-12 h-12 bg-[#F4D03F] flex items-center justify-center">
                  <Phone className="text-[#0D0D0D]" size={24} />
                </div>
                <div>
                  <h3 className="text-[#E5E5E5] font-serif text-lg mb-1">Điện Thoại</h3>
                  <p className="text-[#F4D03F]">+84 123 456 789</p>
                  <p className="text-[#6B7280] text-sm mt-1">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-[#1A1A1A] border border-[#333333] hover:border-[#F4D03F]/50 transition-colors">
                <div className="w-12 h-12 bg-[#F4D03F] flex items-center justify-center">
                  <MapPin className="text-[#0D0D0D]" size={24} />
                </div>
                <div>
                  <h3 className="text-[#E5E5E5] font-serif text-lg mb-1">Địa Chỉ</h3>
                  <p className="text-[#F4D03F]">Hà Nội, Việt Nam</p>
                  <p className="text-[#6B7280] text-sm mt-1">Trung tâm văn hóa lịch sử</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#F4D03F]/30 p-8">
              <h3 className="text-2xl font-serif text-[#F4D03F] mb-4">Giờ Làm Việc</h3>
              <div className="space-y-2 text-[#9CA3AF]">
                <div className="flex justify-between">
                  <span>Thứ Hai - Thứ Sáu</span>
                  <span className="text-[#F4D03F]">8:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ Bảy</span>
                  <span className="text-[#F4D03F]">9:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ Nhật</span>
                  <span className="text-red-400">Nghỉ</span>
                </div>
              </div>
            </div>

            <div className="text-center p-8 border border-[#F4D03F]/30 bg-[#1A1A1A]">
              <p className="text-[#F4D03F] font-serif italic text-lg">
                "Nơi quá khứ ngân vang trong từng hơi thở hiện đại"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
