import { useState } from 'react';
import { Gift, Star, Wallet, Check, Copy, Clock, AlertCircle } from 'lucide-react';
import {
  voucherTemplates,
  getUserPoints,
  getRedeemedVouchers,
  redeemVoucher,
  formatCurrency,
  formatPoints,
  type VoucherTemplate,
  type RedeemedVoucher,
  type VoucherProvider,
} from '../lib/voucherService';

interface Props {
  userId: string;
  onPointsChange?: (newTotal: number) => void;
}

export default function VoucherRedemption({ userId, onPointsChange }: Props) {
  const [points, setPoints] = useState(() => getUserPoints(userId));
  const [vouchers, setVouchers] = useState(() => getRedeemedVouchers(userId));
  const [selectedProvider, setSelectedProvider] = useState<VoucherProvider | 'all'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<RedeemedVoucher | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredTemplates = voucherTemplates.filter(
    (t) => selectedProvider === 'all' || t.provider === selectedProvider
  );

  const handleRedeem = async (template: VoucherTemplate) => {
    setRedeemingId(template.id);
    setError(null);

    // Simulate network delay for demo
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = redeemVoucher(userId, template.id);

    if (result.success && result.voucher) {
      const updatedPoints = getUserPoints(userId);
      setPoints(updatedPoints);
      setVouchers(getRedeemedVouchers(userId));
      setShowSuccess(result.voucher);
      // Notify parent component about points change
      onPointsChange?.(updatedPoints.total);
    } else {
      setError(result.error || 'Có lỗi xảy ra');
    }

    setRedeemingId(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <div className="space-y-8">
      {/* Points Summary */}
      <div className="rounded-2xl border border-[#F4D03F]/30 bg-gradient-to-br from-[#1A1A1A] via-[#0D0D0D] to-[#1A1A1A] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Điểm tích lũy</p>
            <div className="mt-2 flex items-center gap-3">
              <Star className="h-8 w-8 text-[#F4D03F]" fill="#F4D03F" />
              <span className="text-4xl font-bold text-[#F4D03F]">{formatPoints(points.total)}</span>
              <span className="text-lg text-gray-400">điểm</span>
            </div>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Đã tích: <span className="text-emerald-400">{formatPoints(points.earned)}</span></p>
            <p>Đã dùng: <span className="text-rose-400">{formatPoints(points.spent)}</span></p>
          </div>
        </div>
      </div>

      {/* Provider Filter */}
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedProvider('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedProvider === 'all'
              ? 'bg-[#F4D03F] text-[#0D0D0D]'
              : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#F4D03F]/20'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setSelectedProvider('momo')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
            selectedProvider === 'momo'
              ? 'bg-[#A50064] text-white'
              : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#A50064]/20'
          }`}
        >
          <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" className="h-5 w-5 rounded" />
          Momo
        </button>
        <button
          onClick={() => setSelectedProvider('vnpay')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
            selectedProvider === 'vnpay'
              ? 'bg-[#0066CC] text-white'
              : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#0066CC]/20'
          }`}
        >
          <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg" alt="VNPay" className="h-5 w-5 rounded" />
          VNPay
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-900/20 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-400" />
          <p className="text-rose-400">{error}</p>
        </div>
      )}

      {/* Voucher Templates Grid */}
      <div>
        <h3 className="text-lg font-semibold text-[#F4D03F] mb-4 flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Đổi điểm lấy voucher
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => {
            const canAfford = points.total >= template.pointsCost;
            const isRedeeming = redeemingId === template.id;

            return (
              <div
                key={template.id}
                className={`relative rounded-xl border p-4 transition ${
                  canAfford
                    ? 'border-[#F4D03F]/30 bg-[#1A1A1A] hover:border-[#F4D03F]/50'
                    : 'border-gray-700 bg-[#1A1A1A]/50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={template.image}
                    alt={template.provider}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{template.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#F4D03F]">
                    <Star className="h-4 w-4" fill="#F4D03F" />
                    <span className="font-bold">{formatPoints(template.pointsCost)}</span>
                    <span className="text-xs text-gray-400">điểm</span>
                  </div>
                  <button
                    onClick={() => handleRedeem(template)}
                    disabled={!canAfford || isRedeeming}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      canAfford
                        ? 'bg-[#F4D03F] text-[#0D0D0D] hover:bg-[#F4D03F]/90'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isRedeeming ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
                        Đang đổi...
                      </span>
                    ) : (
                      'Đổi ngay'
                    )}
                  </button>
                </div>

                {!canAfford && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0D0D0D]/60 rounded-xl">
                    <p className="text-sm text-gray-400">
                      Cần thêm {formatPoints(template.pointsCost - points.total)} điểm
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeemed Vouchers */}
      {vouchers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-[#F4D03F] mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Voucher của bạn ({vouchers.length})
          </h3>
          <div className="space-y-3">
            {vouchers.map((voucher) => {
              const template = voucherTemplates.find((t) => t.id === voucher.templateId);
              const expired = isExpired(voucher.expiresAt);

              return (
                <div
                  key={voucher.id}
                  className={`rounded-xl border p-4 ${
                    voucher.used || expired
                      ? 'border-gray-700 bg-[#1A1A1A]/50 opacity-60'
                      : 'border-[#F4D03F]/30 bg-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={template?.image}
                        alt={voucher.provider}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-white">{template?.name}</p>
                        <p className="text-xs text-gray-400">
                          {voucher.used ? (
                            <span className="text-gray-500">Đã sử dụng</span>
                          ) : expired ? (
                            <span className="text-rose-400">Đã hết hạn</span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              HSD: {formatDate(voucher.expiresAt)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {!voucher.used && !expired && (
                      <div className="flex items-center gap-2">
                        <code className="px-3 py-1 rounded-lg bg-[#0D0D0D] text-[#F4D03F] font-mono text-sm">
                          {voucher.code}
                        </code>
                        <button
                          onClick={() => copyCode(voucher.code)}
                          className="p-2 rounded-lg bg-[#0D0D0D] text-gray-400 hover:text-[#F4D03F] transition"
                        >
                          {copiedCode === voucher.code ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D0D]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#F4D03F]/30 bg-gradient-to-br from-[#1A1A1A] via-[#0D0D0D] to-[#1A1A1A] p-6 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-[#F4D03F]">Đổi voucher thành công!</h3>
            <p className="mt-2 text-gray-400">Mã voucher của bạn:</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <code className="px-4 py-2 rounded-lg bg-[#0D0D0D] text-[#F4D03F] font-mono text-lg">
                {showSuccess.code}
              </code>
              <button
                onClick={() => copyCode(showSuccess.code)}
                className="p-2 rounded-lg bg-[#0D0D0D] text-gray-400 hover:text-[#F4D03F] transition"
              >
                {copiedCode === showSuccess.code ? (
                  <Check className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Giá trị: <span className="text-[#F4D03F]">{formatCurrency(showSuccess.value)}</span>
            </p>
            <p className="text-sm text-gray-400">
              Hạn sử dụng: {formatDate(showSuccess.expiresAt)}
            </p>
            <button
              onClick={() => setShowSuccess(null)}
              className="mt-6 w-full py-3 rounded-full bg-[#F4D03F] text-[#0D0D0D] font-semibold hover:bg-[#F4D03F]/90 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
