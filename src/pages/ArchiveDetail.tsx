import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, BookOpen, Eye, FileText, ImageIcon as Image, Heart, Download } from 'lucide-react';

interface ArchiveDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  heroImage: string;
  date: string;
  location: string;
  period: string;
  tags: string[];
  views: number;
  introduction: string[];
  context: {
    title: string;
    content: string[];
  };
  fullText?: string;
  gallery?: string[];
  significance: {
    historical: string;
    educational: string;
  };
  references: Array<{
    title: string;
    author?: string;
    year?: string;
  }>;
}

const archiveData: Record<string, ArchiveDetail> = {
  'tuyen-ngon-doc-lap': {
    id: 'tuyen-ngon-doc-lap',
    title: 'Tuyên Ngôn Độc Lập 1945',
    category: 'Văn Kiện',
    description: 'Bản văn lịch sử do Chủ tịch Hồ Chí Minh đọc tại Quảng trường Ba Đình ngày 2/9/1945, tuyên bố nước Việt Nam Dân chủ Cộng hòa ra đời.',
    heroImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920',
    date: '2/9/1945',
    location: 'Quảng trường Ba Đình, Hà Nội',
    period: 'Cách Mạng Tháng Tám',
    tags: ['Độc lập', 'Hồ Chí Minh', 'Văn kiện quan trọng', 'Dân chủ'],
    views: 15420,
    introduction: [
      'Tuyên ngôn Độc lập là văn kiện pháp lý và chính trị quan trọng nhất trong lịch sử Việt Nam hiện đại.',
      'Được đọc bởi Chủ tịch Hồ Chí Minh tại Quảng trường Ba Đình vào ngày 2 tháng 9 năm 1945, tuyên ngôn đánh dấu sự ra đời của nước Việt Nam Dân chủ Cộng hòa.',
      'Văn bản này khẳng định quyền độc lập, tự do của dân tộc Việt Nam và tuyên bố với toàn thế giới về sự chấm dứt chế độ thực dân.',
    ],
    context: {
      title: 'Bối Cảnh Lịch Sử',
      content: [
        'Sau Cách mạng Tháng Tám thành công, chính quyền cách mạng được thiết lập trên toàn quốc.',
        'Ngày 2/9/1945, tại Quảng trường Ba Đình, trước hàng vạn đồng bào Thủ đô và đại biểu khắp cả nước, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập.',
        'Tuyên ngôn khẳng định: "Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do và độc lập".',
        'Đây là lần đầu tiên trong lịch sử dân tộc, nhân dân ta được sống trong một nước độc lập, tự do.',
      ],
    },
    fullText: `"Tất cả mọi người đều sinh ra có quyền bình đẳng. Tạo hóa cho họ những quyền không ai có thể xâm phạm được; trong những quyền ấy, có quyền được sống, quyền tự do và quyền mưu cầu hạnh phúc".

Lời bất hủ ấy ở trong bản Tuyên ngôn Độc lập năm 1776 của nước Mỹ. Suy rộng ra, câu ấy có ý nghĩa là: tất cả các dân tộc trên thế giới đều sinh ra bình đẳng; dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do.

Bản Tuyên ngôn Nhân quyền và Dân quyền của Cách mạng Pháp năm 1791 cũng nói: "Người ta sinh ra tự do và bình đẳng về quyền lợi, và phải luôn luôn được tự do và bình đẳng về quyền lợi".

Đó là những lẽ phải không ai chối cãi được.

Thế mà hơn 80 năm nay, bọn thực dân Pháp lợi dụng lá cờ tự do, bình đẳng, bác ái, đến cướp đất nước ta, áp bức đồng bào ta. Hành động của chúng trái hẳn với nhân đạo và chính nghĩa.

[...tóm tắt...]

Vì những lý do ấy, chúng tôi, thành viên Chính phủ lâm thời, đại biểu cho toàn thể dân tộc Việt Nam, tuyên bố từ nay, thoát ly quan hệ với nước Pháp; xóa bỏ tất cả những hiệp ước mà nước Pháp đã ký về nước Việt Nam; và xóa bỏ tất cả những đặc quyền của nước Pháp trên đất nước Việt Nam.

Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy.`,
    gallery: [
      'https://cdnmedia.baotintuc.vn/Upload/QKrAM3u3JmfSk084HTqfEg/files/2020/08/tuyen-ngon-doc-lap/tuyen-ngon-4.jpg',
      'https://vnn-imgs-f.vgcloud.vn/2021/09/01/22/tuyen-ngon-1.jpeg?width=260&s=EF6k5fkGgKSMaxZWJcbyag',
      'https://i.ex-cdn.com/danviet.vn/files/content/2025/08/12/1608285-1606.jpg',
    ],
    significance: {
      historical: 'Tuyên ngôn Độc lập là văn kiện pháp lý quan trọng nhất, đánh dấu sự ra đời của nước Việt Nam Dân chủ Cộng hòa. Văn bản này khẳng định quyền tự quyết của dân tộc Việt Nam và mở ra kỷ nguyên mới trong lịch sử dân tộc.',
      educational: 'Tuyên ngôn giúp thế hệ trẻ hiểu rõ ý nghĩa của độc lập, tự do, nuôi dưỡng lòng yêu nước và tự hào dân tộc. Đây là bài học quý giá về ý chí kiên cường và tinh thần đoàn kết của toàn dân tộc.',
    },
    references: [
      { title: 'Tuyên ngôn Độc lập - Bản gốc', year: '1945' },
      { title: 'Lịch sử Đảng Cộng sản Việt Nam', author: 'Viện Lịch sử Đảng', year: '2011' },
      { title: 'Hồ Chí Minh toàn tập', author: 'NXB Chính trị Quốc gia', year: '2011' },
    ],
  },
  'nhat-ky-trong-tu': {
    id: 'nhat-ky-trong-tu',
    title: 'Nhật Ký Trong Tù',
    category: 'Bài Viết',
    description: 'Tập thơ bất hủ được Bác Hồ sáng tác trong thời gian bị giam giữ ở Trung Quốc (1942-1943), phản ánh tâm hồn cao đẹp và ý chí kiên cường.',
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920',
    date: '1942-1943',
    location: 'Các nhà tù ở Trung Quốc',
    period: 'Kháng Chiến Chống Pháp',
    tags: ['Văn học', 'Hồ Chí Minh', 'Thơ ca', 'Ngục tù'],
    views: 12890,
    introduction: [
      'Nhật ký trong tù là tập thơ Hán được Chủ tịch Hồ Chí Minh sáng tác trong thời gian bị Quốc Dân Đảng Trung Hoa bắt giữ và giam cầm.',
      'Gồm 133 bài thơ, tác phẩm phản ánh cuộc sống ngục tù gian khổ nhưng vẫn thể hiện tinh thần lạc quan, ý chí kiên cường và niềm tin vào cách mạng.',
      'Tập thơ là minh chứng cho phẩm chất đạo đức cao đẹp, tài năng văn học xuất sắc và tình yêu con người sâu sắc của Người.',
    ],
    context: {
      title: 'Hoàn Cảnh Sáng Tác',
      content: [
        'Tháng 8/1942, trên đường từ Việt Nam sang Trung Quốc để liên lạc với phong trào cách mạng, Nguyễn Ái Quốc bị Quốc Dân Đảng Trung Hoa bắt giữ.',
        'Người bị giam giữ và di chuyển qua 13 nhà tù ở các tỉnh Quảng Tây, trong điều kiện vô cùng khắc nghiệt.',
        'Trong suốt thời gian giam cầm, Người đã sáng tác 133 bài thơ bằng chữ Hán, ghi lại trên những mảnh giấy vụn, viết bằng mực tàu hoặc than gỗ.',
        'Những bài thơ này sau đó được tập hợp thành tập "Nhật ký trong tù", xuất bản lần đầu năm 1960.',
      ],
    },
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
Bạn có còn nhớ ta?

KỶ LUẬT

Kỷ luật thì như mẹ,
Nhưng không phải mẹ thiên.
Người trong đạo nhân nghĩa,
Mới hiểu được tình thương.

TRONG CUỘC SỐNG

Mười lăm ngày, một lần trời trong,
Mười lăm ngày sau, trời lại đục.
Ngày mưa giờ nắng,
Trong lòng xốn xang.

[... Và nhiều bài thơ khác ...]`,
    gallery: [
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200',
      'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1200',
    ],
    significance: {
      historical: 'Nhật ký trong tù là tác phẩm văn học độc đáo, vừa mang giá trị lịch sử, vừa mang giá trị nghệ thuật cao. Tác phẩm phản ánh hoàn cảnh lịch sử và con đường cách mạng gian nan của Chủ tịch Hồ Chí Minh.',
      educational: 'Tác phẩm giáo dục cho thế hệ trẻ tinh thần lạc quan cách mạng, ý chí kiên cường trước mọi khó khăn thử thách. Đồng thời thể hiện tình yêu con người, tình yêu Tổ quốc sâu sắc.',
    },
    references: [
      { title: 'Nhật ký trong tù - Bản dịch tiếng Việt', author: 'NXB Văn học', year: '1960' },
      { title: 'Hồ Chí Minh - Con người và tác phẩm', author: 'GS. Trần Đăng Sinh', year: '2005' },
      { title: 'Thơ Hồ Chí Minh', author: 'NXB Chính trị Quốc gia', year: '2010' },
    ],
  },
};

export default function ArchiveDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const archive = id ? archiveData[id] : null;

  if (!archive) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-brand-blue mb-4">Không tìm thấy tư liệu</h1>
          <button onClick={() => navigate('/culture/archives')} className="text-gray-400 hover:text-brand-blue transition-colors">
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-900">
      {/* Back Button */}
      <button
        onClick={() => navigate('/culture/archives')}
        className="fixed top-24 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-charcoal-800/90 backdrop-blur-sm border border-brand-blue/30 rounded-full text-brand-blue hover:bg-charcoal-800 hover:border-brand-blue transition-all"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-semibold">Quay lại</span>
      </button>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={archive.heroImage} alt={archive.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 via-charcoal-900/80 to-charcoal-900"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-charcoal-700/90 backdrop-blur-sm rounded-full mb-8 border border-brand-blue/30">
            <FileText className="text-brand-blue" size={20} />
            <span className="text-brand-blue text-sm font-bold uppercase tracking-wider">{archive.category}</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-display text-brand-blue mb-6 tracking-wider drop-shadow-2xl">
            {archive.title}
          </h1>

          <p className="text-2xl text-gray-200 mb-8 font-light">
            {archive.description}
          </p>

          <div className="flex items-center justify-center gap-8 text-lg text-gray-300 mb-12">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-brand-blue" />
              <span>{archive.date}</span>
            </div>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-brand-blue" />
              <span>{archive.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="mb-16">
            <h2 className="text-4xl font-display text-brand-blue mb-8 uppercase tracking-wider flex items-center gap-3">
              <div className="w-1 h-10 bg-brand-blue rounded-full"></div>
              Tổng Quan
            </h2>
            <div className="space-y-6">
              {archive.introduction.map((paragraph, idx) => (
                <p key={idx} className="text-xl text-gray-200 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Context */}
          <div className="mb-16 bg-gradient-to-br from-charcoal-800 to-charcoal-900 border-2 border-brand-blue/30 rounded-2xl p-8">
            <h2 className="text-3xl font-display text-brand-blue mb-6 flex items-center gap-3">
              <BookOpen className="text-brand-blue" size={32} />
              {archive.context.title}
            </h2>
            <div className="space-y-4">
              {archive.context.content.map((paragraph, idx) => (
                <p key={idx} className="text-lg text-gray-200 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Gallery */}
          {archive.gallery && archive.gallery.length > 0 && (
            <div className="mb-16">
              <h2 className="text-4xl font-display text-brand-blue mb-8 uppercase tracking-wider flex items-center gap-3">
                <div className="w-1 h-10 bg-brand-blue rounded-full"></div>
                Thư Viện Ảnh
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {archive.gallery.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-brand-blue/30 hover:border-brand-blue transition-all group">
                    <img src={img} alt={`Tư liệu ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Text */}
          {archive.fullText && (
            <div className="mb-16">
              <h2 className="text-4xl font-display text-brand-blue mb-8 uppercase tracking-wider flex items-center gap-3">
                <div className="w-1 h-10 bg-brand-blue rounded-full"></div>
                Nội Dung Văn Bản
              </h2>
              <div className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 border-2 border-brand-blue/30 rounded-2xl p-10">
                <pre className="whitespace-pre-wrap font-serif text-gray-200 text-lg leading-relaxed">
                  {archive.fullText}
                </pre>
              </div>
            </div>
          )}

          {/* Significance */}
          <div className="mb-16">
            <h2 className="text-4xl font-display text-brand-blue mb-8 uppercase tracking-wider flex items-center gap-3">
              <div className="w-1 h-10 bg-brand-blue rounded-full"></div>
              Ý Nghĩa & Giá Trị
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 border-2 border-brand-blue/30 p-8 rounded-xl">
                <h4 className="text-xl font-semibold text-brand-blue mb-4 flex items-center gap-2">
                  <Heart className="text-brand-blue" size={24} />
                  Giá Trị Lịch Sử
                </h4>
                <p className="text-gray-200 leading-relaxed">{archive.significance.historical}</p>
              </div>
              <div className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 border-2 border-brand-blue/30 p-8 rounded-xl">
                <h4 className="text-xl font-semibold text-brand-blue mb-4 flex items-center gap-2">
                  <BookOpen className="text-brand-blue" size={24} />
                  Ý Nghĩa Giáo Dục
                </h4>
                <p className="text-gray-200 leading-relaxed">{archive.significance.educational}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-brand-blue mb-6">Từ Khóa Liên Quan</h3>
            <div className="flex flex-wrap gap-3">
              {archive.tags.map((tag, i) => (
                <span key={i} className="px-5 py-2 bg-brand-blue/20 border border-brand-blue/40 rounded-full text-brand-blue font-semibold hover:bg-brand-blue/30 transition-all">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* References */}
          <div className="mb-16 bg-gradient-to-br from-charcoal-800 to-charcoal-900 border-2 border-brand-blue/30 rounded-2xl p-8">
            <h2 className="text-3xl font-display text-brand-blue mb-6 flex items-center gap-3">
              <FileText className="text-brand-blue" size={32} />
              Tài Liệu Tham Khảo
            </h2>
            <ul className="space-y-4">
              {archive.references.map((ref, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-200">
                  <span className="text-brand-blue mt-1">•</span>
                  <div>
                    <p className="font-semibold">{ref.title}</p>
                    {(ref.author || ref.year) && (
                      <p className="text-sm text-gray-400">
                        {ref.author && ref.author}
                        {ref.author && ref.year && ' - '}
                        {ref.year && ref.year}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats & Info */}
          <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-brand-blue/20">
            <div className="flex items-center gap-2 text-gray-400">
              <Eye size={20} className="text-brand-blue" />
              <span><span className="text-brand-blue font-bold">{archive.views.toLocaleString()}</span> lượt xem</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={20} className="text-brand-blue" />
              <span>{archive.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={20} className="text-brand-blue" />
              <span>{archive.location}</span>
            </div>
          </div>

          {/* Reference Note */}
          <div className="mt-12 p-6 bg-brand-blue/10 border border-brand-blue/30 rounded-xl">
            <p className="text-gray-200 text-sm leading-relaxed text-center italic">
              💡 Tư liệu này được số hóa và lưu trữ nhằm mục đích nghiên cứu, học tập và giáo dục. Xin vui lòng trích dẫn nguồn khi sử dụng.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
