import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Award, BookOpen, Image as ImageIcon, Video as VideoIcon, FileText, Quote, Play, ChevronDown, Clock, X, Maximize2, Star, Heart } from 'lucide-react';

interface LifeStage {
  period: string;
  years: string;
  title: string;
  subtitle: string;
  description: string[];
  image: string;
  keyEvents: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  photos: Array<{
    url: string;
    caption: string;
  }>;
  documents?: Array<{
    title: string;
    year: string;
    thumbnail: string;
  }>;
  quotes?: Array<{
    text: string;
    context: string;
  }>;
}

interface FigureDetail {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  heroImage: string;
  birth: string;
  birthPlace: string;
  death?: string;
  deathPlace?: string;
  summary: string[];
  lifeStages: LifeStage[];
  legacy: {
    title: string;
    achievements: string[];
    impact: string[];
  };
  videos: Array<{
    url: string;
    thumbnail: string;
    title: string;
    description: string;
    year: string;
  }>;
}

const figureData: Record<string, FigureDetail> = {
  'ho-chi-minh': {
    id: 'ho-chi-minh',
    name: 'Hồ Chí Minh',
    title: 'Chủ Tịch - Lãnh Tụ Dân Tộc',
    subtitle: 'Người sáng lập nước Việt Nam Dân chủ Cộng hòa',
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920',
    birth: '19/5/1890',
    birthPlace: 'Làng Sen, Kim Liên, Nam Đàn, Nghệ An',
    death: '2/9/1969',
    deathPlace: 'Hà Nội',
    summary: [
      'Chủ tịch Hồ Chí Minh là vị lãnh tụ vĩ đại của dân tộc Việt Nam, người sáng lập Đảng Cộng sản Việt Nam và Nhà nước Việt Nam Dân chủ Cộng hòa.',
      'Suốt cuộc đời, Người đã cống hiến trọn vẹn cho sự nghiệp giải phóng dân tộc, thống nhất Tổ quốc và hạnh phúc của nhân dân.',
      'Tư tưởng Hồ Chí Minh mãi là kim chỉ nam cho cách mạng Việt Nam, là di sản tinh thần vô giá của dân tộc.',
    ],
    lifeStages: [
      {
        period: 'Thời Niên Thiếu',
        years: '1890 - 1911',
        title: 'Tuổi Thơ và Năm Tháng Học Trò',
        subtitle: 'Hình thành ý thức yêu nước',
        description: [
          'Sinh ngày 19/5/1890 tại làng Sen (Hoàng Trù), xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An. Tên khai sinh là Nguyễn Sinh Cung.',
          'Cha là cụ Nguyễn Sinh Sắc, một nhà nho yêu nước. Mẹ là bà Hoàng Thị Loan. Từ nhỏ, Người đã chứng kiến cảnh đói khổ của đồng bào dưới ách đô hộ của thực dân Pháp.',
          'Năm 1906, Người bỏ học, đi lang thang khắp nước để tìm hiểu đời sống nhân dân. Những trải nghiệm này đã hun đúc tinh thần yêu nước và khát vọng giải phóng dân tộc.',
        ],
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        keyEvents: [
          { year: '1890', title: 'Ra đời', description: 'Sinh tại làng Sen, Nghệ An' },
          { year: '1895', title: 'Học chữ Quốc ngữ', description: 'Theo học với cha' },
          { year: '1906', title: 'Bỏ học', description: 'Bắt đầu đi tìm hiểu đất nước' },
          { year: '1911', title: 'Ra đi', description: 'Lên tàu rời Việt Nam tìm đường cứu nước' },
        ],
        photos: [
          { url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600', caption: 'Ảnh chân dung niên thiếu' },
          { url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600', caption: 'Quê hương Nghệ An' },
        ],
        quotes: [
          { text: 'Làm sao cho nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do', context: 'Khát vọng từ thuở nhỏ' },
        ],
      },
      {
        period: 'Ra Đi Tìm Đường',
        years: '1911 - 1930',
        title: 'Hành Trình Tìm Đường Cứu Nước',
        subtitle: 'Từ Nguyễn Tất Thành đến Nguyễn Ái Quốc',
        description: [
          'Ngày 5/6/1911, từ bến cảng Nhà Rồng (Sài Gòn), Người lên tàu Amiral Latouche-Tréville với tên Văn Ba, làm phụ bếp, ra đi tìm đường cứu nước.',
          'Người đã đi qua 30 nước thuộc 5 châu lục, làm đủ mọi nghề để kiếm sống: rửa bát, phụ bếp, quét dọn, thợ ảnh... Qua đó, Người tìm hiểu phong tục, văn hóa các dân tộc và các phương pháp đấu tranh giải phóng.',
          'Năm 1920, tại Đại hội Tours của Đảng Xã hội Pháp, Người bỏ phiếu tán thành gia nhập Quốc tế III, trở thành một trong những người sáng lập Đảng Cộng sản Pháp.',
          'Từ đây, Người lấy tên Nguyễn Ái Quốc và bắt đầu hoạt động cách mạng chuyên nghiệp, tìm ra con đường giải phóng dân tộc gắn với chủ nghĩa Mác-Lênin.',
        ],
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
        keyEvents: [
          { year: '1911', title: 'Rời Tổ quốc', description: 'Lên tàu từ bến Nhà Rồng' },
          { year: '1917', title: 'Định cư Pháp', description: 'Bắt đầu hoạt động chính trị' },
          { year: '1920', title: 'Thành lập Đảng CS Pháp', description: 'Tại Đại hội Tours' },
          { year: '1923-1924', title: 'Sang Liên Xô', description: 'Học tập về cách mạng vô sản' },
          { year: '1925', title: 'Thành lập Hội Việt Nam Cách mạng Thanh niên', description: 'Tại Quảng Châu, Trung Quốc' },
        ],
        photos: [
          { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600', caption: 'Thời kỳ ở Pháp' },
          { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600', caption: 'Hoạt động cách mạng' },
        ],
        documents: [
          { title: 'Bản án chế độ thực dân Pháp', year: '1925', thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400' },
        ],
        quotes: [
          { text: 'Chỉ có chủ nghĩa xã hội, chủ nghĩa cộng sản mới giải phóng được các dân tộc bị áp bức', context: 'Nhận thức về con đường cứu nước' },
        ],
      },
      {
        period: 'Thành Lập Đảng',
        years: '1930 - 1941',
        title: 'Thành Lập Đảng Cộng Sản Việt Nam',
        subtitle: 'Mở ra kỷ nguyên mới cho dân tộc',
        description: [
          'Ngày 3/2/1930, tại Hương Cảng (Trung Quốc), Người chủ trì Hội nghị hợp nhất các tổ chức cộng sản trong nước thành Đảng Cộng sản Việt Nam. Đây là sự kiện có ý nghĩa lịch sử to lớn, mở ra kỷ nguyên mới - kỷ nguyên độc lập dân tộc gắn liền với chủ nghĩa xã hội.',
          'Từ 1930-1941, Người tiếp tục hoạt động cách mạng ở Trung Quốc, Liên Xô, Thái Lan... bị thực dân Pháp và Quốc Dân Đảng Trung Hoa bắt giữ nhiều lần, nhưng vẫn kiên trì đấu tranh.',
          'Năm 1941, sau 30 năm xa Tổ quốc, Người trở về nước, chọn căn cứ ở Pác Bó (Cao Bằng) để trực tiếp lãnh đạo cách mạng Việt Nam.',
        ],
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800',
        keyEvents: [
          { year: '3/2/1930', title: 'Thành lập Đảng', description: 'Hội nghị hợp nhất tại Hương Cảng' },
          { year: '1930-1931', title: 'Phong trào cách mạng', description: 'Xô viết Nghệ Tĩnh bùng nổ' },
          { year: '1941', title: 'Về nước', description: 'Trở về sau 30 năm, đóng tại Pác Bó' },
          { year: '19/5/1941', title: 'Thành lập Việt Minh', description: 'Hội nghị Trung ương lần thứ 8' },
        ],
        photos: [
          { url: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=600', caption: 'Hội nghị thành lập Đảng' },
          { url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600', caption: 'Hang Pác Bó - nơi Bác về' },
        ],
        documents: [
          { title: 'Chính cương vắn tắt của Đảng', year: '1930', thumbnail: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400' },
          { title: 'Nhật ký trong tù', year: '1942-1943', thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400' },
        ],
      },
      {
        period: 'Cách Mạng Tháng Tám',
        years: '1941 - 1945',
        title: 'Lãnh Đạo Cách Mạng Giành Chính Quyền',
        subtitle: 'Khai sinh nước Việt Nam Dân chủ Cộng hòa',
        description: [
          'Từ 1941-1945, Người trực tiếp lãnh đạo phong trào kháng Nhật cứu nước, chuẩn bị lực lượng cho tổng khởi nghĩa.',
          'Tháng 8/1945, khi Nhật Bản đầu hàng, Người lãnh đạo Tổng khởi nghĩa giành chính quyền trong cả nước, lập nên nước Việt Nam Dân chủ Cộng hòa.',
          'Ngày 2/9/1945, tại Quảng trường Ba Đình lịch sử, Chủ tịch Hồ Chí Minh thay mặt Chính phủ lâm thời đọc Tuyên ngôn Độc lập, tuyên bố với toàn thế giới về sự ra đời của nước Việt Nam Dân chủ Cộng hòa - nhà nước công nông đầu tiên ở Đông Nam Á.',
        ],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        keyEvents: [
          { year: '13-15/8/1945', title: 'Đại hội Quốc dân Tân Trào', description: 'Quyết định tổng khởi nghĩa' },
          { year: '19/8/1945', title: 'Cách mạng thành công tại Hà Nội', description: 'Giành chính quyền thủ đô' },
          { year: '2/9/1945', title: 'Tuyên ngôn Độc lập', description: 'Khai sinh nước Việt Nam Dân chủ Cộng hòa' },
        ],
        photos: [
          { url: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=600', caption: 'Lễ đọc Tuyên ngôn Độc lập' },
          { url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600', caption: 'Quảng trường Ba Đình lịch sử' },
        ],
        documents: [
          { title: 'Tuyên ngôn Độc lập', year: '1945', thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400' },
        ],
        quotes: [
          { text: 'Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do và độc lập', context: 'Tuyên ngôn Độc lập 2/9/1945' },
          { text: 'Không có gì quý hơn độc lập tự do', context: 'Câu nói bất hủ' },
        ],
      },
      {
        period: 'Kháng Chiến Chống Pháp',
        years: '1946 - 1954',
        title: 'Toàn Quốc Kháng Chiến',
        subtitle: 'Từ kháng chiến đến Điện Biên Phủ',
        description: [
          'Tháng 12/1946, thực dân Pháp tấn công Hà Nội, âm mưu tiêu diệt chính quyền cách mạng non trẻ. Người ra lời kêu gọi toàn quốc kháng chiến: "Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ".',
          'Suốt 9 năm kháng chiến, Người lãnh đạo toàn dân đồng lòng, kiên cường chiến đấu chống thực dân Pháp xâm lược.',
          'Năm 1954, quân và dân ta đại thắng Điện Biên Phủ, bắt buộc thực dân Pháp phải ký Hiệp định Genève, công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ Việt Nam.',
        ],
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
        keyEvents: [
          { year: '19/12/1946', title: 'Lời kêu gọi kháng chiến', description: 'Toàn quốc đồng loạt kháng chiến' },
          { year: '1950', title: 'Quan hệ ngoại giao', description: 'Liên Xô và Trung Quốc công nhận nước ta' },
          { year: '7/5/1954', title: 'Chiến thắng Điện Biên Phủ', description: '"Lừng lẫy năm châu, chấn động địa cầu"' },
          { year: '21/7/1954', title: 'Hiệp định Genève', description: 'Công nhận độc lập, chủ quyền Việt Nam' },
        ],
        photos: [
          { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600', caption: 'Bác Hồ trong kháng chiến' },
          { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600', caption: 'Quân dân ta trong kháng chiến' },
        ],
        documents: [
          { title: 'Lời kêu gọi toàn quốc kháng chiến', year: '1946', thumbnail: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400' },
        ],
        quotes: [
          { text: 'Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ', context: 'Lời kêu gọi kháng chiến 19/12/1946' },
        ],
      },
      {
        period: 'Xây Dựng Miền Bắc',
        years: '1954 - 1969',
        title: 'Xây Dựng Miền Bắc Xã Hội Chủ Nghĩa',
        subtitle: 'Vừa xây dựng, vừa chiến đấu',
        description: [
          'Sau Hiệp định Genève, nước ta tạm thời bị chia cắt làm hai miền. Miền Bắc được hoàn toàn giải phóng, bước vào thời kỳ quá độ lên chủ nghĩa xã hội.',
          'Người lãnh đạo nhân dân miền Bắc khôi phục kinh tế, tiến hành cải cách ruộng đất, phát triển công nghiệp, văn hóa, giáo dục, xây dựng hậu phương vững chắc.',
          'Đồng thời, Người lãnh đạo cuộc kháng chiến chống Mỹ cứu nước, giải phóng miền Nam, thống nhất Tổ quốc.',
          'Ngày 2/9/1969, Chủ tịch Hồ Chí Minh từ trần, để lại niềm tiếc thương vô hạn của toàn Đảng, toàn dân và bạn bè quốc tế. Nhưng tư tưởng, đạo đức, phong cách Hồ Chí Minh mãi mãi sống mãi trong lòng dân.',
        ],
        image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800',
        keyEvents: [
          { year: '1954-1955', title: 'Giải phóng miền Bắc', description: 'Tiếp quản Thủ đô, xây dựng xã hội mới' },
          { year: '1960', title: 'Thành lập Mặt trận Dân tộc Giải phóng miền Nam', description: 'Đấu tranh thống nhất đất nước' },
          { year: '1965', title: 'Kháng chiến chống Mỹ', description: 'Quyết tâm đánh thắng giặc Mỹ xâm lược' },
          { year: '2/9/1969', title: 'Từ trần', description: 'Đi vào lòng dân tộc như biểu tượng bất diệt' },
        ],
        photos: [
          { url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600', caption: 'Bác Hồ với nhân dân' },
          { url: 'https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?w=600', caption: 'Bác Hồ với thiếu nhi' },
        ],
        documents: [
          { title: 'Di chúc', year: '1969', thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400' },
        ],
        quotes: [
          { text: 'Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người', context: 'Về giáo dục đào tạo' },
          { text: 'Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công', context: 'Di sản để lại' },
        ],
      },
    ],
    legacy: {
      title: 'Di Sản Vĩ Đại',
      achievements: [
        'Người sáng lập Đảng Cộng sản Việt Nam, Nhà nước Việt Nam Dân chủ Cộng hòa',
        'Lãnh đạo nhân dân ta giành thắng lợi trong hai cuộc kháng chiến vĩ đại',
        'Tạo nên bước ngoặt lớn trong lịch sử dân tộc - kỷ nguyên độc lập dân tộc gắn với chủ nghĩa xã hội',
        'Để lại tư tưởng Hồ Chí Minh - kim chỉ nam cho cách mạng Việt Nam',
        'Tấm gương sáng về đạo đức cách mạng trong sáng, giản dị',
        'Phong cách Hồ Chí Minh - gần gũi dân, hiểu dân, yêu dân',
      ],
      impact: [
        'Tư tưởng Hồ Chí Minh mãi là ngọn cờ dẫn đường cho dân tộc Việt Nam',
        'Đạo đức Hồ Chí Minh là nền tảng tinh thần của cán bộ, đảng viên',
        'Di chúc của Người là văn kiện lịch sử quý giá',
        'Lăng Chủ tịch Hồ Chí Minh - nơi lưu giữ hình hài Người mãi mãi',
      ],
    },
    videos: [
      {
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800',
        title: 'Lễ Đọc Tuyên Ngôn Độc Lập 2/9/1945',
        description: 'Khoảnh khắc lịch sử vĩ đại của dân tộc',
        year: '1945',
      },
      {
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
        title: 'Bác Hồ với thiếu nhi Việt Nam',
        description: 'Tình cảm sâu nặng của Bác dành cho thế hệ trẻ',
        year: '1960s',
      },
    ],
  },
};

export default function FigureDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  
  const figure = id ? figureData[id] : null;

  useEffect(() => {
    if (figure) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        const stageElements = document.querySelectorAll('.life-stage');
        
        stageElements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveStage(index);
          }
        });
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [figure]);

  if (!figure) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-amber-400 mb-4">Không tìm thấy nhân vật</h1>
          <button onClick={() => navigate('/culture/historical-figures')} className="text-gray-400 hover:text-amber-400 transition-colors">
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Back Button */}
      <button
        onClick={() => navigate('/culture/historical-figures')}
        className="fixed top-24 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-[#181818]/90 backdrop-blur-sm border border-amber-400/30 rounded-full text-amber-400 hover:bg-[#181818] hover:border-amber-400 transition-all"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-semibold">Quay lại</span>
      </button>

      {/* Timeline Navigation - Sticky */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
        <div className="flex flex-col gap-4">
          {figure.lifeStages.map((stage, index) => (
            <button
              key={index}
              onClick={() => {
                const element = document.getElementById(`stage-${index}`);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`group relative flex items-center gap-3 transition-all ${
                activeStage === index ? 'scale-110' : 'scale-100 opacity-50 hover:opacity-100'
              }`}
            >
              <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                activeStage === index 
                  ? 'bg-amber-400 border-amber-400 shadow-lg shadow-amber-400/50' 
                  : 'bg-transparent border-gray-600'
              }`} />
              <div className="absolute right-6 bg-[#181818] px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-amber-400/20">
                <span className="text-xs text-amber-400 font-semibold">{stage.period}</span>
                <div className="text-[10px] text-gray-400">{stage.years}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={figure.heroImage}
            alt={figure.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#8B0000]/90 backdrop-blur-sm rounded-full mb-8 border border-yellow-400/30">
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider">{figure.title}</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-display uppercase text-amber-400 mb-6 tracking-wider drop-shadow-2xl">
            {figure.name}
          </h1>

          <p className="text-2xl md:text-3xl text-gray-200 mb-8 font-light">
            {figure.subtitle}
          </p>

          <div className="flex items-center justify-center gap-8 text-lg text-gray-300 mb-12">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-amber-400" />
              <span>{figure.birth} - {figure.death}</span>
            </div>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-amber-400" />
              <span>{figure.birthPlace}</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-amber-400 text-sm uppercase tracking-wider">Khám phá cuộc đời</span>
            <ChevronDown className="text-amber-400" size={32} />
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#181818]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-display text-center text-amber-400 mb-12 uppercase tracking-wider">
            Tổng Quan Cuộc Đời
          </h2>
          <div className="space-y-6">
            {figure.summary.map((paragraph, idx) => (
              <p key={idx} className="text-xl text-gray-300 leading-relaxed text-center">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Life Stages Timeline - Compact View */}
      <section className="relative py-12">
        {/* Vertical Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-amber-400/50 to-transparent hidden md:block"></div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="relative mb-16 flex justify-center">
            <h2 className="text-4xl font-display text-center text-amber-400 uppercase tracking-wider bg-[#0a0a0a] px-8 py-2 relative z-10">
              Hành Trình Cuộc Đời
            </h2>
          </div>

          {figure.lifeStages.map((stage, index) => (
            <div
              key={index}
              id={`stage-${index}`}
              className="life-stage relative mb-8"
            >
              <div className={`${index % 2 === 0 ? 'md:pr-[55%]' : 'md:pl-[55%]'}`}>
                {/* Timeline Dot */}
                <div className="absolute left-1/2 top-8 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 border-4 border-[#0a0a0a] shadow-lg shadow-amber-400/50 hidden md:block z-10"></div>

                {/* Compact Stage Card */}
                <div 
                  onClick={() => setExpandedStage(index)}
                  className={`bg-gradient-to-br from-[#181818] to-[#0a0a0a] border border-amber-400/30 rounded-xl overflow-hidden hover:border-amber-400 hover:shadow-xl hover:shadow-amber-400/20 transition-all duration-300 cursor-pointer group ${
                    activeStage === index ? 'border-amber-400/60 shadow-lg' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-amber-400/30 flex-shrink-0">
                      <img
                        src={stage.image}
                        alt={stage.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-[#0a0a0a]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="text-amber-400" size={24} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-3 py-0.5 bg-amber-400 text-[#0a0a0a] font-bold rounded-full text-xs">
                          {stage.period}
                        </span>
                        <span className="text-yellow-400 text-sm font-bold">{stage.years}</span>
                      </div>
                      <h3 className="text-xl font-display text-white mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">{stage.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{stage.description[0]}</p>
                    </div>

                    {/* Icon */}
                    <ChevronDown className="text-amber-400 flex-shrink-0 group-hover:translate-y-1 transition-transform" size={24} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expanded Stage Modal */}
      {expandedStage !== null && (
        <div className="fixed inset-0 bg-[#0a0a0a]/95 z-50 overflow-y-auto">
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Close Button */}
              <button
                onClick={() => setExpandedStage(null)}
                className="fixed top-6 right-6 w-12 h-12 bg-amber-400 hover:bg-amber-500 text-[#0a0a0a] rounded-full flex items-center justify-center transition-all z-10 shadow-xl"
              >
                <X size={24} />
              </button>

              {/* Modal Content */}
              <div className="bg-gradient-to-br from-[#181818] to-[#0a0a0a] border-2 border-amber-400/50 rounded-2xl overflow-hidden shadow-2xl">
                {(() => {
                  const stage = figure.lifeStages[expandedStage];
                  return (
                    <>
                      {/* Header */}
                      <div className="bg-gradient-to-r from-[#8B0000] to-[#6B0000] p-8 border-b-2 border-amber-400/30">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-4 py-1 bg-amber-400 text-[#0a0a0a] font-bold rounded-full">
                            {stage.period}
                          </span>
                          <span className="text-yellow-400 text-xl font-bold">{stage.years}</span>
                        </div>
                        <h2 className="text-4xl font-display text-white mb-3">{stage.title}</h2>
                        <p className="text-yellow-300 text-xl">{stage.subtitle}</p>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <div className="grid lg:grid-cols-2 gap-8">
                          {/* Left Column - Images */}
                          <div className="space-y-6">
                            {/* Main Image */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-amber-400/40 shadow-2xl">
                              <img
                                src={stage.image}
                                alt={stage.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Photo Gallery */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <ImageIcon className="text-amber-400" size={20} />
                                <h4 className="text-lg font-bold text-amber-400">Thư Viện Ảnh</h4>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {stage.photos.map((photo, photoIdx) => (
                                  <div
                                    key={photoIdx}
                                    onClick={() => setSelectedImage(photo.url)}
                                    className="relative aspect-video rounded-lg overflow-hidden border border-amber-400/30 cursor-pointer hover:border-amber-400 transition-all group"
                                  >
                                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-[#0a0a0a]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <ImageIcon className="text-amber-400" size={24} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Documents */}
                            {stage.documents && stage.documents.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-4">
                                  <FileText className="text-amber-400" size={20} />
                                  <h4 className="text-lg font-bold text-amber-400">Tư Liệu Lịch Sử</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  {stage.documents.map((doc, docIdx) => (
                                    <div key={docIdx} className="bg-[#0a0a0a]/50 border border-amber-400/20 rounded-lg p-3 hover:border-amber-400/60 transition-all cursor-pointer group">
                                      <div className="aspect-[3/4] rounded overflow-hidden mb-2">
                                        <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                      </div>
                                      <p className="text-white text-sm font-semibold mb-1 line-clamp-2">{doc.title}</p>
                                      <span className="text-amber-400 text-xs">{doc.year}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Column - Text Content */}
                          <div className="space-y-6">
                            {/* Description */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-amber-400" size={24} />
                                <h4 className="text-xl font-bold text-amber-400">Diễn Biến</h4>
                              </div>
                              <div className="space-y-4">
                                {stage.description.map((paragraph, pIdx) => (
                                  <p key={pIdx} className="text-gray-300 leading-relaxed text-lg">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            </div>

                            {/* Key Events */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <Clock className="text-amber-400" size={24} />
                                <h4 className="text-xl font-bold text-amber-400">Sự Kiện Quan Trọng</h4>
                              </div>
                              <div className="space-y-3">
                                {stage.keyEvents.map((event, eventIdx) => (
                                  <div key={eventIdx} className="flex items-start gap-3 bg-[#0a0a0a]/50 p-4 rounded-lg border border-amber-400/10 hover:border-amber-400/30 transition-all">
                                    <span className="px-3 py-1 bg-amber-400/20 text-amber-400 text-sm font-bold rounded whitespace-nowrap">{event.year}</span>
                                    <div className="flex-1">
                                      <h5 className="text-white font-semibold mb-1 text-lg">{event.title}</h5>
                                      <p className="text-gray-400">{event.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Quotes */}
                            {stage.quotes && stage.quotes.length > 0 && (
                              <div className="bg-gradient-to-r from-[#8B0000]/20 to-transparent border-l-4 border-amber-400 p-6 rounded-r-lg">
                                <Quote className="text-amber-400 mb-3" size={36} />
                                {stage.quotes.map((quote, qIdx) => (
                                  <div key={qIdx} className="mb-4 last:mb-0">
                                    <p className="text-amber-100 italic text-xl mb-2">"{quote.text}"</p>
                                    <p className="text-gray-400">— {quote.context}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legacy Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#181818] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="inline-block text-red-500 mb-4" size={48} />
            <h2 className="text-5xl font-display text-amber-400 uppercase tracking-wider mb-4">
              {figure.legacy.title}
            </h2>
            <div className="h-1 w-32 bg-amber-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-[#181818] to-[#0a0a0a] border border-amber-400/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-3">
                <Award size={28} />
                Thành Tựu
              </h3>
              <ul className="space-y-4">
                {figure.legacy.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">•</span>
                    <span className="text-gray-300 leading-relaxed">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#181818] to-[#0a0a0a] border border-amber-400/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-3">
                <Star size={28} />
                Ảnh Hưởng
              </h3>
              <ul className="space-y-4">
                {figure.legacy.impact.map((impact, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">•</span>
                    <span className="text-gray-300 leading-relaxed">{impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {figure.videos && figure.videos.length > 0 && (
        <section className="py-20 px-6 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <VideoIcon className="inline-block text-amber-400 mb-4" size={48} />
              <h2 className="text-4xl font-display text-amber-400 uppercase tracking-wider">
                Video Lịch Sử
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {figure.videos.map((video, idx) => (
                <div key={idx} className="bg-[#181818] border border-amber-400/20 rounded-lg overflow-hidden hover:border-amber-400/60 transition-all group">
                  <div className="relative aspect-video">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#0a0a0a]/60 flex items-center justify-center group-hover:bg-[#0a0a0a]/40 transition-all">
                      <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={40} className="text-[#0a0a0a] ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-400 text-xs rounded mb-3">{video.year}</span>
                    <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                    <p className="text-gray-400">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-[#0a0a0a]/95 flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-5xl">×</span>
          </button>
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
