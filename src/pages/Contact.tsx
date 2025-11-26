import { useState } from 'react';
import { Mail, MapPin, Phone, Send, MessageCircle, Clock } from 'lucide-react';
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
    <div className="min-h-screen bg-[#050505] pt-0">
      {/* Hero */}
      <div
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(5,5,5,0.86), rgba(5,5,5,0.96)), url(https://images.pexels.com/photos/196649/pexels-photo-196649.jpeg)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up px-4">
            <p className="text-sm tracking-[0.3em] text-[#E6BE8A] uppercase mb-3">
              Kết nối cùng Echoes of Việt Nam
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#F4D03F] mb-3">
              Liên hệ & góp ý
            </h1>
            <p className="text-base md:text-lg text-[#E5E5E5] max-w-2xl mx-auto leading-relaxed">
              Mọi ý kiến từ bạn đều giúp chúng tôi kể lại lịch sử Việt Nam một cách trọn vẹn và nhân văn hơn.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
          {/* Form liên hệ */}
          <div className="scroll-animate">
            <div className="mb-6 flex items-center gap-3">
              <MessageCircle className="text-[#F4D03F]" size={26} />
              <div>
                <h2 className="text-2xl font-serif text-[#F4D03F] mb-1">
                  Gửi lời nhắn tới chúng tôi
                </h2>
                <p className="text-xs text-[#9CA3AF]">
                  Chia sẻ ngắn gọn nhu cầu hoặc góp ý, chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 bg-[#090909] border border-[#262626] p-6 md:p-7">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E5E5E5] mb-2 text-sm">Họ và tên *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#111111] border border-[#333333] text-[#E5E5E5] text-sm focus:border-[#F4D03F] outline-none"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#E5E5E5] mb-2 text-sm">Email liên hệ *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#111111] border border-[#333333] text-[#E5E5E5] text-sm focus:border-[#F4D03F] outline-none"
                    placeholder="ví dụ: banbe@echoes.vn"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#E5E5E5] mb-2 text-sm">Nội dung trao đổi *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2.5 bg-[#111111] border border-[#333333] text-[#E5E5E5] text-sm focus:border-[#F4D03F] outline-none resize-none leading-relaxed"
                  placeholder="Bạn có thể chia sẻ về: góp ý nội dung, đề xuất tính năng mới, ý tưởng hợp tác, hoặc câu hỏi về lịch sử Việt Nam..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#F4D03F] text-[#111111] text-sm font-semibold tracking-wide uppercase hover:bg-[#E6BE8A] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}</span>
              </button>

              {submitStatus === 'success' && (
                <div className="mt-3 p-3.5 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded">
                  Cảm ơn bạn đã tin tưởng và chia sẻ với Echoes of Việt Nam. Chúng tôi sẽ phản hồi sớm nhất có thể.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-3 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded">
                  Có lỗi xảy ra trong quá trình gửi. Vui lòng kiểm tra kết nối mạng và thử lại sau ít phút.
                </div>
              )}
            </form>
          </div>

          {/* Thông tin liên hệ */}
          <aside className="space-y-7">
            <div>
              <h2 className="text-2xl font-serif text-[#F4D03F] mb-2">Kênh liên lạc chính thức</h2>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                Chúng tôi ưu tiên trả lời email và tin nhắn gửi từ biểu mẫu liên hệ. Với các yêu cầu hợp tác hoặc
                chương trình dành cho trường học, bạn có thể ghi rõ tiêu đề để được hỗ trợ nhanh hơn.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-[#111111] border border-[#333333]">
                <div className="w-11 h-11 bg-[#F4D03F] flex items-center justify-center">
                  <Mail className="text-[#111111]" size={22} />
                </div>
                <div>
                  <h3 className="text-[#E5E5E5] font-serif text-base mb-1">Email</h3>
                  <p className="text-[#F4D03F] text-sm">contact@echoesvietnam.vn</p>
                  <p className="text-[#6B7280] text-xs mt-1">Thường phản hồi trong vòng 24 giờ làm việc.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#111111] border border-[#333333]">
                <div className="w-11 h-11 bg-[#F4D03F] flex items-center justify-center">
                  <Phone className="text-[#111111]" size={22} />
                </div>
                <div>
                  <h3 className="text-[#E5E5E5] font-serif text-base mb-1">Điện thoại</h3>
                  <p className="text-[#F4D03F] text-sm">+84 123 456 789</p>
                  <p className="text-[#6B7280] text-xs mt-1">Giờ hành chính, từ Thứ Hai đến Thứ Sáu.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#111111] border border-[#333333]">
                <div className="w-11 h-11 bg-[#F4D03F] flex items-center justify-center">
                  <MapPin className="text-[#111111]" size={22} />
                </div>
                <div>
                  <h3 className="text-[#E5E5E5] font-serif text-base mb-1">Địa điểm hoạt động</h3>
                  <p className="text-[#F4D03F] text-sm">Hà Nội, Việt Nam</p>
                  <p className="text-[#6B7280] text-xs mt-1">
                    Không gian làm việc linh hoạt, kết nối với các đối tác giáo dục và văn hoá trên toàn quốc.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#F4D03F]/35 p-5 space-y-3 text-sm text-[#D1D5DB]">
              <div className="flex items-center gap-2 text-[#F4D03F]">
                <Clock size={18} />
                <span className="font-serif">Giờ làm việc</span>
              </div>
              <div className="space-y-1 text-xs text-[#9CA3AF]">
                <p>
                  <span className="text-[#E5E5E5] font-medium">Thứ Hai - Thứ Sáu:</span> 8:00 – 17:00
                </p>
                <p>
                  <span className="text-[#E5E5E5] font-medium">Thứ Bảy:</span> 9:00 – 15:00
                </p>
                <p>
                  <span className="text-[#E5E5E5] font-medium">Chủ Nhật & ngày lễ:</span> Nghỉ, chỉ tiếp nhận yêu cầu qua email.
                </p>
              </div>
              <p className="text-[11px] text-[#6B7280] pt-1">
                Trong mùa cao điểm (thi cử, năm học mới...), thời gian phản hồi có thể chậm hơn đôi chút. Rất mong nhận được sự thông cảm.
              </p>
            </div>

            <div className="text-center p-6 border border-[#F4D03F]/35 bg-[#090909]">
              <p className="text-[#F4D03F] font-serif italic text-base leading-relaxed">
                "Mỗi góp ý của bạn là một viên gạch nhỏ, giúp xây nên không gian lịch sử Việt Nam tử tế và gần gũi hơn với thế hệ trẻ."
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
