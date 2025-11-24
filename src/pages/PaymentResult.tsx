import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { paymentService } from '../lib/paymentService'
import { getMembershipPlan, MEMBERSHIP_TERMS } from '../lib/memberships'
import { localAuth } from '../lib/localAuth'
import { addExtraAttempts, popPendingDigitalPurchase, type PendingDigitalPurchase } from '../lib/storage'
import { CheckCircle, XCircle, Loader, Sparkles } from 'lucide-react'

const DIGITAL_META_PREFIX = '[digital-meta]'

function parseDigitalMeta(notes?: string | null): PendingDigitalPurchase | null {
  if (!notes) return null
  const markerIndex = notes.lastIndexOf(DIGITAL_META_PREFIX)
  if (markerIndex === -1) return null
  const raw = notes.slice(markerIndex + DIGITAL_META_PREFIX.length).trim()
  if (!raw) return null
  try {
    return JSON.parse(raw) as PendingDigitalPurchase
  } catch (error) {
    console.warn('Không thể parse thông tin mua lượt từ ghi chú đơn hàng', error)
    return null
  }
}

export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing')
  const [orderId, setOrderId] = useState<string>('')
  const [orderDetails, setOrderDetails] = useState<any | null>(null)
  const [digitalMeta, setDigitalMeta] = useState<PendingDigitalPurchase | null>(null)
  const [rewardApplied, setRewardApplied] = useState(false)

  useEffect(() => {
    verifyPayment()
  }, [])

  const verifyPayment = async () => {
    try {
      const statusParam = searchParams.get('status') as 'success' | 'failed' | null
      const directOrderId = searchParams.get('orderId')

      if (statusParam && directOrderId) {
        setOrderId(directOrderId)
        setStatus(statusParam)
        return
      }

      // VNPay return parameters
      const params: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        params[key] = value
      })

      if (params.vnp_TxnRef) {
        // VNPay
        const success = await paymentService.verifyVNPayReturn(params)
        setOrderId(params.vnp_TxnRef)
        setStatus(success ? 'success' : 'failed')
      } else if (params.orderId) {
        // Momo or other
        setOrderId(params.orderId)
        if (params.resultCode === '0') {
          await paymentService.recordPaymentSuccess(params.orderId, 'momo', params)
          setStatus('success')
        } else {
          setStatus('failed')
        }
      } else {
        setStatus('failed')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      setStatus('failed')
    }
  }

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return
      try {
        const details = await paymentService.getOrderDetails(orderId)
        setOrderDetails(details)
        const parsedMeta = parseDigitalMeta(details?.notes)
        if (parsedMeta) {
          setDigitalMeta(parsedMeta)
        }
      } catch (error) {
        console.error('Không thể tải chi tiết đơn hàng:', error)
      }
    }

    loadOrder()
  }, [orderId])

  const productInfo = orderDetails?.products
  const candidatePlanId = productInfo?.id ?? digitalMeta?.planId ?? ''
  const membershipPlan = candidatePlanId ? getMembershipPlan(candidatePlanId) : null
  const isMembershipProduct = productInfo?.category === 'Membership' || !!membershipPlan || digitalMeta?.planId
  const isMembership = isMembershipProduct
  const isAttemptPack = (membershipPlan?.id ?? digitalMeta?.planId) === 'attempt-pack-10'
  const attemptPackQuantity = digitalMeta?.quantity ?? 10
  const attemptPackEventTitle = digitalMeta?.eventTitle
  const attemptPackEventId = digitalMeta?.eventId
  const attemptPackLabel = membershipPlan?.label ?? 'Gói +10 lượt'

  useEffect(() => {
    if (status !== 'success') return
    if (!isAttemptPack) return
    if (rewardApplied) return

    let meta = digitalMeta
    const pending = popPendingDigitalPurchase('attempt-pack-10')
    if (!meta && pending) {
      meta = pending
      setDigitalMeta(pending)
    }

    if (!meta) {
      setRewardApplied(true)
      return
    }

    const currentUser = localAuth.getCurrentUser()
    if (!currentUser || !meta.eventId) {
      setRewardApplied(true)
      return
    }

    addExtraAttempts(currentUser.id, meta.eventId, meta.quantity ?? 10)
    setRewardApplied(true)
  }, [status, isAttemptPack, rewardApplied, digitalMeta])

  useEffect(() => {
    if (status !== 'success' || !isAttemptPack || !rewardApplied) return
    const redirectTarget = attemptPackEventId ? `/event/detail?id=${attemptPackEventId}` : '/history'
    const timer = window.setTimeout(() => {
      navigate(redirectTarget)
    }, 2500)
    return () => window.clearTimeout(timer)
  }, [status, isAttemptPack, rewardApplied, attemptPackEventId, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <Loader className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Đang xác thực thanh toán</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Thanh toán thành công!</h2>
            {isMembership ? (
              isAttemptPack ? (
                <div className="text-gray-600 mb-6 space-y-3">
                  <p>
                    {attemptPackLabel} đã được kích hoạt cho tài khoản của bạn.
                  </p>
                  {membershipPlan?.rewardStars ? (
                    <div className="flex items-center justify-center gap-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg py-3">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-medium">+{membershipPlan.rewardStars} sao thưởng đã được cộng.</span>
                    </div>
                  ) : null}
                  <p>
                    Đã cộng thêm {attemptPackQuantity} lượt làm quiz
                    {attemptPackEventTitle ? ` cho "${attemptPackEventTitle}".` : ' vào kho luyện tập của bạn.'}
                  </p>
                  <p>Bạn có thể mở lại quiz để sử dụng ngay các lượt mới vừa nạp.</p>
                  <p className="text-xs text-gray-500">Trang sẽ tự chuyển về hồ sơ liên quan sau vài giây.</p>
                </div>
              ) : membershipPlan ? (
                <div className="text-gray-600 mb-6 space-y-3">
                  <p>
                    Gói <span className="font-semibold text-gray-800">{membershipPlan.label}</span> đã được kích hoạt cho
                    tài khoản của bạn.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg py-3">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">+{membershipPlan.rewardStars} sao thưởng đã được cộng.</span>
                  </div>
                  <p>
                    Thời hạn hiệu lực: {membershipPlan.durationDays} ngày kể từ hôm nay. Kiểm tra mục Hồ sơ để theo dõi sao và trạng thái gói.
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 mb-6">
                  Gói thành viên đã được kích hoạt. Vui lòng kiểm tra hồ sơ để xem quyền lợi mới.
                </p>
              )
            ) : (
              <p className="text-gray-600 mb-6">
                Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ xử lý và giao hàng trong thời gian sớm nhất.
              </p>
            )}
            {isMembership ? (
              isAttemptPack ? (
                <>
                  <button
                    onClick={() => {
                      if (attemptPackEventId) {
                        navigate(`/event/detail?id=${attemptPackEventId}`)
                      } else {
                        navigate('/history')
                      }
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
                  >
                    Quay lại hồ sơ sự kiện
                  </button>
                  <button
                    onClick={() => navigate('/history')}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Mở dòng thời gian lịch sử
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
                  >
                    Xem hồ sơ và sao thưởng
                  </button>
                  <button
                    onClick={() => navigate('/history')}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Bắt đầu khám phá quiz nâng cao
                  </button>
                </>
              )
            ) : (
              <>
                <button
                  onClick={() => navigate(`/order-details?orderId=${orderId}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
                >
                  Xem chi tiết đơn hàng
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </>
            )}
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Thanh toán thất bại</h2>
            {isMembership ? (
              isAttemptPack ? (
                <p className="text-gray-600 mb-6">
                  Giao dịch chưa hoàn tất nên lượt quiz mới chưa được cộng. Bạn có thể thử lại với phương thức khác hoặc quay lại hồ sơ sự kiện để mua lại sau.
                </p>
              ) : (
                <p className="text-gray-600 mb-6">
                  Giao dịch chưa hoàn tất nên gói thành viên và sao thưởng vẫn giữ nguyên. Bạn có thể thử lại với phương thức khác hoặc liên hệ hỗ trợ nếu cần.
                </p>
              )
            ) : (
              <p className="text-gray-600 mb-6">
                Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
              </p>
            )}
            <button
              onClick={() => navigate('/shop')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Quay lại cửa hàng
            </button>
          </>
        )}

        {(status === 'success' || status === 'failed') && isMembership && (
          <div className="mt-6 text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quy định gói thành viên</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {MEMBERSHIP_TERMS.map((term) => (
                <li key={term} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
