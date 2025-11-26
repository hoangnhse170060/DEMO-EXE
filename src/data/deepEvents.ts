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
  headline: 'Pháp xâm lược',
  date: '01/09/1858',
  location: 'Đà Nẵng, Việt Nam',
  summary:
    ' Ngày 1 tháng 9 năm 1858, hải quân Pháp nổ súng tấn công Đà Nẵng, mở đầu cho hơn một thế kỷ đô hộ và khai thác thuộc địa tại Việt Nam, dẫn đến những biến động sâu rộng trong xã hội và lịch sử đất nước.',
  heroImage:
    'https://www.tindachieu.com/news/wp-content/uploads/2017/09/tran-%C4%91a-nang-1858-2-tindachieu.jpg',
  sections: [
    {
      id: 'context',
      title: 'Bối cảnh nền trước khi Pháp tấn công Đà Nẵng ',
      kind: 'context',
      content:
        'Trước khi Pháp tấn công Đà Nẵng, Việt Nam trải qua nhiều biến động chính trị và xã hội. Các lực lượng trong nước và quốc tế đều có ảnh hưởng đến tình hình khu vực, tạo nên bối cảnh phức tạp cho sự kiện này.',
      bullets: [
        'Chính trị: Triều Nguyễn suy yếu, lạc hậu về quân sự so với thực dân Pháp.',
        'Quân sự: Không có hải quân hiện đại, chỉ dựa vào lực lượng bộ binh và pháo đài ven biển.',
        'Ngoại giao: Pháp – Tây Ban Nha muốn mở cửa thị trường và chiếm đóng Nam Kỳ, Đà Nẵng là bước mở đầu.'
        

      ],
    },
    {
      id: 'aug-revolution',
      title: 'Cuộc tấn công Đà Nẵng của Pháp – Tây Ban Nha (1858–1860)',
      kind: 'timeline',
      content:
        'Ngày 1 tháng 9 năm 1858, hải quân Pháp nổ súng tấn công Đà Nẵng, mở đầu cho hơn một thế kỷ đô hộ và khai thác thuộc địa tại Việt Nam, dẫn đến những biến động sâu rộng trong xã hội và lịch sử đất nước.',
      bullets: [
        '1/9/1858: Liên quân Pháp – Tây Ban Nha đổ bộ, chiếm bán đảo Sơn Trà.',
        '9/1858: Nguyễn Tri Phương nhận chỉ huy phòng thủ Đà Nẵng.',
        '1859: Quân Pháp mở nhiều đợt tấn công nhưng bị chặn đứng.',
        '3/1860: Liên quân buộc phải rút khỏi Đà Nẵng sau gần 2 năm bị cầm chân.',

      ],
    },
    {
      id: 'significance',
      title: 'Ý nghĩa – chính trị, pháp lý, văn hóa',
      kind: 'analysis',
      content:
        ' ',
      bullets: [
        'Chính trị: Là thất bại đầu tiên của thực dân Pháp ở Việt Nam, làm chậm kế hoạch xâm lược ',

        'Quân sự: Minh chứng sức chống cự kiên cường của quân dân Đại Nam, khẳng định chiến thuật phòng thủ bờ biển hiệu quả.',

        'Văn hóa: Tạo truyền thống kháng chiến chống xâm lược của Đà Nẵng và miền Trung.',

      ],
    },
    {
      id: 'diplomacy',
      title: 'Phân tích',
      kind: 'analysis',
      content:
        'Chiến thuật và phòng thủ.',
      bullets: [
        'Vườn không nhà trống”: Rút dân, giấu lương thực, tạo khó khăn cho quân Pháp.',
        'Đồn lũy và pháo đài: Tổ chức thành tuyến, bảo vệ bán đảo Sơn Trà và khu vực ven biển.',
        'Huy động nghĩa binh: Quân dân phối hợp chặt chẽ với bộ binh triều Nguyễn, ngăn cản quân Pháp tiến sâu.',

      ],
    },
    {
      id: 'legacy',
      title: 'Kết Quả',
      kind: 'impact',
      content:
        ' ',
    bullets: [
        'Liên quân Pháp – Tây Ban Nha không thể mở rộng chiếm đóng nhanh chóng.',
        'Triều Nguyễn giữ được Đà Nẵng gần 2 năm, buộc Pháp chuyển hướng xâm lược Nam Kỳ.',
      ],
    },
  ],
  people: [
    {
      id: 'nguyen tri phuong',
      name: 'Nguyễn Tri Phương',
      role: 'Đại thần triều Nguyễn, Tổng đốc Đà Nẵng',
      portrait: 'https://photo.znews.vn/w1210/Uploaded/mdf_nsozxd/2018_11_30/Nguyen_Tri_Phuong1_thumb.jpg',
      bio: 'Nhà quân sự lỗi lạc, người chỉ huy phòng thủ Đà Nẵng trong cuộc tấn công của liên quân Pháp – Tây Ban Nha năm 1858.',
      quotes: [
        'Phòng thủ Đà Nẵng là nhiệm vụ thiêng liêng của ta trước giặc ngoại xâm.',
      ],
    },
    
  ],
  sources: [
   
  
    {
      id: 'study2010',
      type: 'secondary',
      title: 'Nghiên cứu về cuộc xâm lược Đà Nẵng',
      author: 'Nhiều tác giả',
      year: '2010',
      reliability: 'medium',
      citation: 'Tổng luận sử học hiện đại về cuộc xâm lược Đà Nẵng (2010).'
    }
  ],
  media: {
    images: [
      {
        src: 'https://cdn.giaoduc.net.vn/images/48bce25b440269bdd04a8a7eeb0e15c39dc5443e1edb75349617c82dd96fa67f914b4ac519850ed6f074079fa24aa696e42150f8f56261942d43ebac0950ffbc/chiem_da_nang.jpg',
        caption: 'Pháp nổ súng vào Đà Nẵng, mở đầu cuộc chiến tranh xâm ',
        title: 'Đà Nẵng 1858 ',
        credit: ''
      },
      {
        src: 'https://sohanews.sohacdn.com/thumb_w/660/2019/1/31/photo-1-1548944224110428365062.jpg',
        caption: 'Cuộc kháng chiến chống xâm lược Pháp đầu tiên của quân và dân ta ở mặt trận Đà Nẵng năm 1858',
        credit: '',
        title: 'Đà Nẵng'
      },
    ],
    videos: [
      { platform: 'youtube', id: 'Rx7uo7ZdCM0', title: 'Phim tư liệu: Cuộc tấn công Đà Nẵng 1858' },
    ],
  },
  meta: {
    revision: 'v1.0',
    updatedAt: new Date().toISOString(),
    methodology:
      'Tổng hợp nguồn sơ cấp (ghi âm, văn bản pháp lý) và nguồn thứ cấp (tổng kết sử học). Phản kiểm giữa các nguồn và ghi chú thiên kiến khi có.',
    notes: ' '
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

const franceInvasion1858: DeepEvent = {
  id: 'france-invasion-1858',
  headline: 'Pháp xâm lược ',
  date: '01/09/1858',
  location: 'Đà Nẵng',
  summary: 'Liên quân Pháp – Tây Ban Nha nổ súng vào Đà Nẵng, thiết lập bàn đạp cho chiến dịch xâm chiếm ba kỳ.',
  heroImage: 'https://file3.qdnd.vn/data/images/0/2024/11/11/upload_1028/chien%20dich%20da%20nang.jpg?dpi=150&quality=100&w=870',
  sections: [
    {
      id: 'context-1',
      title: 'Bối cảnh thế giới và Đông Nam Á',
      kind: 'context',
      content: 'Thế kỷ 19 là thế kỷ của chủ nghĩa Tây phương. Các cường quốc Âu Mỹ đang mở rộng lãnh thổ và ảnh hưởng ở khắp nơi trên thế giới. Pháp, một trong những đế quốc mạnh nhất, sau khi chinh phục Bắc Phi (Algeria), đã hướng mắt sang Đông Nam Á.\n\nTại Việt Nam, vua Tự Đức đắn đo trong chính sách. Ông vừa muốn duy trì truyền thống Nho giáo, vừa phải đối mặt với sức ép từ các cường quốc. Chính sách bách hại Công giáo của vua tạo ra cớ cho Pháp can thiệp quân sự. Những sứ giả Pháp bị xử tử, những tàu thương mại bị tấn công, tất cả những điều này tạo thành lý do để Napoleon III gửi quân tới Việt Nam.',
      bullets: [
        'Thế kỷ 19: Thế kỷ của chủ nghĩa Tây phương và thực dân hóa',
        'Pháp đã chinh phục Algeria (1830), Ai Cập (1882), Sudan',
        'Vua Tự Đức bách hại Công giáo: nhiều giáo sĩ bị xử tử',
        'Tàu Coutancie bị bắn chìm ngoài khơi Quảng Nam (1858)',
        'Pháp tìm cớ để 2can thiệp quân sự vào Đông Dương'
      ]
    },
    {
      id: 'timeline-1',
      title: 'Diễn biến sự kiện quân sự',
      kind: 'timeline',
      content: 'Chiến dịch xâm lược Việt Nam bắt đầu từ Đà Nẵng vào ngày 01/09/1858 và kéo dài hơn 4 năm. Liên quân Pháp – Tây Ban Nha gồm khoảng 2.500 binh lính Pháp, 1.700 binh lính Tây Ban Nha, cùng với hỗ trợ từ Anh và các lực lượng khác.\n\nPháp sử dụng tàu chiến hiện đại, đạn pháo mạnh, và các chiến thuật quân sự tiên tiến. Quân Nguyễn, mặc dù nổi tiếng về can đảm, chỉ có nỏ, súng cổ, và những bất lợi địa hình để chống lại. Tuy nhiên, họ đã chiến đấu rất can đảm dù biết rằng cuối cùng sẽ thua cuộc.',
      bullets: [
        '01/09/1858: Liên quân Pháp-Tây Ban Nha pháo kích Đà Nẵng',
        '1858-1859: Đảo Nào, Đảo Cù Lao Chàm bị chiếm, phong tỏa Đà Nẩng',
        '02/1859: Liên quân chuyển hướng tấn công Sài Gòn',
        '1860: Chiếm được Gia Định, từng bước kiểm soát ba kỳ',
        '1862: Nguyễn Ánh ký Hiệp ước Nhâm Tuất - chính thức mất ba kỳ (Cochinchine)',
        '1887: Pháp sáp nhập Annam và Tonkin thành Liên bang Đông Dương'
      ]
    },
    {
      id: 'analysis-1',
      title: 'Phân tích chiến dịch quân sự',
      kind: 'analysis',
      content: 'Cuộc chiến này là một bài học về sự chênh lệch công nghệ quân sự giữa các cường quốc phương Tây và các nước phương Đông trong thế kỷ 19. Pháp sử dụng tàu chiến chạy bằng hơi nước, pháo cỏ lớn, súng nạn, và các hệ thống phòng thủ bờ biển hiện đại.\n\nNgược lại, quân Nguyễn dựa vào sức người, khả năng thích ứng với địa hình, và tinh thần chiến đấu không khuất phục. Tuy nhiên, một khi liên quân Pháp đổ bộ thành công, quân Nguyễn không có cách nào để chống lại sức mạnh quân sự vượt trội này. Chiến dịch này chứng tỏ rằng, vào thế kỷ 19, các nước châu Á không thể cạnh tranh về quân sự với các cường quốc phương Tây nếu không có những cải cách căn bản.',
      bullets: [
        'Công nghệ quân sự: Tàu chiến hơi nước vs buồm gỗ',
        'Pháp: 2.500-3.000 quân; Việt Nam: không rõ tổng số',
        'Pháp sử dụng chiến thuật phục kích bờ biển hiệu quả',
        'Quân Nguyễn chiến đấu bất chấp thua thiệt nặng',
        'Sự chênh lệch công nghệ là nhân tố quyết định'
      ]
    },
    {
      id: 'impact-1',
      title: 'Tác động lâu dài đến Việt Nam',
      kind: 'impact',
      content: 'Cuộc xâm lược 1858-1862 là bước ngoặt lớn nhất trong lịch sử hiện đại Việt Nam. Nó không chỉ đánh dấu sự sụp đổ của chính quyền độc lập mà còn mở ra một thời kỳ mới - thời kỳ của sự sống chết trong ách thống trị của một cường quốc Âu Châu.\n\nTại Việt Nam, sự thua cuộc này không dập tắt tinh thần kháng cự mà ngược lại đánh thức ý thức dân tộc sâu sắc. Nó dẫn đến sự ra đời của những phong trào cải cách, như Tây Du của Phan Bội Châu, và Duy Tân của Phan Châu Trinh. Hai nhân vật này, mặc dù có những quan điểm khác nhau, nhưng đều nhằm tới cùng một mục tiêu: chống lại ách thực dân và nâng cao nước Việt lên.\n\nNgược lại, từ góc độ Pháp, chiến thắng này mở ra một nước Đông Dương giàu có, với tài nguyên phong phú và nhân lực dồi dào. Pháp xây dựng một hệ thống thực dân toàn diện, từ quản trị, giáo dục, đến kinh tế, để khai thác Đông Dương.',
      bullets: [
        'Việt Nam mất độc lập quốc gia 92 năm (1862-1954)',
        'Ra đời các lãnh tụ cách mạng: Phan Bội Châu, Phan Châu Trinh',
        'Phong trào Tây Du, Duy Tân sinh ra từ sự tỉnh ngộ này',
        'Hình thành ý thức dân tộc mạnh mẽ: "Cách mạng" thế kỷ 20',
        'Pháp xây dựng Liên bang Đông Dương với thủ phủ Hà Nội'
      ]
    },
    {
      id: 'culture-1',
      title: 'Văn hóa và sự bảo tồn Việt Nam',
      kind: 'analysis',
      content: 'Mặc dù bị chinh phục, nền văn hóa Việt Nam không bị xóa sạch mà lại tìm được những cách thức mới để bảo tồn và phát triển. Các nhà trí thức Việt học Pháp, tiếp cận công nghệ và kiến thức hiện đại, nhưng vẫn giữ vững tâm huyết với quốc gia.\n\nLa Latinh hóa chữ Việt (1858 trở đi) một mặt dễ dàng quốc dân hóa giáo dục, mặt khác cũng cắt đứt nối kết với quá khứ Hán học. Tuy nhiên, sự ra đời của báo chí, tạp chí, và các tác phẩm văn học viết bằng chữ Quốc Ngữ đã tạo ra một phong trào văn hóa sôi động, vốn là tiền đề cho cách mạng tư tưởng thế kỷ 20.',
      bullets: [
        'La Latinh hóa chữ Việt: tích cực và tiêu cực',
        'Báo chí, tạp chí sinh ra từ yêu cầu thời đại',
        'Các tác phẩm văn học nổi tiếng: Truyền Kiều, Dạ cổ hoài âm',
        'Sự giao thoa văn hóa Tây - Đông tạo thành tư duy mới',
        'Nền tảng cho cách mạng tư tưởng thế kỷ 20'
      ]
    },
    {
      id: 'spirit-1',
      title: 'Tinh thần Việt Nam qua bối cảnh lịch sử',
      kind: 'analysis',
      content: 'Cuộc xâm lược 1858 không phải là kết thúc của Việt Nam mà là một giai đoạn khác của hành trình dài chống lại áp bức và xâm lược. Từ thời Bắc Thuộc, đến Cách Mạng Tây Sơn, rồi tới hiện nay, dân tộc Việt Nam vẫn luôn có khả năng đứng dậy sau những thất bại.\n\nTinh thần "Không chiến thắng được xâm lược, là chúng ta còn sống tục tật" của tổ tiên đã kế tục qua thế hệ này. Mặc dù bị thất bại quân sự, nhân dân Việt Nam vẫn tiếp tục kháng cự bằng những cách thức khác: từ những phong trào văn hóa, giáo dục, đến những cuộc nổi dậy vũ trang như Cần Vương (1885-1909).\n\nCuộc chiến này đã chứng tỏ rằng: Mặc dù thua về công nghệ quân sự, nhân dân Việt Nam không bao giờ chịu phục tùng ách thực dân hoàn toàn. Tinh thần ấy là nền tảng cho Cách Mạng Tháng Tám 1945 và cuộc chiến tranh độc lập Việt Nam sau này.',
      bullets: [
        'Tinh thần kháng cự không bao giờ sạch sẽ',
        'Phong trào Cần Vương (1885-1909): sự kế tục của nhân dân',
        '"Chiến tranh nhân dân" - khái niệm mới để chống lại thực dân',
        'Từ Tây Du, Duy Tân tới Cách Mạng Tháng Tám',
        'Những cấp độ kháng cự khác nhau trong một giai đoạn lịch sử'
      ]
    },
  ],
  people: [
    {
      id: 'tu-duc',
      name: 'Vua Tự Đức',
      role: 'Vua Việt Nam (1847-1883)',
      bio: 'Vua Tự Đức là vị vua bị cuốn vào cuộc xâm lược mà ông không thể chống lại. Mặc dù cố gắng hợp tác với một số cường quốc để cân bằng sức mạnh, ông cuối cùng phải ký Hiệp ước Nhâm Tuất (1862), mất ba kỳ Cochinchine. Ông được coi là vua suy yếu, nhưng thực tế ông chỉ là nạn nhân của thời đại quá mạnh mẽ hơn ông.',
      quotes: ['Người sử kế nước, cần phải chọn lựa đường lối khôn ngoan']
    },
    {
      id: 'phan-boi-chau',
      name: 'Phan Bội Châu',
      role: 'Nhà cách mạng, công khai kháng cự Pháp',
      bio: 'Phan Bội Châu (1867-1940) là biểu tượng của sự kháng cự quân sự chống lại Pháp. Ông tổ chức Phong trào Cần Vương (1885-1909) rồi sau đó thực hiện Tây Du để tìm sự hỗ trợ từ các cường quốc khác, đặc biệt là Nhật Bản. Ông tin rằng chỉ có những cuộc nổi dậy vũ trang mới có thể đuổi Pháp ra khỏi Việt Nam.',
      quotes: ['Muốn cứu nước, phải có vũ khí']
    },
    {
      id: 'phan-chau-trinh',
      name: 'Phan Châu Trinh',
      role: 'Nhà cải cách, đấu tranh bằng cách hòa bình',
      bio: 'Phan Châu Trinh (1872-1926) là đối lập quan điểm của Phan Bội Châu. Thay vì nổi dậy vũ trang, ông tin rằng phải hợp tác với Pháp, học hỏi từ Pháp, và từ từ đưa Việt Nam tiến bộ. Ông gửi thư kiến nghị tới các viên chức Pháp, tổ chức các phong trào giáo dục. Mặc dù không thành công lắm, Phan Châu Trinh đã chứng minh rằng con đường cải cách cũng là một hình thức kháng cự.',
      quotes: ['Văn hóa là vũ khí của dân tộc']
    }
  ],
  sources: [
    {
      id: 'source-1',
      type: 'primary',
      title: 'Nhật ký hải quân 1858',
      author: 'Hoa Kỳ',
      year: '1858',
      reliability: 'high'
    },
    {
      id: 'source-2',
      type: 'primary',
      title: 'Tư liệu Bộ Ngoại giao Pháp',
      author: 'Pháp',
      reliability: 'high'
    },
    {
      id: 'source-3',
      type: 'secondary',
      title: 'Lịch sử Việt Nam thế kỷ XIX',
      author: 'Bộ Giáo dục Việt Nam',
      year: '2005',
      reliability: 'high'
    }
  ],
  media: {
    images: [
      {
        src: 'https://sohanews.sohacdn.com/2018/10/16/2-15396633952641313528288.jpg',
        title: 'Tàu chiến Pháp',
        caption: 'Tàu chiến Pháp trong chiến dịch xâm chiếm Việt Nam',
        credit: 'Không tên',
        year: '1858'
      },
      {
        src: 'https://mia.vn/media/uploads/blog-du-lich/kinh-thanh-hue-chiem-nguong-kien-truc-vang-son-cua-13-vi-vua-trieu-dai-nha-nguyen-04-1638156842.jpg',
        title: 'Thành phố Huế thời Nguyễn',
        caption: 'Thành Huế thời kỳ Nguyễn – trung tâm quyền lực Việt Nam',
        credit: 'Wikipedia',
        year: '1858'
      }
    ]
  },
  meta: {
    revision: 'v1.0',
    updatedAt: '2025-01-15T00:00:00.000Z',
    methodology: 'Đối chiếu các tài liệu lịch sử sơ cấp từ Pháp, Việt Nam và các công trình nghiên cứu.'
  }
};

const canVuong1885: DeepEvent = {
  id: 'can-vuong-1885',
  headline: 'Phong trào Cần Vương',
  date: '07/07/1885',
  location: 'Bắc Trung Bộ',
  summary: 'Vua Hàm Nghi ra Chiếu Cần Vương, kêu gọi nhân dân đứng lên cứu nước và phản đối chính sách cai trị của Pháp.',
  heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kham_Nghi.jpg/200px-Kham_Nghi.jpg',
  sections: [
    {
      id: 'context-2',
      title: 'Tình hình chính trị năm 1885',
      kind: 'context',
      content: 'Sau khi mất độc lập, Việt Nam chịu sự kiểm soát của Pháp. Nhân dân bất bình với chính sách cai trị tàn bạo. Vua Hàm Nghi, người trẻ tuổi nhưng có tinh thần yêu nước, quyết định phát động khởi nghĩa cách mạng.',
      bullets: [
        'Pháp kiểm soát hoàn toàn chính quyền Việt Nam',
        'Thuế suất cao, dân chúng sống trong khổ sở',
        'Vua Hàm Nghi được tấn dụng bởi các quan quý'
      ]
    },
    {
      id: 'timeline-2',
      title: 'Quá trình phong trào Cần Vương',
      kind: 'timeline',
      content: 'Vua Hàm Nghi bỏ trốn khỏi Huế vào năm 1885 và phát hành Chiếu Cần Vương để kêu gọi toàn dân dấy lên cách mạng.',
      bullets: [
        'Ngày 07/07/1885: Vua Hàm Nghi bỏ trốn khỏi Huế',
        'Phát hành Chiếu Cần Vương kêu gọi dân chúng',
        'Các khởi nghĩa Ba Đình, Hương Khê, Bãi Sậy bùng nổ',
        'Pháp tăng cường đàn áp, bắt giữ các lãnh tụ như Phan Đình Phùng'
      ]
    },
    {
      id: 'analysis-2',
      title: 'Ý nghĩa của Cần Vương',
      kind: 'analysis',
      content: 'Cần Vương là phong trào kháng cự đầu tiên có tổ chức sau khi mất nước. Mặc dù cuối cùng bị dập tắt, nhưng nó thể hiện tinh thần yêu nước của nhân dân Việt Nam và những lãnh tụ tài ba.',
      bullets: [
        'Là khởi đầu của tinh thần kháng chiến dân tộc',
        'Thể hiện vai trò lãnh đạo của vua Hàm Nghi',
        'Các lãnh tụ như Phan Đình Phùng trở thành biểu tượng kháng chiến'
      ]
    },
    {
      id: 'impact-2',
      title: 'Ảnh hưởng lâu dài',
      kind: 'impact',
      content: 'Cần Vương không làm Pháp rút lui, nhưng nó khơi dậy tâm thức yêu nước của nhân dân. Các thế hệ sau như Phan Bội Châu, Phan Châu Trinh tiếp tục khác chiến bằng những cách khác nhau.',
      bullets: [
        'Khơi dậy tâm thức yêu nước',
        'Là tiền đề cho các phong trào kháng chiến sau',
        'Sinh ra các lãnh tụ tiên phong trong cách mạng'
      ]
    }
  ],
  people: [
    {
      id: 'ham-nghi',
      name: 'Vua Hàm Nghi',
      role: 'Vua Việt Nam',
      bio: 'Vua Hàm Nghi là vị vua trẻ tuổi nhưng có tinh thần yêu nước mãnh liệt. Ông phát động phong trào Cần Vương khi mới 16 tuổi, là biểu tượng của tinh thần kháng chiến dân tộc.',
      quotes: ['Cần Vương để cứu nước']
    },
    {
      id: 'phan-dinh-phuong',
      name: 'Phan Đình Phùng',
      role: 'Tướng lĩnh Cần Vương',
      bio: 'Phan Đình Phùng là một trong những tướng lĩnh tài ba nhất của phong trào Cần Vương. Ông đã lãnh đạo các cuộc chiến ở Hà Tĩnh với tài mưu trí đáng kinh ngạc.',
      quotes: ['Sẽ kháng chiến đến cùng cùng']
    }
  ],
  sources: [
    {
      id: 'source-4',
      type: 'primary',
      title: 'Chiếu Cần Vương',
      author: 'Vua Hàm Nghi',
      year: '1885',
      reliability: 'high'
    },
    {
      id: 'source-5',
      type: 'secondary',
      title: 'Lịch sử Cần Vương',
      author: 'Nxb. Quân đội Nhân dân',
      year: '1975',
      reliability: 'high'
    }
  ],
  media: {
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kham_Nghi.jpg/300px-Kham_Nghi.jpg',
        title: 'Vua Hàm Nghi',
        caption: 'Vua Hàm Nghi – người phát động phong trào Cần Vương',
        credit: 'Wikipedia'
      }
    ]
  },
  meta: {
    revision: 'v1.0',
    updatedAt: '2025-01-15T00:00:00.000Z'
  }
};

const dongDu1905: DeepEvent = {
  id: 'dong-du-1905',
  headline: 'Đông Du – Duy Tân',
  date: '15/06/1905',
  location: 'Nhật Bản · Bắc Kỳ',
  summary: 'Phan Bội Châu – Phan Châu Trinh triển khai phong trào Đông Du và Duy Tân, gửi thanh niên sang Nhật học tập và cổ vũ cải cách giáo dục.',
  sections: [
    {
      id: 'context-3',
      title: 'Bối cảnh cải cách thế kỷ XX',
      kind: 'context',
      content: 'Sau thất bại của Cần Vương, các lãnh tụ yêu nước nhận ra cần phải thay đổi chiến lược. Phan Bội Châu và Phan Châu Trinh, mặc dù có cách tiếp cận khác nhau, đều hướng tới hiện đại hóa Việt Nam.',
      bullets: [
        'Phan Bội Châu theo đường lối tây tân',
        'Phan Châu Trinh theo đường lối cải cách',
        'Nhật Bản thành tâm điểm học tập'
      ]
    },
    {
      id: 'timeline-3',
      title: 'Phong trào Đông Du',
      kind: 'timeline',
      content: 'Năm 1905, các thanh niên Việt Nam được gửi sang Nhật Bản để học tập quân sự và kinh tế. Đây là bước khởi đầu của phong trào Đông Du lịch sử.',
      bullets: [
        'Năm 1905: Thanh niên Đông Du được gửi sang Nhật Bản',
        'Học tập tại các quân trường Hokkaido và Tokyo',
        'Năm 1908: Phan Bội Châu được bắt ở Hà Nội',
        'Phong trào Đông Du tiếp tục tính đến năm 1908'
      ]
    },
    {
      id: 'analysis-3',
      title: 'Ý nghĩa của Đông Du – Duy Tân',
      kind: 'analysis',
      content: 'Đông Du là nỗ lực đầu tiên của trí thức Việt Nam trong việc tìm kiếm đường lối cải cách. Mặc dù bị chính quyền Pháp cảnh báo, phong trào vẫn tiếp tục với sức sống mãnh liệt.',
      bullets: [
        'Là sự khởi đầu của phong trào Duy Tân',
        'Tạo ra lớp inteligensia hiện đại',
        'Chuẩn bị cho Cách mạng tháng Tám'
      ]
    }
  ],
  people: [
    {
      id: 'phan-boi-chau',
      name: 'Phan Bội Châu',
      role: 'Lãnh tụ Đông Du',
      bio: 'Phan Bội Châu là người tiên phong trong phong trào Đông Du. Ông đã đưa hàng chục thanh niên Việt Nam sang Nhật Bản để học tập quân sự.',
      quotes: ['Phải đi học phương Tây để cứu nước']
    },
    {
      id: 'phan-chu-trinh',
      name: 'Phan Châu Trinh',
      role: 'Lãnh tụ Duy Tân',
      bio: 'Phan Châu Trinh theo đường lối cải cách, sủng ho lại động của thanh niên học tập để nâng cao tri thức. Ông là người hỗ trợ Duy Tân.',
      quotes: ['Giáo dục là chìa khóa']
    }
  ],
  sources: [
    {
      id: 'source-6',
      type: 'secondary',
      title: 'Tư liệu Đông Du',
      author: 'Bộ Giáo dục Việt Nam',
      reliability: 'high'
    },
    {
      id: 'source-7',
      type: 'secondary',
      title: 'Báo chí Duy Tân 1906',
      year: '1906',
      reliability: 'medium'
    }
  ],
  media: {
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Phan_Boi_Chau.jpg/200px-Phan_Boi_Chau.jpg',
        title: 'Phan Bội Châu',
        caption: 'Phan Bội Châu – người khởi động phong trào Đông Du',
        credit: 'Wikipedia'
      }
    ]
  },
  meta: {
    revision: 'v1.0',
    updatedAt: '2025-01-15T00:00:00.000Z'
  }
};

const workerMovements1910: DeepEvent = {
  id: 'worker-movements-1910',
  headline: 'Phong trào công nhân & yêu nước',
  date: '01/05/1910',
  location: 'Sài Gòn · Hà Nội · Hải Phòng',
  summary: 'Công nhân các khu nhà máy lớn liên tục đình công đòi lương, giảm giờ làm và phối hợp với chí sĩ yêu nước chống đối sự đô hộ của Pháp.',
  sections: [
    {
      id: 'context-4',
      title: 'Tình hình xã hội thời kỳ công nghiệp hóa',
      kind: 'context',
      content: 'Thế kỷ XX, nền kinh tế Việt Nam dưới thống trị của Pháp bắt đầu hiện đại hóa. Các nhà máy, xí nghiệp được xây dựng, tạo ra lớp công nhân mới. Tuy nhiên, điều kiện làm việc rất tệ.',
      bullets: [
        'Nhà máy được xây dựng ở Sài Gòn, Hà Nội, Hải Phòng',
        'Công nhân bị bóc lột mạnh mẽ',
        'Tiền lương thấp, giờ làm dài'
      ]
    },
    {
      id: 'timeline-4',
      title: 'Các cuộc đình công',
      kind: 'timeline',
      content: 'Bắt đầu từ năm 1910, công nhân bắt đầu tổ chức đình công để đòi quyền lợi.',
      bullets: [
        'Năm 1910: Đình công tại nhà máy Sài Gòn',
        'Công hội bí mật lan sang Hà Nội và Hải Phòng',
        'Các chí sĩ yêu nước tham gia hỗ trợ phong trào',
        'Pháp tăng cường đàn áp công nhân'
      ]
    },
    {
      id: 'impact-4',
      title: 'Ảnh hưởng của phong trào công nhân',
      kind: 'impact',
      content: 'Phong trào công nhân là khởi đầu của giai cấp công nhân Việt Nam. Nó là nền tảng cho sự hình thành của đảng cộng sản sau này.',
      bullets: [
        'Khơi dậy ý thức giai cấp',
        'Là tiền đề cho Đảng Cộng sản',
        'Gắn kết công nhân và tri thức'
      ]
    }
  ],
  people: [
    {
      id: 'worker-leader-1',
      name: 'Các nhà lãnh đạo công nhân',
      role: 'Lãnh tụ phong trào',
      bio: 'Các công nhân lãnh đạo đã tổ chức đình công và liên lạc với chí sĩ yêu nước để chống lại sự bóc lột của Pháp.',
      quotes: ['Đoàn kết để đòi quyền lợi']
    }
  ],
  sources: [
    {
      id: 'source-8',
      type: 'secondary',
      title: 'Tờ báo L\'Annam Nouveau',
      year: '1910',
      reliability: 'high'
    },
    {
      id: 'source-9',
      type: 'secondary',
      title: 'Hồi ký công nhân năm 1919',
      year: '1919',
      reliability: 'medium'
    }
  ],
  media: {
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hanoi_old_street.jpg/640px-Hanoi_old_street.jpg',
        title: 'Hà Nội thế kỷ XX',
        caption: 'Cảnh phố Hà Nội thời kỳ công nghiệp hóa',
        credit: 'Wikipedia'
      }
    ]
  },
  meta: {
    revision: 'v1.0',
    updatedAt: '2025-01-15T00:00:00.000Z'
  }
};

const nguyenAiQuoc1911: DeepEvent = {
  id: 'nguyen-ai-quoc-journey',
  headline: 'Nguyễn Ái Quốc tìm đường cứu nước',
  date: '05/06/1911',
  location: 'Paris · Quốc tế công sản',
  summary: 'Nguyễn Tất Thành ra đi bằng tàu, gửi Yêu sách 8 điểm lên Hội nghị Versailles và tìm hiểu chủ nghĩa Mác – Lênin.',
  sections: [
    {
      id: 'context-5',
      title: 'Bối cảnh quốc tế sau Thế chiến thứ nhất',
      kind: 'context',
      content: 'Sau Thế chiến thứ nhất, thế giới bước vào giai đoạn mới với sự thức tỉnh của các dân tộc. Hội nghị Versailles năm 1919 trở thành sân chơi của các quyền lực toàn cầu.',
      bullets: [
        'Liên Xô mới thành lập theo chủ nghĩa Marxist',
        'Các phong trào cách mạng bùng lên khắp thế giới',
        'Công sản quốc tế thành hình'
      ]
    },
    {
      id: 'timeline-5',
      title: 'Hành trình của Nguyễn Ái Quốc',
      kind: 'timeline',
      content: 'Năm 1911, Nguyễn Tất Thành (tức Hồ Chí Minh sau này) rời Việt Nam để tìm kiếm con đường cứu nước.',
      bullets: [
        'Năm 1911: Nguyễn Tất Thành rời Hải Phòng',
        'Năm 1917: Quân Đỏ thành lập ở Liên Xô',
        'Năm 1919: Gửi Yêu sách 8 điểm lên Hội nghị Versailles',
        'Năm 1920: Gia nhập Đảng Cộng sản Pháp'
      ]
    },
    {
      id: 'analysis-5',
      title: 'Phân tích hành trình tìm kiếm',
      kind: 'analysis',
      content: 'Hành trình của Nguyễn Ái Quốc là sự tìm kiếm chân thực của một người yêu nước. Ông đã thử nhiều cách để giải phóng dân tộc trước khi tìm ra con đường Mác – Lênin.',
      bullets: [
        'Tìm kiếm từ tây phương hóa đến cộng sản',
        'Yêu sách 8 điểm là lời kêu gọi công khai',
        'Sự thay đổi tư tưởng dẫn đến con đường Cách mạng'
      ]
    },
    {
      id: 'impact-5',
      title: 'Ảnh hưởng lâu dài',
      kind: 'impact',
      content: 'Hành trình của Nguyễn Ái Quốc quyết định con đường phát triển của Cách mạng Việt Nam. Ông trở thành người sáng lập Đảng Cộng sản Việt Nam.',
      bullets: [
        'Thành lập Đảng Cộng sản Việt Nam năm 1930',
        'Trở thành lãnh tụ Cách mạng Việt Nam',
        'Cấu hình tương lai Việt Nam'
      ]
    }
  ],
  people: [
    {
      id: 'ho-chi-minh',
      name: 'Nguyễn Ái Quốc (Hồ Chí Minh)',
      role: 'Nhà cách mạng',
      bio: 'Nguyễn Ái Quốc là người sáng lập Đảng Cộng sản Việt Nam. Ông đi tìm con đường cứu nước từ năm 1911 và cuối cùng tìm ra chủ nghĩa Mác – Lênin.',
      quotes: ['Sẽ giải phóng nước mình']
    }
  ],
  sources: [
    {
      id: 'source-10',
      type: 'primary',
      title: 'Hồ sơ 1919',
      year: '1919',
      reliability: 'high'
    },
    {
      id: 'source-11',
      type: 'primary',
      title: 'Phát biểu tại Hội đồng Cộng sản Quốc tế',
      year: '1924',
      reliability: 'high'
    }
  ],
  media: {
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Ho_Chi_Minh_%281946%29.jpg/200px-Ho_Chi_Minh_%281946%29.jpg',
        title: 'Hồ Chí Minh',
        caption: 'Hồ Chí Minh – lãnh tụ cách mạng',
        credit: 'Wikipedia'
      }
    ]
  },
  meta: {
    revision: 'v1.0',
    updatedAt: '2025-01-15T00:00:00.000Z'
  }
};

export function getDeepEventById(id?: string): DeepEvent {
  if (!id) return independence1945;
  switch (id) {
    case 'independence-1945':
      return independence1945;
    case 'resistance-1946':
      return resistance1946;
    case 'france-invasion-1858':
      return franceInvasion1858;
    case 'can-vuong-1885':
      return canVuong1885;
    case 'dong-du-1905':
      return dongDu1905;
    case 'worker-movements-1910':
      return workerMovements1910;
    case 'nguyen-ai-quoc-journey':
      return nguyenAiQuoc1911;
    default:
      return independence1945;
  }
}
