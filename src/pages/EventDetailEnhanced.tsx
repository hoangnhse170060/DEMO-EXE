import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Zap, ChevronDown } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: string;
  content: string;
  details?: string[];
  isExpanded?: boolean;
}

interface Timeline {
  year: string;
  month?: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

interface Gallery {
  id: string;
  src: string;
  caption: string;
  year?: string;
}

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  name: string;
  date: string;
  description: string;
  icon: string;
}

const EventDetailEnhanced = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventData = location.state?.event;
  const historyTarget = eventData?.id ? `/history?eventId=${eventData.id}` : '/history';

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Mock data for Trần Đại Nghĩa (for demo)
  const heroData = {
    title: eventData?.title || 'Giáo sư - Viên sỹ Trần Đại Nghĩa',
    subtitle: eventData?.summary || 'Nhà giáo dục tiéng tăm của Việt Nam thế kỷ XX',
    backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    badge: 'LỊCH SỬ GIÁO DỤC',
  };

  const highlights = [
    {
      icon: '📚',
      text: 'Thị đỏ vào trường trung học ở Mỹ Tho với số điểm cao nhất và được cấp học bổng',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🏫',
      text: 'Năm 1930, Phạm Quang Lệ thị đỏ vào trường trung học bán xứ Petrus Ký',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '🌟',
      text: 'Năm 1933, ông thì đỏ hạng bầu từ tại (Tú tài Bản xứ) và tư tại Tây)',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const timeline: Timeline[] = [
    {
      year: '1913',
      month: '9/13',
      title: 'Sinh ngày 13 tháng 9 năm 1913',
      description: 'Sinh tại Châu Hiệp, huyện Tân Bình (Vĩnh Long)',
      icon: '👶',
      image: 'https://images.unsplash.com/photo-1553883558-d1fda0eeb490?w=300&h=200&fit=crop',
    },
    {
      year: '1926-1930',
      month: '9/1926',
      title: 'Thời kỳ học tập ở Mỹ Tho',
      description: 'Học tập tại trường trung học ở Mỹ Tho với thành tích xuất sắc',
      icon: '📚',
      image: 'https://images.unsplash.com/photo-1427504494785-cdeb4f5d12db?w=300&h=200&fit=crop',
    },
    {
      year: '1933',
      month: '5/1933',
      title: 'Hoàn thành bằng Tú tài',
      description: 'Tốt nghiệp bằng Tú tài Bản xứ và được công nhận là cử nhân có đầy đủ năng lực',
      icon: '🎓',
      image: 'https://images.unsplash.com/photo-1523147335684-37898b6baf30?w=300&h=200&fit=crop',
    },
    {
      year: '1945',
      month: '9/1945',
      title: 'Cách mạng và Độc lập',
      description: 'Tham gia trong kháng chiến, góp phần vào quá trình xây dựng nước Việt Nam',
      icon: '🚩',
      image: 'https://images.unsplash.com/photo-1540575467063-178f50911e0e?w=300&h=200&fit=crop',
    },
  ];

  const sections: Section[] = [
    {
      id: 'background',
      title: '📖 Tiểu sử và Nền tảng',
      icon: '📜',
      content:
        'Trần Đại Nghĩa sinh năm 1913 tại Châu Hiệp, huyện Tân Bình, tỉnh Vĩnh Long. Quê tại làng Chánh Hiệp, huyện Tân Bình (Vĩnh Long). Năm thứ 7 tuổi, ông mộ cải chà, gia cảnh thiếu hơn me và chính đã về quê có gáng chân lo lên tiền ấn học.',
      details: [
        'Gia đình có truyền thống trí thức',
        'Lớn lên giữa thời kỳ Pháp thuộc',
        'Tiếp nhận nền giáo dục Pháp hiện đại',
        'Có đam mê về khoa học và giáo dục',
      ],
    },
    {
      id: 'education',
      title: '🎓 Con đường Cách Mạng',
      icon: '🏫',
      content:
        'Ngày 9-1946, Trần Đại Nghĩa cùng đoàn của Bác Hồ đã rời Căng Tu-lông nước Pháp về Việt Nam. Ông đã tham gia tích cực trong quá trình xây dựng thành phố độc lập.',
      details: [
        'Năm 1946: Rời Pháp, trở về Việt Nam',
        'Tham gia Kháng chiến chống Pháp',
        'Góp phần xây dựng giáo dục quốc gia',
        'Thành lập các trường học lâu đài',
      ],
    },
    {
      id: 'contributions',
      title: '💡 Những Đóng Góp Lịch Sử',
      icon: '⭐',
      content:
        'Trang Đại Nghĩa được ghi nhận là một trong những nhà giáo dục tiên phong trong việc hiện đại hóa giáo dục Việt Nam. Ông đã thành lập lên ba bảng bằng giáo dục với các phương pháp sư phạm tiên tiến.',
      details: [
        'Cải cách phương pháp giảng dạy',
        'Xây dựng chương trình giáo dục mới',
        'Huấn luyện thế hệ giáo viên',
        'Phát triển văn hóa giáo dục',
      ],
    },
  ];

  const gallery: Gallery[] = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      caption: 'Trần Đại Nghĩa - Giáo sư tiêu biểu',
      year: '1935',
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1427504494785-cdeb4f5d12db?w=600&h=400&fit=crop',
      caption: 'Trường học của Trần Đại Nghĩa',
      year: '1940',
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1523147335684-37898b6baf30?w=600&h=400&fit=crop',
      caption: 'Cùng các học sinh ưu tú',
      year: '1938',
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1540575467063-178f50911e0e?w=600&h=400&fit=crop',
      caption: 'Kỷ niệm với các đồng sự',
      year: '1945',
    },
  ];

  const mapPins: MapPin[] = [
    {
      id: 'birthplace',
      lat: 10.2,
      lng: 105.8,
      name: 'Nơi sinh',
      date: '1913',
      description: 'Châu Hiệp, Tân Bình, Vĩnh Long',
      icon: '👶',
    },
    {
      id: 'school1',
      lat: 10.15,
      lng: 105.78,
      name: 'Trường Trung Học Mỹ Tho',
      date: '1926-1930',
      description: 'Nơi theo học với thành tích xuất sắc',
      icon: '📚',
    },
    {
      id: 'france',
      lat: 48.8566,
      lng: 2.3522,
      name: 'Paris, Pháp',
      date: '1933-1945',
      description: 'Tiếp tục học tập và giảng dạy',
      icon: '🇫🇷',
    },
    {
      id: 'hanoi',
      lat: 21.0285,
      lng: 105.8542,
      name: 'Hà Nội',
      date: 'Từ 1945',
      description: 'Cơ sở hoạt động giáo dục sau độc lập',
      icon: '🏛️',
    },
  ];

  // Handle scroll for progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolled = window.scrollY;
      const totalScroll = documentHeight - windowHeight;
      const progress = (scrolled / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-brand-base overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-brand-blue via-purple-500 to-pink-500 z-50" style={{ width: `${scrollProgress}%` }} />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-40 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft size={24} className="text-brand-blue" />
      </button>

      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(31, 41, 55, 0.7), rgba(139, 0, 0, 0.7)), url(${heroData.backgroundImage})`,
            backgroundAttachment: 'fixed',
            transform: `translateY(${scrollProgress * 0.5}px)`,
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6 inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-white/80 text-sm font-semibold tracking-widest">{heroData.badge}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 drop-shadow-lg animate-fade-in">{heroData.title}</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {heroData.subtitle}
          </p>

          {/* Hero CTA */}
          <div className="flex gap-4 justify-center flex-wrap animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <button className="px-8 py-3 bg-white text-brand-text font-semibold rounded-lg hover:bg-white/90 transition-all duration-200 hover:scale-105 shadow-lg">
              🎬 Xem Video
            </button>
            <button className="px-8 py-3 bg-white/20 text-white border border-white/40 font-semibold rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
              📖 Đọc Chi Tiết
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={32} className="text-white/60" />
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-brand-base to-brand-base/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-brand-text mb-4 text-center">✨ Những Khoảnh Khắc Chính</h2>
          <p className="text-center text-brand-muted mb-12">Những bước ngoặt quan trọng trong cuộc đời của Trần Đại Nghĩa</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative z-10">
                  <span className="text-5xl mb-4 block">{highlight.icon}</span>
                  <p className="text-brand-text font-medium leading-relaxed">{highlight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-brand-text mb-4 text-center">🕰️ Dòng Thời Gian Sự Kiện</h2>
          <p className="text-center text-brand-muted mb-16">Hành trình 50 năm cống hiến cho giáo dục</p>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-brand-blue via-purple-500 to-pink-500" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div key={idx} className={`flex items-center gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`w-1/2 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-brand-blue/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-brand-blue" />
                        <span className="text-sm font-semibold text-brand-blue">{item.year}</span>
                        {item.month && <span className="text-xs text-brand-muted">Tháng {item.month}</span>}
                      </div>
                      <h3 className="text-xl font-serif text-brand-text mb-2">{item.title}</h3>
                      <p className="text-brand-muted text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="relative w-auto flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-blue to-purple-500 flex items-center justify-center text-white text-xl shadow-lg ring-4 ring-white z-10">
                      {item.icon}
                    </div>
                  </div>

                  {/* Image Placeholder */}
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-brand-base/50 to-brand-base">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-brand-text mb-4 text-center">📸 Tư Liệu Hình Ảnh</h2>
          <p className="text-center text-brand-muted mb-12">Những bức ảnh lịch sử quý giá</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <img
                src={gallery[activeGalleryIndex].src}
                alt={gallery[activeGalleryIndex].caption}
                className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <p className="text-white font-serif text-xl mb-1">{gallery[activeGalleryIndex].caption}</p>
                  {gallery[activeGalleryIndex].year && <span className="text-white/80 text-sm">{gallery[activeGalleryIndex].year}</span>}
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="space-y-4">
              {gallery.map((image, idx) => (
                <div
                  key={image.id}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    activeGalleryIndex === idx ? 'ring-4 ring-brand-blue shadow-lg scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={image.src} alt={image.caption} className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                  <p className="absolute bottom-2 left-2 text-white text-xs font-semibold bg-black/40 px-2 py-1 rounded">{image.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expandable Sections */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-brand-text mb-4 text-center">📚 Thông Tin Chi Tiết</h2>

          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="border-2 border-brand-blue/20 rounded-xl overflow-hidden hover:border-brand-blue/40 transition-all duration-300">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-brand-base/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{section.icon}</span>
                    <h3 className="text-xl font-serif text-brand-text">{section.title}</h3>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-brand-blue transition-transform duration-300 ${expandedSections[section.id] ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedSections[section.id] && (
                  <div className="px-6 pb-6 border-t border-brand-blue/10 animate-fade-in">
                    <p className="text-brand-muted leading-relaxed mb-4">{section.content}</p>
                    {section.details && (
                      <ul className="space-y-2">
                        {section.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-brand-text">
                            <span className="text-brand-blue font-bold mt-1">✓</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-brand-text mb-4 text-center">🗺️ Bản Đồ Sự Kiện</h2>
          <p className="text-center text-brand-muted mb-12">Những địa điểm quan trọng trong cuộc đời</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white p-8 border border-brand-blue/20">
              <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative">
                <span className="text-6xl">🗺️</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-center text-brand-muted text-sm">Interactive Map sẽ được thêm vào</p>
                </div>
              </div>
            </div>

            {/* Pins Info */}
            <div className="space-y-4">
              {mapPins.map((pin) => (
                <div
                  key={pin.id}
                  onMouseEnter={() => setHoveredPin(pin.id)}
                  onMouseLeave={() => setHoveredPin(null)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                    hoveredPin === pin.id
                      ? 'border-brand-blue bg-brand-blue/10 shadow-lg scale-105'
                      : 'border-brand-blue/20 bg-white hover:border-brand-blue/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{pin.icon}</span>
                    <div>
                      <h4 className="font-semibold text-brand-text">{pin.name}</h4>
                      <p className="text-sm text-brand-blue font-medium">{pin.date}</p>
                      <p className="text-sm text-brand-muted mt-1">{pin.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quiz CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-brand-blue via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 drop-shadow-lg">
            ✨ Sẵn Sàng Kiểm Tra Kiến Thức?
          </h2>
          <p className="text-xl text-white/90 mb-12 drop-shadow-md max-w-2xl mx-auto">
            Trả lời 3 câu hỏi trong 20 giây để kiểm tra hiểu biết của bạn về Trần Đại Nghĩa và kỷ nguyên giáo dục của ông.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(historyTarget)}
              className="px-10 py-4 bg-white text-brand-blue font-bold text-lg rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Zap size={20} className="group-hover:animate-spin" />
              Bắt Đầu Quiz Ngay
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-10 py-4 bg-white/20 text-white font-bold text-lg rounded-lg border-2 border-white/40 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
            >
              Quay Lại
            </button>
          </div>

          <p className="text-white/70 text-sm mt-6">🎯 Hoàn thành quiz để mở khóa thêm nội dung & nhận sao</p>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 px-4 bg-brand-base text-center">
        <p className="text-brand-muted text-sm">
          📚 Nguồn tài liệu: Bảo tàng Lịch sử Quốc gia Việt Nam | Cập nhật: 2025
        </p>
      </section>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EventDetailEnhanced;
