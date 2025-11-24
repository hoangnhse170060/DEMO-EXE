import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Product } from '../lib/supabase'
import { paymentService, PaymentMethod } from '../lib/paymentService'
import { localAuth } from '../lib/localAuth'
import { mockProducts } from '../data/mockShop'
import { getMembershipPlan } from '../lib/memberships'
import { getPendingDigitalPurchase, type PendingDigitalPurchase } from '../lib/storage'
import { CreditCard, Wallet, Building2, Truck, MapPin, Phone, User } from 'lucide-react'

export default function Checkout() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [pendingDigital, setPendingDigital] = useState<PendingDigitalPurchase | null>(null)
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: ''
  })
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadCheckoutData()
  }, [])

  const loadCheckoutData = async () => {
    setLoading(true)
    const productId = searchParams.get('productId')
    const qtyParam = searchParams.get('quantity')
    const resolvedQuantity = qtyParam ? parseInt(qtyParam, 10) : 1
    try {

      if (!productId) {
        navigate('/shop')
        return
      }

      let resolvedProduct: Product | null = null

      if (isSupabaseConfigured) {
        const { data: productData } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (productData) {
          resolvedProduct = productData as Product
        }
      } else {
        resolvedProduct = mockProducts.find(item => item.id === productId) ?? null
      }

      if (!resolvedProduct) {
        // fallback to mock catalog (useful when Supabase chưa có bản ghi tương ứng)
        const mockFallback = mockProducts.find(item => item.id === productId) ?? null
        if (mockFallback) {
          resolvedProduct = mockFallback
        }
      }

      if (!resolvedProduct) {
        navigate('/shop')
        return
      }

      setProduct(resolvedProduct)
      setQuantity(resolvedProduct.category === 'Membership' ? 1 : resolvedQuantity)
      const storedDigital = getPendingDigitalPurchase()
      if (storedDigital && storedDigital.planId === resolvedProduct.id) {
        setPendingDigital(storedDigital)
      } else {
        setPendingDigital(null)
      }

      const methods = await paymentService.getPaymentMethods()
      const filteredMethods = resolvedProduct.category === 'Membership'
        ? methods.filter(method => method.type !== 'cod')
        : methods
      setPaymentMethods(filteredMethods)
      if (filteredMethods.length > 0) {
        setSelectedPaymentMethod(filteredMethods[0].id)
      }

      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (profile && profile.metadata) {
            setShippingInfo({
              fullName: profile.metadata.fullName || '',
              phone: profile.metadata.phone || '',
              address: profile.metadata.address || '',
              city: profile.metadata.city || '',
              district: profile.metadata.district || '',
              ward: profile.metadata.ward || ''
            })
          }
        }
      } else {
        const currentUser = localAuth.getCurrentUser()
        if (currentUser) {
          const saved = paymentService.getSavedShippingAddress(currentUser.id)
          if (saved) {
            setShippingInfo(saved)
          }
        }
      }
    } catch (error) {
      console.error('Error loading checkout data:', error)
      if (!isSupabaseConfigured) {
        const fallbackProduct = productId ? mockProducts.find(item => item.id === productId) ?? null : null
        if (fallbackProduct) {
          setProduct(fallbackProduct)
          setQuantity(fallbackProduct.category === 'Membership' ? 1 : resolvedQuantity)
          const storedDigital = getPendingDigitalPurchase()
          if (storedDigital && storedDigital.planId === fallbackProduct.id) {
            setPendingDigital(storedDigital)
          } else {
            setPendingDigital(null)
          }
          const fallbackMethods = await paymentService.getPaymentMethods()
          const filteredFallback = fallbackProduct.category === 'Membership'
            ? fallbackMethods.filter(method => method.type !== 'cod')
            : fallbackMethods
          setPaymentMethods(filteredFallback)
          if (filteredFallback.length > 0) {
            setSelectedPaymentMethod(filteredFallback[0].id)
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (product?.category === 'Membership') {
      if (!selectedPaymentMethod) {
        setErrors({ payment: 'Vui lòng chọn phương thức thanh toán' })
        return false
      }
      setErrors({})
      return true
    }
    
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên'
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại'
    else if (!/^[0-9]{10,11}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }
    if (!shippingInfo.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ'
    if (!shippingInfo.city.trim()) newErrors.city = 'Vui lòng chọn Tỉnh/Thành phố'
    if (!shippingInfo.district.trim()) newErrors.district = 'Vui lòng chọn Quận/Huyện'
    if (!shippingInfo.ward.trim()) newErrors.ward = 'Vui lòng chọn Phường/Xã'
    if (!selectedPaymentMethod) newErrors.payment = 'Vui lòng chọn phương thức thanh toán'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !product) return

    setLoading(true)
    try {
      const currentUser = localAuth.getCurrentUser()
      const isMembershipProduct = product.category === 'Membership'
      const isDigitalWithMeta = isMembershipProduct && pendingDigital && pendingDigital.planId === product.id

      const shippingPayload = isMembershipProduct
        ? {
            fullName: shippingInfo.fullName || currentUser?.display_name || 'Thành viên Echoes',
            phone: shippingInfo.phone || currentUser?.phone || '0000000000',
            address: 'Kích hoạt trực tuyến - không cần giao hàng',
            city: 'Online',
            district: 'Online',
            ward: 'Online',
          }
        : shippingInfo

  // Preserve digital bundle quantities (e.g. +10 quiz attempts) while keeping other memberships singular
  const digitalQuantity = isDigitalWithMeta ? Math.max(1, pendingDigital.quantity ?? 1) : 1
  const quantityToUse = isMembershipProduct ? digitalQuantity : quantity
      const trimmedNotes = notes.trim()
  const digitalMeta = isDigitalWithMeta ? { ...pendingDigital, quantity: digitalQuantity } : null
      const metaString = digitalMeta ? `[digital-meta]${JSON.stringify(digitalMeta)}` : ''
      const finalNotes = [trimmedNotes, metaString].filter((segment) => segment.length > 0).join('\n')

      // Create order
      const orderId = await paymentService.createOrder({
        product_id: product.id,
        quantity: quantityToUse,
        shipping_address: shippingPayload,
        notes: finalNotes,
        payment_method_id: selectedPaymentMethod
      })

      // Initiate payment
      const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod)
      const paymentResult = await paymentService.initiatePayment(orderId, selectedMethod!.type)

      if (paymentResult.success) {
        if (paymentResult.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = paymentResult.paymentUrl
        } else {
          if (isMembershipProduct) {
            navigate(`/payment-result?status=success&orderId=${orderId}`)
          } else {
            // COD or other methods
            navigate(`/order-details?orderId=${orderId}`)
          }
        }
      } else {
        if (isMembershipProduct) {
          navigate(`/payment-result?status=failed&orderId=${orderId}`)
        } else {
          alert(paymentResult.error || 'Có lỗi xảy ra khi thanh toán')
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'vnpay':
      case 'momo':
        return <Wallet className="w-5 h-5" />
      case 'bank_transfer':
        return <Building2 className="w-5 h-5" />
      case 'cod':
        return <Truck className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    )
  }

  const membershipPlan = product.category === 'Membership' ? getMembershipPlan(product.id) : null
  const appliedQuantity = product.category === 'Membership' ? 1 : quantity
  const totalAmount = product.price * appliedQuantity
  const digitalContext = membershipPlan && pendingDigital?.planId === product.id ? pendingDigital : null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            {membershipPlan ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Kích hoạt gói thành viên
                </h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    Gói <span className="font-semibold text-blue-700">{membershipPlan.label}</span> sẽ được kích hoạt
                    ngay cho tài khoản đang đăng nhập sau khi thanh toán thành công. Không yêu cầu giao hàng vật lý.
                  </p>
                  {digitalContext?.eventTitle ? (
                    <p>
                      Áp dụng cho hồ sơ sự kiện: <span className="font-semibold">{digitalContext.eventTitle}</span>.
                      Bạn có thể tiếp tục quiz ngay khi hoàn tất.
                    </p>
                  ) : null}
                  <p>
                    Vui lòng kiểm tra hòm thư và mục <span className="font-semibold">Hồ sơ</span> để theo dõi sao thưởng
                    và trạng thái gói. Nếu cần cập nhật thông tin liên hệ, hãy điều chỉnh tại trang hồ sơ cá nhân.
                  </p>
                  <p className="text-xs text-gray-500">
                    Ghi chú thêm (tùy chọn):
                  </p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Ghi chú cho đội hỗ trợ (nếu có)..."
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Thông tin giao hàng
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0123456789"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Số nhà, tên đường"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="TP. Hồ Chí Minh"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Quận/Huyện <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.district}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.district ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Quận 1"
                      />
                      {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phường/Xã <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.ward}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, ward: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.ward ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Phường Bến Nghé"
                      />
                      {errors.ward && <p className="text-red-500 text-sm mt-1">{errors.ward}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Ghi chú</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Ghi chú cho người bán..."
                    />
                  </div>
                </form>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      {getPaymentIcon(method.type)}
                      <span className="font-medium">{method.name}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.payment && <p className="text-red-500 text-sm mt-2">{errors.payment}</p>}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Đơn hàng</h2>

              {membershipPlan && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 mb-4">
                  <p className="font-semibold">Quyền lợi gói {membershipPlan.label}</p>
                  {membershipPlan.rewardStars > 0 ? (
                    <p className="mt-1">+{membershipPlan.rewardStars} sao thưởng ngay khi thanh toán.</p>
                  ) : null}
                  <p className="mt-1">
                    Hiệu lực: {membershipPlan.durationDays > 0 ? `${membershipPlan.durationDays} ngày` : 'Áp dụng ngay lập tức'} kể từ thời điểm kích hoạt.
                  </p>
                  {digitalContext?.eventTitle ? (
                    <p className="mt-1">Áp dụng cho hồ sơ: {digitalContext.eventTitle}</p>
                  ) : null}
                </div>
              )}

              <div className="flex gap-4 mb-4 pb-4 border-b">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600">Số lượng: {appliedQuantity}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Bằng việc đặt hàng, bạn đồng ý với Điều khoản sử dụng của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
