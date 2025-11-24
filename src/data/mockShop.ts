import type { Product } from '../lib/supabase';
import { listMembershipPlans } from '../lib/memberships';

export type MockReview = {
  id: string;
  product_id: string;
  author: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type MockChatMessage = {
  id: string;
  product_id: string;
  author: 'seller' | 'buyer';
  message: string;
  created_at: string;
};

const membershipProducts: Product[] = listMembershipPlans().map((plan) => ({
  id: plan.id,
  name: plan.name,
  description: plan.description,
  price: plan.price,
  image_url: plan.image,
  category: 'Membership',
  created_at: new Date().toISOString(),
  seller_name: 'Echoes of Việt Nam',
  seller_title: plan.headline,
  seller_location: 'Trực tuyến',
  seller_contact: 'support@echoes.vn',
}));

export const mockProducts: Product[] = [
  ...membershipProducts,
  {
    id: 'mock-product-1',
    name: 'Tranh Cổ Động Điện Biên Phủ',
    description:
      'Bản in giới hạn của bức tranh cổ động chiến dịch Điện Biên Phủ, in trên giấy mỹ thuật Italia với khung gỗ lim xử lý thủ công.',
    price: 1250000,
    image_url: 'https://file.qdnd.vn/data/images/0/2019/05/06/thuha/060519ha3.jpg?dpi=150&quality=100&w=575',
    category: 'Nghệ Thuật',
    created_at: new Date().toISOString(),
    seller_name: 'Nhà sưu tập Trần Minh Hải',
    seller_title: 'Sưu tập tranh kháng chiến',
    seller_location: 'Hà Nội',
    seller_contact: '0938 123 456',
  },
  {
    id: 'mock-product-2',
    name: 'Áo Khoác Kỷ Niệm Đường Trường Sơn',
    description:
      'Áo khoác thiết kế theo phong cách quân trang Trường Sơn, chất liệu cotton canvas cao cấp, may thủ công tại Huế.',
    price: 890000,
    image_url: 'https://quanaobodoi.vn/wp-content/uploads/2025/01/20241013_154918.jpg',
    category: 'Thời Trang',
    created_at: new Date().toISOString(),
    seller_name: 'Xưởng may Di Sản',
    seller_title: 'Thủ công truyền thống',
    seller_location: 'Thừa Thiên Huế',
    seller_contact: 'heritage@atelier.vn',
  },
  {
    id: 'mock-product-3',
    name: 'Bộ Tem Chiến Khu Việt Bắc 1951',
    description:
      'Bộ tem được bảo quản trong bìa kính, chứng nhận nguồn gốc từ nhà sưu tầm độc lập tại Bắc Giang.',
    price: 450000,
    image_url: 'https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/dataimages/201805/original/images5332714_FullSizeRender.jpg',
    category: 'Sưu Tầm',
    created_at: new Date().toISOString(),
    seller_name: 'Tiệm Tem Cổ Ánh Dương',
    seller_title: 'Sưu tập tem Đông Dương',
    seller_location: 'Bắc Giang',
    seller_contact: 'zalo.me/temanhduong',
  },
  {
    id: 'mock-product-4',
    name: 'Sách Ảnh Ký Ức Miền Nam 1960-1975',
    description:
      'Ấn bản tái bản giới hạn gồm 300 trang ảnh tư liệu do các phóng viên chiến trường ghi lại.',
    price: 520000,
    image_url: 'https://cdn.nhandan.vn/images/22f099ca8bc7ae81aa2a8d3416a84bf8364c2dc7cb172c184e762ebbc2cb754bd7608af5bb627e147dde1014ddba172fd2075ff2f0d994ca8a9715f54a5b4ee304b0f24db637d2585f8e3ff472c03efa41226dca830effaf1ecda30feed56985446b3bdd1bfbeba01f80d226c8bffd0a31017b07789999476c90be6e264b4707/z6461813506481-960bf7af4b27ddeb16ceb486ab60b6de-3040-8098.jpg.webp',
    category: 'Sách',
    created_at: new Date().toISOString(),
    seller_name: 'NXB Hồi Ức Việt',
    seller_title: 'Tư liệu lịch sử',
    seller_location: 'TP. Hồ Chí Minh',
    seller_contact: 'contact@hoiucc.vn',
  },
  {
    id: 'mock-product-5',
    name: 'Mô hình Tàu Không Số HQ-671',
    description:
      'Mô hình tàu không số tỉ lệ 1:72 với các chi tiết đồng nguyên chất, đi kèm chân đế khắc laser.',
    price: 2100000,
    image_url: 'https://mohinhthuyenbuom.com/wp-content/uploads/2019/07/Thuyen-chien-KORIETZ-Кореец-min.jpg',
    category: 'Thủ Công',
    created_at: new Date().toISOString(),
    seller_name: 'Studio Ký Ức Xanh',
    seller_title: 'Điêu khắc mô hình',
    seller_location: 'Đà Nẵng',
    seller_contact: 'info@kyucxanh.vn',
  },
  {
    id: 'mock-product-6',
    name: 'Bưu Thiếp Bưu thiếp Lăng Bác - Vẽ Ký Ức Hà Nội',
    description:
      'Bưu Thiếp Bưu thiếp Lăng Bác - Vẽ Ký Ức Hà Nội',
    price: 320000,
    image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m25xigxhvues3f.webp',
    category: 'Ấn Phẩm',
    created_at: new Date().toISOString(),
    seller_name: 'Nhà in Tháng Tám',
    seller_title: 'Ấn phẩm lưu niệm',
    seller_location: 'Hà Nội',
    seller_contact: 'tha8printing.vn',
  },
];

export const mockProductReviews: MockReview[] = [
  {
    id: 'mock-review-1',
    product_id: 'mock-product-1',
    author: 'Lê Quốc Bảo',
    rating: 5,
    comment: 'Chất lượng in sắc nét, màu sắc đẹp hơn mong đợi. Đóng gói chắc chắn.',
    created_at: '2025-09-12T10:15:00.000Z',
  },
  {
    id: 'mock-review-2',
    product_id: 'mock-product-2',
    author: 'Nguyễn Thảo My',
    rating: 4,
    comment: 'Áo giữ ấm tốt, may chắc chắn. Form hơi rộng nên cần chọn nhỏ hơn một size.',
    created_at: '2025-08-02T08:40:00.000Z',
  },
  {
    id: 'mock-review-3',
    product_id: 'mock-product-4',
    author: 'Phạm Đình Tuấn',
    rating: 5,
    comment: 'Tài liệu quý giá, phần chú thích rất chi tiết. Đáng để sưu tầm.',
    created_at: '2025-07-18T13:25:00.000Z',
  },
  {
    id: 'mock-review-4',
    product_id: 'mock-product-5',
    author: 'Vũ Kiều An',
    rating: 5,
    comment: 'Mô hình tinh xảo đến từng chi tiết nhỏ, cảm giác rất chân thực.',
    created_at: '2025-05-09T16:05:00.000Z',
  },
];

export const mockChatThreads: Record<string, MockChatMessage[]> = {
  'mock-product-2': [
    {
      id: 'mock-chat-1',
      product_id: 'mock-product-2',
      author: 'buyer',
      message: 'Áo này có size S không ạ?',
      created_at: '2025-10-18T09:21:00.000Z',
    },
    {
      id: 'mock-chat-2',
      product_id: 'mock-product-2',
      author: 'seller',
      message: 'Dạ có đủ size từ S đến XL, bạn cần mình giữ hàng giúp không?',
      created_at: '2025-10-18T09:25:00.000Z',
    },
  ],
  'mock-product-4': [
    {
      id: 'mock-chat-3',
      product_id: 'mock-product-4',
      author: 'buyer',
      message: 'Sách có kèm hộp bảo quản không anh?',
      created_at: '2025-09-01T11:10:00.000Z',
    },
    {
      id: 'mock-chat-4',
      product_id: 'mock-product-4',
      author: 'seller',
      message: 'Có kèm hộp carton cứng và túi chống ẩm bạn nhé.',
      created_at: '2025-09-01T11:12:00.000Z',
    },
  ],
};
