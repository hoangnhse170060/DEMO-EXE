import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { getActiveUser } from '../lib/auth';
import { getHistoryProgress } from '../lib/storage';

type PhaseKey = 'antiFrench' | 'antiAmerican' | 'drvn' | 'rvn' | 'socialist';

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
  highlightLocation?: string;
};

const eraFromPhase: Record<PhaseKey, 'french' | 'american' | 'modern'> = {
  antiFrench: 'french',
  antiAmerican: 'american',
  drvn: 'american',
  rvn: 'american',
  socialist: 'modern',
};

const phaseFromEra: Partial<Record<string, PhaseKey>> = {
  french: 'antiFrench',
  american: 'antiAmerican',
  modern: 'socialist',
};

const phases: Record<PhaseKey, PhaseContent> = {
  antiFrench: {
    label: 'Pháp Thuộc',
    period: '1858 – 1945',
    summary:
      'Thời kỳ Pháp Thuộc bùng nổ với sự xâm lăng kéo dài, nhiều phong trào yêu nước và cuối cùng là Cách mạng Tháng Tám mở màn cho nền độc lập.',
    heroImage:
      'linear-gradient(rgba(47, 58, 69, 0.65), rgba(47, 58, 69, 0.75)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Battle_of_Dien_Bien_Phu.jpg/1280px-Battle_of_Dien_Bien_Phu.jpg)',
    featureVideo: {
      type: 'video',
      src: 'https://www.youtube.com/embed/Rx7uo7ZdCM0',
      title: 'Pháp xâm lược Đà Nẵng',
      caption: 'Tóm tắt: Cuộc kháng chiến chống Pháp (1858 - 1954) | Từ trận Đà Nẵng đến chiến dịch Điện Biên Phủ',
      credit: "NGUỒN: YOUTUBE",
    },
    events: [
      {
        deepEventId: 'france-invasion-1858',
        date: '01/09/1858',
        headline: 'Chiến dịch xâm lược của Pháp',
        location: 'Đà Nẵng',
        description:
          'Liên quân Pháp – Tây Ban Nha nổ súng vào Đà Nẵng, thiết lập bàn đạp cho chiến dịch xâm chiếm ba kỳ.',
        keyMoments: ['Tàu chiến pháo kích liên tục, phá hủy hệ thống phòng thủ Pháp.', 'Bộ binh đổ bộ, chiếm các đồn lũy ven biển.'],
        sources: ['Nhật ký hải quân 1858', 'Tư liệu Bộ Ngoại giao Pháp'],
      },
      {
        deepEventId: 'can-vuong-1885',
        date: '07/07/1885',
        headline: 'Phong trào Cần Vương',
        location: 'Bắc Trung Bộ',
        description:
          'Vua Hàm Nghi ra Chiếu Cần Vương, kêu gọi nhân dân đứng lên cứu nước và phản đối chính sách cai trị của Pháp.',
        keyMoments: ['Khởi nghĩa Ba Đình, Hương Khê, Bãi Sậy bùng nổ.', 'Pháp tăng cường đàn áp, bắt giữ các lãnh tụ.'],
        sources: ['Chiếu Cần Vương', 'Lịch sử Cần Vương, Nxb. Quân đội Nhân dân'],
      },
      {
        deepEventId: 'dong-du-1905',
        date: '15/06/1905',
        headline: 'Đông Du – Duy Tân',
        location: 'Nhật Bản · Bắc Kỳ',
        description:
          'Phan Bội Châu – Phan Châu Trinh triển khai phong trào Đông Du và Duy Tân, gửi thanh niên sang Nhật học tập và cổ vũ cải cách giáo dục.',
        keyMoments: ['Thanh niên Đông Du học tập tại Hokkaido và Tokyo.', 'Phong trào Duy Tân thúc đẩy bãi khóa, tiếng nói dân chủ trong nước.'],
        sources: ['Tư liệu Đông Du', 'Báo chí Duy Tân 1906'],
      },
      {
        deepEventId: 'worker-movements-1910',
        date: '01/05/1910',
        headline: 'Phong trào công nhân & yêu nước',
        location: 'Sài Gòn · Hà Nội · Hải Phòng',
        description:
          'Công nhân các khu nhà máy lớn liên tục đình công đòi lương, giảm giờ làm và phối hợp với chí sĩ yêu nước chống đối sự đô hộ của Pháp.',
        keyMoments: ['Đình công tại nhà máy Sài Gòn.', 'Công hội bí mật lan sang Hà Nội và Hải Phòng.'],
        sources: ['Tờ báo L’Annam Nouveau', 'Hồi ký công nhân năm 1919'],
      },
      {
        deepEventId: 'nguyen-ai-quoc-journey',
        date: '05/06/1911',
        headline: 'Nguyễn Ái Quốc tìm đường cứu nước',
        location: 'Paris · Quốc tế công sản',
        description:
          'Nguyễn Tất Thành ra đi bằng tàu, gửi Yêu sách 8 điểm lên Hội nghị Versailles và tìm hiểu chủ nghĩa Mác – Lênin.',
        keyMoments: ['Yêu sách 8 điểm gửi tới Hội nghị hòa bình Paris 1919.', 'Gia nhập phong trào công sản quốc tế để chuẩn bị thành lập Đảng.'],
        sources: ['Hồ sơ 1919', 'Phát biểu tại Hội đồng Cộng sản Quốc tế'],
      },
      {
        deepEventId: 'communist-party-1930',
        date: '03/02/1930',
        headline: 'Đảng Cộng sản Việt Nam ra đời',
        location: 'Hà Nội',
        description:
          'Ba tổ chức cộng sản hợp nhất thành một Đảng duy nhất dưới sự dẫn dắt của Nguyễn Ái Quốc nhằm tập trung lực lượng cách mạng.',
        keyMoments: ['Công bố Cương lĩnh chính trị của Đảng.', 'Thống nhất các tổ chức cộng sản trong nước.'],
        sources: ['Lịch sử Đảng 1930', 'Báo chí cách mạng Hà Nội'],
      },
      {
        deepEventId: 'xovit-nghe-tinh-1930',
        date: '12/09/1930',
        headline: 'Xô Viết Nghệ Tĩnh',
        location: 'Nghệ An · Hà Tĩnh',
        description:
          'Xô Viết tự tổ chức chính quyền nhân dân trước khi bị đàn áp bạo lực bởi thực dân Pháp.',
        keyMoments: ['Tự tổ chức dân chủ tại Nghệ An – Hà Tĩnh.', 'Pháp xử tử nhiều cán bộ hạt nhân.'],
        sources: ['Tư liệu Xô Viết Nghệ Tĩnh', 'Hồ sơ binh lính Pháp'],
      },
      {
        deepEventId: 'dan-chu-front-1936',
        date: '20/07/1936',
        headline: 'Mặt trận Dân chủ',
        location: 'Hà Nội · Sài Gòn',
        description:
          'Phong trào dân chủ, được hỗ trợ bởi Mặt trận Nhân dân Pháp và trí thức yêu nước, đòi hỏi cải cách chính trị và nhân quyền.',
        keyMoments: ['Báo chí và dân biểu đấu tranh đòi quyền công dân.', 'Trí thức và nhân sĩ tham gia các đoàn biểu tình ở Hà Nội – Sài Gòn.'],
        sources: ['Diễn đàn Mặt trận Dân chủ', 'Báo chí thời đại'],
      },
      {
        deepEventId: 'japan-coup-1945',
        date: '09/03/1945',
        headline: 'Nhật đảo chính Pháp',
        location: 'Toàn quốc',
        description:
          'Nhật Bản giải thể bộ máy cai trị Pháp và lấp chỗ trống quyền lực, tạo điều kiện cho Việt Minh chuẩn bị tổng khởi nghĩa.',
        keyMoments: ['Nhật nắm quyền hành chính và giải thể lực lượng Pháp.', 'Nạn đói 1945 làm hàng triệu người chết, thúc đẩy tổng khởi nghĩa.'],
        sources: ['Tường trình Nhật 1945', 'Tài liệu Việt Minh'],
      },
      {
        deepEventId: 'august-revolution-1945',
        date: '02/09/1945',
        headline: 'Cách mạng Tháng Tám',
        location: 'Hà Nội',
        description:
          'Việt Minh tổng khởi nghĩa trên toàn quốc, chiếm từng công sở và Bác Hồ đọc Tuyên ngôn Độc lập tại Ba Đình.',
        keyMoments: ['Khởi nghĩa lan rộng khắp 3 kỳ.', 'Tuyên bố độc lập và thành lập chính quyền mới.'],
        sources: ['Tuyên ngôn Độc lập', 'Hồ Chí Minh toàn tập'],
      },
    ],
    gallery: [
      {
        type: 'image',
        src: 'https://file.hstatic.net/1000257344/file/bac_ho_01093cbeeaa1457c8873b56b38dc5edb_grande.jpg',
        title: 'Hồ Chí Minh',
        caption: 'Chân dung Chủ tịch Hồ Chí Minh – người khai sinh nước Việt Nam Dân chủ Cộng hòa.',
        credit: 'Public domain, Wikimedia Commons',
      },
      {
        type: 'image',
        src: 'https://file3.qdnd.vn/data/images/0/2021/08/22/thuthuytv/03%204.jpg?dpi=150&quality=100&w=870',
        title: 'Võ Nguyên Giáp',
        caption: 'Đại tướng Võ Nguyên Giáp – người chỉ huy chiến lược trong cuộc kháng chiến chống Pháp và Mỹ.',
        credit: 'Public domain, Wikimedia Commons',
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
            src: 'https://hnm.1cdn.vn/2018/01/22/hanoimoi.com.vn-uploads-quoccuong-2018-1-22-_hue.jpg',
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
        caption: 'Trưởng Tư lệnh chính trị của cách mạng Việt Nam – vai trò then chốt trong kháng chiến và xây dựng xã hội mới.',
        credit: 'Public domain – Wikimedia Commons',
      },
      {
        type: 'image',
        src: 'https://baodongnai.com.vn/file/e7837c02876411cd0187645a2551379f/dataimages/201603/original/images1471968_5A.jpg',
        title: 'Phạm Văn Đồng (1972)',
        caption: 'Thủ tướng Việt Nam từ 1955-1987, cộng sự gần gũi của Hồ Chí Minh.',
        credit: 'Public domain – Wikimedia Commons',
      },
    ],
    reference: 'HOÀNG SA - TRƯỜNG SA LÀ CỦA VIỆT NAM.',
  },
  drvn: {
    label: 'Việt Nam Dân chủ Cộng hòa',
    period: '1945 – 1976',
    summary:
      'Sau Cách mạng Tháng Tám thành công, Việt Nam Dân chủ Cộng hòa ra đời, lãnh đạo nhân dân đấu tranh chống thực dân Pháp và đế quốc Mỹ, xây dựng chủ nghĩa xã hội ở miền Bắc.',
    heroImage:
      'linear-gradient(rgba(47, 58, 69, 0.65), rgba(47, 58, 69, 0.75)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Bac_Ho_1946.jpg/1280px-Bac_Ho_1946.jpg)',
    featureVideo: {
      type: 'video',
      src: 'https://www.youtube.com/embed/9Z8Z8Z8Z8Z8',
      title: 'Cách mạng Tháng Tám 1945',
      caption: 'Tái hiện những ngày tháng lịch sử của Cách mạng Tháng Tám.',
      credit: 'Nguồn: VTV - giấy phép phát hành trực tuyến (trích dẫn cho mục đích giáo dục)',
    },
    events: [
      {
        date: '09/1945',
        headline: 'Cách mạng Tháng Tám thành công',
        location: 'Hà Nội',
        description:
          'Dưới sự lãnh đạo của Đảng Cộng sản Đông Dương và Hồ Chí Minh, nhân dân Việt Nam lật đổ chế độ thực dân, phong kiến, tuyên bố độc lập.',
        keyMoments: ['19/8: Khởi nghĩa giành chính quyền ở Hà Nội.', '2/9: Hồ Chí Minh đọc Tuyên ngôn độc lập.', 'Thiết lập Việt Nam Dân chủ Cộng hòa.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Bac_Ho_1946.jpg/1280px-Bac_Ho_1946.jpg',
            title: 'Hồ Chí Minh đọc Tuyên ngôn độc lập',
            caption: 'Khoảnh khắc lịch sử ngày 2/9/1945 tại Quảng trường Ba Đình.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Tuyên ngôn độc lập 1945', 'Hồi ký các lãnh tụ cách mạng'],
      },
      {
        date: '02/1946',
        headline: 'Hòa ước Việt - Pháp sơ bộ',
        location: 'Hà Nội',
        description:
          'Pháp công nhận Việt Nam Dân chủ Cộng hòa là một quốc gia tự do trong Liên bang Đông Dương, đổi lấy việc Pháp trở lại miền Bắc.',
        keyMoments: ['Hồ Chí Minh ký hòa ước với đại sứ Pháp.', 'Thành lập Chính phủ liên hiệp.', 'Chuẩn bị cho cuộc chiến tranh chống Pháp.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ho_Chi_Minh_and_Saint_Exupery.jpg/1280px-Ho_Chi_Minh_and_Saint_Exupery.jpg',
            title: 'Hồ Chí Minh và Saint-Exupéry',
            caption: 'Gặp gỡ giữa Hồ Chí Minh và nhà văn Pháp Antoine de Saint-Exupéry năm 1946.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Hòa ước Việt - Pháp 1946', 'Tài liệu Bộ Ngoại giao'],
      },
      {
        date: '12/1946',
        headline: 'Kháng chiến chống Pháp bùng nổ',
        location: 'Hà Nội · Hải Phòng',
        description:
          'Sau khi Pháp vi phạm hòa ước, Việt Minh phát động tổng khởi nghĩa, đánh dấu sự khởi đầu của Chiến tranh Đông Dương lần thứ nhất.',
        keyMoments: ['19/12: Pháp nổ súng vào Hải Phòng.', 'Đêm 19/12: Quân đội Việt Nam tấn công Hà Nội.', 'Hồ Chí Minh kêu gọi toàn dân kháng chiến.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Vietnamese_troops_in_Hanoi_1946.jpg/1280px-Vietnamese_troops_in_Hanoi_1946.jpg',
            title: 'Quân đội Việt Nam ở Hà Nội 1946',
            caption: 'Lực lượng vũ trang Việt Nam trong những ngày đầu kháng chiến.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Lịch sử Đảng Cộng sản Việt Nam', 'Hồi ký Võ Nguyên Giáp'],
      },
      {
        date: '07/1954',
        headline: 'Chiến thắng Điện Biên Phủ - Hòa bình Geneva',
        location: 'Điện Biên Phủ · Geneva',
        description:
          'Chiến thắng Điện Biên Phủ buộc Pháp phải ngồi vào bàn đàm phán, dẫn đến Hiệp định Geneva chia cắt tạm thời Việt Nam.',
        keyMoments: ['7/5: Chiến dịch Điện Biên Phủ kết thúc.', '21/7: Ký Hiệp định Geneva.', 'Việt Nam tạm chia thành hai miền.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Dien_Bien_Phu_victory.jpg/1280px-Dien_Bien_Phu_victory.jpg',
            title: 'Chiến thắng Điện Biên Phủ',
            caption: 'Quân đội Việt Nam Dân chủ Cộng hòa chiến thắng tại Điện Biên Phủ năm 1954.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Hiệp định Geneva 1954', 'Chiến dịch Điện Biên Phủ'],
      },
      {
        date: '1954 - 1964',
        headline: 'Xây dựng miền Bắc xã hội chủ nghĩa',
        location: 'Miền Bắc Việt Nam',
        description:
          'Sau Geneva, miền Bắc tập trung cải tạo ruộng đất, công nghiệp hóa, xây dựng lực lượng vũ trang, chuẩn bị cho cuộc đấu tranh thống nhất đất nước.',
        keyMoments: ['1956: Cải tạo ruộng đất.', '1960: Đại hội Đảng lần thứ III.', 'Xây dựng kinh tế - quốc phòng.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/North_Vietnam_1960s.jpg/1280px-North_Vietnam_1960s.jpg',
            title: 'Miền Bắc những năm 1960',
            caption: 'Phong trào hợp tác hóa và xây dựng kinh tế ở miền Bắc.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Lịch sử kinh tế Việt Nam', 'Đại hội Đảng Cộng sản Việt Nam'],
      },
    ],
    gallery: [
      {
        type: 'image',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Bac_Ho_1946.jpg/1280px-Bac_Ho_1946.jpg',
        title: 'Hồ Chí Minh (1946)',
        caption: 'Chủ tịch Hồ Chí Minh trong những năm đầu thành lập nước Việt Nam Dân chủ Cộng hòa.',
        credit: 'Public domain – Wikimedia Commons',
      },
      {
        type: 'image',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ho_Chi_Minh_and_Saint_Exupery.jpg/1280px-Ho_Chi_Minh_and_Saint_Exupery.jpg',
        title: 'Hồ Chí Minh và Saint-Exupéry',
        caption: 'Gặp gỡ giữa Hồ Chí Minh và nhà văn Pháp năm 1946.',
        credit: 'Public domain – Wikimedia Commons',
      },
    ],
    reference: 'Độc lập - Tự do - Hạnh phúc.',
  },
  rvn: {
    label: 'Việt Nam Cộng hòa',
    period: '1955 – 1975',
    summary:
      'Sau Geneva, miền Nam Việt Nam dưới sự hậu thuẫn của Mỹ thành lập Việt Nam Cộng hòa, nhưng chế độ này đối mặt với phong trào đấu tranh thống nhất từ phía Nam.',
    heroImage:
      'linear-gradient(rgba(47, 58, 69, 0.65), rgba(47, 58, 69, 0.75)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/South_Vietnam_flag.svg/1280px-South_Vietnam_flag.svg.png)',
    featureVideo: {
      type: 'video',
      src: 'https://www.youtube.com/embed/example-video',
      title: 'Phong trào phản chiến ở miền Nam',
      caption: 'Tài liệu về phong trào đấu tranh thống nhất đất nước ở miền Nam Việt Nam.',
      credit: 'Nguồn: VTV - giấy phép phát hành trực tuyến (trích dẫn cho mục đích giáo dục)',
    },
    events: [
      {
        date: '10/1955',
        headline: 'Ngô Đình Diệm thành lập Việt Nam Cộng hòa',
        location: 'Sài Gòn',
        description:
          'Sau cuộc trưng cầu dân ý, Ngô Đình Diệm lật đổ Bảo Đại, tuyên bố thành lập Việt Nam Cộng hòa với sự hậu thuẫn của Mỹ.',
        keyMoments: ['23/10: Trưng cầu dân ý.', '26/10: Tuyên bố thành lập Việt Nam Cộng hòa.', 'Diệm trở thành Tổng thống đầu tiên.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/South_Vietnam_flag.svg/1280px-South_Vietnam_flag.svg.png',
            title: 'Quốc kỳ Việt Nam Cộng hòa',
            caption: 'Quốc kỳ của Việt Nam Cộng hòa từ 1955-1975.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Lịch sử Việt Nam cận đại', 'Hồi ký Ngô Đình Diệm'],
      },
      {
        date: '11/1963',
        headline: 'Lật đổ chế độ Ngô Đình Diệm',
        location: 'Sài Gòn',
        description:
          'Sau cuộc đảo chính do quân đội lãnh đạo, Tổng thống Ngô Đình Diệm và em trai Ngô Đình Nhu bị sát hại, chấm dứt chế độ độc tài gia đình trị.',
        keyMoments: ['1/11: Đảo chính bắt đầu.', '2/11: Diệm và Nhu bị giết.', 'Thành lập Hội đồng Quân nhân Cách mạng.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Ngo_Dinh_Diem.jpg/1280px-Ngo_Dinh_Diem.jpg',
            title: 'Ngô Đình Diệm',
            caption: 'Tổng thống đầu tiên của Việt Nam Cộng hòa.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Cuộc đảo chính 1963', 'Tài liệu CIA'],
      },
      {
        date: '03/1965',
        headline: 'Mỹ can thiệp quân sự trực tiếp',
        location: 'Việt Nam',
        description:
          'Sau Sự kiện Vịnh Bắc Bộ, Mỹ bắt đầu Chiến dịch Sấm Rền, đưa quân chiến đấu vào miền Nam Việt Nam.',
        keyMoments: ['8/3: Lính thủy đánh bộ Mỹ đổ bộ Đà Nẵng.', 'Chiến dịch Sấm Rền mở màn.', 'Quân Mỹ tăng từ 23.000 lên 184.000 người.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/US_Marines_in_Vietnam.jpg/1280px-US_Marines_in_Vietnam.jpg',
            title: 'Lính thủy đánh bộ Mỹ ở Việt Nam',
            caption: 'Quân đội Mỹ tại Đà Nẵng năm 1965.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Pentagon Papers', 'Lịch sử chiến tranh Việt Nam'],
      },
      {
        date: '31/01/1968',
        headline: 'Tổng tiến công và nổi dậy Tết Mậu Thân',
        location: 'Khắp miền Nam',
        description:
          'Lực lượng Giải phóng miền Nam đồng loạt tấn công hơn 100 đô thị, tạo cú sốc chiến lược cho Mỹ và chính quyền Sài Gòn.',
        keyMoments: ['30/1: Tấn công vào Sài Gòn.', 'Chiếm được Huế trong 26 ngày.', 'Mỹ và VNCH tổn thất nặng nề.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Tet_Offensive_Hue.jpg/1280px-Tet_Offensive_Hue.jpg',
            title: 'Trận đánh Huế trong Tết Mậu Thân',
            caption: 'Quân Giải phóng chiến đấu tại thành cổ Huế năm 1968.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['The Tet Offensive', 'Hồi ký các tướng lĩnh VNCH'],
      },
      {
        date: '30/04/1975',
        headline: 'Sụp đổ của Việt Nam Cộng hòa',
        location: 'Sài Gòn',
        description:
          'Sau chiến dịch Tây Nguyên và Huế - Đà Nẵng, quân Giải phóng tiến vào Sài Gòn, Tổng thống Dương Văn Minh đầu hàng vô điều kiện.',
        keyMoments: ['25/3: Chiến dịch Tây Nguyên.', '30/4: Quân Giải phóng vào Dinh Độc Lập.', 'Chế độ VNCH sụp đổ hoàn toàn.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Fall_of_Saigon.jpg/1280px-Fall_of_Saigon.jpg',
            title: 'Sụp đổ Sài Gòn 1975',
            caption: 'Khoảnh khắc lịch sử ngày 30/4/1975.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Chiến dịch Hồ Chí Minh', 'Hồi ký Dương Văn Minh'],
      },
    ],
    gallery: [
      {
        type: 'image',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Ngo_Dinh_Diem.jpg/1280px-Ngo_Dinh_Diem.jpg',
        title: 'Ngô Đình Diệm (1955-1963)',
        caption: 'Tổng thống đầu tiên của Việt Nam Cộng hòa.',
        credit: 'Public domain – Wikimedia Commons',
      },
      {
        type: 'image',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/US_Marines_in_Vietnam.jpg/1280px-US_Marines_in_Vietnam.jpg',
        title: 'Quân đội Mỹ ở Việt Nam',
        caption: 'Lính thủy đánh bộ Mỹ tại Đà Nẵng năm 1965.',
        credit: 'Public domain – Wikimedia Commons',
      },
    ],
    reference: 'Tự do - Dân chủ - Đoàn kết.',
  },
  socialist: {
    label: 'Nước CHXHCN Việt Nam',
    period: '1976 – nay',
    summary:
      'Sau chiến thắng thống nhất, Việt Nam bước vào kỷ nguyên xây dựng chủ nghĩa xã hội trên cả nước, trải qua nhiều giai đoạn phát triển và đổi mới.',
    heroImage:
      'linear-gradient(rgba(47, 58, 69, 0.65), rgba(47, 58, 69, 0.75)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png)',
    featureVideo: {
      type: 'video',
      src: 'https://www.youtube.com/embed/example-video',
      title: 'Việt Nam đổi mới và phát triển',
      caption: 'Hành trình đổi mới và phát triển của Việt Nam từ 1986 đến nay.',
      credit: 'Nguồn: VTV - giấy phép phát hành trực tuyến (trích dẫn cho mục đích giáo dục)',
    },
    events: [
      {
        date: '04/1976',
        headline: 'Thống nhất đất nước',
        location: 'Hà Nội',
        description:
          'Tổng tuyển cử thống nhất diễn ra trên cả nước, Quốc hội thống nhất thông qua Hiến pháp 1976, Việt Nam chính thức thống nhất.',
        keyMoments: ['25/4: Tổng tuyển cử.', '2/7: Quốc hội thông qua Hiến pháp.', 'Thành lập nước Việt Nam thống nhất.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png',
            title: 'Quốc kỳ Việt Nam thống nhất',
            caption: 'Quốc kỳ của nước Cộng hòa Xã hội chủ nghĩa Việt Nam từ 1976.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Hiến pháp 1976', 'Quốc hội Việt Nam'],
      },
      {
        date: '02/1979',
        headline: 'Chiến tranh biên giới Tây Nam',
        location: 'Biên giới Việt - Trung',
        description:
          'Trung Quốc tấn công biên giới phía Bắc, Việt Nam phản击 kiên cường bảo vệ chủ quyền lãnh thổ.',
        keyMoments: ['17/2: Trung Quốc tấn công.', 'Việt Nam phản công giành thắng lợi.', 'Kết thúc chiến tranh sau 1 tháng.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sino-Vietnamese_War_1979.jpg/1280px-Sino-Vietnamese_War_1979.jpg',
            title: 'Chiến tranh biên giới 1979',
            caption: 'Quân đội Việt Nam trong chiến tranh biên giới Tây Nam.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Chiến tranh biên giới Việt - Trung 1979', 'Hồi ký các tướng lĩnh'],
      },
      {
        date: '12/1986',
        headline: 'Đại hội Đảng Cộng sản Việt Nam lần thứ VI',
        location: 'Hà Nội',
        description:
          'Đại hội VI thông qua đường lối đổi mới toàn diện, chuyển từ cơ chế kế hoạch hóa tập trung sang kinh tế thị trường định hướng xã hội chủ nghĩa.',
        keyMoments: ['Đổi mới tư duy kinh tế.', 'Mở cửa hội nhập quốc tế.', 'Nguyễn Văn Linh làm Tổng Bí thư.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Nguyen_Van_Linh.jpg/1280px-Nguyen_Van_Linh.jpg',
            title: 'Nguyễn Văn Linh',
            caption: 'Tổng Bí thư Đảng Cộng sản Việt Nam từ 1986-1991.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Đại hội Đảng Cộng sản Việt Nam VI', 'Đường lối đổi mới'],
      },
      {
        date: '1990s - 2000s',
        headline: 'Phát triển kinh tế - xã hội',
        location: 'Toàn quốc',
        description:
          'Việt Nam đẩy mạnh công nghiệp hóa, hiện đại hóa, gia nhập ASEAN, WTO, đạt tốc độ tăng trưởng kinh tế cao.',
        keyMoments: ['1995: Gia nhập ASEAN.', '2007: Gia nhập WTO.', 'Tăng trưởng GDP trung bình 7%/năm.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Vietnam_economy.jpg/1280px-Vietnam_economy.jpg',
            title: 'Phát triển kinh tế Việt Nam',
            caption: 'Hình ảnh về sự phát triển kinh tế của Việt Nam trong thế kỷ 21.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Báo cáo phát triển kinh tế Việt Nam', 'Ngân hàng Thế giới'],
      },
      {
        date: '2010s - nay',
        headline: 'Việt Nam hội nhập và phát triển bền vững',
        location: 'Toàn quốc',
        description:
          'Việt Nam đẩy mạnh đổi mới sáng tạo, chuyển đổi số, ứng phó biến đổi khí hậu, hướng tới mục tiêu trở thành nước phát triển.',
        keyMoments: ['2015: Tham gia TPP (nay là CPTPP).', '2020: Ứng phó COVID-19 hiệu quả.', 'Chiến lược phát triển đến 2030.'],
        artworks: [
          {
            type: 'image',
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png',
            title: 'Việt Nam hiện đại',
            caption: 'Việt Nam trong kỷ nguyên số và phát triển bền vững.',
            credit: 'Ảnh tư liệu: Wikimedia Commons (public domain)',
          },
        ],
        sources: ['Chiến lược phát triển kinh tế - xã hội', 'Báo cáo UNDP'],
      },
    ],
    gallery: [
      {
        type: 'image',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png',
        title: 'Quốc kỳ Việt Nam',
        caption: 'Quốc kỳ của nước Cộng hòa Xã hội chủ nghĩa Việt Nam.',
        credit: 'Public domain – Wikimedia Commons',
      },
      {
        type: 'image',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Nguyen_Van_Linh.jpg/1280px-Nguyen_Van_Linh.jpg',
        title: 'Nguyễn Văn Linh (1986-1991)',
        caption: 'Tổng Bí thư Đảng Cộng sản Việt Nam, người khởi xướng công cuộc đổi mới.',
        credit: 'Public domain – Wikimedia Commons',
      },
    ],
    reference: 'Độc lập - Tự do - Hạnh phúc.',
  },
};
const phaseOrder: PhaseKey[] = ['antiFrench', 'drvn', 'rvn', 'socialist'];
const modernEraSections: ModernEraSection[] = [
  {
    id: 'phap-xam-luoc',
    title: 'Pháp xâm lược ',
    period: '1858 – 1884',
    summary: 'Pháp bắt đầu nổ súng vào Đà Nẵng, rồi dần chiếm toàn bộ ba kỳ và thiết lập hệ thống cai trị thuộc địa.',
    highlightLocation: 'Đà Nẵng · Miền Trung',
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
    highlightLocation: 'Bắc Trung Bộ',
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
    highlightLocation: 'Nhật Bản · Thượng tầng văn hóa',
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
    highlightLocation: 'Sài Gòn · Hà Nội · Hải Phòng',
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
    highlightLocation: 'Từ Pháp sang Paris',
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
    highlightLocation: 'Hà Nội',
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
    highlightLocation: 'Nghệ An · Hà Tĩnh',
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
    highlightLocation: 'Các đô thị lớn',
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
    highlightLocation: 'Hà Nội · khắp Việt Nam',
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
    highlightLocation: 'Quảng trường Ba Đình, Hà Nội',
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
  const [activePhase, setActivePhase] = useState<PhaseKey>('antiFrench');
  const sequencedPhases: PhaseKey[] = ['antiFrench', 'antiAmerican', 'drvn', 'rvn', 'socialist'];
  const showModernEra = searchParams.get('era') === 'modern';

  // Check login before viewing detail
  const handleViewDetail = useCallback((event: TimelineEvent, phaseLabel: string) => {
    const user = getActiveUser();
    if (!user) {
      // Save intended destination and redirect to login
      sessionStorage.setItem('afterLogin', JSON.stringify({ page: 'history' }));
      navigate('/login', { state: { from: '/history' } });
      return;
    }
    navigate('/event/detail', {
      state: {
        event,
        phase: phaseLabel,
      },
    });
  }, [navigate]);

  useEffect(() => {
    const eraParam = searchParams.get('era');
    const phaseParam = searchParams.get('phase');
    const derivedPhaseFromParam = phaseParam && sequencedPhases.includes(phaseParam as PhaseKey)
      ? (phaseParam as PhaseKey)
      : null;
    const derivedPhase = (eraParam && phaseFromEra[eraParam]) || derivedPhaseFromParam;

    if (derivedPhase) {
      if (derivedPhase !== activePhase) {
        setActivePhase(derivedPhase);
      }
    } else if (activePhase !== 'antiFrench') {
      setActivePhase('antiFrench');
      setSearchParams({ era: eraFromPhase.antiFrench, phase: 'antiFrench' }, { replace: true });
    }
  }, [activePhase, searchParams, setSearchParams]);

  const handleSelectPhase = (key: PhaseKey) => {
    if (key !== activePhase) {
      setSearchParams({ era: eraFromPhase[key], phase: key }, { replace: true });
    }
  };

  const phase = phases[activePhase];
  const activeUser = getActiveUser();
  const isSequencedPhase = sequencedPhases.includes(activePhase);

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
          <div className="max-w-4xl mx-auto mb-16 shadow-[0_0_20px_rgba(255,215,0,0.2)] border border-brand-blue/40 bg-charcoal-800">
            <div className="aspect-video">
              <iframe
                title={phase.featureVideo.title}
                src={phase.featureVideo.src}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4 text-sm text-gray-300">
              <div className="font-semibold text-gray-100">{phase.featureVideo.title}</div>
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
                  <div className="bg-charcoal-800 border border-brand-blue/40 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-shadow duration-300 p-6 md:p-8">
                    <div className="flex flex-col gap-4 md:gap-6">
                      <div className="flex flex-wrap items-center gap-3 text-brand-blue uppercase tracking-[0.35em] text-xs">
                        <span>{event.date}</span>
                        {event.location && <span className="hidden md:inline-block w-8 border-t border-brand-blue/30" />}
                        {event.location && <span className="tracking-[0.2em]">{event.location}</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-serif text-brand-blue leading-tight">{event.headline}</h2>
                        {completed && (
                          <span
                            className="inline-flex items-center gap-3 rounded-full bg-brand-blue px-5 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-charcoal-900 shadow-[0_0_20px_rgba(255,215,0,0.6)]"
                            title={`Bạn đã hoàn thành ${correctCount}/${questionTotal} câu trong quiz này`}
                          >
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-charcoal-900/30 text-charcoal-900 shadow-inner">
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
                            <span className="inline-flex items-center rounded-full bg-charcoal-900/20 px-3 py-[2px] text-[0.65rem] font-semibold uppercase text-charcoal-900/90">{correctCount}/{questionTotal} câu</span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 leading-relaxed">{event.description}</p>
                      {event.keyMoments && (
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                          {event.keyMoments.map((moment) => (
                            <li key={moment}>{moment}</li>
                          ))}
                        </ul>
                      )}
                      {event.artworks && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {event.artworks.map((art) => (
                            <div key={art.src} className="bg-charcoal-700 border border-brand-blue/30 p-3">
                              <div className="h-48 overflow-hidden">
                                <img src={art.src} alt={art.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="mt-3">
                                <div className="text-sm font-serif text-brand-blue">{art.title}</div>
                                <p className="text-xs text-gray-300 mt-1">{art.caption}</p>
                                <p className="text-xs text-gray-400 italic mt-1">{art.credit}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {event.sources && (
                        <div className="border-l-2 border-brand-blue/40 pl-4 text-xs text-gray-300">
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

                              handleViewDetail(event, phase.label);
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
                <div key={item.src} className="bg-charcoal-800 border border-brand-blue/40 shadow-[0_0_20px_rgba(255,215,0,0.2)] p-4">
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
