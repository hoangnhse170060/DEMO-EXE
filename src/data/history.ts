// ==== Contracts ==============================================================
export type Era = {
  id: 'french' | 'american' | (string & {});
  name: string;
  years: [number, number];
  description: string;
  heroImage: { url: string; alt: string };
  color?: string;
};

export type MediaItem = {
  kind: 'image' | 'video' | 'document' | 'map';
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  source_url?: string;
  license?: 'public-domain' | 'cc' | 'editorial' | 'restricted';
  original_date?: string;
  location_label?: string;
  provenance?: 'primary' | 'official-archive' | 'newswire' | 'unknown';
  verification_score?: number; // 0..1
  subtitles?: string[];
  transcript?: string;
  lat?: number;
  lng?: number;
  label?: string;
};

export type ContentBlock =
  | { type: 'h2' | 'h3' | 'p' | 'quote'; text: string; secId: string; source?: string }
  | (MediaItem & { secId: string });

export type SubEvent = {
  id: string;
  parentId: string;
  order: number;
  date: string;
  title: string;
  leader?: string;
  opponent?: string;
  troopEstimates?: { us?: string; them?: string; note?: string };
  guestSummary: string;
  content: ContentBlock[];
  media?: MediaItem[];
  sources?: { title: string; link?: string }[];
  quizPoolIds: string[];
  nextId?: string | null;
};

export type HistoryEvent = {
  id: string;
  eraId: Era['id'];
  year: number;
  month?: number;
  date?: string;
  title: string;
  headline?: string;
  summary: string;
  tags?: string[];
  reliability?: 1 | 2 | 3 | 4 | 5;
  content: ContentBlock[];
  media?: MediaItem[];
  featuredImage?: { url: string; alt: string; credit?: string };
  subEvents: SubEvent[];
};

export type QuizQuestion = {
  id: string;
  subEventId: string;
  eventId: string;
  eraId: Era['id'];
  prompt: string;
  media?: {
    type: 'image' | 'video';
    src: string;
    alt: string;
    caption?: string;
    credit?: string;
    platform?: 'youtube' | 'local';
    poster?: string;
  };
  options: string[];
  answerIndex: number;
  explanation?: string;
  timePerQuestion?: number;
};

// ==== Seed Eras ==============================================================
export const eras: Era[] = [
  {
    id: 'french',
    name: 'Kháng chiến chống Pháp',
    years: [1858, 1954],
    description:
      'Từ buổi đầu thực dân tái xâm lược đến chiến thắng Việt Bắc và Điện Biên Phủ, phong trào kháng chiến toàn dân từng bước phá sản kế hoạch “đánh nhanh, thắng nhanh”.',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1524490992048-047a74a8343b?auto=format&fit=crop&w=1600&q=80',
      alt: 'Địa hình rừng núi Việt Bắc trong sương sớm',
    },
    color: '#2E86AB',
  },
  {
    id: 'american',
    name: 'Kháng chiến chống Mỹ',
    years: [1954, 1975],
    description:
      'Miền Bắc xây dựng hậu phương lớn, miền Nam đấu tranh chính trị và quân sự, tạo nên những chiến dịch quy mô làm lung lay ý chí xâm lược của Hoa Kỳ.',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
      alt: 'Đêm pháo sáng trên bầu trời Sài Gòn 1968',
    },
    color: '#B83280',
  },
];

// ==== Seed Events ============================================================
const VB_EVENT_ID = 'evt-1947-vietbac';
const DANANG_1858_EVENT_ID = 'evt-1858-danang';

const vietBac1947: HistoryEvent = {
  id: VB_EVENT_ID,
  eraId: 'french',
  year: 1947,
  month: 10,
  date: '1947-10-07',
  title: 'Chiến dịch Việt Bắc – Thu Đông 1947',
  headline: 'Bước ngoặt phản công, đánh bại cuộc tiến công chiến lược của Pháp vào căn cứ địa Việt Bắc.',
  summary:
    "Chiến dịch phản công đầu tiên của QĐNDVN, đánh bại cuộc tiến công chiến lược của Pháp lên căn cứ Việt Bắc, làm phá sản kế hoạch 'đánh nhanh, thắng nhanh'.",
  reliability: 5,
  tags: ['campaign', 'viet-bac', 'guerrilla', 'art-of-war'],
  content: [{ type: 'p', secId: 'intro', text: 'Tổng quan chiến dịch và ý nghĩa chiến lược…' }],
  featuredImage: {
    url: '/media/1947/vietbac-1007.webp',
    alt: 'Bản đồ hướng tiến công chiến dịch Việt Bắc',
    credit: 'TTLQG',
  },
  media: [
    {
      kind: 'image',
      src: '/media/1947/vietbac-1007.webp',
      alt: 'Bản đồ hướng tiến công 7/10',
      caption: 'Khởi điểm Léa',
      credit: 'TTLQG',
      source_url: '',
      license: 'editorial',
      provenance: 'official-archive',
      verification_score: 0.92,
      original_date: '1947-10-07',
    },
  ],
  subEvents: [
    {
      id: 'evt-1947-1007',
      parentId: VB_EVENT_ID,
      order: 1,
      date: '1947-10-07',
      title: 'Pháp mở cuộc tiến công lên Việt Bắc (khởi điểm Léa)',
      leader: 'Võ Nguyên Giáp (Chỉ huy trưởng)',
      opponent: 'Salan (Bắc Đông Dương)',
      troopEstimates: {
        us: '7 trung đoàn + 30 đại đội độc lập, dân quân',
        them: '>10.000 quân, ~40 máy bay, ~40 tàu xuồng',
        note: 'ước lượng',
      },
      guestSummary:
        'Pháp dùng hai gọng kìm và quân dù đánh vào Bắc Kạn–Chợ Đồn–Chợ Mới; mũi tây theo sông Lô–sông Gâm.',
      media: [
        {
          kind: 'image',
          src: '/media/1947/vietbac-1007.webp',
          alt: 'Bản đồ hướng tiến công 7/10',
          caption: 'Khởi điểm Léa',
          credit: 'TTLQG',
          source_url: '',
          license: 'editorial',
          provenance: 'official-archive',
          verification_score: 0.92,
          original_date: '1947-10-07',
        },
      ],
      content: [
        { type: 'h2', secId: 's1', text: 'Tình hình & lực lượng' },
        { type: 'p', secId: 's1p1', text: 'Mục tiêu: diệt/bắt đầu não; phá căn cứ; bịt biên giới Việt–Trung.' },
        { type: 'p', secId: 's1p2', text: 'Giai đoạn đầu ta bị bất ngờ, chịu tổn thất cục bộ.' },
      ],
      sources: [{ title: 'Tư liệu lưu trữ quốc gia' }],
      quizPoolIds: ['q-vb-1007-1', 'q-vb-1007-2', 'q-vb-1007-3'],
      nextId: 'evt-1947-1013',
    },
    {
      id: 'evt-1947-1013',
      parentId: VB_EVENT_ID,
      order: 2,
      date: '1947-10-13',
      title: 'Thu được kế hoạch địch – điều chỉnh phương án tác chiến',
      leader: 'Bộ Tổng chỉ huy',
      opponent: 'Quân Pháp',
      guestSummary:
        'Ta thu kế hoạch địch từ máy bay rơi; lập 3 mặt trận: sông Lô–đường 2; Bắc Kạn–đường 3; đường 4; phát động du kích rộng.',
      media: [
        {
          kind: 'image',
          src: '/media/1947/vietbac-1013.webp',
          alt: 'Điều chỉnh phương án 13/10',
          caption: 'Điều chỉnh',
          credit: 'TTLQG',
          license: 'editorial',
          verification_score: 0.92,
        },
      ],
      content: [
        { type: 'h2', secId: 's2', text: 'Phương châm' },
        { type: 'p', secId: 's2p1', text: 'Phục kích tiêu hao – tiêu diệt từng bộ phận; tạo điều kiện đánh vận động.' },
      ],
      sources: [{ title: 'Tư liệu lưu trữ quốc gia' }],
      quizPoolIds: ['q-vb-1013-1', 'q-vb-1013-2', 'q-vb-1013-3'],
      nextId: 'evt-1947-1030',
    },
    {
      id: 'evt-1947-1030',
      parentId: VB_EVENT_ID,
      order: 3,
      date: '1947-10-30',
      title: 'Trận Bông Lau – bẻ gọng kìm đường 4',
      leader: 'Bộ đội địa phương & chủ lực',
      opponent: 'Cụm cơ giới địch',
      guestSummary: 'Phục kích đoàn cơ giới ở Bông Lau (đường 4), tiêu hao mạnh mũi đông.',
      media: [
        {
          kind: 'image',
          src: '/media/1947/bonglau.webp',
          alt: 'Trận Bông Lau 30/10',
          caption: 'Bông Lau',
          credit: 'TTLQG',
          license: 'editorial',
          verification_score: 0.9,
        },
      ],
      content: [{ type: 'p', secId: 's3p1', text: 'Đánh vào đoàn cơ giới, chặn mũi tiến công.' }],
      quizPoolIds: ['q-vb-1030-1', 'q-vb-1030-2'],
      nextId: 'evt-1947-1110',
    },
    {
      id: 'evt-1947-1110',
      parentId: VB_EVENT_ID,
      order: 4,
      date: '1947-11-10',
      title: 'Đỉnh điểm các trận Sông Lô',
      leader: 'Pháo binh & bộ đội sông Lô',
      opponent: 'Hạm – lục hỗn hợp',
      guestSummary:
        'Các trận 23–24/10 và 10/11 đánh chìm/hỏng nhiều tàu, cắt tiếp tế mũi tây.',
      media: [
        {
          kind: 'image',
          src: '/media/1947/songlo.webp',
          alt: 'Chiến đấu trên sông Lô',
          caption: 'Sông Lô',
          credit: 'TTLQG',
          license: 'editorial',
          verification_score: 0.92,
        },
      ],
      content: [{ type: 'p', secId: 's4p1', text: 'Hỏa lực bờ sông + địa hình khúc khuỷu tạo thế đánh hiệu quả.' }],
      quizPoolIds: ['q-vb-1110-1', 'q-vb-1110-2'],
      nextId: 'evt-1947-1121',
    },
    {
      id: 'evt-1947-1121',
      parentId: VB_EVENT_ID,
      order: 5,
      date: '1947-11-21',
      title: 'Pháp bắt đầu rút – ta truy kích nhiều hướng',
      leader: 'Bộ Tổng chỉ huy',
      opponent: 'Quân Pháp đang rút',
      guestSummary: 'Từ 21/11, địch bí mật rút; ta truy kích, tập kích liên tiếp.',
      media: [
        {
          kind: 'image',
          src: '/media/1947/rutquan.webp',
          alt: 'Địch rút, ta truy kích',
          caption: 'Rút quân',
          credit: 'TTLQG',
          license: 'editorial',
          verification_score: 0.9,
        },
      ],
      content: [{ type: 'p', secId: 's5p1', text: 'Tổ chức chặn – phục kích các mũi rút.' }],
      quizPoolIds: ['q-vb-1121-1', 'q-vb-1121-2'],
      nextId: 'evt-1947-1130',
    },
    {
      id: 'evt-1947-1130',
      parentId: VB_EVENT_ID,
      order: 6,
      date: '1947-11-30',
      title: 'Tập kích Phủ Thông',
      leader: 'Bộ đội chủ lực',
      opponent: 'Đồn Phủ Thông',
      guestSummary: 'Đánh vào vị trí then chốt trên tuyến rút.',
      media: [
        {
          kind: 'image',
          src: '/media/1947/phuthong.webp',
          alt: 'Tập kích Phủ Thông 30/11',
          caption: 'Phủ Thông',
          credit: 'TTLQG',
          license: 'editorial',
          verification_score: 0.9,
        },
      ],
      content: [{ type: 'p', secId: 's6p1', text: 'Phối hợp thế trận truy kích.' }],
      quizPoolIds: ['q-vb-1130-1'],
      nextId: 'evt-1947-1215',
    },
    {
      id: 'evt-1947-1215',
      parentId: VB_EVENT_ID,
      order: 7,
      date: '1947-12-15',
      title: 'Đèo Giàng & các trận phối hợp',
      leader: 'Lực lượng phối thuộc',
      opponent: 'Quân Pháp',
      guestSummary: 'Phục kích nhiều trận ở Sơn Dương, Bình Ca, Đèo Khế, Phan Lương, Đèo Giàng…',
      media: [
        {
          kind: 'image',
          src: '/media/1947/deogiang.webp',
          alt: 'Đèo Giàng 15/12',
          caption: 'Đèo Giàng',
          credit: 'TTLQG',
          license: 'editorial',
          verification_score: 0.9,
        },
      ],
      content: [{ type: 'p', secId: 's7p1', text: 'Gia tăng tiêu hao, khóa chặt đường rút địch.' }],
      quizPoolIds: ['q-vb-1215-1'],
      nextId: 'evt-1947-1220',
    },
    {
      id: 'evt-1947-1220',
      parentId: VB_EVENT_ID,
      order: 8,
      date: '1947-12-20',
      title: 'Kết thúc chiến dịch – thắng lợi chiến lược',
      leader: 'Bộ Tổng chỉ huy',
      opponent: 'Tàn quân rút chạy',
      guestSummary:
        'Kết thúc thắng lợi; loại >7.200 địch, rơi 18 máy bay, chìm 54 tàu xuồng, phá 255 xe, thu 25 pháo.',
      media: [
        {
          kind: 'image',
          src: '/media/1947/ketthuc.webp',
          alt: 'Kết thúc 20/12/1947',
          caption: 'Kết thúc chiến dịch',
          credit: 'TTLQG',
          license: 'editorial',
          verification_score: 0.92,
        },
      ],
      content: [
        { type: 'h2', secId: 's8', text: 'Tổng kết & Ý nghĩa' },
        {
          type: 'p',
          secId: 's8p1',
          text: "Phá sản kế hoạch 'đánh nhanh, thắng nhanh'; khẳng định nghệ thuật 'tiến công trong phản công'.",
        },
      ],
      quizPoolIds: ['q-vb-1220-1', 'q-vb-1220-2'],
      nextId: null,
    },
  ],
};

const TET68_EVENT_ID = 'evt-1968-tet';

const tetMauThan1968: HistoryEvent = {
  id: TET68_EVENT_ID,
  eraId: 'american',
  year: 1968,
  month: 1,
  date: '1968-01-30',
  title: 'Tổng tiến công và nổi dậy Tết Mậu Thân 1968',
  headline: 'Đòn tiến công tổng lực làm chấn động nước Mỹ và thay đổi cục diện chiến tranh Việt Nam.',
  summary: 'Đợt tiến công chiến lược trên toàn miền Nam, tác động mạnh đến cục diện chiến tranh Việt Nam.',
  reliability: 4,
  tags: ['campaign', 'urban', 'political-impact'],
  content: [
    { type: 'h2', secId: 'context', text: 'Bối cảnh & chủ trương' },
    {
      type: 'p',
      secId: 'context-para-1',
      text: 'Cuối năm 1967, Bộ Chính trị và Quân ủy Trung ương xây dựng phương án chiến lược: kết hợp tiến công quân sự với nổi dậy chính trị, giáng đòn bất ngờ vào trung tâm đầu não Mỹ - Sài Gòn nhằm thay đổi cục diện chiến tranh.',
    },
    {
      type: 'p',
      secId: 'context-para-2',
      text: 'Lực lượng vũ trang giải phóng bí mật chuẩn bị trong nhiều tháng, chuyển quân vào nội đô, tổ chức kho tàng, hầm trú ẩn và cơ sở hậu cần ngay giữa lòng các thành phố lớn.',
    },
    { type: 'h3', secId: 'objectives-title', text: 'Mục tiêu chiến lược' },
    {
      type: 'p',
      secId: 'objectives-para-1',
      text: 'Đòn mở màn đúng thời điểm Tết cổ truyền nhằm tạo hiệu ứng bất ngờ tối đa, đánh vào niềm tin chiến thắng nhanh chóng của Hoa Kỳ và chính quyền Sài Gòn, đồng thời khởi động phong trào nổi dậy của quần chúng.',
    },
    {
      type: 'quote',
      secId: 'quote-walter-cronkite',
      text: 'Chiến tranh không thể thắng chỉ bằng sức mạnh quân sự. Đã đến lúc phải đàm phán.',
      source: 'Walter Cronkite, CBS Evening News, 27/02/1968',
    },
    {
      type: 'p',
      secId: 'objectives-para-2',
      text: 'Kết quả tức thời chưa đạt mục tiêu giữ lâu dài các đô thị, nhưng cú sốc truyền thông khiến dư luận Mỹ hoài nghi về triển vọng chiến thắng, buộc chính quyền Johnson thay đổi chiến lược.',
    },
    {
      kind: 'image',
      secId: 'context-image',
      src: '/media/1968/troops-prep.webp',
      alt: 'Lực lượng Giải phóng ém quân chuẩn bị cho Tết Mậu Thân',
      caption: 'Lực lượng đặc công bí mật chuẩn bị tại vành đai Sài Gòn cuối năm 1967.',
      credit: 'Ảnh tư liệu Ban Tuyên huấn Trung ương Cục',
      license: 'editorial',
      verification_score: 0.88,
    },
    { type: 'h2', secId: 'impact', text: 'Tác động lâu dài' },
    {
      type: 'p',
      secId: 'impact-para-1',
      text: 'Đợt tổng tiến công làm lung lay ý chí tiếp tục chiến tranh của Hoa Kỳ, dẫn tới chính sách “phi Mỹ hóa”, đàm phán Paris và cuối cùng là việc rút quân Mỹ khỏi miền Nam Việt Nam.',
    },
    {
      type: 'p',
      secId: 'impact-para-2',
      text: 'Về quân sự, chiến dịch cho thấy khả năng tổ chức tác chiến đồng loạt, phối hợp giữa các binh chủng và mạng lưới cơ sở chính trị rộng khắp của Mặt trận Dân tộc Giải phóng.',
    },
  ],
  featuredImage: {
    url: '/media/1968/embassy.webp',
    alt: 'Biệt động tấn công Tòa Đại sứ Mỹ tại Sài Gòn',
    credit: 'Ảnh tư liệu',
  },
  media: [
    {
      kind: 'image',
      src: '/media/1968/tet-0130.webp',
      alt: 'Đêm Giao thừa 1968',
      caption: 'Đơn vị đặc công nổ súng đúng khoảnh khắc Giao thừa.',
      credit: 'Ảnh tư liệu',
      license: 'editorial',
      verification_score: 0.9,
    },
    {
      kind: 'image',
      src: '/media/1968/saigon-street.webp',
      alt: 'Giao tranh trên đường phố Sài Gòn 1968',
      caption: 'Biệt động chiến đấu gần Dinh Độc Lập trong đêm 31/1.',
      credit: 'Ảnh: Thông tấn xã Giải phóng',
      license: 'editorial',
      verification_score: 0.87,
    },
    {
      kind: 'document',
      src: '/docs/1968/johnson-address.pdf',
      alt: 'Thông điệp truyền hình của Tổng thống Johnson ngày 31/3/1968',
      caption: 'Thông điệp của Tổng thống Lyndon B. Johnson thông báo không tái tranh cử và giảm ném bom.',
      credit: 'Thư viện Tổng thống LBJ',
      license: 'editorial',
      verification_score: 0.82,
    },
  ],
  subEvents: [
    {
      id: 'evt-1968-0130',
      parentId: TET68_EVENT_ID,
      order: 1,
      date: '1968-01-30',
      title: 'Đêm Giao thừa – nổ súng đồng loạt',
      leader: 'Các Bộ tư lệnh Miền & địa phương',
      opponent: 'Quân đội Mỹ & Sài Gòn',
      troopEstimates: {
        us: 'Lực lượng vũ trang giải phóng + cơ sở nội thành',
        them: 'Quân Mỹ/Đồng minh & VNCH',
      },
      guestSummary: 'Nhiều đô thị và căn cứ bị tiến công đồng loạt ngay Giao thừa.',
      media: [
        {
          kind: 'image',
          src: '/media/1968/tet-0130.webp',
          alt: 'Đêm Giao thừa 1968',
          caption: 'Mở màn đợt tiến công',
          credit: 'Ảnh tư liệu',
          license: 'editorial',
          verification_score: 0.9,
        },
      ],
      content: [
        { type: 'h3', secId: 's1-head', text: 'Mở màn đồng loạt' },
        {
          type: 'p',
          secId: 's1p1',
          text: 'Mũi chủ lực đánh vào các đô thị lớn như Sài Gòn, Huế, Đà Nẵng, Cần Thơ cùng lúc; các đơn vị địa phương nổ súng hỗ trợ ở cấp quận, huyện.',
        },
        {
          type: 'p',
          secId: 's1p2',
          text: 'Thời điểm giao thừa giúp các lực lượng vận chuyển vũ khí bí mật bằng xe cứu thương, thuyền buôn, mai phục ngay trong các chùa, trường học.',
        },
        {
          kind: 'map',
          secId: 's1-map',
          src: '/media/1968/tet-map.webp',
          alt: 'Bản đồ những thành phố nổ súng trong đêm 30/1/1968',
          caption: 'Hơn 100 đô thị và căn cứ trên toàn miền Nam đồng loạt bị tiến công.',
          credit: 'Cục Tác chiến - Bộ Tổng tham mưu',
          license: 'editorial',
          verification_score: 0.85,
        },
      ],
      sources: [{ title: 'Tư liệu báo chí quốc tế 1968' }],
      quizPoolIds: ['q-tet-0130-1', 'q-tet-0130-2'],
      nextId: 'evt-1968-0131-sg',
    },
    {
      id: 'evt-1968-0131-sg',
      parentId: TET68_EVENT_ID,
      order: 2,
      date: '1968-01-31',
      title: 'Sài Gòn – trận đánh khu vực Tòa Đại sứ Mỹ',
      leader: 'Đơn vị biệt động',
      opponent: 'Lực lượng Mỹ/VNCH bảo vệ tòa đại sứ',
      guestSummary: 'Trận đánh biểu tượng gây chấn động dư luận Mỹ và quốc tế.',
      media: [
        {
          kind: 'image',
          src: '/media/1968/embassy.webp',
          alt: 'Tòa Đại sứ Mỹ 1968',
          caption: 'Trận đánh Tòa Đại sứ',
          credit: 'Ảnh tư liệu',
          license: 'editorial',
          verification_score: 0.9,
        },
      ],
      content: [
        { type: 'h3', secId: 's2-head', text: 'Tòa Đại sứ Mỹ - biểu tượng bị đánh thẳng' },
        {
          type: 'p',
          secId: 's2p1',
          text: 'Biệt động Sài Gòn đột nhập từ rạng sáng 31/1, chiếm sân tòa đại sứ suốt nhiều giờ, buộc quân Mỹ phải đổ quân từ trực thăng xuống mái nhà.',
        },
        {
          type: 'quote',
          secId: 's2-quote',
          text: 'Nếu đại sứ quán của chúng ta tại Việt Nam cũng không an toàn, thì ở đâu an toàn nữa?',
          source: 'The Washington Post, 01/02/1968',
        },
        {
          type: 'p',
          secId: 's2p2',
          text: 'Hình ảnh binh sĩ Mỹ tử trận ngay tại sân tòa đại sứ truyền về khiến công luận đặt câu hỏi về “ánh sáng cuối đường hầm” mà chính quyền Mỹ từng tuyên bố.',
        },
      ],
      sources: [
        { title: 'After-action Report, MACV, February 1968' },
        { title: 'The Washington Post, 01/02/1968', link: 'https://www.washingtonpost.com/archive/politics/1968/02/01/tet-offensive-hits-us-embassy/ef1ee98f-4aaa-4ca6-b6bc-77bb93fd7c7c/' },
      ],
      quizPoolIds: ['q-tet-0131sg-1', 'q-tet-0131sg-2'],
      nextId: 'evt-1968-0131-hue',
    },
    {
      id: 'evt-1968-0131-hue',
      parentId: TET68_EVENT_ID,
      order: 3,
      date: '1968-01-31',
      title: 'Huế – giao tranh kéo dài',
      leader: 'Các lực lượng trên địa bàn Trị – Thiên',
      opponent: 'Mỹ/Đồng minh & VNCH',
      guestSummary: 'Giao tranh đô thị ác liệt, kéo dài nhiều tuần; tác động lớn về quân sự – dư luận.',
      media: [
        {
          kind: 'image',
          src: '/media/1968/hue.webp',
          alt: 'Huế 1968',
          caption: 'Huế trong Tết Mậu Thân',
          credit: 'Ảnh tư liệu',
          license: 'editorial',
          verification_score: 0.9,
        },
      ],
      content: [
        { type: 'h3', secId: 's3-head', text: 'Chiến sự dài ngày tại kinh đô Huế' },
        {
          type: 'p',
          secId: 's3p1',
          text: 'Lực lượng Giải phóng chiếm phần lớn Thành Nội, thiết lập chính quyền cách mạng tạm thời trong 26 ngày.',
        },
        {
          type: 'p',
          secId: 's3p2',
          text: 'Hai bên giành giật từng ngôi nhà, từng góc phố; hỏa lực pháo binh và không kích khiến thành phố chịu thiệt hại lớn.',
        },
        {
          kind: 'image',
          secId: 's3-photo',
          src: '/media/1968/hue-citadel.webp',
          alt: 'Giao tranh tại Kỳ Đài Huế',
          caption: 'Bản đồ tác chiến tại khu vực Kỳ Đài – Trường Quốc Học.',
          credit: 'Thông tấn xã Giải phóng',
          license: 'editorial',
          verification_score: 0.86,
        },
      ],
      sources: [
        { title: 'US Marine Corps Monographs on Hue' },
        { title: 'Báo Quân đội Nhân dân, đặc san 1968' },
      ],
      quizPoolIds: ['q-tet-0131hue-1', 'q-tet-0131hue-2'],
      nextId: 'evt-1968-0210',
    },
    {
      id: 'evt-1968-0210',
      parentId: TET68_EVENT_ID,
      order: 4,
      date: '1968-02-10',
      title: 'Phản công – giành lại các mục tiêu',
      leader: 'Bộ chỉ huy Mỹ/VNCH',
      opponent: 'Lực lượng tiến công',
      guestSummary: 'Phản công mạnh, giành lại các mục tiêu trọng yếu.',
      media: [
        {
          kind: 'image',
          src: '/media/1968/counter.webp',
          alt: 'Phản công',
          caption: 'Đợt phản công',
          credit: 'Ảnh tư liệu',
          license: 'editorial',
          verification_score: 0.9,
        },
      ],
      content: [
        { type: 'h3', secId: 's4-head', text: 'Phản công quy mô lớn của Mỹ - VNCH' },
        {
          type: 'p',
          secId: 's4p1',
          text: 'Quân Mỹ huy động lính thủy đánh bộ, không vận và thiết giáp tái chiếm từng quận, phối hợp với các đơn vị VNCH.',
        },
        {
          type: 'p',
          secId: 's4p2',
          text: 'Hỏa lực pháo hạm và B-52 được sử dụng ngay trong khu dân cư, gây thương vong lớn cho thường dân nhưng giúp phía Mỹ giành lại hầu hết các mục tiêu.',
        },
      ],
      sources: [
        { title: 'Pentagon Papers - Gravel Edition' },
      ],
      quizPoolIds: ['q-tet-0210-1'],
      nextId: 'evt-1968-0302',
    },
    {
      id: 'evt-1968-0302',
      parentId: TET68_EVENT_ID,
      order: 5,
      date: '1968-03-02',
      title: 'Kết thúc giao tranh tại Huế',
      leader: 'Mỹ/Đồng minh & VNCH',
      opponent: 'Lực lượng tiến công',
      guestSummary: 'Kết thúc một trong những điểm nóng kéo dài nhất của đợt Tết.',
      media: [
        {
          kind: 'image',
          src: '/media/1968/end-hue.webp',
          alt: 'Kết thúc tại Huế',
          caption: 'Huế sau giao tranh',
          credit: 'Ảnh tư liệu',
          license: 'editorial',
          verification_score: 0.9,
        },
      ],
      content: [
        { type: 'h3', secId: 's5-head', text: 'Huế sau 26 ngày đêm chiến đấu' },
        {
          type: 'p',
          secId: 's5p1',
          text: 'Đến đầu tháng 3, lực lượng Giải phóng rút khỏi Huế để bảo toàn lực lượng; nhiều cơ sở hạ tầng và di tích bị hư hại nặng.',
        },
        {
          type: 'p',
          secId: 's5p2',
          text: 'Cả hai phía đều chịu tổn thất lớn; phong trào phản chiến tại Mỹ dâng cao sau các hình ảnh phá hủy tại Huế.',
        },
      ],
      sources: [
        { title: 'AP Wire, March 1968' },
        { title: 'Ủy ban điều tra thiệt hại Tp. Huế (1969)' },
      ],
      quizPoolIds: ['q-tet-0302-1'],
      nextId: 'evt-1968-0331',
    },
    {
      id: 'evt-1968-0331',
      parentId: TET68_EVENT_ID,
      order: 6,
      date: '1968-03-31',
      title: 'Tác động chính trị tại Hoa Kỳ',
      leader: 'Chính quyền Mỹ',
      opponent: 'Sức ép dư luận – bầu cử',
      guestSummary: 'Tổng thống Lyndon B. Johnson tuyên bố không tái tranh cử; tín hiệu giảm leo thang.',
      media: [
        {
          kind: 'image',
          src: '/media/1968/politics.webp',
          alt: 'Tác động chính trị 1968',
          caption: 'Thông điệp 31/3',
          credit: 'Ảnh tư liệu',
          license: 'editorial',
          verification_score: 0.9,
        },
      ],
      content: [
        { type: 'h3', secId: 's6-head', text: 'Chuyển biến chính trị tại Hoa Kỳ' },
        {
          type: 'p',
          secId: 's6p1',
          text: 'Ngày 31/3/1968, Tổng thống Lyndon B. Johnson tuyên bố ngừng ném bom miền Bắc (trừ vùng phi quân sự) và không tái tranh cử, mở đường cho đàm phán Paris.',
        },
        {
          type: 'p',
          secId: 's6p2',
          text: 'Tạp chí Time gọi Tết Mậu Thân là “bước ngoặt của cuộc chiến” khi dư luận Mỹ chuyển sang ủng hộ chấm dứt chiến tranh.',
        },
      ],
      sources: [
        { title: 'Thông điệp truyền hình của Tổng thống Johnson, 31/03/1968' },
        { title: 'Time Magazine, Special Issue May 1968' },
      ],
      quizPoolIds: ['q-tet-0331-1'],
      nextId: null,
    },
  ],
};

const danang1858: HistoryEvent = {
  id: DANANG_1858_EVENT_ID,
  eraId: 'french',
  year: 1858,
  month: 9,
  date: '1858-09-01',
  title: 'Pháp tấn công Đà Nẵng 1858',
  headline: 'Mở đầu cuộc xâm lược thực dân Pháp vào Việt Nam',
  summary:
    'Ngày 1/9/1858, hạm đội Pháp - Tây Ban Nha do đô đốc Rigault de Genouilly chỉ huy nổ súng tấn công vào Đà Nẵng, mở đầu cuộc chiến tranh xâm lược kéo dài gần 100 năm.',
  reliability: 5,
  tags: ['french-invasion', 'danang', 'colonial-war', '1858'],
  content: [
    { type: 'h2', secId: 'intro', text: 'Bối cảnh và nguyên nhân' },
    { 
      type: 'p', 
      secId: 'intro-p1', 
      text: 'Giữa thế kỷ 19, Pháp tìm cách mở rộng ảnh hưởng ở Viễn Đông. Họ dùng cớ bảo vệ các giáo sĩ và tín đồ Công giáo để can thiệp vào Việt Nam.' 
    },
    { 
      type: 'h2', 
      secId: 'attack', 
      text: 'Cuộc tấn công' 
    },
    {
      type: 'p',
      secId: 'attack-p1',
      text: 'Ngày 1/9/1858, hạm đội gồm 14 tàu chiến và 2.500 lính với hỏa lực hùng mạnh tiến công Đà Nẵng. Quân triều đình Nguyễn chống trả quyết liệt nhưng thiếu vũ khí hiện đại.',
    },
  ],
  featuredImage: {
    url: '/media/1858/danang-attack.webp',
    alt: 'Hạm đội Pháp tấn công Đà Nẵng 1858',
    credit: 'Tranh lịch sử',
  },
  media: [],
  subEvents: [
    {
      id: 'evt-1858-danang-01',
      parentId: DANANG_1858_EVENT_ID,
      order: 1,
      date: '1858-09-01',
      title: 'Hạm đội Pháp - Tây Ban Nha đổ bộ Đà Nẵng',
      leader: 'Đô đốc Rigault de Genouilly',
      opponent: 'Quân triều đình Nguyễn',
      troopEstimates: {
        them: '14 tàu chiến, 2.500 lính',
        us: 'Các đồn lũy ven biển',
        note: 'Lực lượng không cân sức',
      },
      guestSummary:
        'Hạm đội Pháp - Tây Ban Nha nổ súng tấn công Đà Nẵng, mở đầu cuộc xâm lược thực dân.',
      content: [
        { type: 'h2', secId: 's1', text: 'Cuộc tấn công' },
        { 
          type: 'p', 
          secId: 's1p1', 
          text: 'Sáng ngày 1/9/1858, hạm đội Pháp - Tây Ban Nha nổ súng dữ dội vào các đồn lũy ven biển Đà Nẵng.' 
        },
        { 
          type: 'p', 
          secId: 's1p2', 
          text: 'Quân triều đình Nguyễn chống trả quyết liệt nhưng không thể chống lại hỏa lực hiện đại của địch.' 
        },
      ],
      media: [],
      sources: [
        { title: 'Lịch sử Việt Nam, NXB Giáo dục' },
        { title: 'Kháng chiến chống Pháp 1858-1954' },
      ],
      quizPoolIds: [
        'q-danang-1858-1',
        'q-danang-1858-2',
        'q-danang-1858-3',
        'q-danang-1858-4',
        'q-danang-1858-5',
      ],
      nextId: null,
    },
  ],
};

// Phong trào Cần Vương 1885-1896
const CANVUONG_EVENT_ID = 'evt-1885-canvuong';

const canVuong1885: HistoryEvent = {
  id: CANVUONG_EVENT_ID,
  eraId: 'french',
  year: 1885,
  month: 7,
  date: '1885-07-13',
  title: 'Phong trào Cần Vương (1885-1896)',
  headline: 'Phong trào yêu nước chống Pháp do các sĩ phu và văn thân lãnh đạo',
  summary: 'Sau khi triều đình Huế thất bại trong cuộc phản công kinh thành, vua Hàm Nghi xuất bôn ra chiếu Cần Vương, kêu gọi nhân dân cả nước đứng lên chống Pháp.',
  reliability: 5,
  tags: ['can-vuong', 'resistance', 'patriotic-movement', '1885'],
  content: [
    { type: 'h2', secId: 'intro', text: 'Bối cảnh lịch sử' },
    { 
      type: 'p', 
      secId: 'intro-p1', 
      text: 'Năm 1884, triều đình Huế ký Hiệp ước Patenôtre, chính thức công nhận quyền bảo hộ của Pháp. Tuy nhiên, nhiều quan lại và sĩ phu yêu nước không chấp nhận điều này.' 
    },
    { type: 'h2', secId: 'chieu', text: 'Chiếu Cần Vương' },
    {
      type: 'p',
      secId: 'chieu-p1',
      text: 'Ngày 13/7/1885, vua Hàm Nghi xuất bôn ra chiếu Cần Vương, kêu gọi các quan lại, sĩ phu và nhân dân cả nước "phù vua cứu nước".',
    },
  ],
  featuredImage: {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1600&q=80',
    alt: 'Phong trào Cần Vương',
    credit: 'Tranh lịch sử',
  },
  media: [],
  subEvents: [
    {
      id: 'evt-1885-canvuong-01',
      parentId: CANVUONG_EVENT_ID,
      order: 1,
      date: '1885-07-13',
      title: 'Vua Hàm Nghi xuất chiếu Cần Vương',
      leader: 'Vua Hàm Nghi, Tôn Thất Thuyết',
      opponent: 'Thực dân Pháp',
      guestSummary: 'Sau cuộc tấn công bất thành vào đồn Mang Cá, Tôn Thất Thuyết đưa vua Hàm Nghi ra Tân Sở (Quảng Trị) và xuất chiếu Cần Vương.',
      content: [
        { type: 'h3', secId: 's1-head', text: 'Chiếu Cần Vương' },
        { 
          type: 'p', 
          secId: 's1p1', 
          text: 'Chiếu Cần Vương kêu gọi toàn dân đứng lên "phù vua cứu nước", mở đầu phong trào kháng chiến rộng lớn khắp cả nước.' 
        },
      ],
      media: [],
      sources: [{ title: 'Lịch sử Việt Nam, NXB Giáo dục' }],
      quizPoolIds: ['q-canvuong-01-1', 'q-canvuong-01-2', 'q-canvuong-01-3', 'q-canvuong-01-4', 'q-canvuong-01-5', 'q-canvuong-01-6'],
      nextId: null,
    },
  ],
};

export const events: HistoryEvent[] = [danang1858, canVuong1885, vietBac1947, tetMauThan1968];

export const quizBank: QuizQuestion[] = [
  // Quiz Đà Nẵng 1858 - Yes/No format
  {
    id: 'q-danang-1858-1',
    subEventId: 'evt-1858-danang-01',
    eventId: DANANG_1858_EVENT_ID,
    eraId: 'french',
    prompt: 'Phải chăng Pháp chọn Đà Nẵng làm nơi nổ súng mở đầu vì đây là vị trí chiến lược quan trọng của Việt Nam?',
    options: ['Đúng', 'Sai'],
    answerIndex: 0,
    explanation: 'Đúng. Đà Nẵng là cảng biển nước sâu, vị trí chiến lược quan trọng, gần kinh đô Huế, thuận lợi cho việc tiến quân và tiếp tế của Pháp.',
  },
  {
    id: 'q-danang-1858-2',
    subEventId: 'evt-1858-danang-01',
    eventId: DANANG_1858_EVENT_ID,
    eraId: 'french',
    prompt: 'Nhà Nguyễn có tổ chức phòng thủ và chống trả mạnh mẽ khi Pháp tấn công vào Đà Nẵng năm 1858 không?',
    options: ['Đúng', 'Sai'],
    answerIndex: 0,
    explanation: 'Đúng. Nhà Nguyễn đã tổ chức phòng thủ và chống trả quyết liệt dưới sự chỉ huy của các tướng lĩnh, gây nhiều khó khăn cho quân Pháp.',
  },
  {
    id: 'q-danang-1858-3',
    subEventId: 'evt-1858-danang-01',
    eventId: DANANG_1858_EVENT_ID,
    eraId: 'french',
    prompt: 'Có đúng là quân Pháp đã nhanh chóng chiếm được toàn bộ Đà Nẵng ngay khi tấn công năm 1858 không?',
    options: ['Đúng', 'Sai'],
    answerIndex: 1,
    explanation: 'Sai. Quân Pháp gặp nhiều khó khăn và không thể nhanh chóng chiếm được toàn bộ Đà Nẵng do sự kháng cự mạnh mẽ của quân triều đình và nhân dân.',
  },
  {
    id: 'q-danang-1858-4',
    subEventId: 'evt-1858-danang-01',
    eventId: DANANG_1858_EVENT_ID,
    eraId: 'french',
    prompt: 'Nhân dân địa phương có tham gia tích cực vào cuộc kháng chiến chống Pháp tại Đà Nẵng không?',
    options: ['Đúng', 'Sai'],
    answerIndex: 0,
    explanation: 'Đúng. Nhân dân địa phương đã tích cực phối hợp với quân triều đình, thực hiện chiến thuật "vườn không nhà trống", gây khó khăn cho quân Pháp.',
  },
  {
    id: 'q-danang-1858-5',
    subEventId: 'evt-1858-danang-01',
    eventId: DANANG_1858_EVENT_ID,
    eraId: 'french',
    prompt: 'Cuộc kháng chiến tại Đà Nẵng năm 1858 có hoàn toàn thất bại và không để lại ý nghĩa gì không?',
    options: ['Đúng', 'Sai'],
    answerIndex: 1,
    explanation: 'Sai. Cuộc kháng chiến tại Đà Nẵng đã làm thất bại kế hoạch đánh nhanh thắng nhanh của Pháp, buộc địch phải chuyển hướng tấn công vào Gia Định.',
  },
  
  // Quiz Phong trào Cần Vương 1885-1896
  {
    id: 'q-canvuong-01-1',
    subEventId: 'evt-1885-canvuong-01',
    eventId: CANVUONG_EVENT_ID,
    eraId: 'french',
    prompt: 'Chiếu Cần Vương được ban hành vào năm nào?',
    options: ['1884', '1885', '1886', '1887'],
    answerIndex: 1,
    explanation: 'Chiếu Cần Vương được vua Hàm Nghi ban hành ngày 13/7/1885.',
  },
  {
    id: 'q-canvuong-01-2',
    subEventId: 'evt-1885-canvuong-01',
    eventId: CANVUONG_EVENT_ID,
    eraId: 'french',
    prompt: 'Ai là người chủ trì đưa vua Hàm Nghi ra khỏi kinh thành và xuất chiếu Cần Vương?',
    options: ['Phan Đình Phùng', 'Tôn Thất Thuyết', 'Nguyễn Thiện Thuật', 'Hoàng Hoa Thám'],
    answerIndex: 1,
    explanation: 'Tôn Thất Thuyết là người tổ chức cuộc tấn công đồn Mang Cá và đưa vua Hàm Nghi ra Tân Sở xuất chiếu Cần Vương.',
  },
  {
    id: 'q-canvuong-01-3',
    subEventId: 'evt-1885-canvuong-01',
    eventId: CANVUONG_EVENT_ID,
    eraId: 'french',
    prompt: '"Cần Vương" có nghĩa là gì?',
    options: ['Đánh đuổi giặc Pháp', 'Phù vua, giúp vua', 'Cải cách đất nước', 'Xây dựng quân đội'],
    answerIndex: 1,
    explanation: '"Cần Vương" nghĩa là phù vua, giúp vua - kêu gọi nhân dân đứng lên giúp vua chống giặc cứu nước.',
  },
  {
    id: 'q-canvuong-01-4',
    subEventId: 'evt-1885-canvuong-01',
    eventId: CANVUONG_EVENT_ID,
    eraId: 'french',
    prompt: 'Cuộc khởi nghĩa Hương Khê (1885-1896) do ai lãnh đạo?',
    options: ['Đinh Công Tráng', 'Nguyễn Thiện Thuật', 'Phan Đình Phùng', 'Hoàng Hoa Thám'],
    answerIndex: 2,
    explanation: 'Khởi nghĩa Hương Khê do Phan Đình Phùng lãnh đạo tại Hà Tĩnh, là cuộc khởi nghĩa tiêu biểu nhất trong phong trào Cần Vương.',
  },
  {
    id: 'q-canvuong-01-5',
    subEventId: 'evt-1885-canvuong-01',
    eventId: CANVUONG_EVENT_ID,
    eraId: 'french',
    prompt: 'Khởi nghĩa Ba Đình (1886-1887) diễn ra ở tỉnh nào?',
    options: ['Hà Tĩnh', 'Thanh Hóa', 'Hưng Yên', 'Bắc Giang'],
    answerIndex: 1,
    explanation: 'Khởi nghĩa Ba Đình do Đinh Công Tráng lãnh đạo tại Thanh Hóa.',
  },
  {
    id: 'q-canvuong-01-6',
    subEventId: 'evt-1885-canvuong-01',
    eventId: CANVUONG_EVENT_ID,
    eraId: 'french',
    prompt: 'Phong trào Cần Vương kết thúc vào năm nào?',
    options: ['1888', '1892', '1896', '1900'],
    answerIndex: 2,
    explanation: 'Phong trào Cần Vương kết thúc năm 1896 khi cuộc khởi nghĩa Hương Khê thất bại sau khi Phan Đình Phùng qua đời.',
  },

  // Quiz Việt Bắc 1947
  {
    id: 'q-vb-1007-1',
    subEventId: 'evt-1947-1007',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Kế hoạch của Pháp mở màn chiến dịch Việt Bắc mang tên gì?',
    options: ['Cloclo', 'Léa', 'Castor', 'Atlas'],
    answerIndex: 1,
    explanation: 'Kế hoạch mở màn mang tên Léa.',
  },

  {
    id: 'q-vb-1007-2',
    subEventId: 'evt-1947-1007',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Hai gọng kìm của địch hướng vào khu vực trọng tâm nào?',
    options: ['Hà Nội', 'Bắc Kạn–Chợ Đồn–Chợ Mới', 'Huế', 'Đà Nẵng'],
    answerIndex: 1,
    explanation: 'Trọng tâm là tam giác Bắc Kạn–Chợ Đồn–Chợ Mới.',
  },
  {
    id: 'q-vb-1007-3',
    subEventId: 'evt-1947-1007',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Mũi tây của địch đi theo tuyến sông nào?',
    options: ['Sông Mã', 'Sông Hồng–sông Lô–sông Gâm', 'Sông Thu Bồn', 'Sông Bằng'],
    answerIndex: 1,
    explanation: 'Mũi tây đi theo sông Hồng, ngược sông Lô–Gâm.',
  },
  {
    id: 'q-vb-1013-1',
    subEventId: 'evt-1947-1013',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Sau 13/10, ta lập mấy mặt trận lớn?',
    options: ['1', '2', '3', '4'],
    answerIndex: 2,
    explanation: 'Ba mặt trận.',
  },
  {
    id: 'q-vb-1013-2',
    subEventId: 'evt-1947-1013',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Phương thức tác chiến chủ yếu được nhấn mạnh là gì?',
    options: ['Công thành', 'Phòng ngự cố định', 'Phục kích tiêu hao', 'Đổ bộ đường biển'],
    answerIndex: 2,
    explanation: 'Phục kích tiêu hao, tiêu diệt từng bộ phận.',
  },
  {
    id: 'q-vb-1013-3',
    subEventId: 'evt-1947-1013',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Một trong ba mặt trận không phải là?',
    options: ['Sông Lô–đường 2', 'Bắc Kạn–đường 3', 'Đường 4', 'Đường 5'],
    answerIndex: 3,
    explanation: 'Không có Đường 5.',
  },
  {
    id: 'q-vb-1030-1',
    subEventId: 'evt-1947-1030',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Trận 30/10 diễn ra ở đâu?',
    media: {
      type: 'image',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Column_French_Ambush_Viet_Bac_1947.jpg/800px-Column_French_Ambush_Viet_Bac_1947.jpg',
      alt: 'Đoàn cơ giới Pháp bị phục kích tại đường số 4 cuối năm 1947',
      caption: 'Đoàn cơ giới Pháp trên đường số 4 – bối cảnh trận Bông Lau.',
      credit: 'Lưu trữ quân đội Pháp (public domain)',
    },
    options: ['Bông Lau', 'Điện Biên Phủ', 'Phủ Thông', 'Đèo Khế'],
    answerIndex: 0,
    explanation: 'Bông Lau – đường 4.',
  },
  {
    id: 'q-vb-1030-2',
    subEventId: 'evt-1947-1030',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Mục tiêu chính của ta tại Bông Lau?',
    options: ['Tàu vận tải', 'Đoàn cơ giới đường bộ', 'Sân bay', 'Kho đạn'],
    answerIndex: 1,
    explanation: 'Đoàn cơ giới.',
  },
  {
    id: 'q-vb-1110-1',
    subEventId: 'evt-1947-1110',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Các trận sông Lô đã đánh vào lực lượng nào của địch?',
    media: {
      type: 'video',
      platform: 'youtube',
      src: 'UpWV7k_gak4',
      alt: 'Tư liệu chiến sự trên sông Lô 1947',
      caption: 'Đoạn phim cũ ghi cảnh hỏa lực bờ sông truy kích đoàn tàu Pháp.',
      credit: 'Trung tâm Phim tư liệu Việt Nam',
      poster: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=960&h=540&fit=crop',
    },
    options: ['Bộ binh hành quân rừng núi', 'Thủy đội xung kích', 'Không quân', 'Biệt kích'],
    answerIndex: 1,
    explanation: 'Chủ yếu thủy đội/đoàn tàu.',
  },
  {
    id: 'q-vb-1110-2',
    subEventId: 'evt-1947-1110',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Mục tiêu chiến thuật ở sông Lô là?',
    options: ['Mở đường tiến công Hà Nội', 'Cắt tiếp tế mũi tây', 'Tăng viện cho Huế', 'Đổ bộ Đà Nẵng'],
    answerIndex: 1,
    explanation: 'Cắt tiếp tế mũi tây.',
  },
  {
    id: 'q-vb-1121-1',
    subEventId: 'evt-1947-1121',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Ngày nào địch bắt đầu rút khỏi Việt Bắc?',
    options: ['21/11/1947', '30/11/1947', '15/12/1947', '20/12/1947'],
    answerIndex: 0,
    explanation: '21/11/1947.',
  },
  {
    id: 'q-vb-1121-2',
    subEventId: 'evt-1947-1121',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Ta áp dụng thế trận gì khi địch rút?',
    options: ['Công kiên', 'Đánh biển', 'Chặn – phục kích nhiều hướng', 'Không chiến'],
    answerIndex: 2,
    explanation: 'Chặn và phục kích.',
  },
  {
    id: 'q-vb-1130-1',
    subEventId: 'evt-1947-1130',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Ngày 30/11/1947 ta tập kích đồn nào?',
    options: ['Phủ Thông', 'Bắc Kạn', 'Chợ Mới', 'Na Sản'],
    answerIndex: 0,
    explanation: 'Đồn Phủ Thông.',
  },
  {
    id: 'q-vb-1215-1',
    subEventId: 'evt-1947-1215',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Đèo Giàng thuộc nhóm hoạt động nào?',
    options: [
      'Tăng viện đường biển',
      'Phối hợp phục kích trên tuyến rút',
      'Không kích mục tiêu chiến lược',
      'Công kiên đô thị',
    ],
    answerIndex: 1,
    explanation: 'Chuỗi phục kích phối hợp.',
  },
  {
    id: 'q-vb-1220-1',
    subEventId: 'evt-1947-1220',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Chiến dịch kết thúc vào ngày?',
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=960&h=540&fit=crop',
      alt: 'Chiến sĩ Việt Minh trong rừng Việt Bắc',
      caption: 'Lực lượng chủ lực rút kinh nghiệm và củng cố thế trận sau chiến dịch.',
      credit: 'Unsplash – minh họa',
    },
    options: ['07/10/1947', '20/12/1947', '30/04/1975', '07/05/1954'],
    answerIndex: 1,
    explanation: '20/12/1947.',
  },
  {
    id: 'q-vb-1220-2',
    subEventId: 'evt-1947-1220',
    eventId: VB_EVENT_ID,
    eraId: 'french',
    prompt: 'Ý nghĩa lớn nhất của chiến thắng Việt Bắc 1947?',
    options: [
      'Mở đường ra Bắc Kinh',
      "Bảo vệ cơ quan đầu não & phá sản “đánh nhanh, thắng nhanh”",
      'Giải phóng toàn bộ đồng bằng',
      'Tái chiếm Sài Gòn',
    ],
    answerIndex: 1,
    explanation: 'Bảo vệ đầu não, làm hỏng kế hoạch chiến lược.',
  },
  {
    id: 'q-tet-0130-1',
    subEventId: 'evt-1968-0130',
    eventId: TET68_EVENT_ID,
    eraId: 'american',
    prompt: 'Đợt tiến công nổ ra vào thời điểm nào?',
    options: ['Rằm tháng Giêng', 'Đêm Giao thừa Tết Mậu Thân', 'Quốc khánh', 'Giữa năm'],
    answerIndex: 1,
    explanation: 'Đêm Giao thừa 1968.',
  },
  {
    id: 'q-tet-0130-2',
    subEventId: 'evt-1968-0130',
    eventId: TET68_EVENT_ID,
    eraId: 'american',
    prompt: 'Đặc điểm nổi bật của mở màn?',
    options: ['Đánh đơn lẻ', 'Đồng loạt nhiều đô thị/căn cứ', 'Chỉ đánh rừng núi', 'Đổ bộ đường biển'],
    answerIndex: 1,
    explanation: 'Đồng loạt quy mô lớn.',
  },
  {
    id: 'q-tet-0131sg-1',
    subEventId: 'evt-1968-0131-sg',
    eventId: TET68_EVENT_ID,
    eraId: 'american',
    prompt: 'Trận đánh gây chấn động truyền thông diễn ra ở đâu?',
    options: ['Tòa Đại sứ Mỹ tại Sài Gòn', 'Chợ Bến Thành', 'Dinh Thống Nhất', 'Tân Sơn Nhất'],
    answerIndex: 0,
    explanation: 'Tòa Đại sứ Mỹ.',
  },
  {
    id: 'q-tet-0131sg-2',
    subEventId: 'evt-1968-0131-sg',
    eventId: TET68_EVENT_ID,
    eraId: 'american',
    prompt: 'Tác động chính của trận này là?',
    options: [
      'Chiến thắng chiến thuật lớn',
      'Tác động tâm lý – chính trị mạnh tại Mỹ',
      'Giành quyền kiểm soát lâu dài',
      'Cắt đứt tiếp tế đường biển',
    ],
    answerIndex: 1,
    explanation: 'Hiệu ứng truyền thông – chính trị.',
  },
  {
    id: 'q-tet-0131hue-1',
    subEventId: 'evt-1968-0131-hue',
    eventId: TET68_EVENT_ID,
    eraId: 'american',
    prompt: 'Địa bàn giao tranh kéo dài nhất trong đợt Tết là?',
    options: ['Đà Nẵng', 'Huế', 'Cần Thơ', 'Nha Trang'],
    answerIndex: 1,
    explanation: 'Huế.',
  },
  {
    id: 'q-tet-0131hue-2',
    subEventId: 'evt-1968-0131-hue',
    eventId: TET68_EVENT_ID,
    eraId: 'american',
    prompt: 'Tính chất nổi bật của chiến sự tại Huế?',
    options: [
      'Chiến tranh du kích rừng sâu',
      'Đô thị ác liệt kéo dài',
      'Không chiến ngoài khơi',
      'Đổ bộ đường biển',
    ],
    answerIndex: 1,
    explanation: 'Đô thị ác liệt, kéo dài.',
  },
  {
    id: 'q-tet-0210-1',
    subEventId: 'evt-1968-0210',
    eventId: TET68_EVENT_ID,
    eraId: 'american',
    prompt: 'Sau mở màn, phía Mỹ/VNCH làm gì?',
    options: ['Rút khỏi đô thị', 'Phản công mạnh giành lại mục tiêu', 'Tạm ngừng chiến sự', 'Chuyển ra Bắc'],
    answerIndex: 1,
    explanation: 'Tổ chức phản công.',
  },
  {
    id: 'q-tet-0302-1',
    subEventId: 'evt-1968-0302',
    eventId: TET68_EVENT_ID,
    eraId: 'american',
    prompt: 'Ngày nào cơ bản kết thúc giao tranh tại Huế?',
    options: ['03/31', '02/10', '03/02', '01/31'],
    answerIndex: 2,
    explanation: 'Khoảng 2/3/1968.',
  },
  {
    id: 'q-tet-0331-1',
    subEventId: 'evt-1968-0331',
    eventId: TET68_EVENT_ID,
    eraId: 'american',
    prompt: 'Sự kiện chính trị nổi bật 31/3/1968 tại Mỹ?',
    options: [
      'Tổng thống Johnson tuyên bố không tái tranh cử',
      'Hạ viện Mỹ tuyên chiến',
      'Bầu cử tổng thống',
      'Tăng quân ồ ạt',
    ],
    answerIndex: 0,
    explanation: 'Tuyên bố của Tổng thống Johnson.',
  },
];

export const historyData = {
  eras,
  events,
  quizBank,
};

export async function fetchEras(): Promise<Era[]> {
  return eras;
}

export async function fetchEvents(eraId?: Era['id']): Promise<HistoryEvent[]> {
  const list = events;
  return eraId ? list.filter((event) => event.eraId === eraId) : list;
}

export async function fetchEventsByEra(eraId: Era['id']): Promise<HistoryEvent[]> {
  return fetchEvents(eraId);
}

export async function fetchQuizByEvent(eventId: string): Promise<QuizQuestion[]> {
  return quizBank.filter((question) => question.eventId === eventId);
}

export async function fetchQuizForSubEvent(subEventId: string): Promise<QuizQuestion[]> {
  return quizBank.filter((question) => question.subEventId === subEventId);
}

export function findEventById(id: string): HistoryEvent | undefined {
  return events.find((event) => event.id === id);
}

export function findSubEventById(subId: string): SubEvent | undefined {
  for (const event of events) {
    const found = event.subEvents.find((subEvent) => subEvent.id === subId);
    if (found) return found;
  }
  return undefined;
}
