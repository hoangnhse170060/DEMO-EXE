export type HistoricalSource = {
  id: string;
  type: 'primary' | 'secondary';
  title: string;
  author?: string;
  year?: string;
  url?: string;
  citation?: string;
  reliability?: 'high' | 'medium' | 'low';
};

export type EventPerson = {
  id: string;
  name: string;
  role: string;
  portrait?: string;
  bio: string;
  quotes?: string[];
};

export type EventSection = {
  id: string;
  title: string;
  kind: 'context' | 'timeline' | 'analysis' | 'impact' | 'appendix';
  content: string; // plain text / markdown-lite
  bullets?: string[];
};

export type DeepEvent = {
  id: string;
  headline: string;
  date: string;
  location?: string;
  summary: string;
  heroImage?: string;
  sections: EventSection[];
  people: EventPerson[];
  sources: HistoricalSource[];
  media: {
    images: Array<{ src: string; caption: string; credit?: string; year?: string; title?: string }>;
    videos?: Array<{ platform: 'youtube' | 'local'; id?: string; src?: string; title: string }>;
    audio?: Array<{ src: string; title: string; description?: string }>;
  };
  meta?: {
    revision: string;
    updatedAt: string;
    methodology?: string;
    notes?: string;
  };
};

const independence1945: DeepEvent = {
  id: 'independence-1945',
  headline: 'Tuyên ngôn Độc lập tại Quảng trường Ba Đình',
  date: '02/09/1945',
  location: 'Hà Nội',
  summary:
    'Sự kiện Chủ tịch Hồ Chí Minh thay mặt Chính phủ lâm thời tuyên bố độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa – mốc chuyển thời đại của lịch sử Việt Nam hiện đại.',
  heroImage:
    'https://baonamdinh.vn/file/e7837c02816d130b0181a995d7ad7e96/082023/untitled-1_20230831215518.jpg',
  sections: [
    {
      id: 'context',
      title: 'Bối cảnh trước Cách mạng Tháng Tám',
      kind: 'context',
      content:
        'Đầu năm 1945, nạn đói hoành hành cướp đi sinh mạng của hàng triệu người. Sau cuộc đảo chính 9/3/1945, chính quyền thực dân Pháp ở Đông Dương sụp đổ. Tháng 8/1945, Nhật đầu hàng Đồng minh, khoảng trống quyền lực xuất hiện. Đây là “thời cơ có một không hai” để lực lượng cách mạng chớp thời cơ giành chính quyền.',
      bullets: [
        'Nạn đói 1944–1945 tại miền Bắc',
        'Đảo chính Nhật – Pháp (9/3/1945)',
        'Nhật đầu hàng – khoảng trống quyền lực (8/1945)'
      ],
    },
    {
      id: 'aug-revolution',
      title: 'Cách mạng Tháng Tám – những mũi khởi nghĩa',
      kind: 'timeline',
      content:
        'Từ giữa tháng 8/1945, phong trào khởi nghĩa bùng nổ trên khắp cả nước. Hà Nội (19/8), Huế (23/8), Sài Gòn – Gia Định (25/8) nhanh chóng giành chính quyền, thiết lập Ủy ban nhân dân lâm thời.',
      bullets: [
        'Hà Nội (19/8): mít-tinh lớn chuyển hóa thành khởi nghĩa',
        'Huế (23/8): vua Bảo Đại thoái vị',
        'Sài Gòn – Gia Định (25/8): thành lập Ủy ban nhân dân Nam Bộ'
      ],
    },
    {
      id: 'preparations',
      title: 'Chuẩn bị cho buổi lễ 2/9',
      kind: 'timeline',
      content:
        'Sau khi giành chính quyền, Chính phủ lâm thời quyết định tổ chức lễ tuyên bố độc lập tại Quảng trường Ba Đình. Công tác dựng lễ đài, huy động quần chúng, đảm bảo an ninh – truyền thanh được triển khai khẩn trương.',
    },
    {
      id: 'ceremony',
      title: 'Buổi lễ Tuyên ngôn Độc lập',
      kind: 'analysis',
      content:
        'Khoảng 50.000 người dự lễ. Trong tiếng reo hò, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, mở đầu bằng mệnh đề nổi tiếng về quyền con người. Câu hỏi “Tôi nói, đồng bào nghe rõ không?” – “Rõ!” trở thành ký ức tập thể đặc biệt của Hà Nội thu 1945.',
      bullets: [
        'Lễ đài: Hồ Chí Minh, Võ Nguyên Giáp, Phạm Văn Đồng…',
        'Đọc Tuyên ngôn – trích dẫn về quyền bình đẳng',
        'Phần duyệt binh của Quân Giải phóng'
      ],
    },
    {
      id: 'significance',
      title: 'Ý nghĩa – chính trị, pháp lý, văn hóa',
      kind: 'analysis',
      content:
        'Tuyên ngôn đặt nền móng cho Nhà nước Việt Nam Dân chủ Cộng hòa; là văn kiện lập quốc, tiền đề cho Hiến pháp 1946. Về văn hóa – tư tưởng, văn bản kết hợp lập luận chặt chẽ với cảm hứng dân tộc, dẫn chiếu các bản Tuyên ngôn Hoa Kỳ và Nhân quyền – Dân quyền Pháp.',
    },
    {
      id: 'diplomacy',
      title: 'Phản ứng và bối cảnh quốc tế',
      kind: 'analysis',
      content:
        'Ngay sau lễ, Chính phủ lâm thời gửi điện đến các cường quốc yêu cầu công nhận độc lập. Mỹ giữ thái độ quan sát (phái đoàn OSS tại Hà Nội). Quân Trung Hoa Dân Quốc vào Bắc Việt giải giáp Nhật; Pháp chuẩn bị quay lại Đông Dương, dẫn tới xung đột sau đó.',
    },
    {
      id: 'legacy',
      title: 'Di sản lâu dài',
      kind: 'impact',
      content:
        'Tinh thần 2/9 trở thành biểu tượng bản sắc Việt Nam hiện đại – ý chí tự cường và khát vọng tự do, là mạch nguồn cho các khẩu hiệu kháng chiến sau này.',
    },
  ],
  people: [
    {
      id: 'hochiminh',
      name: 'Hồ Chí Minh',
      role: 'Chủ tịch Chính phủ lâm thời',
      portrait: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Ho_Chi_Minh_-_1946_Portrait.jpg',
      bio: 'Nhà cách mạng, lãnh tụ của phong trào độc lập dân tộc Việt Nam trong thế kỷ XX.',
      quotes: [
        'Tất cả mọi người sinh ra đều có quyền bình đẳng…',
      ],
    },
    {
      id: 'vonguyengiap',
      name: 'Võ Nguyên Giáp',
      role: 'Bộ trưởng Nội vụ kiêm Tổng chỉ huy',
        portrait: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPcNYZndatqs7u1SSYVFkhtgFBVznMRoL0BA&s',
      bio: 'Nhà quân sự, người chỉ huy Quân đội nhân dân Việt Nam trong nhiều chiến dịch lớn.',
    },
  ],
  sources: [
    {
      id: 'VNA1955',
      type: 'primary',
      title: 'Bản ghi âm Tuyên ngôn Độc lập (1955)',
      author: 'Đài Tiếng nói Việt Nam',
      year: '1955',
      url: 'https://www.youtube.com/watch?v=5ODYUerrQ88',
      reliability: 'high',
      citation: 'Đài Tiếng nói Việt Nam (1955), Bản ghi âm Tuyên ngôn Độc lập.'
    },
    {
      id: 'HP1946',
      type: 'primary',
      title: 'Hiến pháp 1946',
      year: '1946',
      reliability: 'high',
      citation: 'Hiến pháp nước Việt Nam Dân chủ Cộng hòa (1946).'
    },
    {
      id: 'study2010',
      type: 'secondary',
      title: 'Nghiên cứu về Cách mạng Tháng Tám',
      author: 'Nhiều tác giả',
      year: '2010',
      reliability: 'medium',
      citation: 'Tổng luận sử học hiện đại về Cách mạng Tháng Tám (2010).'
    }
  ],
  media: {
    images: [
      {
        src: 'https://imgnvsk.vnanet.vn/mediaupload/content/2023/8/16/229-ttxvn_20150828_quockhanh2.jpg',
        caption: 'Quảng trường Ba Đình – minh họa',
        title: 'Ba Đình 1945',
        credit: ''
      },
      {
        src: 'https://file3.qdnd.vn/data/images/0/2022/09/01/tvkimgiang/bac%20ho%20doc%20tuyen%20ngon.jpg',
        caption: 'Bác Hồ đọc Tuyên ngôn Độc lập',
        credit: 'Unsplash – minh họa',
        title: ''
      },
    ],
    videos: [
      { platform: 'youtube', id: '5ODYUerrQ88', title: 'Phim tư liệu: Ngày Độc Lập 2/9/1945' }
    ],
  },
  meta: {
    revision: 'v1.0',
    updatedAt: new Date().toISOString(),
    methodology:
      'Tổng hợp nguồn sơ cấp (ghi âm, văn bản pháp lý) và nguồn thứ cấp (tổng kết sử học). Phản kiểm giữa các nguồn và ghi chú thiên kiến khi có.',
    notes: 'Bản dữ liệu minh họa phục vụ trình diễn UI/UX học thuật trên web.'
  }
};

const resistance1946: DeepEvent = {
  id: 'resistance-1946',
  headline: 'Toàn quốc kháng chiến bùng nổ',
  date: '19/12/1946',
  location: 'Hà Nội – Việt Bắc',
  summary:
    'Sau tối hậu thư của Pháp, Trung ương Đảng ra Lời kêu gọi Toàn quốc kháng chiến, mở ra giai đoạn chiến tranh nhân dân trường kỳ từ đô thị về căn cứ Việt Bắc.',
  heroImage:
    'https://nhandan.vn/special/hanoi_khangchien_60ngaydem/assets/5nlKlWdLeM/hanoicbichiendau-750x422.jpg',
  sections: [
    {
      id: 'prelude',
      title: 'Tối hậu thư và lựa chọn lịch sử',
      kind: 'context',
      content:
        'Cuối năm 1946, sau hàng loạt vụ khiêu khích, ngày 18/12 quân Pháp gửi tối hậu thư đòi tước vũ khí lực lượng tự vệ Hà Nội. Đêm 18 rạng 19/12, Thường vụ Trung ương ra Chỉ thị Toàn quốc kháng chiến, khẳng định quyết tâm bảo vệ chủ quyền dân tộc.',
      bullets: [
        'Hiệp định Sơ bộ 6/3 và Tạm ước 14/9 không còn tác dụng kiềm chế xung đột.',
        'Pháp gia tăng tập kích tại Hải Phòng, Lạng Sơn, Hà Nội trong tháng 11–12/1946.',
        'Trung ương nhận định: “Không thể nhân nhượng thêm được nữa”.',
      ],
    },
    {
      id: 'call-to-arms',
      title: 'Lời kêu gọi Toàn quốc kháng chiến',
      kind: 'timeline',
      content:
        '20 giờ ngày 19/12/1946, Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến. Tiếng súng phá nhà máy điện Yên Phụ mở màn chiến dịch giữ Hà Nội 60 ngày đêm, tạo điều kiện cho Trung ương Đảng và Chính phủ rút lên Việt Bắc.',
      bullets: [
        'Chủ động tắt điện toàn thành phố, báo hiệu nổ súng.',
        'Lời hiệu triệu vang lên trên Đài Tiếng nói Việt Nam từ làng Vạn Phúc.',
        'Các chiến khu đồng loạt triển khai phương án đánh địch.',
      ],
    },
    {
      id: 'hanoi-60days',
      title: 'Hà Nội 60 ngày đêm giam chân địch',
      kind: 'analysis',
      content:
        'Các liên khu I, II, III xây dựng chiến lũy, đánh địch trong từng con phố. Chiến thuật giam chân, tiêu hao khiến Pháp không thể đánh nhanh. Sau 60 ngày chiến đấu ác liệt, lực lượng ta rút ra ngoại thành an toàn, bảo toàn chủ lực.',
      bullets: [
        'Chiến lũy Ô Quan Chưởng, Hàng Đào, Hàng Đậu.',
        'Đội cảm tử quân 10 người ôm bom phá xe tăng tại Cửa Bắc.',
        'Đêm 17/2/1947 rút khỏi Liên khu I theo đường hầm bí mật.',
      ],
    },
    {
      id: 'strategic-shift',
      title: 'Rút lên Việt Bắc – hình thành chiến tranh nhân dân',
      kind: 'analysis',
      content:
        'Chủ tịch Hồ Chí Minh, Chính phủ, Quốc hội, quân chủ lực rút lên ATK Việt Bắc, hình thành trung tâm lãnh đạo kháng chiến. Đường lối “toàn dân, toàn diện, trường kỳ, tự lực cánh sinh” được cụ thể hóa qua hệ thống căn cứ và mạng lưới dân công hậu cần.',
      bullets: [
        'Thiết lập các cơ quan Trung ương tại Tân Trào, Định Hóa, Chợ Đồn.',
        'Ở lại Hà Nội một bộ phận cán bộ hoạt động nội thành, xây dựng cơ sở bí mật.',
        'Khu vực Khu IV, Nam Bộ tiếp tục đánh phá hậu phương địch.',
      ],
    },
    {
      id: 'impact-long-term',
      title: 'Ý nghĩa và di sản',
      kind: 'impact',
      content:
        'Toàn quốc kháng chiến đánh dấu sự khởi đầu của cuộc chiến tranh nhân dân lâu dài. Sự kiện chứng minh bản lĩnh quyết tử của Hà Nội và ý chí đại đoàn kết, mở đường cho những chiến dịch Việt Bắc 1947, Biên giới 1950 và Điện Biên Phủ 1954.',
      bullets: [
        'Củng cố niềm tin nhân dân vào đường lối kháng chiến kiến quốc.',
        'Định hình mô thức tác chiến đô thị – căn cứ – du kích kết hợp.',
        'Gây tiếng vang quốc tế về quyền tự vệ chính đáng của Việt Nam.',
      ],
    },
    {
      id: 'appendix-communique',
      title: 'Chỉ thị Toàn quốc kháng chiến (trích)',
      kind: 'appendix',
      content:
        '“Lúc này, nếu không kiên quyết hy sinh thì chẳng những quyền độc lập tự do của Tổ quốc không giữ được mà cuộc đời của dân ta, con cháu ta rồi cũng không tự do, hạnh phúc.”',
    },
  ],
  people: [
    {
      id: 'hochiminh-1946',
      name: 'Hồ Chí Minh',
      role: 'Chủ tịch nước Việt Nam Dân chủ Cộng hòa',
      portrait: 'https://media.thanhtra.com.vn/public/data/news_images/2018/08/congdinh/bac_ho_voi_khuc_hat_dan_ca.jpg?w=1319',
      bio: 'Người soạn thảo Lời kêu gọi Toàn quốc kháng chiến, chỉ đạo rút lui chiến lược về căn cứ Việt Bắc.',
      quotes: ['“Ai có súng dùng súng, ai có gươm dùng gươm…”'],
    },
    {
      id: 'vonguyengiap-1946',
      name: 'Võ Nguyên Giáp',
      role: 'Ủy viên Quân sự, Chỉ huy mặt trận Hà Nội',
      portrait: 'https://nhandan.vn/special/nguoi-anh-ca-cua-QDNDVN/assets/GpKITqzAvt/vng-1940-750x1060.jpg',
      bio: 'Tổ chức chiến đấu 60 ngày đêm tại Hà Nội, sau đó chỉ đạo chiến tranh du kích mở rộng ở Liên khu Việt Bắc.',
    },
    {
      id: 'truongchinh-1946',
      name: 'Trường Chinh',
      role: 'Tổng Bí thư Đảng',
        portrait: 'https://cdnimage.daihoidang.vn/t400/Media/Graphic/Profile/2020/12/02/truong-chinh-edit.jpg',
      bio: 'Đồng tác giả Chỉ thị Toàn quốc kháng chiến, hoạch định đường lối chiến tranh nhân dân lâu dài.',
    },
  ],
  sources: [
    {
      id: 'call1946',
      type: 'primary',
      title: 'Lời kêu gọi Toàn quốc kháng chiến',
      author: 'Hồ Chí Minh',
      year: '1946',
      url: 'https://dangcongsan.vn/tu-lieu-van-kien/van-kien-dang/ho-chi-minh/loi-keu-goi-toan-quoc-khang-chien-1946-547637.html',
      reliability: 'high',
      citation: 'Hồ Chí Minh (19/12/1946), Lời kêu gọi Toàn quốc kháng chiến.',
    },
    {
      id: 'directive1946',
      type: 'primary',
      title: 'Chỉ thị Toàn quốc kháng chiến',
      author: 'Trung ương Đảng Cộng sản Đông Dương',
      year: '1946',
      url: 'https://dangcongsan.vn/tu-lieu-van-kien/van-kien-dang/van-kien-tw-dang/chinh-tri/chi-thi-toan-quoc-khang-chien-1946-547639.html',
      reliability: 'high',
      citation: 'Trung ương Đảng (12/1946), Chỉ thị Toàn quốc kháng chiến.',
    },
    {
      id: 'militaryhistory2010',
      type: 'secondary',
      title: 'Lịch sử kháng chiến chống Pháp, tập 1',
      author: 'Viện Lịch sử Quân sự Việt Nam',
      year: '2010',
      reliability: 'high',
      citation: 'Viện Lịch sử Quân sự Việt Nam (2010), Lịch sử kháng chiến chống Pháp, tập 1.',
    },
  ],
  media: {
    images: [
      {
        src: 'https://cdnphoto.dantri.com.vn/14xjzsYSqNAYwRqkzW1ZKseFiVY=/thumb_w/680/2024/01/31/cam-tu-quan-5062-1481900002-1706686543490.jpg',
        caption: 'Chiến lũy trên phố Hàng Đào trong 60 ngày đêm khói lửa.',
        credit: 'Wikimedia Commons (Public Domain)',
        year: '1946',
        title: 'Chiến lũy Hà Nội',
      },
      {
        src: 'https://file3.qdnd.vn/data/images/0/2016/12/11/thuha/111216ha26.jpg',
        caption: 'Áp phích tuyên truyền Lời kêu gọi Toàn quốc kháng chiến.',
        credit: 'Tư liệu lưu trữ Trung ương',
        year: '1946',
        title: 'Lời kêu gọi kháng chiến',
      },
      {
        src: 'https://thupt1977.wordpress.com/wp-content/uploads/2017/09/hop_o_chien_khu_viet_bac-07ll.jpg',
        caption: 'Họp ở chiến khu Việt Bắc, 1947.',
        credit: 'Unsplash – minh họa',
        title: 'Căn cứ Việt Bắc',
      },
    ],
 videos: [
  {
    platform: 'youtube',
    id: 'UpWV7k_gak4',
    title: 'Phim tư liệu: Hà Nội mùa đông 1946',
    src: 'https://www.youtube.com/embed/qLfGQOWXo7Q',
  }
],

  },
  meta: {
    revision: 'v1.0',
    updatedAt: '2025-01-15T00:00:00.000Z',
    methodology:
      'Đối chiếu văn kiện sơ cấp (Lời kêu gọi, Chỉ thị) với công trình nghiên cứu chính thống; bổ sung ảnh tư liệu lưu trữ và ảnh minh họa địa hình.',
    notes: 'Bản dữ liệu phục vụ trải nghiệm hồ sơ nghiên cứu về kháng chiến chống Pháp giai đoạn mở đầu.',
  },
};

export function getDeepEventById(id?: string): DeepEvent {
  if (!id) return independence1945;
  switch (id) {
    case 'independence-1945':
      return independence1945;
    case 'resistance-1946':
      return resistance1946;
    default:
      return independence1945;
  }
}
