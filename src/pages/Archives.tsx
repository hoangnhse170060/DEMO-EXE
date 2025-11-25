import { useState } from 'react';
import { FileText, Newspaper, Hammer, BookOpen, Search, X, Calendar, MapPin, Eye, Download, Filter, Grid, List, Image as ImageIcon, Play } from 'lucide-react';

type ArchiveCategory = 'all' | 'documents' | 'newspapers' | 'artifacts' | 'writings';
type ViewMode = 'grid' | 'list';

interface Archive {
  id: string;
  title: string;
  category: ArchiveCategory;
  description: string;
  image: string;
  date: string;
  location?: string;
  period: string;
  tags: string[];
  views: number;
  gallery?: string[]; // Multiple images of the document
  video?: {
    url: string;
    title: string;
    thumbnail: string;
  };
  fullText?: string; // Full text content
}

const archives: Archive[] = [
  {
    id: '1',
    title: 'Tuyên Ngôn Độc Lập 1945',
    category: 'documents',
    description: 'Bản văn lịch sử do Chủ tịch Hồ Chí Minh đọc tại Quảng trường Ba Đình ngày 2/9/1945, tuyên bố nước Việt Nam Dân chủ Cộng hòa ra đời.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    date: '2/9/1945',
    location: 'Quảng trường Ba Đình, Hà Nội',
    period: 'Cách Mạng Tháng Tám',
    tags: ['Độc lập', 'Hồ Chí Minh', 'Văn kiện quan trọng'],
    views: 15420,
    gallery: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200',
      'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1200',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
    ],
    video: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập',
      thumbnail: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800',
    },
    fullText: `"Tất cả mọi người đều sinh ra có quyền bình đẳng. Tạo hóa cho họ những quyền không ai có thể xâm phạm được; trong những quyền ấy, có quyền được sống, quyền tự do và quyền mưu cầu hạnh phúc".

Lời bất hủ ấy ở trong bản Tuyên ngôn Độc lập năm 1776 của nước Mỹ. Suy rộng ra, câu ấy có ý nghĩa là: tất cả các dân tộc trên thế giới đều sinh ra bình đẳng; dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do.

Bản Tuyên ngôn Nhân quyền và Dân quyền của Cách mạng Pháp năm 1791 cũng nói: "Người ta sinh ra tự do và bình đẳng về quyền lợi, và phải luôn luôn được tự do và bình đẳng về quyền lợi".

Đó là những lẽ phải không ai chối cãi được.

Thế mà hơn 80 năm nay, bọn thực dân Pháp lợi dụng lá cờ tự do, bình đẳng, bác ái, đến cướp đất nước ta, áp bức đồng bào ta. Hành động của chúng trái hẳn với nhân đạo và chính nghĩa...`,
  },
  {
    id: '2',
    title: 'Báo Cờ Giải Phóng',
    category: 'newspapers',
    description: 'Tờ báo cách mạng đầu tiên của Việt Nam, xuất bản từ năm 1941, là tiếng nói của Đảng và cách mạng trong thời kỳ đấu tranh giải phóng dân tộc.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    date: '1941',
    location: 'Pác Bó, Cao Bằng',
    period: 'Kháng Chiến Chống Pháp',
    tags: ['Báo chí', 'Tuyên truyền', 'Cách mạng'],
    views: 8750
  },
  {
    id: '3',
    title: 'Chiếc Mỏ Cuốc Điện Biên Phủ',
    category: 'artifacts',
    description: 'Chiếc mỏ cuốc được sử dụng trong chiến dịch Điện Biên Phủ, biểu tượng cho sức mạnh lao động và tinh thần quyết chiến của quân dân ta.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
    date: '1954',
    location: 'Điện Biên Phủ',
    period: 'Kháng Chiến Chống Pháp',
    tags: ['Hiện vật', 'Điện Biên Phủ', 'Công cụ lao động'],
    views: 6230
  },
  {
    id: '4',
    title: 'Nhật Ký Trong Tù - Hồ Chí Minh',
    category: 'writings',
    description: 'Tập thơ bất hủ được Bác Hồ sáng tác trong thời gian bị giam giữ ở Trung Quốc (1942-1943), phản ánh tâm hồn cao đẹp và ý chí kiên cường.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    date: '1942-1943',
    location: 'Trung Quốc',
    period: 'Kháng Chiến Chống Pháp',
    tags: ['Văn học', 'Hồ Chí Minh', 'Thơ ca'],
    views: 12890,
    gallery: [
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200',
    ],
    fullText: `BÀI THƠ CẢM TÁC

Bị giam ba tháng liền,
Đọc sách năm trăm thiên,
Sử xưa không chép sử,
Sao gọi sử hoàn toàn?

TỰ KHÍCH

Đói đầy cam vui khổ,
Bệnh lão chẳng lo âu.
Biết đó là điều đáng,
Càng thêm tinh thần hơn.

TẶNG BẠN

Đêm tối nhớ bạn bè,
Nhớ bạn xa cách trở.
Trời mưa gió có về,
Bạn có còn nhớ ta?`,
  },
  {
    id: '5',
    title: 'Báo Thanh Niên - Số Đầu',
    category: 'newspapers',
    description: 'Số đầu tiên của tờ báo Thanh Niên do Nguyễn Ái Quốc (Hồ Chí Minh) sáng lập tại Quảng Châu năm 1925, cơ quan ngôn luận của Hội Việt Nam Cách mạng Thanh niên.',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
    date: '21/6/1925',
    location: 'Quảng Châu, Trung Quốc',
    period: 'Phong Trào Cộng Sản',
    tags: ['Báo chí', 'Thanh niên', 'Cách mạng'],
    views: 7340
  },
  {
    id: '6',
    title: 'Cờ Tổ Quốc Đầu Tiên',
    category: 'artifacts',
    description: 'Lá cờ đỏ sao vàng đầu tiên của nước Việt Nam Dân chủ Cộng hòa, được may thủ công và tung bay trong lễ míttinh ở Hà Nội tháng 8/1945.',
    image: 'https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?w=800',
    date: '19/8/1945',
    location: 'Hà Nội',
    period: 'Cách Mạng Tháng Tám',
    tags: ['Hiện vật', 'Quốc kỳ', 'Cách mạng'],
    views: 18650
  },
  {
    id: '7',
    title: 'Bản Án Chế Độ Thực Dân Pháp',
    category: 'writings',
    description: 'Tác phẩm nổi tiếng của Nguyễn Ái Quốc viết năm 1925, lên án tội ác của chủ nghĩa thực dân Pháp tại Đông Dương và các thuộc địa.',
    image: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800',
    date: '1925',
    location: 'Paris, Pháp',
    period: 'Phong Trào Cộng Sản',
    tags: ['Chính trị', 'Hồ Chí Minh', 'Phản đế'],
    views: 9560
  },
  {
    id: '8',
    title: 'Máy Phát Thanh Chiến Dịch',
    category: 'artifacts',
    description: 'Máy phát thanh quân sự được sử dụng trong chiến dịch Điện Biên Phủ để liên lạc và chỉ huy, minh chứng cho trình độ kỹ thuật của bộ đội ta.',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800',
    date: '1954',
    location: 'Điện Biên Phủ',
    period: 'Kháng Chiến Chống Pháp',
    tags: ['Thiết bị quân sự', 'Thông tin liên lạc', 'Điện Biên Phủ'],
    views: 5430
  },
  {
    id: '9',
    title: 'Lời Kêu Gọi Toàn Quốc Kháng Chiến',
    category: 'documents',
    description: 'Lời kêu gọi của Chủ tịch Hồ Chí Minh đêm 19/12/1946, phát động cuộc kháng chiến toàn quốc chống thực dân Pháp xâm lược.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    date: '19/12/1946',
    location: 'Hà Nội',
    period: 'Kháng Chiến Chống Pháp',
    tags: ['Kêu gọi', 'Kháng chiến', 'Hồ Chí Minh'],
    views: 11240
  },
  {
    id: '10',
    title: 'Báo Nhân Dân - Số Đặc Biệt 30/4/1975',
    category: 'newspapers',
    description: 'Số báo đặc biệt thông báo tin vui giải phóng hoàn toàn miền Nam, thống nhất đất nước, kết thúc 30 năm chiến tranh.',
    image: 'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=800',
    date: '30/4/1975',
    location: 'Hà Nội',
    period: 'Kháng Chiến Chống Mỹ',
    tags: ['Báo chí', 'Giải phóng', 'Thống nhất'],
    views: 14780
  },
  {
    id: '11',
    title: 'Ấn Triện Vua Gia Long',
    category: 'artifacts',
    description: 'Ấn triện bằng vàng của vua Gia Long - vị hoàng đế đầu tiên của triều Nguyễn, biểu tượng quyền lực vương triều phong kiến Việt Nam cuối cùng.',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800',
    date: '1802',
    location: 'Huế',
    period: 'Triều Nguyễn',
    tags: ['Hiện vật', 'Hoàng gia', 'Văn hóa cung đình'],
    views: 8920
  },
  {
    id: '12',
    title: 'Đường Kách Mệnh - Nguyễn Ái Quốc',
    category: 'writings',
    description: 'Tác phẩm quan trọng viết năm 1927, nêu rõ con đường cách mạng giải phóng dân tộc gắn liền với chủ nghĩa xã hội.',
    image: 'https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?w=800',
    date: '1927',
    location: 'Liên Xô',
    period: 'Phong Trào Cộng Sản',
    tags: ['Lý luận', 'Cách mạng', 'Hồ Chí Minh'],
    views: 6780
  },
];

const categories = [
  { id: 'all' as ArchiveCategory, label: 'Tất Cả', icon: Grid, count: archives.length },
  { id: 'documents' as ArchiveCategory, label: 'Văn Kiện', icon: FileText, count: archives.filter(a => a.category === 'documents').length },
  { id: 'newspapers' as ArchiveCategory, label: 'Báo Chí', icon: Newspaper, count: archives.filter(a => a.category === 'newspapers').length },
  { id: 'artifacts' as ArchiveCategory, label: 'Hiện Vật', icon: Hammer, count: archives.filter(a => a.category === 'artifacts').length },
  { id: 'writings' as ArchiveCategory, label: 'Bài Viết', icon: BookOpen, count: archives.filter(a => a.category === 'writings').length },
];

export default function Archives() {
  const [selectedCategory, setSelectedCategory] = useState<ArchiveCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedArchive, setSelectedArchive] = useState<Archive | null>(null);

  const filteredArchives = archives.filter(archive => {
    const matchesCategory = selectedCategory === 'all' || archive.category === selectedCategory;
    const matchesSearch = 
      archive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      archive.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      archive.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-[#181818] to-[#0a0a0a] border-b border-amber-400/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#8B0000]/90 backdrop-blur-sm rounded-full mb-6 border border-amber-400/30">
            <FileText className="text-amber-400" size={24} />
            <span className="text-amber-400 font-bold uppercase tracking-wider">Kho Tư Liệu Lịch Sử</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display text-amber-400 mb-6 uppercase tracking-wider">
            Tư Liệu Lịch Sử
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Khám phá kho tàng tư liệu quý giá về lịch sử dân tộc - từ văn kiện quan trọng, báo chí cách mạng đến hiện vật và bài viết lịch sử.
          </p>

          <div className="h-1 w-32 bg-amber-400 mx-auto"></div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-amber-400/20 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-xl w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm tư liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-[#181818] border border-amber-400/30 rounded-full text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#181818] border border-amber-400/30 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-400 text-[#0a0a0a]'
                    : 'text-gray-400 hover:text-amber-400'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'list'
                    ? 'bg-amber-400 text-[#0a0a0a]'
                    : 'text-gray-400 hover:text-amber-400'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-center">
            <span className="text-gray-400">
              Tìm thấy <span className="text-amber-400 font-bold">{filteredArchives.length}</span> tư liệu
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#181818]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-400 border-amber-400 text-[#0a0a0a] shadow-lg shadow-amber-400/30'
                      : 'bg-[#181818] border-amber-400/30 text-gray-300 hover:border-amber-400 hover:text-amber-400'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{category.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-[#0a0a0a] text-amber-400' : 'bg-amber-400/20 text-amber-400'
                  }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Archives Grid/List */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredArchives.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="mx-auto text-gray-600 mb-4" size={64} />
              <h3 className="text-2xl text-gray-400 mb-2">Không tìm thấy tư liệu</h3>
              <p className="text-gray-500">Vui lòng thử lại với từ khóa khác</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArchives.map((archive, index) => (
                <div
                  key={archive.id}
                  onClick={() => setSelectedArchive(archive)}
                  className="group bg-gradient-to-br from-[#181818] to-[#0a0a0a] rounded-2xl overflow-hidden border-2 border-amber-400/30 hover:border-amber-400 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-400/20"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={archive.image}
                      alt={archive.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      {(() => {
                        const category = categories.find(c => c.id === archive.category);
                        if (!category) return null;
                        const Icon = category.icon;
                        return (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-400 rounded-full">
                            <Icon size={14} className="text-[#0a0a0a]" />
                            <span className="text-xs font-bold text-[#0a0a0a] uppercase">{category.label}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Media Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {archive.video && (
                        <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-2" title="Có video">
                          <Play size={16} className="text-white" />
                        </div>
                      )}
                      {archive.gallery && archive.gallery.length > 0 && (
                        <div className="bg-blue-500/90 backdrop-blur-sm rounded-full p-2" title={`${archive.gallery.length} ảnh`}>
                          <ImageIcon size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <Calendar size={14} className="text-amber-400" />
                      <span>{archive.date}</span>
                      {archive.location && (
                        <>
                          <span>•</span>
                          <MapPin size={14} className="text-amber-400" />
                          <span className="truncate">{archive.location}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-display text-amber-400 mb-3 group-hover:text-amber-300 transition-colors line-clamp-2">
                      {archive.title}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                      {archive.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {archive.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-amber-400/10 border border-amber-400/20 rounded text-xs text-amber-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {archive.tags.length > 2 && (
                        <span className="px-2 py-1 bg-amber-400/10 border border-amber-400/20 rounded text-xs text-amber-400">
                          +{archive.tags.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-amber-400/20">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Eye size={16} />
                        <span>{archive.views.toLocaleString()}</span>
                      </div>
                      <span className="px-3 py-1 bg-amber-400/20 text-amber-400 text-xs font-semibold rounded-full">
                        {archive.period}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArchives.map((archive, index) => (
                <div
                  key={archive.id}
                  onClick={() => setSelectedArchive(archive)}
                  className="group flex gap-6 bg-gradient-to-r from-[#181818] to-[#0a0a0a] rounded-2xl overflow-hidden border-2 border-amber-400/30 hover:border-amber-400 transition-all duration-500 cursor-pointer hover:shadow-xl hover:shadow-amber-400/20"
                  style={{
                    animationDelay: `${index * 30}ms`,
                  }}
                >
                  {/* Image */}
                  <div className="relative w-64 flex-shrink-0 overflow-hidden">
                    <img
                      src={archive.image}
                      alt={archive.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/50"></div>
                    
                    {/* Media Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {archive.video && (
                        <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-2" title="Có video">
                          <Play size={16} className="text-white" />
                        </div>
                      )}
                      {archive.gallery && archive.gallery.length > 0 && (
                        <div className="bg-blue-500/90 backdrop-blur-sm rounded-full p-2" title={`${archive.gallery.length} ảnh`}>
                          <ImageIcon size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        {(() => {
                          const category = categories.find(c => c.id === archive.category);
                          if (!category) return null;
                          const Icon = category.icon;
                          return (
                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-400 rounded-full">
                              <Icon size={14} className="text-[#0a0a0a]" />
                              <span className="text-xs font-bold text-[#0a0a0a] uppercase">{category.label}</span>
                            </div>
                          );
                        })()}
                        <span className="px-3 py-1 bg-amber-400/20 text-amber-400 text-xs font-semibold rounded-full">
                          {archive.period}
                        </span>
                      </div>

                      <h3 className="text-2xl font-display text-amber-400 mb-3 group-hover:text-amber-300 transition-colors">
                        {archive.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-amber-400" />
                          <span>{archive.date}</span>
                        </div>
                        {archive.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-amber-400" />
                            <span>{archive.location}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-300 leading-relaxed mb-4">
                        {archive.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {archive.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-xs text-amber-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-4 mt-4 border-t border-amber-400/20">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Eye size={16} />
                        <span className="text-sm">{archive.views.toLocaleString()} lượt xem</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#181818] to-[#0a0a0a] border-t border-amber-400/20">
        <div className="max-w-4xl mx-auto text-center">
          <ImageIcon className="mx-auto text-amber-400 mb-6" size={48} />
          
          <h2 className="text-3xl font-display text-amber-400 mb-6">
            Bảo Tồn Di Sản Lịch Sử
          </h2>
          
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            Mỗi tư liệu là một mảnh ghép quý giá của lịch sử dân tộc. Chúng tôi cam kết số hóa và bảo tồn những di sản văn hóa này để thế hệ mai sau có thể học hỏi và tự hào về truyền thống vẻ vàng của cha ông.
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-amber-400/30"></div>
            <span className="text-amber-400 text-2xl">📚</span>
            <div className="h-px w-24 bg-amber-400/30"></div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedArchive && (
        <div className="fixed inset-0 bg-[#0a0a0a]/95 z-50 overflow-y-auto">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedArchive(null)}
                className="fixed top-6 right-6 w-12 h-12 bg-amber-400 hover:bg-amber-500 text-[#0a0a0a] rounded-full flex items-center justify-center transition-all z-10 shadow-xl"
              >
                <X size={24} />
              </button>

              {/* Modal Content */}
              <div className="bg-gradient-to-br from-[#181818] to-[#0a0a0a] border-2 border-amber-400/50 rounded-2xl overflow-hidden shadow-2xl">
                {/* Header Image */}
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={selectedArchive.image}
                    alt={selectedArchive.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    {(() => {
                      const category = categories.find(c => c.id === selectedArchive.category);
                      if (!category) return null;
                      const Icon = category.icon;
                      return (
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-400 rounded-full shadow-lg">
                          <Icon size={18} className="text-[#0a0a0a]" />
                          <span className="text-sm font-bold text-[#0a0a0a] uppercase">{category.label}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Digital Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/90 backdrop-blur-sm rounded-full shadow-lg">
                      <ImageIcon size={16} className="text-white" />
                      <span className="text-sm font-semibold text-white">Tư Liệu Số</span>
                    </div>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h1 className="text-4xl md:text-5xl font-display text-amber-400 mb-3 drop-shadow-lg">
                      {selectedArchive.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-200">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-amber-400" />
                        <span className="font-semibold">{selectedArchive.date}</span>
                      </div>
                      {selectedArchive.location && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-amber-400" />
                            <span>{selectedArchive.location}</span>
                          </div>
                        </>
                      )}
                      <span>•</span>
                      <span className="px-3 py-1 bg-amber-400/30 backdrop-blur-sm text-amber-300 text-sm font-semibold rounded-full border border-amber-400/50">
                        {selectedArchive.period}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                  {/* Description Section */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-amber-400 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-amber-400">Giới Thiệu</h2>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {selectedArchive.description}
                    </p>
                  </div>

                  {/* Video Section */}
                  {selectedArchive.video && (
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-amber-400 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-amber-400">Video Lịch Sử</h2>
                      </div>
                      <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-amber-400/30 shadow-2xl">
                        <iframe
                          src={selectedArchive.video.url}
                          title={selectedArchive.video.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <p className="mt-4 text-gray-400 text-center italic">{selectedArchive.video.title}</p>
                    </div>
                  )}

                  {/* Gallery Section */}
                  {selectedArchive.gallery && selectedArchive.gallery.length > 0 && (
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-amber-400 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-amber-400">Thư Viện Ảnh Tư Liệu</h2>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedArchive.gallery.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-amber-400/30 hover:border-amber-400 transition-all cursor-pointer group"
                          >
                            <img
                              src={img}
                              alt={`Tư liệu ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/20 transition-all flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-400 p-3 rounded-full">
                                <Eye size={24} className="text-[#0a0a0a]" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Full Text Section */}
                  {selectedArchive.fullText && (
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-amber-400 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-amber-400">Nội Dung Văn Bản</h2>
                      </div>
                      <div className="bg-gradient-to-br from-[#181818] to-[#0a0a0a] border-2 border-amber-400/30 rounded-xl p-8">
                        <div className="prose prose-invert prose-amber max-w-none">
                          <pre className="whitespace-pre-wrap font-serif text-gray-300 text-lg leading-relaxed">
                            {selectedArchive.fullText}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Historical Context */}
                  <div className="mb-10 bg-[#181818]/50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="text-amber-400" size={24} />
                      <h3 className="text-xl font-bold text-amber-400">Bối Cảnh Lịch Sử</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Tư liệu này thuộc giai đoạn <span className="text-amber-400 font-semibold">{selectedArchive.period}</span>, một trong những thời kỳ quan trọng của lịch sử dân tộc Việt Nam.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedArchive.category === 'documents' && 
                        'Văn kiện này đóng vai trò quan trọng trong việc ghi nhận và lưu giữ những quyết định, tuyên bố chính thức của dân tộc trong giai đoạn này.'
                      }
                      {selectedArchive.category === 'newspapers' && 
                        'Báo chí đóng vai trò quan trọng trong việc tuyên truyền, giáo dục và kết nối nhân dân trong thời kỳ đấu tranh cách mạng.'
                      }
                      {selectedArchive.category === 'artifacts' && 
                        'Hiện vật này là bằng chứng hữu hình về cuộc sống, sản xuất và đấu tranh của nhân dân ta trong thời kỳ lịch sử quan trọng này.'
                      }
                      {selectedArchive.category === 'writings' && 
                        'Tác phẩm này phản ánh tư tưởng, văn hóa và tinh thần của thời đại, là di sản văn học và lịch sử quý báu của dân tộc.'
                      }
                    </p>
                  </div>

                  {/* Significance */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-amber-400 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-amber-400">Ý Nghĩa & Giá Trị</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-amber-400/10 to-transparent border border-amber-400/20 p-6 rounded-xl">
                        <h4 className="text-lg font-semibold text-amber-400 mb-3">Giá Trị Lịch Sử</h4>
                        <p className="text-gray-300">
                          {selectedArchive.category === 'documents' && 
                            'Văn kiện này là minh chứng trực tiếp cho các quyết định lịch sử, thể hiện ý chí và quyết tâm của dân tộc trong giai đoạn quan trọng.'
                          }
                          {selectedArchive.category === 'newspapers' && 
                            'Tờ báo này phản ánh trung thực bối cảnh xã hội, chính trị và tinh thần của thời đại, là nguồn tư liệu quý giá cho nghiên cứu lịch sử.'
                          }
                          {selectedArchive.category === 'artifacts' && 
                            'Hiện vật này mang giá trị chứng cứ cao về đời sống vật chất và tinh thần của nhân dân trong thời kỳ lịch sử này.'
                          }
                          {selectedArchive.category === 'writings' && 
                            'Tác phẩm này có giá trị văn học và lịch sử cao, phản ánh tư tưởng tiến bộ và tinh thần yêu nước của thời đại.'
                          }
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-400/10 to-transparent border border-amber-400/20 p-6 rounded-xl">
                        <h4 className="text-lg font-semibold text-amber-400 mb-3">Ý Nghĩa Giáo Dục</h4>
                        <p className="text-gray-300">
                          Tư liệu này giúp thế hệ trẻ hiểu rõ hơn về lịch sử dân tộc, những gian khó và hy sinh của các thế hệ đi trước, từ đó nuôi dưỡng lòng yêu nước và tự hào dân tộc.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Filter className="text-amber-400" size={20} />
                      <h3 className="text-lg font-bold text-amber-400">Từ Khóa Liên Quan</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selectedArchive.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-amber-400/20 border border-amber-400/40 rounded-full text-amber-300 font-semibold hover:bg-amber-400/30 transition-all cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-amber-400/20">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Eye size={20} className="text-amber-400" />
                      <span className="text-lg">
                        <span className="text-amber-400 font-bold">{selectedArchive.views.toLocaleString()}</span> lượt xem
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={20} className="text-amber-400" />
                      <span className="text-lg">{selectedArchive.date}</span>
                    </div>
                    {selectedArchive.gallery && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <ImageIcon size={20} className="text-amber-400" />
                        <span className="text-lg">{selectedArchive.gallery.length} ảnh</span>
                      </div>
                    )}
                    {selectedArchive.video && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Play size={20} className="text-amber-400" />
                        <span className="text-lg">Có video</span>
                      </div>
                    )}
                  </div>

                  {/* Reference Note */}
                  <div className="mt-8 p-6 bg-amber-400/10 border border-amber-400/30 rounded-xl">
                    <p className="text-gray-300 text-sm leading-relaxed text-center italic">
                      💡 Tư liệu này được số hóa và lưu trữ nhằm mục đích nghiên cứu, học tập và giáo dục. 
                      Xin vui lòng trích dẫn nguồn khi sử dụng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
