import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Award, Heart, Search, X } from 'lucide-react';

interface HistoricalFigure {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  birth: string;
  death?: string;
  achievements: string[];
}

const historicalFigures: HistoricalFigure[] = [
  {
    id: 'ho-chi-minh',
    name: 'Hồ Chí Minh',
    title: 'Chủ Tịch Nước - Lãnh Tụ Cách Mạng',
    description: 'Biểu tượng đoàn kết dân tộc, người sáng lập nước Việt Nam Dân chủ Cộng hòa',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
    birth: '19/5/1890',
    death: '2/9/1969',
    achievements: [
      'Người sáng lập Đảng Cộng sản Việt Nam',
      'Lãnh đạo cách mạng Tháng Tám 1945',
      'Chủ tịch nước đầu tiên của Việt Nam'
    ]
  },
  {
    id: 'vo-nguyen-giap',
    name: 'Võ Nguyên Giáp',
    title: 'Đại Tướng - Tổng Tư Lệnh Quân Đội',
    description: 'Đại tướng đầu tiên của Việt Nam, chỉ huy chiến thắng Điện Biên Phủ và chiến dịch 1975',
    image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800',
    birth: '25/8/1911',
    death: '4/10/2013',
    achievements: [
      'Chỉ huy chiến thắng Điện Biên Phủ 1954',
      'Chỉ huy chiến dịch Hồ Chí Minh 1975',
      'Đại tướng đầu tiên của QĐND Việt Nam'
    ]
  },
  {
    id: 'pham-van-dong',
    name: 'Phạm Văn Đồng',
    title: 'Thủ Tướng Chính Phủ',
    description: 'Thủ tướng lâu năm, nhà ngoại giao quan trọng của cách mạng Việt Nam',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800',
    birth: '1/3/1906',
    death: '29/4/2000',
    achievements: [
      'Thủ tướng Chính phủ 1955-1987',
      'Tham gia đàm phán Hiệp định Genève 1954',
      'Đại biểu Quốc hội nhiều khóa'
    ]
  },
  {
    id: 'truong-chinh',
    name: 'Trường Chinh',
    title: 'Tổng Bí Thư - Chủ Tịch Nước',
    description: 'Nhà lãnh đạo chủ chốt, lý luận gia xuất sắc của Đảng và cách mạng Việt Nam',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800',
    birth: '9/2/1907',
    death: '30/9/1988',
    achievements: [
      'Tổng Bí thư Đảng hai nhiệm kỳ',
      'Chủ tịch nước CHXHCN Việt Nam',
      'Tác giả nhiều tác phẩm lý luận quan trọng'
    ]
  },
  {
    id: 'le-duan',
    name: 'Lê Duẩn',
    title: 'Tổng Bí Thư Đảng',
    description: 'Lãnh đạo Đảng và đất nước trong thời kỳ kháng chiến chống Mỹ và xây dựng CNXH',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    birth: '7/4/1907',
    death: '10/7/1986',
    achievements: [
      'Tổng Bí thư 1960-1986',
      'Lãnh đạo kháng chiến chống Mỹ thắng lợi',
      'Chỉ đạo thống nhất đất nước'
    ]
  },
  {
    id: 'nguyen-van-linh',
    name: 'Nguyễn Văn Linh',
    title: 'Tổng Bí Thư Đảng',
    description: 'Người khởi xướng công cuộc Đổi Mới, mở ra thời kỳ phát triển mới của đất nước',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800',
    birth: '1/7/1915',
    death: '27/4/1998',
    achievements: [
      'Tổng Bí thư 1986-1991',
      'Người khởi xướng Đổi Mới 1986',
      'Bí thư Thành ủy TP.HCM thời kỳ kháng chiến'
    ]
  },
];

export default function HistoricalFigures() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter figures based on search query
  const filteredFigures = historicalFigures.filter((figure) => {
    const query = searchQuery.toLowerCase();
    return (
      figure.name.toLowerCase().includes(query) ||
      figure.title.toLowerCase().includes(query) ||
      figure.description.toLowerCase().includes(query) ||
      figure.achievements.some(a => a.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#181818] to-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-amber-400"></div>
            <User className="text-amber-400" size={32} />
            <div className="h-1 w-12 bg-amber-400"></div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-display uppercase text-amber-400 mb-6 tracking-wider">
            Nhân Vật Lịch Sử
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Những con người vĩ đại đã cống hiến trọn đời cho sự nghiệp độc lập, tự do của dân tộc
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Award className="text-amber-400" size={20} />
              <span>Anh Hùng Dân Tộc</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 px-6 bg-gradient-to-r from-[#181818] via-[#0a0a0a] to-[#181818] border-y border-amber-400/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl font-light text-amber-400 italic">
            "Không có gì quý hơn độc lập tự do"
          </p>
          <p className="mt-4 text-gray-400">— Chủ tịch Hồ Chí Minh —</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400" size={24} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm nhân vật theo tên, chức vụ, thành tựu..."
                className="w-full pl-14 pr-14 py-4 bg-[#181818] border-2 border-amber-400/30 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors"
                >
                  <X size={24} />
                </button>
              )}
            </div>
            
            {/* Search Results Count */}
            {searchQuery && (
              <div className="mt-4 text-center">
                <p className="text-gray-400">
                  Tìm thấy <span className="text-amber-400 font-bold">{filteredFigures.length}</span> kết quả
                  {filteredFigures.length === 0 && ' - Hãy thử từ khóa khác'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Figures Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredFigures.length === 0 ? (
            <div className="text-center py-20">
              <User className="mx-auto text-gray-600 mb-4" size={64} />
              <h3 className="text-2xl text-gray-400 mb-2">Không tìm thấy nhân vật</h3>
              <p className="text-gray-500">Vui lòng thử lại với từ khóa khác</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFigures.map((figure, index) => (
              <div
                key={figure.id}
                onClick={() => navigate(`/culture/historical-figures/${figure.id}`)}
                className="group relative bg-gradient-to-br from-[#181818] to-[#0a0a0a] rounded-2xl overflow-hidden border-2 border-amber-400/30 hover:border-amber-400 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-400/20"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                {/* Image - Portrait Style */}
                <div className="relative h-96 overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#181818]">
                  <img
                    src={figure.image}
                    alt={figure.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
                  
                  {/* Name Overlay on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] to-transparent">
                    <h3 className="text-3xl font-display text-amber-400 mb-2 drop-shadow-lg">
                      {figure.name}
                    </h3>
                    <p className="text-sm text-amber-300 font-semibold uppercase tracking-wider">
                      {figure.title}
                    </p>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-[#0a0a0a]/90 backdrop-blur-md border border-amber-400/50 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                    <Calendar className="text-amber-400" size={16} />
                    <span className="text-xs text-amber-300 font-semibold">{figure.birth} {figure.death && `- ${figure.death}`}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-gradient-to-b from-[#0a0a0a] to-[#181818]">
                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed mb-6 text-center italic border-l-4 border-amber-400 pl-4 py-2 bg-[#181818]/50 rounded-r">
                    {figure.description}
                  </p>

                  {/* Achievements */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="text-amber-400" size={18} />
                      <span className="text-amber-400 text-sm font-bold uppercase">Thành Tựu Nổi Bật</span>
                    </div>
                    {figure.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-start gap-3 bg-[#181818]/50 p-3 rounded-lg border border-amber-400/10">
                        <span className="text-amber-400 text-lg leading-none">✦</span>
                        <span className="text-sm text-gray-300 leading-relaxed">{achievement}</span>
                      </div>
                    ))}
                  </div>

                  {/* View Details Button */}
                  <div className="pt-4 border-t border-amber-400/20">
                    <div className="flex items-center justify-center gap-2 text-amber-400 font-bold group-hover:text-amber-300 transition-colors bg-[#181818] hover:bg-amber-400/10 py-3 rounded-lg">
                      <span>Khám Phá Cuộc Đời</span>
                      <span className="transform group-hover:translate-x-2 transition-transform text-lg">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Memorial Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#181818] border-t border-amber-400/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <Heart className="text-red-500" size={32} />
          </div>
          
          <h2 className="text-3xl font-display text-amber-400 mb-6">
            Cùng Hàng Triệu Anh Hùng, Liệt Sĩ
          </h2>
          
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            Và những chiến sĩ cách mạng vô danh đã hi sinh vì độc lập tự do của Tổ quốc, 
            vì hạnh phúc của nhân dân. Công ơn các vị sẽ mãi được ghi nhớ trong lòng dân tộc.
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-amber-400/30"></div>
            <span className="text-amber-400 text-2xl">🕊️</span>
            <div className="h-px w-24 bg-amber-400/30"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
