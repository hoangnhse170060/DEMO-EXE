// Voucher Redemption Service - Demo mode with 1000 points per user

export type VoucherProvider = 'momo' | 'vnpay';

export interface VoucherTemplate {
  id: string;
  provider: VoucherProvider;
  name: string;
  description: string;
  value: number; // VND value
  pointsCost: number;
  image: string;
}

export interface RedeemedVoucher {
  id: string;
  templateId: string;
  provider: VoucherProvider;
  code: string;
  value: number;
  redeemedAt: string;
  expiresAt: string;
  used: boolean;
}

export interface UserPoints {
  total: number;
  earned: number;
  spent: number;
  history: PointTransaction[];
}

export interface PointTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  createdAt: string;
}

// Voucher templates available for redemption
export const voucherTemplates: VoucherTemplate[] = [
  {
    id: 'momo-10k',
    provider: 'momo',
    name: 'Voucher Momo 10.000đ',
    description: 'Giảm 10.000đ cho đơn hàng từ 50.000đ trên Momo',
    value: 10000,
    pointsCost: 100,
    image: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
  },
  {
    id: 'momo-20k',
    provider: 'momo',
    name: 'Voucher Momo 20.000đ',
    description: 'Giảm 20.000đ cho đơn hàng từ 100.000đ trên Momo',
    value: 20000,
    pointsCost: 180,
    image: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
  },
  {
    id: 'momo-50k',
    provider: 'momo',
    name: 'Voucher Momo 50.000đ',
    description: 'Giảm 50.000đ cho đơn hàng từ 200.000đ trên Momo',
    value: 50000,
    pointsCost: 400,
    image: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
  },
  {
    id: 'vnpay-10k',
    provider: 'vnpay',
    name: 'Voucher VNPay 10.000đ',
    description: 'Giảm 10.000đ cho thanh toán qua VNPay',
    value: 10000,
    pointsCost: 100,
    image: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg',
  },
  {
    id: 'vnpay-20k',
    provider: 'vnpay',
    name: 'Voucher VNPay 20.000đ',
    description: 'Giảm 20.000đ cho thanh toán qua VNPay',
    value: 20000,
    pointsCost: 180,
    image: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg',
  },
  {
    id: 'vnpay-50k',
    provider: 'vnpay',
    name: 'Voucher VNPay 50.000đ',
    description: 'Giảm 50.000đ cho thanh toán qua VNPay',
    value: 50000,
    pointsCost: 400,
    image: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg',
  },
  {
    id: 'momo-100k',
    provider: 'momo',
    name: 'Voucher Momo 100.000đ',
    description: 'Giảm 100.000đ cho đơn hàng từ 500.000đ trên Momo',
    value: 100000,
    pointsCost: 750,
    image: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
  },
  {
    id: 'vnpay-100k',
    provider: 'vnpay',
    name: 'Voucher VNPay 100.000đ',
    description: 'Giảm 100.000đ cho thanh toán qua VNPay',
    value: 100000,
    pointsCost: 750,
    image: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg',
  },
];

const POINTS_KEY = 'user_points';
const VOUCHERS_KEY = 'redeemed_vouchers';
const DEFAULT_POINTS = 1000; // Demo: mỗi user có 1000 điểm

// Generate random voucher code
function generateVoucherCode(provider: VoucherProvider): string {
  const prefix = provider === 'momo' ? 'MOMO' : 'VNPAY';
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${randomPart}`;
}

// Get user points
export function getUserPoints(userId: string): UserPoints {
  const key = `${POINTS_KEY}_${userId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize with default points for demo
  const defaultPoints: UserPoints = {
    total: DEFAULT_POINTS,
    earned: DEFAULT_POINTS,
    spent: 0,
    history: [
      {
        id: 'init-bonus',
        type: 'earn',
        amount: DEFAULT_POINTS,
        description: 'Điểm thưởng chào mừng thành viên mới',
        createdAt: new Date().toISOString(),
      },
    ],
  };
  
  localStorage.setItem(key, JSON.stringify(defaultPoints));
  return defaultPoints;
}

// Save user points
function saveUserPoints(userId: string, points: UserPoints): void {
  const key = `${POINTS_KEY}_${userId}`;
  localStorage.setItem(key, JSON.stringify(points));
}

// Get redeemed vouchers
export function getRedeemedVouchers(userId: string): RedeemedVoucher[] {
  const key = `${VOUCHERS_KEY}_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

// Save redeemed vouchers
function saveRedeemedVouchers(userId: string, vouchers: RedeemedVoucher[]): void {
  const key = `${VOUCHERS_KEY}_${userId}`;
  localStorage.setItem(key, JSON.stringify(vouchers));
}

// Redeem a voucher
export function redeemVoucher(
  userId: string,
  templateId: string
): { success: boolean; voucher?: RedeemedVoucher; error?: string } {
  const template = voucherTemplates.find((t) => t.id === templateId);
  
  if (!template) {
    return { success: false, error: 'Voucher không tồn tại' };
  }
  
  const points = getUserPoints(userId);
  
  if (points.total < template.pointsCost) {
    return {
      success: false,
      error: `Bạn cần ${template.pointsCost} điểm nhưng chỉ có ${points.total} điểm`,
    };
  }
  
  // Deduct points
  const transaction: PointTransaction = {
    id: `txn-${Date.now()}`,
    type: 'spend',
    amount: template.pointsCost,
    description: `Đổi ${template.name}`,
    createdAt: new Date().toISOString(),
  };
  
  points.total -= template.pointsCost;
  points.spent += template.pointsCost;
  points.history.unshift(transaction);
  saveUserPoints(userId, points);
  
  // Create voucher
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // Valid for 30 days
  
  const newVoucher: RedeemedVoucher = {
    id: `voucher-${Date.now()}`,
    templateId: template.id,
    provider: template.provider,
    code: generateVoucherCode(template.provider),
    value: template.value,
    redeemedAt: new Date().toISOString(),
    expiresAt: expiryDate.toISOString(),
    used: false,
  };
  
  const vouchers = getRedeemedVouchers(userId);
  vouchers.unshift(newVoucher);
  saveRedeemedVouchers(userId, vouchers);
  
  return { success: true, voucher: newVoucher };
}

// Mark voucher as used
export function markVoucherUsed(userId: string, voucherId: string): boolean {
  const vouchers = getRedeemedVouchers(userId);
  const index = vouchers.findIndex((v) => v.id === voucherId);
  
  if (index === -1) return false;
  
  vouchers[index].used = true;
  saveRedeemedVouchers(userId, vouchers);
  return true;
}

// Add points (e.g., from quiz completion)
export function addPoints(userId: string, amount: number, description: string): UserPoints {
  const points = getUserPoints(userId);
  
  const transaction: PointTransaction = {
    id: `txn-${Date.now()}`,
    type: 'earn',
    amount,
    description,
    createdAt: new Date().toISOString(),
  };
  
  points.total += amount;
  points.earned += amount;
  points.history.unshift(transaction);
  saveUserPoints(userId, points);
  
  return points;
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

// Format points
export function formatPoints(points: number): string {
  return new Intl.NumberFormat('vi-VN').format(points);
}
