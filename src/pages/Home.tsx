import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Plane, Building, Bus, X } from 'lucide-react';

const heroHighlights = [
  { title: 'Thời Tiền Sử', image: 'https://s3.cloud.cmctelecom.vn/tinhte2/2020/08/5112083_do-da-6.jpg' },
  { title: 'Giải phóng Miền Nam',  image: 'https://i.pinimg.com/1200x/16/07/ca/1607cab26fee6af7e816fd775af17148.jpg' },
  { title: 'Đất nước Hòa Bình', image: 'https://cdn.tienphong.vn/images/29cd5274602d6d99af6b49e5ee9595c596fffbeb164106f0efa5eaedd7c56064daffad9ae195ab0c6999c149bf4572f298bc36e9cd5d53e3b705d358749a287ba56723e33da1fa49a6d810a700a3fcbe/z6950383608379-b6deec883c683faf3f1d32f4cbc060f8.jpg' }
];

const timeline = [
  { title: 'Lịch sử', text: 'Tìm hiểu về lịch sử Việt Nam qua các thời kỳ.', image: 'https://cdn.tienphong.vn/images/a7a4eb175a75567c9a7ae09768d70948e242b568a2b2f094465d6f3a941c392180194365622a91f721cdf468e6bc7bf8714ef85a15986e12ec866c53661a093d/anh1b_YJEW.jpg' },
  { title: 'Văn hóa', text: 'Khám phá các giá trị văn hóa đặc sắc của Việt Nam.', image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2023/9/22/1244807/2-01.jpg' },
];

const historyTimeline = [
  {
    title: "Thời Tiền Sử",
    text: "Giai đoạn xuất hiện dấu tích người nguyên thủy.",
    image: "https://covatdanang.com/wp-content/uploads/2024/11/van-hoa-son-vi.jpg",
    periods: [
      {
        name: "Văn hóa Hòa Bình",
        image: "https://lichsu.org/wp-content/uploads/2023/10/nen-van-hoa-hoa-binh.jpg" ,
        desc: "Một trong những nền văn hóa cổ nhất Đông Nam Á, nổi bật với công cụ đá ghè và lối sống săn bắt – hái lượm."
      },
      {
        name: "Văn hóa Bắc Sơn",
        image: "https://tamdiepblog.wordpress.com/wp-content/uploads/2024/11/cong-cu-vh-bac-son.jpg?w=859",
        desc: "Đặc trưng bởi rìu mài lưỡi, mở đầu thời kỳ đá mới của Việt Nam."
      }
    ]
  },
  {
    title: "Thời Cổ Đại",
    text: "Hình thành những nhà nước đầu tiên của người Việt.",
    image: "https://icdn.dantri.com.vn/a4R9SzOKIZ3rZJpaVTug/Image/2013/09/Anh-bai/6-e2d85.jpg",
    periods: [
      {
        name: "Văn Lang",
        image: "https://kienviet.net/wp-content/uploads/2012/07/00887761-b8c0-4de8-8c6e-3773748917d4_cong-tam-quan-thanh-co-loa.jpg",
        desc: "Nhà nước đầu tiên của người Việt dưới thời các vua Hùng."
      },
      {
        name: "Âu Lạc",
        image: "https://vietjack.com/lich-su-6-ket-noi/images/cau-hoi-3-trang-62-lich-su-lop-6-ket-noi-tri-thuc-1.png",
        desc: "Thành Cổ Loa và kỹ nghệ đồng phát triển mạnh mẽ."
      }
      
    ]
  },
  {
    title: "Thời Bắc Thuộc",
    text: "Giai đoạn lịch sử Việt Nam kéo dài hơn một nghìn năm",
    image: "https://tiasang.com.vn/wp-content/uploads/2024/03/image-12.png",
    periods: [
      {
        name: "Nhà Triệu ",
        image: "https://hoangthanhthanglong.vn/wp-content/uploads/2023/05/trieuda2.jpg",
        desc: "Thời kỳ nhà Triệu và nhà Hán cai trị đất Việt."
      },
      {
        name: "Khởi nghĩa Hai Bà Trưng",
        image: "https://vov2.vov.vn/sites/default/files/images/Khoi%20nghia%20HBT.jpg",
        desc: "Cuộc khởi nghĩa tạo nên bản anh hùng ca bất tử của dân tộc."
      }
    ]
  },
  {
    title: "Thời Phong Kiến",
    text: "Hơn 1000 năm tự chủ và phát triển quốc gia Đại Việt.",
    image: "https://congdankhuyenhoc.qltns.mediacdn.vn/thumb_w/840/449484899827462144/2024/1/24/cacvikhaoquantronglexuongdanhkhoathinamdinhdaunamdinhngay27thang12nam1897-1706104184937485134775.jpg",
    periods: [
      {
        name: "Nhà Lý",
        image: "https://galaxytourist.vn/public/upload/images/image(829).png",
        desc: "Thời kỳ thịnh trị, mở ra nền văn hóa Lý đặc sắc."
      },
      {
        name: "Nhà Trần",
        image: "https://vov2.vov.vn/sites/default/files/styles/large/public/2021-09/khang-chien-chong-nguyen-mong_1.jpg",
        desc: "Ba lần đánh thắng quân Nguyên Mông – đỉnh cao quân sự Đại Việt."
      }
    ]
  },
  {
    title: "Thời Hiện Đại",
    text: "Thời kỳ đấu tranh giải phóng và xây dựng quốc gia hiện đại.",
    image: "https://conganthanhhoa.gov.vn/upload/81582/fck/cathanhhoa/Untitled_1-1702944802790.jpg",
    periods: [
      {
        name: "Kháng chiến chống Pháp",
        image: "https://cdn.thuvienphapluat.vn/uploads/tintuc/2024/12/17/cuoc-khang-chien-chong-phap.png",
        desc: "Cuộc chiến kéo dài gần 100 năm chống thực dân Pháp."
      },
      {
        name: "Kháng chiến chống Mỹ",
        image: "https://imgnvsk.vnanet.vn/MediaUpload/Content/2025/04/16/116-15-33-31.jpg",
        desc: "Một trong những cuộc chiến quyết liệt nhất thế kỷ 20, kết thúc năm 1975."
      }
    ]
  }
];

const inclusions = [
  { title: 'Guides', detail: 'Hướng dẫn viên am hiểu lịch sử', icon: BookOpen },
  { title: 'Flights', detail: 'Hà Nội ↔ Huế ↔ Sài Gòn', icon: Plane },
  { title: 'Transfers', detail: 'Xe riêng + tàu lịch sử', icon: Bus },
  { title: 'Hotels', detail: 'Khách sạn boutique 4⭐️', icon: Building }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [modalImage, setModalImage] = useState<{ url: string; title: string; desc: string } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide carousel effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroHighlights.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#181818] via-[#050505] to-[#181818] text-white overflow-hidden">
      {/* Image Modal */}
      {modalImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all z-50"
            onClick={() => setModalImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={modalImage.url} 
                alt={modalImage.title}
                className="w-full h-auto max-h-[85vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
                <h3 className="text-4xl font-bold mb-3">{modalImage.title}</h3>
                <p className="text-white/80 text-lg leading-relaxed">{modalImage.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <section
        className="relative h-screen bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.25), rgba(245,233,210,0.18)), url(${heroHighlights[currentSlide].image.replace('w=600', 'w=1920')})`
        }}
      >
  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-[#f5e9d2]/20 transition-opacity duration-1000" />
        <div className="relative max-w-6xl mx-auto h-full px-6 py-10 flex flex-col justify-between">

          <div className="flex flex-col justify-center items-center h-full">
            {/* Center - Title */}
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="text-center space-y-4">
                <p className="text-3xl tracking-[0.5em] font-light animate-fadeIn text-amber-400">VIỆT NAM</p>
                <h1 className="text-7xl md:text-9xl font-black tracking-[0.1em] uppercase drop-shadow-2xl animate-fadeInUp text-white">DÒNG SỬ VIỆT</h1>
              </div>
            </div>
            {/* Bottom - Carousel Cards */}
            <div className="flex items-center justify-between gap-32">
              <div className="flex items-center gap-6">
                {/* Carousel Indicators - Vertical */}
                <div className="flex flex-col gap-3 items-center">
                  {heroHighlights.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'h-10 w-2 bg-white' : 'h-2 w-2 bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                {/* Cards */}
                <div className="flex gap-3 items-end">
                  {heroHighlights.map((item, index) => (
                    <div 
                      key={item.title} 
                      className={`flex-shrink-0 w-32 h-44 rounded-xl overflow-hidden relative group cursor-pointer animate-slideInUp ${
                        index === currentSlide 
                          ? '-translate-y-8 scale-110 shadow-[0_20px_40px_rgba(80,180,255,0.18)] z-10 border-4 border-blue-300' 
                          : 'translate-y-0 scale-100 border-2 border-teal-200'
                      } bg-[#181818]/80`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both',
                        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                      onClick={() => setCurrentSlide(index)}
                    >
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-125" 
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-[#181818]/80 via-[#050505]/60 to-transparent transition-opacity ${
                        index === currentSlide ? 'opacity-30' : 'opacity-60'
                      } group-hover:opacity-20`} />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                        <p className="text-sm font-bold leading-tight text-amber-400">{item.title.split(' ').slice(0, 2).join(' ')}</p>
                        <p className="text-sm font-bold leading-tight text-white">{item.title.split(' ').slice(2).join(' ')}</p>
          
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Khám Phá Button - Bottom Right */}
              <button 
                onClick={() => navigate('/history')}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#181818] via-[#050505] to-[#181818] text-amber-400 font-bold border-2 border-amber-400 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,193,7,0.12)] group"
              >
                <span className="text-lg tracking-[0.3em] font-semibold">KHÁM PHÁ</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Quotes */}
      <section className="overflow-hidden py-6 bg-gradient-to-r from-[#050505] via-[#0a0a0a] to-[#050505] border-y border-white/10">
        <div className="flex animate-scroll whitespace-nowrap">
          <span className="inline-flex items-center text-xl font-light tracking-wide">
            <span className="mx-12">🇻🇳</span>
            <span className="text-amber-400 font-medium">Dân ta phải biết sử ta - Cho tường gốc tích nước nhà Việt Nam</span>
            <span className="mx-12 text-white/40">•</span>
            <span className="text-white/90">Hoàng Sa - Trường Sa là của Việt Nam</span>
            <span className="mx-12 text-white/40">•</span>
            <span className="text-amber-400 font-medium">Không có gì quý hơn độc lập tự do</span>
            <span className="mx-12 text-white/40">•</span>
            <span className="text-white/90">Đoàn kết - Đoàn kết - Đại đoàn kết</span>
            <span className="mx-12 text-white/40">•</span>
            <span className="text-amber-400 font-medium">Thành công - Thành công - Đại thành công</span>
            <span className="mx-12">🇻🇳</span>
          </span>
          <span className="inline-flex items-center text-xl font-light tracking-wide" aria-hidden="true">
            <span className="mx-12">🇻🇳</span>
            <span className="text-amber-400 font-medium">Dân ta phải biết sử ta - Cho tường gốc tích nước nhà Việt Nam</span>
            <span className="mx-12 text-white/40">•</span>
            <span className="text-white/90">Hoàng Sa - Trường Sa là của Việt Nam</span>
            <span className="mx-12 text-white/40">•</span>
            <span className="text-amber-400 font-medium">Không có gì quý hơn độc lập tự do</span>
            <span className="mx-12 text-white/40">•</span>
            <span className="text-white/90">Đoàn kết - Đoàn kết - Đại đoàn kết</span>
            <span className="mx-12 text-white/40">•</span>
            <span className="text-amber-400 font-medium">Thành công - Thành công - Đại thành công</span>
            <span className="mx-12">🇻🇳</span>
          </span>
        </div>
      </section>

    <section className="py-16 px-6 bg-gradient-to-b from-[#181818] to-[#050505]">
  <div className="max-w-6xl mx-auto space-y-8 bg-[#181818]/80 rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div className="text-[0.7rem] uppercase tracking-[0.8em] text-white/50">Giới Thiệu</div>
            <div className="h-px flex-1 bg-white/10 mx-6" />
          </div>
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6 text-white/80">
              <p className="text-3xl font-light">Ở ĐÂY CÓ NHỮNG GÌ?</p>
              <p className="text-sm leading-relaxed">Dòng Sử Việt được ra mắt với sứ mệnh lưu giữ và lan tỏa những giá trị lịch sử hào hùng, quý báu của dân tộc Việt Nam từ thời tiền sử đến nay. </p>
            </div>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4 items-center bg-[#050505]/60 rounded-2xl p-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-white/70">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    <section className="py-20 px-6 bg-gradient-to-b from-[#181818] to-[#050505]">
  <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#181818] via-[#050505] to-[#181818] rounded-3xl shadow-lg p-8">
          {/* Section Header */}
          <div className="flex items-center mb-16">
            <div className="h-px flex-1 bg-white/20" />
            <h2 className="text-4xl md:text-5xl uppercase tracking-[0.5em] text-white/80 px-8">Dòng chảy lịch sử</h2>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-12 space-y-6">
            <p className="text-white/80 text-lg leading-relaxed text-center">
             Hành trình khám phá dòng chảy lịch sử Việt Nam từ thời tiền sử đến nay
            </p>
            <p className="text-amber-400 text-sm leading-relaxed text-center  ">
              <span className="text-amber-400">Từ Thời Tiền Sử</span>, <span className="text-amber-400">Thời Cổ – Trung Đại</span>, và <span className="text-amber-400">Thời Bắc Thuộc</span>.
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 hidden lg:block" />

            {/* Timeline Items */}
            <div className="space-y-20">
              {historyTimeline.map((era, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#181818] rounded-full border-4 border-amber-400 z-10 hidden lg:block" />

                  {/* Content */}
                  <div className={`grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 0 ? '' : 'lg:direction-rtl'}`}>
                    {/* Text Side */}
                    <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12 lg:order-2'}`}>
                      <div className="inline-block mb-3">
                        <span className="text-xs uppercase tracking-[0.5em] text-amber-400 font-semibold">
                          Giai đoạn {index + 1}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        {era.title}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed mb-6">
                        {era.text}
                      </p>
                      
                      {/* Sub-periods */}
                      <div className={`space-y-3 ${index % 2 === 0 ? 'lg:items-end' : 'lg:items-start'} flex flex-col`}>
                        {era.periods.map((period, pidx) => (
                          <div 
                            key={pidx} 
                            className="inline-flex items-center gap-3 bg-[#050505]/60 px-4 py-2 rounded-full border border-white/10 hover:bg-[#181818]/80 transition-all cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                              <img 
                                src={period.image} 
                                alt={period.name}
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                              />
                            </div>
                            <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                              {period.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Image Side */}
                    <div className={`${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12 lg:order-1'}`}>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Main Era Image */}
                        <div 
                          className="col-span-2 relative h-64 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
                          onClick={() => setModalImage({ url: era.image, title: era.title, desc: era.text })}
                        >
                          <img 
                            src={era.image} 
                            alt={era.title}
                            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 mx-auto">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                              <p className="text-sm font-semibold text-amber-400">Xem chi tiết</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Period Images */}
                        {era.periods.map((period, pidx) => (
                          <div 
                            key={pidx} 
                            className="relative h-40 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                            onClick={() => setModalImage({ url: period.image, title: period.name, desc: period.desc })}
                          >
                            <img 
                              src={period.image} 
                              alt={period.name}
                              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              {period.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  

    <section className="py-16 px-6 bg-gradient-to-b from-[#181818] to-[#050505]">
  <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 bg-gradient-to-br from-[#181818] via-[#050505] to-[#181818] rounded-3xl shadow-lg p-8">
          <div className="bg-[#050505]/60 rounded-[40px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)] space-y-5">
            <h2 className="text-4xl font-semibold tracking-[0.2em] text-amber-400">Góp Ý – Phản Hồi</h2>
            <p className="text-sm text-white/80">Chúng tôi sẽ phản hồi sớm nhất có thể. Xin cảm ơn !!!</p>
            <div className="space-y-4">
              <input type="text" placeholder="Tên của bạn" className="w-full px-4 py-3 rounded-full bg-[#181818]/80 border border-white/10 placeholder:text-white/40" />
              <input type="text" placeholder="Số điện thoại" className="w-full px-4 py-3 rounded-full bg-[#181818]/80 border border-white/10 placeholder:text-white/40" />
              <textarea placeholder="Bình luận" className="w-full px-4 py-3 rounded-2xl bg-[#181818]/80 border border-white/10 placeholder:text-white/40" rows={4} />
              <button className="w-full px-6 py-3 rounded-full bg-amber-400 text-black font-semibold flex items-center justify-center gap-2">Gửi</button>
              <label className="flex items-center gap-2 text-xs text-white/60"><input type="checkbox" className="accent-amber-400" /> Tôi đồng ý với các điều khoản và chính sách bảo mật</label>
            </div>
          </div>
          <div className="bg-[url('https://i.pinimg.com/1200x/ce/2c/6b/ce2c6bd9c5a442f30f4944068a093a14.jpg')] bg-cover bg-center rounded-[40px] flex items-end p-40 shadow-[0_30px_60px_rgba(0,0,0,0.6)] ">  
            <div className="space-y-2">
           
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
