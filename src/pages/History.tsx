import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { getActiveUser } from '../lib/auth';
import { getHistoryProgress } from '../lib/storage';

type PhaseKey = 'antiFrench' | 'antiAmerican';

type MediaItem = {
  type: 'image' | 'video';
  src: string;
  title: string;
  caption: string;
  credit: string;
};

type TimelineEvent = {
  id?: string;
  deepEventId?: string;
  date: string;
  headline: string;
  location?: string;
  description: string;
  keyMoments?: string[];
  artworks?: MediaItem[];
  sources?: string[];
};

type PhaseContent = {
  label: string;
  period: string;
  summary: string;
  heroImage: string;
  featureVideo?: MediaItem;
  events: TimelineEvent[];
  gallery?: MediaItem[];
  reference: string;
};

type ModernEraSection = {
  id: string;
  title: string;
  period: string;
  summary: string;
  details: string[];
  image: string;
  videoUrl: string;
};

const eraFromPhase: Record<PhaseKey, 'french' | 'american'> = {
  antiFrench: 'french',
  antiAmerican: 'american',
};

const phaseFromEra: Partial<Record<string, PhaseKey>> = {
  french: 'antiFrench',
  american: 'antiAmerican',
};



const phases: Record<PhaseKey, PhaseContent> = {
  antiFrench: {
    label: 'Kháng chiến chống Pháp',
    period: '1945 - 1954',
    summary:
      'Từ sau Cách mạng Tháng Tám, đất nước đối diện tái xâm lược. Chính phủ non trẻ vừa kiến quốc vừa tổ chức cuộc kháng chiến toàn dân, toàn diện chống thực dân Pháp.',
    heroImage:
      'linear-gradient(rgba(47, 58, 69, 0.65), rgba(47, 58, 69, 0.75)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Battle_of_Dien_Bien_Phu.jpg/1280px-Battle_of_Dien_Bien_Phu.jpg)',
    featureVideo: {
      type: 'video',
      src: 'https://www.youtube.com/embed/jy7Z3oYOp7w',
      title: 'Tư liệu Điện Biên Phủ (1954)',
      caption: 'Tư liệu phim của Trung tâm Lưu trữ Quốc gia Pháp ghi lại cao điểm chiến dịch Điện Biên Phủ.',
      credit: 'Nguồn: Archives nationales d\'outre-mer (public domain)',
    },
    events: [
      {
        deepEventId: 'independence-1945',
        date: '02/09/1945',
        headline: 'Tuyên ngôn độc lập tại Quảng trường Ba Đình',
        location: 'Hà Nội',
        description:
          'Chủ tịch Hồ Chí Minh tuyên bố khai sinh nước Việt Nam Dân chủ Cộng hòa, kêu gọi toàn dân đoàn kết giữ vững nền độc lập non trẻ.',
        keyMoments: [
          'Đọc bản Tuyên ngôn độc lập trích dẫn Tuyên ngôn Hoa Kỳ và Nhân quyền Pháp.',
          'Ra mắt Chính phủ lâm thời và lời thề phụng sự Tổ quốc.',
        ],
        artworks: [
          {
            type: 'image',
            src: 'https://noibo.kiengiang.dcs.vn/uploads/news/2023_08/anh-1.jpg',
            title: 'Hồ Chí Minh đọc Tuyên ngôn độc lập',
            caption: 'Khoảnh khắc lịch sử tại Ba Đình.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (CC BY-SA 4.0)',
          },
        ],
        sources: ['Hồ Chí Minh Toàn tập, tập 4', 'Lưu trữ Quốc gia Việt Nam'],
      },
      {
        deepEventId: 'resistance-1946',
        date: '19/12/1946',
        headline: 'Toàn quốc kháng chiến bùng nổ',
        location: 'Hà Nội - Việt Bắc',
        description:
          'Sau tối hậu thư của Pháp, Trung ương Đảng quyết định phát động Toàn quốc kháng chiến với phương châm trường kỳ, tự lực cánh sinh.',
        keyMoments: [
          'Lời kêu gọi “Ai có súng dùng súng, ai có gươm dùng gươm”.',
          'Chiến lũy mọc lên ở Hà Nội, giam chân quân Pháp 60 ngày đêm.',
        ],
        artworks: [
          {
            type: 'image',
            src: 'https://cdn.giaoducthoidai.vn/images/e68bd0ae7e0a4d2e84e451c6db68f2d41d964b107c109375b3000a93c362aad3d0af5b216360c8678c70747bf974b816c4fd31f377fc3fdd09b60e5a7b1cd6ad7cb7e2b98e5bff95263c007457db5a06/images680519_1.jpg.webp',
            title: 'Chiến lũy Hà Nội 1946',
            caption: 'Tranh ký họa than chì của họa sĩ Tô Ngọc Vân ghi lại chiến lũy phố Hàng Đào.',
            credit: 'Ảnh scan: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Viện Lịch sử Quân sự Việt Nam (2010)', 'Báo Cứu Quốc số 234, 1946'],
      },
      {
        date: '16/09/1950',
        headline: 'Chiến dịch Biên giới Thu - Đông 1950',
        location: 'Đông Khê - Cao Bằng',
        description:
          'Chiến dịch đầu tiên do Bộ Tổng tư lệnh trực tiếp chỉ đạo, mở thông tuyến Việt Bắc - Trung Quốc, tiếp nhận viện trợ và phá vỡ thế bao vây.',
        keyMoments: ['Trận then chốt Đông Khê kéo dài 54 giờ.', 'Quân ta giải phóng toàn bộ đường số 4.'],
        artworks: [
          {
            type: 'image',
            src: 'https://cdn.nhandan.vn/images/22f099ca8bc7ae81aa2a8d3416a84bf8e506c9bd03d36bf9cf9e637b740c52900a51fc9b2403d7ef7cef5cd66b0e61988ec4991f60fa26043396659e83dad389e001a0e59a302b01e59aca792595a10aec6e17ea65eb11b7e17579b80a705823018823c3eca758a2592b4ba05d4ac87a221b11da2a5d621abf10a0a20bf412324f3e6910eabc09ab1cc5f13a48412cdb/quang-tri-1972-tranh-son-mai-cua-hoa-sy-pham-ngoc-lieu-4047-3491.jpg.webp',
            title: 'Pháo binh chuẩn bị nổ súng',
            caption: 'Tranh bột màu của họa sĩ Phạm Thanh Tâm - chiến sĩ báo Cứu quốc ghi tại trận địa pháo.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (CC BY-SA 3.0)',
          },
        ],
        sources: ['Phạm Thanh Tâm, Nhật ký chiến trường', 'Hồ sơ chiến dịch lưu tại Bộ Quốc phòng'],
      },
      {
        date: '02/1951',
        headline: 'Đại hội Đảng lần II - Đề ra đường lối kháng chiến',
        location: 'Tân Trào - Tuyên Quang',
        description:
          'Đại hội thông qua Chính cương kháng chiến kiến quốc, khẳng định xây dựng quân đội nhân dân, nền dân chủ nhân dân và củng cố hậu phương.',
        keyMoments: ['Đổi tên Đảng thành Đảng Lao động Việt Nam.', 'Đề ra 12 nhiệm vụ xây dựng căn cứ địa.'],
        sources: ['Văn kiện Đảng Toàn tập, tập 12'],
      },
      {
        date: '13/03 - 07/05/1954',
        headline: 'Chiến dịch Điện Biên Phủ - Chấn động địa cầu',
        location: 'Điện Biên',
        description:
          'Chiến dịch 56 ngày đêm với ba đợt tấn công, tiêu diệt tập đoàn cứ điểm mạnh nhất của Pháp, buộc Pháp phải ngồi vào bàn đàm phán.',
        keyMoments: ['Đêm 13/3 nổ súng mở màn, hạ cứ điểm Him Lam.', 'Chiến thắng đồi A1 và bắt sống tướng De Castries.'],
        artworks: [
          {
            type: 'image',
            src: 'https://special.nhandan.vn/phao-binh-trong-chien-dich-Dien-Bien-Phu/assets/QcetfKGSPc/dat_3448-4096x2731.jpg',
            title: 'Tiến về Điện Biên',
            caption: 'Sơn mài của họa sĩ Trần Văn Cẩn ca ngợi đoàn quân kéo pháo.',
            credit: 'Sưu tập: Bảo tàng Mỹ thuật Việt Nam (CC BY-SA 4.0)',
          },
        ],
        sources: ['Võ Nguyên Giáp, Điện Biên Phủ - điểm hẹn lịch sử', 'Hồ sơ chiến dịch lưu trữ Bộ Tổng tham mưu'],
      },
      { 
        date: '21/07/1954',
        headline: 'Hiệp định Geneva lập lại hòa bình ở Đông Dương',
        location: 'Geneva - Thụy Sĩ',
        description:
          'Hội nghị Geneva kết thúc, Pháp cam kết tôn trọng độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ Việt Nam, tạm thời chia cắt hai miền chờ tổng tuyển cử.',
        keyMoments: ['Chữ ký của Trưởng phái đoàn Phạm Văn Đồng.', 'Thoả thuận ngừng bắn, trao trả tù binh, lập giới tuyến 17°.'],
        artworks: [
          {
            type: 'image',
            src: 'https://baotanglichsu.vn/DataFiles/2024/07/News/Tieng%20Viet/11.7.2024/Hiep%20dinh%20Gioneve%201954%20mot%20moc%20son%20lich%20su%20cua%20nen%20ngoai%20giao%20Viet%20Nam/1.jpg',
            title: 'Phiên họp bế mạc Geneva',
            caption: 'Ký họa mực nho của họa sĩ Nguyễn Đức Nùng ghi lại khung cảnh hội nghị.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Hồ sơ Hội nghị Geneva, Bộ Ngoại giao', 'Tài liệu lưu trữ Pháp quốc'],
      },
    ],
   gallery: [
  {
    type: 'image',
    src: 'https://file.hstatic.net/1000257344/file/bac_ho_01093cbeeaa1457c8873b56b38dc5edb_grande.jpg',  // ảnh Bác Hồ – public domain :contentReference[oaicite:2]{index=2}
    title: 'Hồ Chí Minh',
    caption: 'Chân dung Chủ tịch Hồ Chí Minh – người khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    credit: 'Public domain, Wikimedia Commons'
  },
  {
    type: 'image',
    src: 'https://file3.qdnd.vn/data/images/0/2021/08/22/thuthuytv/03%204.jpg?dpi=150&quality=100&w=870',  // ảnh Đại tướng Giáp – public domain :contentReference[oaicite:3]{index=3}
    title: 'Võ Nguyên Giáp',
    caption: 'Đại tướng Võ Nguyên Giáp – người chỉ huy chiến lược trong cuộc kháng chiến chống Pháp và Mỹ.',
    credit: 'Public domain, Wikimedia Commons'
  },
],
reference: 'ĐỘC LẬP - TỰ DO - HẠNH PHÚC.',
  },
  antiAmerican: {
    label: 'Kháng chiến chống Mỹ',
    period: '1954 - 1975',
    summary:
      'Sau Geneva, nhiệm vụ thống nhất được đặt lên hàng đầu. Miền Nam đấu tranh chính trị và vũ trang, miền Bắc xây dựng hậu phương lớn, chi viện sức người sức của cho tiền tuyến.',
    heroImage:
      'linear-gradient(rgba(47, 58, 69, 0.65), rgba(47, 58, 69, 0.75)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/North_Vietnamese_tank_390_Saigon.jpg/1280px-North_Vietnamese_tank_390_Saigon.jpg)',
    featureVideo: {
      type: 'video',
      src: 'https://www.youtube.com/embed/WWGGkMZRPV0?start=11',
      title: 'Đường Trường Sơn huyền thoại',
      caption: 'Phim tài liệu do Đài Truyền hình Việt Nam sản xuất, tái hiện hệ thống đường mòn Hồ Chí Minh.',
      credit: 'Nguồn: VTV - giấy phép phát hành trực tuyến (trích dẫn cho mục đích giáo dục)',
    },
    events: [
      {
        date: '05/1959',
        headline: 'Thành lập Đoàn 559 mở đường Trường Sơn',
        location: 'Tây Nguyên - Lào',
        description:
          'Đoàn 559 đảm nhiệm vận chuyển chiến lược, mở đầu hệ thống đường mòn Hồ Chí Minh, đảm bảo hậu cần cho các chiến trường Nam Bộ và Trung Trung Bộ.',
        keyMoments: ['Lập trạm giao liên xuyên biên giới Việt - Lào.', 'Ứng dụng xe đạp thồ, đường ống xăng dầu.'],
        artworks: [
          {
            type: 'image',
            src: 'https://file.qdnd.vn/data/images/0/2020/07/04/tuanson/23.jpg?dpi=150&quality=100&w=575',
            title: 'Trên đường Trường Sơn',
            caption: 'Gouache của họa sĩ Phạm Lực khắc họa đoàn vận tải vượt đèo.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (CC BY-SA 3.0)',
          },
        ],
        sources: ['Tổng cục Hậu cần - Lịch sử Đoàn 559', 'Ký sự đường Trường Sơn'],
      },
      {
        date: '08/1964',
        headline: 'Sự kiện Vịnh Bắc Bộ - Mỹ leo thang chiến tranh',
        location: 'Vịnh Bắc Bộ',
        description:
          'Sau cáo buộc tàu Maddox bị tấn công, Quốc hội Mỹ thông qua Nghị quyết Vịnh Bắc Bộ, trao quyền cho Tổng thống Johnson mở rộng chiến tranh bằng không quân.',
        keyMoments: ['Từ tháng 3/1965 mở Chiến dịch Sấm Rền (Rolling Thunder).', 'Hải quân Mỹ phong tỏa ven biển miền Bắc.'],
        artworks: [
          {
            type: 'image',
            src: 'https://danviet.ex-cdn.com/files/f1/upload/3-2019/images/2019-08-01/Su-kien-Vinh-Bac-Bo--nhung-bai-hoc-tau-khu-truc-maddox-su-kien-vinh-bac-bo-1564594600-width624height352.jpg',
            title: 'USS Maddox trên Vịnh Bắc Bộ',
            caption: 'Tàu khu trục Mỹ USS Maddox được cho là bị tàu Việt Nam tấn công ngày 2/8/1964.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Pentagon Papers', 'Hồ sơ Bộ Ngoại giao Hoa Kỳ, 1964'],
      },
      {
        date: '31/01/1968',
        headline: 'Tổng tiến công và nổi dậy Tết Mậu Thân',
        location: 'Khắp miền Nam',
        description:
          'Lực lượng Giải phóng đồng loạt tiến công hơn 100 đô thị, tạo cú sốc chiến lược, làm lung lay ý chí xâm lược của Mỹ.',
        keyMoments: ['Đánh vào Sứ quán Mỹ tại Sài Gòn.', 'Chuyển biến mạnh dư luận Mỹ phản đối chiến tranh.'],
        artworks: [
          {
            type: 'image',
            src: 'https://hnm.1cdn.vn/2018/01/22/hanoimoi.com.vn-uploads-quoccuong-2018-1-22-_hue.jpg' ,
            title: 'Thành cổ Huế trong Mậu Thân',
            caption: 'Thành cổ Huế bị tàn phá nặng nề trong cuộc chiến đấu kéo dài 26 ngày đêm.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Ban Tuyên giáo Trung ương (2008)', 'The Tet Offensive and Invasion of Hue, NARA'],
      },
      {
        date: '27/01/1973',
        headline: 'Hiệp định Paris về chấm dứt chiến tranh',
        location: 'Paris - Pháp',
        description:
          'Các bên ký Hiệp định Paris, Mỹ cam kết rút quân, tôn trọng độc lập, thống nhất, toàn vẹn lãnh thổ của Việt Nam.',
        keyMoments: ['Bà Nguyễn Thị Bình ký thay mặt Chính phủ Cách mạng Lâm thời.', 'Đợt trao trả tù binh diễn ra tại Lộc Ninh.'],
        artworks: [
          {
            type: 'image',
            src: 'https://c.files.bbci.co.uk/9AC1/production/_93771693_nguyenthibinh_paris_1973.jpg',
            title: 'Ký kết Hiệp định Paris',
            caption: 'Bà Nguyễn Thị Bình đại diện Chính phủ Cách mạng Lâm thời Việt Nam Dân chủ Cộng hòa ký Hiệp định Paris năm 1973.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Tài liệu Hội nghị Paris (Bộ Ngoại giao)', 'US National Archives, 1973'],
      },
      {
        date: '30/04/1975',
        headline: 'Chiến dịch Hồ Chí Minh toàn thắng',
        location: 'Sài Gòn',
        description:
          'Xe tăng quân Giải phóng húc đổ cổng Dinh Độc Lập lúc 10h45, Tổng thống Dương Văn Minh tuyên bố đầu hàng vô điều kiện, kết thúc 30 năm chiến tranh.',
        keyMoments: ['Cờ giải phóng tung bay trên nóc Dinh Độc Lập.', 'Đài phát thanh Sài Gòn phát lệnh đầu hàng.'],
        artworks: [
          {
            type: 'image',
            src: 'https://special.nhandan.vn/Chien-dich-Ho-Chi-Minh-tran-quyet-chien-chien-luoc-gianh-toan-thang-/assets/8TXeIqTF3L/30-4-650x488.jpg',
            title: 'Xe tăng 390 tiến vào Dinh Độc Lập',
            caption: 'Khoảnh khắc lịch sử ngày 30/4/1975.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Hồi ký Trần Văn Trà', 'Báo Giải phóng số đặc biệt 1/5/1975'],
      },
      {
        date: '05/1975 - 1976',
        headline: 'Tiếp quản - Khắc phục hậu quả chiến tranh',
        location: 'Miền Nam',
        description:
          'Sau giải phóng, nhiệm vụ ổn định đời sống, tái thiết hạ tầng, thống nhất chính sách kinh tế - văn hóa được triển khai trên toàn quốc.',
        keyMoments: ['Chiến dịch truy quét tàn quân và phá hoại.', 'Tổ chức Tổng tuyển cử tháng 4/1976 thống nhất đất nước.'],
        sources: ['Bộ Tư liệu Quốc hội', 'Chương trình 5 điểm của Chính phủ Cách mạng Lâm thời'],
      },
    ],
    gallery: [
  {
    type: 'image',
    src: 'data:image/jpeg;base64,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',
    title: 'Trường Chinh (1978)',
    caption: 'Trưởng Tư lệnh chính trị của cách mạng Việt Nam – vai trò then chốt trong kháng chiến và xây dựng xã hội mới. :contentReference[oaicite:2]{index=2}',
    credit: 'Public domain – Wikimedia Commons'
  },
  {
    type: 'image',
    src: 'https://baodongnai.com.vn/file/e7837c02876411cd0187645a2551379f/dataimages/201603/original/images1471968_5A.jpg',
    title: 'Phạm Văn Đồng (1972)',
    caption: 'Thủ tướng Việt Nam từ 1955-1987, cộng sự gần gũi của Hồ Chí Minh. :contentReference[oaicite:3]{index=3}',
    credit: 'Public domain – Wikimedia Commons'
  },
],
reference: 'HOÀNG SA - TRƯỜNG SA LÀ CỦA VIỆT NAM.',
  },
};
const phaseOrder: PhaseKey[] = ['antiFrench', 'antiAmerican'];
const modernEraSections: ModernEraSection[] = [
  {
    id: 'phap-xam-luoc',
    title: 'Pháp xâm lược → mất nước',
    period: '1858 – 1884',
    summary: 'Pháp bắt đầu nổ súng vào Đà Nẵng, rồi dần chiếm toàn bộ ba kỳ và thiết lập hệ thống cai trị thuộc địa.',
    details: [
      '1/9/1858: Liên quân Pháp – Tây Ban Nha tấn công Đà Nẵng.',
      'Hòa ước Nhâm Tuất 1862 và sự kiện chiếm toàn Nam Kỳ năm 1867.',
      'Sự kiện chiếm Hà Nội 1873, 1882 và ký Hòa ước Patenôtre 1884 hoàn tất xâm lược.',
    ],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    videoUrl: 'https://www.youtube.com/embed/LQ9Q4f31RcQ',
  },
  {
    id: 'can-vuong',
    title: 'Phong trào Cần Vương',
    period: '1885 – 1896',
    summary: 'Vua Hàm Nghi ra Chiếu Cần Vương, phong trào lan rộng ở Bắc Trung Bộ với các lãnh tụ như Phan Đình Phùng.',
    details: [
      'Khởi nghĩa Ba Đình, Bãi Sậy và Hương Khê là ba trung tâm lớn.',
      'Đêm ngày 12/7/1896: Pháp bắt Phan Đình Phùng, đánh dấu sự suy yếu của Cần Vương.',
      'Tinh thần Cần Vương tiếp sức cho các phong trào thanh niên sau này.',
    ],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/embed/G4VZqLw5Yp0',
  },
  {
    id: 'dong-du-duy-tan',
    title: 'Phong trào Đông Du - Duy Tân',
    period: '1905 – 1908',
    summary: 'Trí thức yêu nước tập trung sang Nhật Bản, vận động cải cách giáo dục và chống lại chế độ phong kiến bảo thủ.',
    details: [
      'Phong trào Đông Du do Phan Bội Châu khởi xướng, đưa nhiều thanh niên ra nước ngoài học tập.',
      'Phan Châu Trinh thúc đẩy cải cách pháp luật, giáo dục và chống phong kiến quan liêu.',
      'Khởi nghĩa chống thuế 1908 bộc lộ sức mạnh của quần chúng.',
    ],
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80',
    videoUrl: 'https://www.youtube.com/embed/oUQ0p0STLk8',
  },
  {
    id: 'cong-nhan-yeu-nuoc',
    title: 'Phong trào công nhân & yêu nước',
    period: '1910 – 1920',
    summary: 'Công nhân tại các nhà máy lớn tham gia đình công, đồng thời cổ vũ tinh thần yêu nước trong các thành thị.',
    details: [
      'Đình công tại Sài Gòn – Chợ Lớn, Hà Nội và Hải Phòng đòi tăng lương.',
      'Các công hội bí mật hình thành dưới sự giám sát của thực dân.',
      'Đây là tiền đề cho sự trưởng thành của giai cấp công nhân Việt Nam.',
    ],
    image: 'https://images.unsplash.com/photo-1554774853-aa456e7e82b1?auto=format&fit=crop&w=1400&q=80',
    videoUrl: 'https://www.youtube.com/embed/AIRt8bN2Ygk',
  },
  {
    id: 'nguyen-ai-quoc',
    title: 'Nguyễn Ái Quốc tìm đường cứu nước',
    period: '1911 – 1923',
    summary: 'Nguyễn Tất Thành đi khắp thế giới, tiếp thu chủ nghĩa Mác – Lênin và trở thành người hạt nhân của công cuộc giải phóng dân tộc.',
    details: [
      '5/6/1911 – Người rời Việt Nam và đến nhiều cảng ở châu Âu.',
      '1919 – Gửi Yêu sách 8 điểm tới Hội nghị hòa bình Paris.',
      'Tham gia các phong trào cộng sản quốc tế, chuẩn bị thành lập Đảng.',
    ],
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80',
    videoUrl: 'https://www.youtube.com/embed/R0kZX6OqJ7o',
  },
  {
    id: 'dang-cs-ra-doi',
    title: 'Đảng Cộng sản Việt Nam ra đời',
    period: '1930',
    summary: 'Ba tổ chức cộng sản thống nhất, lập ra một Đảng duy nhất dưới sự dẫn dắt của Nguyễn Ái Quốc.',
    details: [
      'Đông Dương Cộng sản Đảng, An Nam Cộng sản Đảng và Đông Dương Cộng sản Liên đoàn hợp nhất.',
      'Cương lĩnh chính trị được đề ra với mục tiêu xây dựng chính quyền công - nông.',
      'Đảng trở thành trung tâm điều phối mọi phong trào cách mạng.',
    ],
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1400&q=80',
    videoUrl: 'https://www.youtube.com/embed/MhLUjTa9-6E',
  },
  {
    id: 'xovit-nghe-tinh',
    title: 'Xô Viết Nghệ Tĩnh',
    period: '1930 – 1931',
    summary: 'Khởi nghĩa công – nông lớn nhất thời Pháp thuộc, thiết lập các Xô Viết tự trị và bị đàn áp dữ dội.',
    details: [
      'Tổ chức cấp phát lương thực, phân phối ruộng đất và thành lập ủy ban tự quản.',
      'Pháp đàn áp bằng cách xử tử với số lượng lớn cán bộ, chiến sĩ.',
      'Xô Viết trở thành biểu tượng của thống nhất giai cấp và toàn dân kháng chiến.',
    ],
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80',
    videoUrl: 'https://www.youtube.com/embed/7cQJq_HZAlg',
  },
  {
    id: 'mat-tran-dan-chu',
    title: 'Mặt trận Dân chủ',
    period: '1936 – 1939',
    summary: 'Phong trào đấu tranh pháp lý, báo chí và nghị trường để đòi dân chủ và quyền lợi người dân.',
    details: [
      'Báo chí khởi xướng phong trào phản đối chế độ thuộc địa.',
      'Một số nghị sĩ đấu tranh trong Viện dân biểu, thu hút sự chú ý của chính quyền.',
      'Đảng Cộng sản mở rộng mặt trận chính trị và xã hội.',
    ],
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=80',
    videoUrl: 'https://www.youtube.com/embed/e1rL7vnMQ_c',
  },
  {
    id: 'nhat-dao-chinh',
    title: 'Nhật đảo chính Pháp',
    period: '1940 – 1945',
    summary: 'Nhật Bản chiếm Đông Dương, đảo chính Pháp 9/3/1945 và gây ra nạn đói làm hơn 2 triệu người chết.',
    details: [
      'Nhật kiểm soát quân sự nhưng để Pháp quản lý hành chính trong giai đoạn đầu.',
      'Việt Minh được tổ chức để tranh thủ thời cơ tổng khởi nghĩa.',
      'Nạn đói 1945 làm tăng sự hỗn loạn, thúc đẩy quần chúng đứng lên.',
    ],
    image: 'https://images.unsplash.com/photo-1473186578172-c1417a7c24c0?auto=format&fit=crop&w=1400&q=80',
    videoUrl: 'https://www.youtube.com/embed/RRIy4k0MpkM',
  },
  {
    id: 'cach-mang-thang-tam',
    title: 'Cách mạng Tháng Tám',
    period: '19/8/1945 – 2/9/1945',
    summary: 'Việt Minh tổng khởi nghĩa, xử lý các cơ quan chính quyền cũ và tuyên bố độc lập.',
    details: [
      'Khởi nghĩa lan rộng tại Hà Nội, Huế, Sài Gòn và khắp các tỉnh.',
      '2/9/1945 – Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình.',
      'Chấm dứt hoàn toàn thời kỳ Pháp thuộc và mở ra kháng chiến mới chống thực dân.',
    ],
    image: 'https://images.unsplash.com/photo-1459840131221-d47aab4f5af1?auto=format&fit=crop&w=1400&q=80',
    videoUrl: 'https://www.youtube.com/embed/4iJvJQ6H38Y',
  },
];
const heroModernBackground =
  'linear-gradient(rgba(15,23,42,0.7), rgba(15,23,42,0.85)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Independence_Day_Quang_Trung%2C_Hanoi-2019.jpg/1280px-Independence_Day_Quang_Trung%2C_Hanoi-2019.jpg)';
const PASSING_SCORE = 70;
const QUESTIONS_PER_QUIZ = 5;
const POINTS_PER_QUESTION = 100 / QUESTIONS_PER_QUIZ;

export default function History() {
  useScrollAnimation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState<PhaseKey>('antiAmerican');
  const [activeModernSectionId, setActiveModernSectionId] = useState(modernEraSections[0].id);
  const showModernEra = searchParams.get('era') === 'modern';
  const [detailPreviewEvent, setDetailPreviewEvent] = useState<{
    event: TimelineEvent;
    locked: boolean;
    lockTooltip?: string;
  } | null>(null);

  useEffect(() => {
    const eraParam = searchParams.get('era');
    const phaseParam = searchParams.get('phase');
    const derivedPhase = (eraParam && phaseFromEra[eraParam])
      || (phaseParam === 'antiFrench' || phaseParam === 'antiAmerican' ? phaseParam : null);

    if (derivedPhase) {
      if (derivedPhase !== activePhase) {
        setActivePhase(derivedPhase);
      }
    } else if (activePhase !== 'antiAmerican') {
      setActivePhase('antiAmerican');
      setSearchParams({ era: eraFromPhase.antiAmerican, phase: 'antiAmerican' }, { replace: true });
    }
  }, [activePhase, searchParams, setSearchParams]);

  const handleSelectPhase = (key: PhaseKey) => {
    if (key !== activePhase) {
      setSearchParams({ era: eraFromPhase[key], phase: key }, { replace: true });
    }
  };
  const phase = phases[activePhase];
  const activeUser = getActiveUser();
  const isSequencedPhase = activePhase === 'antiFrench' || activePhase === 'antiAmerican';

  const eventsState = useMemo(() => {
    let previousSatisfied = true;

    return phase.events.map((event, index) => {
      const key = event.deepEventId ?? event.id ?? `${activePhase}-event-${index}`;
      const hasQuiz = Boolean(event.deepEventId ?? event.id);
      let bestScore = 0;
      let correctCount = 0;
      let questionTotal = QUESTIONS_PER_QUIZ;

      if (activeUser && key && hasQuiz) {
        const progress = getHistoryProgress(activeUser.id, key);
        bestScore = progress.bestScore ?? 0;

        let bestAttemptScore = -1;
        let bestAttemptNumber = -1;

        for (const attempt of progress.attempts) {
          const attemptTotalRaw = attempt.total ?? QUESTIONS_PER_QUIZ;
          const attemptTotal = Math.max(1, attemptTotalRaw);
          const attemptScore = attempt.score ?? Math.round((attempt.correct / attemptTotal) * 100);

          if (
            attemptScore > bestAttemptScore
            || (attemptScore === bestAttemptScore && attempt.attemptNumber > bestAttemptNumber)
          ) {
            bestAttemptScore = attemptScore;
            bestAttemptNumber = attempt.attemptNumber;
            correctCount = attempt.correct;
            questionTotal = attemptTotal;
          }
        }
      }

      if (!hasQuiz) {
        correctCount = 0;
        questionTotal = QUESTIONS_PER_QUIZ;
      }
      const locked = isSequencedPhase && index > 0 && !previousSatisfied;

      if (isSequencedPhase) {
        const baselineSatisfied = !hasQuiz ? true : Boolean(activeUser && bestScore >= PASSING_SCORE);
        previousSatisfied = previousSatisfied && baselineSatisfied;
      }

      return {
        event,
        index,
        key,
        bestScore,
        hasQuiz,
        locked,
        correctCount,
        questionTotal,
      };
    });
  }, [activePhase, activeUser?.id, isSequencedPhase, phase.events]);

  const hasLockedEvents = isSequencedPhase && eventsState.some((state) => state.locked);
  const nextLockedState = hasLockedEvents ? eventsState.find((state) => state.locked) : undefined;

  const phaseLockMessage = useMemo(() => {
    if (!isSequencedPhase || !hasLockedEvents || !nextLockedState) {
      return null;
    }

    const previousEvent = eventsState[nextLockedState.index - 1]?.event;
    const prerequisiteTitle = previousEvent?.headline ?? previousEvent?.date ?? 'cột mốc trước';
    const lockedTitle = nextLockedState.event.headline ?? 'cột mốc tiếp theo';

    const requiredCorrect = Math.ceil(PASSING_SCORE / POINTS_PER_QUESTION);

    if (!activeUser) {
      return `Đăng nhập và hoàn thành quiz "${prerequisiteTitle}" với tối thiểu ${requiredCorrect}/${QUESTIONS_PER_QUIZ} câu đúng (≥ ${PASSING_SCORE}%) để mở khóa "${lockedTitle}".`;
    }

    return `Hoàn thành quiz "${prerequisiteTitle}" với tối thiểu ${requiredCorrect}/${QUESTIONS_PER_QUIZ} câu đúng (≥ ${PASSING_SCORE}%) để mở khóa "${lockedTitle}".`;
  }, [activeUser, eventsState, hasLockedEvents, isSequencedPhase, nextLockedState]);

  return (
    <div className="min-h-screen bg-brand-base pt-0">
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: phase.heroImage,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up px-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-3">{phase.label.toUpperCase()}</h1>
            <p className="text-lg md:text-xl text-brand-sand font-serif italic">{phase.period} · Dòng chảy lịch sử dân tộc</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {phaseOrder.map((key) => {
            const item = phases[key];
            const isActive = key === activePhase;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPhase(key)}
                className={`px-6 md:px-8 py-3 md:py-4 rounded-sm border transition-all duration-300 font-serif text-lg ${
                  isActive
                    ? 'bg-brand-blue text-white border-brand-blue shadow-brand'
                    : 'bg-white text-brand-blue border-brand-blue/40 hover:border-brand-blue hover:bg-brand-sand'
                }`}
              >
                <div>{item.label}</div>
                <div className="text-xs md:text-sm font-sans tracking-[0.35em] uppercase text-brand-sand mt-1">{item.period}</div>
              </button>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-brand-muted leading-relaxed">{phase.summary}</p>
        </div>

        {phaseLockMessage && (
          <div className="max-w-4xl mx-auto mb-10 border border-brand-blue/20 bg-brand-sand/40 text-brand-blue rounded-sm px-4 py-3 text-sm">
            {phaseLockMessage}
          </div>
        )}

        {phase.featureVideo && phase.featureVideo.type === 'video' && (
          <div className="max-w-4xl mx-auto mb-16 shadow-soft border border-brand-blue/20 bg-white">
            <div className="aspect-video">
              <iframe
                title={phase.featureVideo.title}
                src={phase.featureVideo.src}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4 text-sm text-brand-muted">
              <div className="font-semibold text-brand-text">{phase.featureVideo.title}</div>
              <p className="mt-1">{phase.featureVideo.caption}</p>
              <p className="mt-2 italic">{phase.featureVideo.credit}</p>
            </div>
          </div>
        )}

        <div className="relative max-w-5xl mx-auto">
          <span className="absolute left-4 md:left-6 top-0 bottom-0 border-l border-brand-blue/20" />
          <div className="space-y-12">
            {eventsState.map(({ event, index, locked, hasQuiz, bestScore, correctCount, questionTotal }) => {
              const previousEventTitle = index > 0 ? phase.events[index - 1]?.headline : undefined;
              const prerequisiteTitle = previousEventTitle ?? 'cột mốc trước';
              const lockTooltip = locked
                ? activeUser
                  ? `Hoàn thành quiz "${prerequisiteTitle}" với tối thiểu ${Math.ceil(PASSING_SCORE / POINTS_PER_QUESTION)}/${QUESTIONS_PER_QUIZ} câu đúng (≥ ${PASSING_SCORE}%) để mở khóa.`
                  : 'Đăng nhập và hoàn thành quiz trước đó để mở khóa cột mốc tiếp theo.'
                : undefined;
              const showUnlockHint = isSequencedPhase && hasQuiz && index === 0 && hasLockedEvents;
              const unlockHintMessage = activePhase === 'antiFrench'
                ? `Sự kiện mở đầu luôn khả dụng để bạn ôn luyện và đạt ít nhất ${Math.ceil(PASSING_SCORE / POINTS_PER_QUESTION)}/${QUESTIONS_PER_QUIZ} câu đúng (tương đương ${PASSING_SCORE}%), từ đó mở khóa các cột mốc tiếp theo của kháng chiến chống Pháp.`
                : `Sự kiện mở đầu luôn khả dụng để bạn ôn luyện và đạt ít nhất ${Math.ceil(PASSING_SCORE / POINTS_PER_QUESTION)}/${QUESTIONS_PER_QUIZ} câu đúng (tương đương ${PASSING_SCORE}%), từ đó mở khóa các cột mốc tiếp theo của giai đoạn kháng chiến chống Mỹ.`;
              const completed = hasQuiz && bestScore >= PASSING_SCORE;

              return (
                <div key={event.date + event.headline} className="relative pl-12 md:pl-16 scroll-animate">
                  <span className="absolute left-[0.9rem] md:left-[1.35rem] top-4 w-4 h-4 rounded-full bg-brand-blue shadow-brand" />
                  <div className="bg-white border border-brand-blue/15 shadow-soft hover:shadow-medium transition-shadow duration-300 p-6 md:p-8">
                    <div className="flex flex-col gap-4 md:gap-6">
                      <div className="flex flex-wrap items-center gap-3 text-brand-blue uppercase tracking-[0.35em] text-xs">
                        <span>{event.date}</span>
                        {event.location && <span className="hidden md:inline-block w-8 border-t border-brand-blue/30" />}
                        {event.location && <span className="tracking-[0.2em]">{event.location}</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-serif text-brand-text leading-tight">{event.headline}</h2>
                        {completed && (
                          <span
                            className="inline-flex items-center gap-3 rounded-full bg-brand-blue px-5 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-white shadow-[0_12px_30px_-16px_rgba(15,82,186,0.65)]"
                            title={`Bạn đã hoàn thành ${correctCount}/${questionTotal} câu trong quiz này`}
                          >
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white shadow-inner">
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 1.5l2.47 5.01 5.53.8-4 3.89.94 5.5L10 13.87l-4.94 2.83.94-5.5-4-3.89 5.53-.8L10 1.5z" />
                              </svg>
                            </span>
                            <span>Đã mở khóa</span>
                            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-[2px] text-[0.65rem] font-semibold uppercase text-white/90">{correctCount}/{questionTotal} câu</span>
                          </span>
                        )}
                      </div>
                      <p className="text-brand-muted leading-relaxed">{event.description}</p>
                      {event.keyMoments && (
                        <ul className="list-disc pl-5 space-y-1 text-sm text-brand-muted">
                          {event.keyMoments.map((moment) => (
                            <li key={moment}>{moment}</li>
                          ))}
                        </ul>
                      )}
                      {event.artworks && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {event.artworks.map((art) => (
                            <div key={art.src} className="bg-brand-sand/30 border border-brand-blue/10 p-3">
                              <div className="h-48 overflow-hidden">
                                <img src={art.src} alt={art.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="mt-3">
                                <div className="text-sm font-serif text-brand-text">{art.title}</div>
                                <p className="text-xs text-brand-muted mt-1">{art.caption}</p>
                                <p className="text-xs text-brand-muted italic mt-1">{art.credit}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {event.sources && (
                        <div className="border-l-2 border-brand-blue/40 pl-4 text-xs text-brand-muted">
                          <div className="uppercase tracking-[0.4em] text-brand-blue mb-1">Nguồn</div>
                          <ul className="list-disc pl-4 space-y-1">
                            {event.sources.map((source) => (
                              <li key={source}>{source}</li>
                            ))}
                          </ul>
                          {showUnlockHint && (
                            <div className="mt-3 text-brand-blue text-xs">
                              {unlockHintMessage}
                            </div>
                          )}
                          <button
                            type="button"
                            disabled={locked}
                            onClick={() => {
                              if (locked) {
                                if (typeof window !== 'undefined') {
                                  window.alert(lockTooltip ?? phaseLockMessage ?? 'Hoàn thành cột mốc trước để mở khóa.');
                                }
                                return;
                              }

                              const deepEventId = event.deepEventId ?? event.id;
                              const search = deepEventId ? `?id=${deepEventId}` : '';
                              const targetPath = `/event/detail${search}`;
                              const currentUser = getActiveUser();

                              if (!currentUser) {
                                if (typeof window !== 'undefined') {
                                  window.sessionStorage.setItem(
                                    'afterLogin',
                                    JSON.stringify({ page: targetPath.replace(/^\//, '') })
                                  );
                                  window.sessionStorage.setItem('lastVisitedPath', targetPath);
                                }
                                navigate('/login', {
                                  state: { from: targetPath },
                                });
                                return;
                              }

                              const params = new URLSearchParams(searchParams.toString());
                              const eraParam = eraFromPhase[activePhase];
                              params.set('era', eraParam);
                              params.set('phase', activePhase);
                              if (deepEventId) {
                                params.set('eventId', deepEventId);
                              } else {
                                params.delete('eventId');
                              }

                              const paramsString = params.toString();

                              navigate(targetPath, {
                                state: {
                                  event,
                                  phase: phase.label,
                                  returnTo: paramsString ? `/history?${paramsString}` : '/history',
                                },
                              });
                            }}
                            className={`mt-4 inline-flex items-center gap-2 rounded-sm border px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 ${locked
                              ? 'cursor-not-allowed border-dashed border-brand-blue/30 bg-white/40 text-brand-blue/40'
                              : 'border-brand-blue bg-white text-brand-blue hover:bg-brand-blue hover:text-white'}`}
                            title={locked ? lockTooltip ?? phaseLockMessage ?? undefined : undefined}
                          >
                            {locked ? (
                              <>
                                <svg
                                  aria-hidden="true"
                                  focusable="false"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M5 8a5 5 0 1110 0v1h.5A1.5 1.5 0 0117 10.5v6A1.5 1.5 0 0115.5 18h-11A1.5 1.5 0 013 16.5v-6A1.5 1.5 0 014.5 9H5V8zm2 0v1h6V8a3 3 0 00-6 0zm3 3a1 1 0 00-.5 1.874V15a.5.5 0 001 0v-2.126A1 1 0 0010 11z" />
                                </svg>
                                <span>Đã khóa</span>
                              </>
                            ) : (
                              <>
                                <span>Xem chi tiết</span>
                                <svg
                                  aria-hidden="true"
                                  focusable="false"
                                  className="h-3.5 w-3.5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M7.293 4.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 11H6a1 1 0 110-2h5.586L7.293 5.707a1 1 0 010-1.414z" />
                                </svg>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {phase.gallery && (
          <div className="mt-16">
            <h3 className="text-center text-xl md:text-2xl font-serif text-brand-text mb-6">Tư liệu khác</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {phase.gallery.map((item) => (
                <div key={item.src} className="bg-white border border-brand-blue/15 shadow-soft p-4">
                  <div className="h-56 overflow-hidden">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-4">
                    <div className="font-serif text-brand-text text-lg">{item.title}</div>
                    <p className="text-brand-muted text-sm mt-1">{item.caption}</p>
                    <p className="text-brand-muted text-xs italic mt-1">{item.credit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 bg-brand-blue/10 border border-brand-blue/20 p-6 md:p-8">
          <h3 className="text-center text-sm md:text-base text-brand-muted uppercase tracking-[0.35em]">{phase.reference}</h3>
        </div>
      </div>
    </div>
  );
}
