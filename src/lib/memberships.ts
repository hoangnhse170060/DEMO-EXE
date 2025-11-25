export type MembershipPlan = {
  id: string;
  label: string;
  name: string;
  price: number;
  durationDays: number;
  rewardStars: number;
  description: string;
  headline: string;
  image: string;
};

const membershipPlans: Record<string, MembershipPlan> = {
  'attempt-pack-10': {
    id: 'attempt-pack-10',
    label: 'Gói +10 lượt',
    name: 'Gói bổ sung 10 lượt Quiz',
    price: 19000,
    durationDays: 30,
    rewardStars: 20,
    description: 'Nạp thêm 10 lượt làm quiz ngay lập tức, phù hợp khi bạn bị khóa vì hết lượt.',
    headline: 'Thêm lượt thử ngay tức thì để tiếp tục ôn luyện.',
    image: 'https://img.pikbest.com/png-images/qiantu/yellow-vip-logo_2622515.png!sw800',
  },
  'membership-annual': {
    id: 'membership-annual',
    label: 'Gói năm',
    name: 'Gói thành viên Quiz 12 tháng',
    price: 189000,
    durationDays: 365,
    rewardStars: 1200,
    description: 'Không giới hạn quiz suốt 12 tháng, cộng 1.200 sao và mở khóa toàn bộ chuyên đề chuyên sâu.',
    headline: 'Dành cho thành viên chuyên sâu muốn nghiên cứu cả năm.',
    image: 'https://img.pikbest.com/png-images/qiantu/yellow-vip-logo_2622515.png!sw800',
  },
};

export const MEMBERSHIP_TERMS: string[] = [
  'Gói +10 lượt quiz bổ sung ngay 10 lượt làm bài cho sự kiện bạn chọn, áp dụng tức thời sau khi thanh toán.',
  'Gói 19.000₫ kích hoạt quyền truy cập quiz nâng cao trong 30 ngày kể từ thời điểm thanh toán thành công.',
  'Gói 490.000₫ kích hoạt quyền truy cập quiz nâng cao trong 12 tháng và cộng dồn sao thưởng 1 lần.',
  'Sao thưởng được cộng ngay sau khi giao dịch xác nhận thành công và không hoàn lại nếu hủy giữa chừng.',
  'Các gói thành viên là sản phẩm số, không yêu cầu giao hàng vật lý và tuân thủ điều khoản sử dụng của Echoes of Việt Nam.',
];

export function getMembershipPlan(planId: string): MembershipPlan | null {
  return membershipPlans[planId] ?? null;
}

export function listMembershipPlans(): MembershipPlan[] {
  return Object.values(membershipPlans);
}
