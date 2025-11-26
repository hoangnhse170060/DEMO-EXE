import { Compass, ListChecks, MousePointer2, Shield, HeartHandshake } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Services() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#050505] pt-0">
      {/* Hero */}
      <div
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(5,5,5,0.86), rgba(5,5,5,0.96)), url(https://images.pexels.com/photos/167404/pexels-photo-167404.jpeg)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up px-4">
            <p className="text-xs md:text-sm tracking-[0.35em] text-[#E6BE8A] uppercase mb-3">
              Giới thiệu nền tảng
            </p>
            <h1 className="text-4xl md:text-[2.9rem] font-serif font-bold text-[#F4D03F] mb-2">
              Echoes of Việt Nam
            </h1>
            <p className="text-[13px] md:text-base text-[#F9FAFB] max-w-2xl mx-auto leading-relaxed">
              Website học tập lịch sử Việt Nam miễn phí, phi lợi nhuận – nơi bạn có thể đi lại từng chặng đường
              dân tộc qua mốc thời gian, sự kiện và câu chuyện nhân vật.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 space-y-12 md:space-y-16">
        {/* 0. Dự án phi lợi nhuận */}
        <section className="-mt-6 md:-mt-10">
          <div className="grid md:grid-cols-[1.1fr_1.2fr] gap-6 md:gap-8 items-stretch">
            <div className="bg-[#0B0B0B] border border-[#F4D03F]/40 p-5 md:p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#F4D03F] mb-1">
                <HeartHandshake size={18} />
                <span className="font-serif text-sm">Dự án phi lợi nhuận</span>
              </div>
              <p className="text-xs md:text-sm text-[#D1D5DB] leading-relaxed">
                Echoes of Việt Nam được xây dựng với tinh thần cộng đồng: không thu phí người dùng, không chèn quảng cáo
                gây khó chịu, không bán dữ liệu cá nhân. Mọi đóng góp (nếu có trong tương lai) sẽ được dùng để duy trì
                máy chủ và cập nhật thêm nội dung lịch sử.
              </p>
              <p className="text-[11px] text-[#9CA3AF]">
                Bạn có thể yên tâm sử dụng website như một người bạn đồng hành trong hành trình học lịch sử, không lo về chi phí.
              </p>
            </div>

            <div className="bg-[#050505] border border-[#262626] p-5 md:p-6 grid grid-cols-2 gap-4 text-xs md:text-sm text-[#D1D5DB]">
              <div>
                <p className="text-[#E5E5E5] font-semibold mb-1">Đối tượng phù hợp</p>
                <p className="text-[#9CA3AF]">
                  • Học sinh, sinh viên
                  <br />• Giáo viên, phụ huynh
                  <br />• Người yêu lịch sử Việt Nam
                </p>
              </div>
              <div>
                <p className="text-[#E5E5E5] font-semibold mb-1">Hình thức sử dụng</p>
                <p className="text-[#9CA3AF]">
                  • Tự học cá nhân
                  <br />• Ôn tập theo chủ đề
                  <br />• Hoạt động nhóm, câu lạc bộ
                </p>
              </div>
            </div>
          </div>
    </section>

    {/* 1. Tổng quan về website */}
    <section className="pt-2 md:pt-0">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-[#F4D03F] mb-3">
                Echoes of Việt Nam là gì?
              </h2>
              <p className="text-sm md:text-base text-[#D1D5DB] leading-relaxed mb-3">
                Đây là một website học tập và trải nghiệm lịch sử Việt Nam, được thiết kế xoay quanh dòng thời
                gian, sự kiện và nhân vật. Mục tiêu chính là giúp người dùng, đặc biệt là học sinh – sinh viên,
                hiểu lịch sử một cách mạch lạc, dễ nhớ và có chiều sâu.
              </p>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                Tất cả nội dung, tính năng và luồng sử dụng được xây dựng xoay quanh nhu cầu "tự học – ôn tập – khám phá"
                của người Việt, không mang tính thương mại hay quảng cáo dịch vụ bên ngoài.
              </p>
            </div>

            <div className="bg-[#0B0B0B] border border-[#333333] p-5 rounded-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#F4D03F]">
                <Compass size={20} />
                <span className="font-serif text-sm">Mục đích sử dụng chính</span>
              </div>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                • Hỗ trợ học tập và ôn luyện lịch sử Việt Nam.
                <br />• Tạo không gian khám phá lịch sử một cách nhẹ nhàng, trực quan.
                <br />• Gợi mở cảm hứng tìm hiểu thêm từ sách, phim, tài liệu ngoài đời thực.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Luồng sử dụng cơ bản */}
        <section className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-start">
          <div className="bg-[#0B0B0B] border border-[#333333] p-7 md:p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-4">
              <ListChecks className="text-[#F4D03F]" size={24} />
              <h2 className="text-2xl font-serif text-[#F9FAFB]">
                Luồng đi trên website
              </h2>
            </div>

            <ol className="space-y-4 text-sm text-[#D1D5DB] list-decimal list-inside">
              <li>
                <span className="font-semibold text-[#F4D03F]">Trang chủ:</span> xem phần giới thiệu nhanh về
                dự án, các khu vực chính và gợi ý bắt đầu hành trình.
              </li>
              <li>
                <span className="font-semibold text-[#F4D03F]">Mục Lịch sử:</span> chọn giai đoạn, sự kiện để đọc
                thông tin chi tiết, xem dòng thời gian và mở quiz luyện tập.
              </li>
              <li>
                <span className="font-semibold text-[#F4D03F]">Quiz & điểm thưởng:</span> sau mỗi bài trắc nghiệm,
                hệ thống ghi nhận kết quả, mở khoá sự kiện tiếp theo (nếu đủ điểm) và cộng điểm tích luỹ cho tài khoản.
              </li>
              <li>
                <span className="font-semibold text-[#F4D03F]">Trang Hồ sơ cá nhân:</span> theo dõi tiến độ học,
                điểm số, huy hiệu hoặc ưu đãi (nếu có) gắn với tài khoản của bạn.
              </li>
              <li>
                <span className="font-semibold text-[#F4D03F]">Khu vực Văn hoá:</span> xem thêm tư liệu, nhân vật,
                kho lưu trữ để làm phong phú thêm góc nhìn về lịch sử Việt Nam.
              </li>
              <li>
                <span className="font-semibold text-[#F4D03F]">Trang Liên hệ:</span> gửi góp ý, báo lỗi nội dung
                hoặc đề xuất tính năng mới cho đội ngũ phát triển.
              </li>
            </ol>
          </div>

          <div className="bg-[#101010] border border-[#F4D03F]/35 p-6 md:p-7 rounded-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#F4D03F] mb-1">
              <MousePointer2 size={18} />
              <p className="font-serif text-sm">Gợi ý cách bắt đầu</p>
            </div>
            <p className="text-sm text-[#D1D5DB] leading-relaxed">
              Nếu là lần đầu truy cập, bạn có thể:
            </p>
            <ul className="space-y-2 text-sm text-[#9CA3AF]">
              <li>• Bắt đầu từ giai đoạn hoặc sự kiện bạn đã từng học trên lớp để ôn lại.</li>
              <li>• Thử một bài quiz ngắn để xem mình nhớ được gì.</li>
              <li>• Lưu lại những sự kiện thú vị để quay lại đọc sâu hơn.</li>
            </ul>
            <p className="text-xs text-[#6B7280] mt-1">
              Mọi thao tác chỉ mang tính trải nghiệm và học tập; bạn có thể dừng lại bất cứ lúc nào mà không lo mất phí.
            </p>
          </div>
    </section>

    {/* Nguyên tắc & điều khoản cơ bản */}
    <section className="border border-[#333333] bg-[#060606]/80 p-7 md:p-8 rounded-sm space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="text-[#F4D03F]" size={26} />
            <div>
              <h2 className="text-2xl font-serif text-[#F9FAFB] mb-1">Nguyên tắc đồng hành</h2>
              <p className="text-xs text-[#9CA3AF]">
                Ngắn gọn – rõ ràng – tôn trọng người dùng Việt Nam.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-sm text-[#D1D5DB]">
            <div className="space-y-2">
              <h3 className="text-[#F4D03F] font-semibold text-sm">
                1. Bảo vệ dữ liệu cá nhân
              </h3>
              <p>
                Chúng tôi chỉ thu thập những thông tin thật sự cần thiết (tài khoản, email liên hệ) và
                không chia sẻ cho bất kỳ bên thứ ba nào nếu không có sự đồng ý của bạn hoặc yêu cầu từ cơ quan có thẩm quyền.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[#F4D03F] font-semibold text-sm">
                2. Tôn trọng lịch sử & cộng đồng
              </h3>
              <p>
                Nội dung được biên soạn dựa trên nguồn tư liệu đáng tin cậy, hướng tới việc lan toả tinh thần
                yêu nước, tôn trọng sự đa dạng về góc nhìn nhưng không cổ suý xuyên tạc lịch sử.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[#F4D03F] font-semibold text-sm">
                3. Sử dụng nội dung một cách công bằng
              </h3>
              <p>
                Bạn có thể dùng nội dung trên nền tảng cho mục đích học tập, giảng dạy và hoạt động cộng đồng
                phi lợi nhuận. Mọi hình thức khai thác thương mại cần có sự trao đổi và đồng ý bằng văn bản.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-[#6B7280] border-t border-[#222222] pt-4 mt-2">
            Phiên bản điều khoản rút gọn, cập nhật: {new Date().toLocaleDateString('vi-VN')}. Khi cần bản chi tiết,
            vui lòng liên hệ đội ngũ Echoes of Việt Nam.
          </p>
        </section>
      </div>
    </div>
  );
}
