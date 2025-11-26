import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Newspaper, Hammer, BookOpen, Search, X, Grid, List } from 'lucide-react';
import { getActiveUser } from '../lib/auth';

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
}

const archives: Archive[] = [
  {
    id: 'tuyen-ngon-doc-lap',
    title: 'Tuyên Ngôn Độc Lập 1945',
    category: 'documents',
    description: 'Bản văn lịch sử do Chủ tịch Hồ Chí Minh đọc tại Quảng trường Ba Đình ngày 2/9/1945',
    image: 'https://cdn.tuoitre.vn/2020/8/27/logo-tuyen-ngon-doc-lap-do-chu-tich-ho-chi-minh-soan-thao-doc-tai-quang-truong-ba-dinh-ha-noi-ngay-2-9-1945-15985087581162082024013.jpg',
    date: '2/9/1945',
    location: 'Quảng trường Ba Đình, Hà Nội',
    period: 'Cách Mạng Tháng Tám',
    tags: ['Độc lập', 'Hồ Chí Minh', 'Văn kiện'],
    views: 15420,
  },
  {
    id: 'bao-co-giai-phong',
    title: 'Báo Cờ Giải Phóng',
    category: 'newspapers',
    description: 'Tờ báo cách mạng đầu tiên của Việt Nam, xuất bản từ năm 1941',
    image: 'https://baotanglichsu.vn/DataFiles/Uploaded/image/cogiaiphong.jpg',
    date: '1941',
    location: 'Pác Bó, Cao Bằng',
    period: 'Kháng Chiến Chống Pháp',
    tags: ['Báo chí', 'Tuyên truyền'],
    views: 8750
  },
  
  {
    id: 'nhat-ky-trong-tu',
    title: 'Nhật Ký Trong Tù',
    category: 'writings',
    description: 'Tập thơ bất hủ của Hồ Chí Minh sáng tác trong tù (1942-1943)',
    image: 'https://thpttraicau.thainguyen.edu.vn/upload/51235/fck/19000713/2022_05_17_07_12_173.png',
    date: '1942-1943',
    location: 'Trung Quốc',
    period: 'Kháng Chiến',
    tags: ['Văn học', 'Hồ Chí Minh'],
    views: 12890,
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
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ArchiveCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleViewArchive = useCallback((archiveId: string) => {
    const user = getActiveUser();
    if (!user) {
      sessionStorage.setItem('afterLogin', JSON.stringify({ page: 'culture/archives' }));
      navigate('/login', { state: { from: '/culture/archives' } });
      return;
    }
    navigate(`/culture/archives/${archiveId}`);
  }, [navigate]);

  const filteredArchives = archives.filter(archive => {
    const matchesCategory = selectedCategory === 'all' || archive.category === selectedCategory;
    const matchesSearch = 
      archive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      archive.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      archive.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-charcoal-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-charcoal-800 to-charcoal-900 border-b border-[#F4D03F]/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-charcoal-700/90 backdrop-blur-sm rounded-full mb-6 border border-[#F4D03F]/30">
            <FileText className="text-[#F4D03F]" size={24} />
            <span className="text-[#F4D03F] font-bold uppercase tracking-wider">Kho Tư Liệu Lịch Sử</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display text-[#F4D03F] mb-6 uppercase tracking-wider">
            Tư Liệu Lịch Sử
          </h1>
          
          <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Khám phá kho tàng tư liệu quý giá về lịch sử dân tộc
          </p>

          <div className="h-1 w-32 bg-[#F4D03F] mx-auto"></div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="sticky top-0 z-30 bg-charcoal-900/95 backdrop-blur-md border-b border-[#F4D03F]/20 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-xl w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F4D03F]" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm tư liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-charcoal-800 border border-[#F4D03F]/30 rounded-full text-white placeholder-gray-400 focus:border-[#F4D03F] focus:outline-none transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F4D03F]">
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 bg-charcoal-800 border border-[#F4D03F]/30 rounded-full p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-[#F4D03F] text-charcoal-900' : 'text-gray-400'}`}>
                <Grid size={20} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-[#F4D03F] text-charcoal-900' : 'text-gray-400'}`}>
                <List size={20} />
              </button>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400">
            Tìm thấy <span className="text-[#F4D03F] font-bold">{filteredArchives.length}</span> tư liệu
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all ${
                    isActive ? 'bg-[#F4D03F] border-[#F4D03F] text-charcoal-900 shadow-lg' : 'bg-charcoal-800 border-[#F4D03F]/30 text-gray-300 hover:border-[#F4D03F]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{category.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-charcoal-900 text-[#F4D03F]' : 'bg-[#F4D03F]/20 text-[#F4D03F]'}`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Archives Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredArchives.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="mx-auto text-gray-600 mb-4" size={64} />
              <h3 className="text-2xl text-gray-400 mb-2">Không tìm thấy tư liệu</h3>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArchives.map((archive) => (
                <div
                  key={archive.id}
                  onClick={() => handleViewArchive(archive.id)}
                  className="group bg-gradient-to-br from-charcoal-800 to-charcoal-900 rounded-2xl overflow-hidden border-2 border-[#F4D03F]/30 hover:border-[#F4D03F] transition-all cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#F4D03F/20]-blue/20"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={archive.image} alt={archive.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      {(() => {
                        const category = categories.find(c => c.id === archive.category);
                        if (!category) return null;
                        const Icon = category.icon;
                        return (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F4D03F] rounded-full">
                            <Icon size={14} className="text-charcoal-900" />
                            <span className="text-xs font-bold text-charcoal-900 uppercase">{category.label}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display text-[#F4D03F] mb-3 line-clamp-2">{archive.title}</h3>
                    <p className="text-gray-200 text-sm mb-4 line-clamp-3">{archive.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {archive.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-[#F4D03F]/10 border border-[#F4D03F]/20 rounded text-xs text-[#F4D03F]">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#F4D03F]/20">
                      <span className="text-gray-400 text-sm">{archive.date}</span>
                      <span className="px-3 py-1 bg-[#F4D03F]/20 text-[#F4D03F] text-xs font-semibold rounded-full">{archive.period}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArchives.map((archive) => (
                <div
                  key={archive.id}
                  onClick={() => handleViewArchive(archive.id)}
                  className="group flex gap-6 bg-gradient-to-r from-charcoal-800 to-charcoal-900 rounded-2xl overflow-hidden border-2 border-[#F4D03F]/30 hover:border-[#F4D03F] transition-all cursor-pointer"
                >
                  <div className="relative w-64 flex-shrink-0">
                    <img src={archive.image} alt={archive.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-6">
                    <h3 className="text-2xl font-display text-[#F4D03F] mb-3">{archive.title}</h3>
                    <p className="text-gray-200 mb-4">{archive.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {archive.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-[#F4D03F]/10 border border-[#F4D03F]/20 rounded-full text-xs text-[#F4D03F]">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
