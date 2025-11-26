import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localAuth } from '../lib/localAuth';
import {
  Calendar,
  CheckCircle2,
  Gift,
  LogOut,
  Mail,
  Phone,
  Shield,
  Star,
  User,
} from 'lucide-react';
import VoucherRedemption from '../components/VoucherRedemption';
import { getUserPoints, formatPoints } from '../lib/voucherService';

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  phone?: string;
  date_of_birth?: string;
  role: 'user' | 'admin';
  stars: number;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [membershipDuration, setMembershipDuration] = useState<string>('');
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    let resolvedProfile: UserProfile | null = null;

    try {
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        resolvedProfile = profileData as UserProfile;
        setProfile(resolvedProfile);
      } else {
        const currentUser = localAuth.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }

        const { profile: profileRecord } = await localAuth.getUserProfile(currentUser.id);
        if (profileRecord) {
          const { password: _password, ...rest } = profileRecord as any;
          resolvedProfile = rest as UserProfile;
          setProfile(resolvedProfile);
        }
      }

      // Load user points from voucher service
      if (resolvedProfile?.id) {
        const points = getUserPoints(resolvedProfile.id);
        setUserPoints(points.total);
      }

      if (resolvedProfile?.created_at) {
        const createdDate = new Date(resolvedProfile.created_at);
        const now = new Date();
        const diffMonths =
          (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth());

        if (diffMonths <= 0) {
          setMembershipDuration('Thành viên mới');
        } else if (diffMonths < 12) {
          setMembershipDuration(`${diffMonths} tháng gắn bó`);
        } else {
          const years = Math.floor(diffMonths / 12);
          const months = diffMonths % 12;
          setMembershipDuration(`${years} năm${months ? ` ${months} tháng` : ''}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localAuth.logout();
    }
    navigate('/login');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F4D03F]/20 px-4 py-1.5 text-sm font-semibold text-[#F4D03F]">
            <Shield className="h-4 w-4" />
            Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-1.5 text-sm font-semibold text-[#E5E5E5]">
            <User className="h-4 w-4" />
            User
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#333333] border-t-[#F4D03F]"></div>
          <p className="text-sm text-[#9CA3AF]">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <div className="rounded-2xl bg-[#1A1A1A] px-10 py-12 text-center border border-[#333333]">
          <p className="mb-6 text-lg font-semibold text-[#F4D03F]">Không tìm thấy thông tin tài khoản</p>
          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-[#F4D03F] px-8 py-3 text-[#0D0D0D] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-14 px-4">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-3xl bg-[#1A1A1A] border border-[#333333]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4D03F]/10 via-transparent to-transparent"></div>
          <div className="relative flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#F4D03F]/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#F4D03F]">
                {membershipDuration || 'Thành viên Echoes'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-[#262626] px-3 py-2 text-sm font-medium text-[#E5E5E5] transition hover:bg-[#333333]"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#F4D03F] to-[#E6BE8A]">
                <User className="h-12 w-12 text-[#0D0D0D]" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#F4D03F]">{profile.display_name}</h1>
              <p className="text-sm text-[#9CA3AF]">{profile.email}</p>
            </div>

            <div className="space-y-3 rounded-2xl bg-[#262626] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#9CA3AF]">Vai trò</span>
                {getRoleBadge(profile.role)}
              </div>
              <div className="flex items-center justify-between text-sm text-[#E5E5E5]">
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#F4D03F]" />
                  Điểm Sao
                </span>
                <strong className="text-base text-[#F4D03F]">{formatPoints(userPoints)}</strong>
              </div>
              {profile.phone && (
                <div className="flex items-center justify-between text-sm text-[#E5E5E5]">
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#F4D03F]" />
                    Số điện thoại
                  </span>
                  <span className="font-medium">{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-[#E5E5E5]">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#F4D03F]" />
                  Tham gia
                </span>
                <span>{formatDate(profile.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-3xl bg-[#1A1A1A] p-8 border border-[#333333]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#F4D03F]">Thông tin cá nhân</p>
              <h2 className="text-2xl font-semibold text-[#E5E5E5]">Hồ sơ thành viên</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              Tài khoản đã xác thực
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#333333] bg-[#262626] p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#F4D03F]" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Email</p>
                  <p className="text-sm font-semibold text-[#E5E5E5]">{profile.email}</p>
                </div>
              </div>
            </div>

            {profile.phone && (
              <div className="rounded-2xl border border-[#333333] bg-[#262626] p-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#F4D03F]" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Số điện thoại</p>
                    <p className="text-sm font-semibold text-[#E5E5E5]">{profile.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {profile.date_of_birth && (
              <div className="rounded-2xl border border-[#333333] bg-[#262626] p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#F4D03F]" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">Ngày sinh</p>
                    <p className="text-sm font-semibold text-[#E5E5E5]">{formatDate(profile.date_of_birth)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Voucher Redemption Section */}
        <div className="rounded-3xl bg-[#1A1A1A] p-8 border border-[#333333]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#F4D03F]">Đổi thưởng</p>
              <h2 className="text-2xl font-semibold text-[#E5E5E5]">Voucher Momo & VNPay</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">
                Sử dụng điểm tích lũy để đổi lấy voucher giảm giá hấp dẫn.
              </p>
            </div>
            <Gift className="h-12 w-12 text-[#F4D03F]" />
          </div>
          <VoucherRedemption userId={profile.id} onPointsChange={setUserPoints} />
        </div>

        {/* Admin block */}
        {profile.role === 'admin' && (
          <div className="rounded-3xl bg-[#1A1A1A] p-8 border border-[#333333]">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#F4D03F]">Trung tâm quản trị</p>
                <h2 className="text-2xl font-semibold text-[#E5E5E5]">Bảng điều khiển Admin</h2>
                <p className="mt-1 text-sm text-[#9CA3AF]">
                  Theo dõi hoạt động hệ thống và hỗ trợ cộng đồng Echoes vận hành trơn tru.
                </p>
              </div>
              <Shield className="h-12 w-12 text-[#F4D03F]" />
            </div>

            <button
              onClick={() => navigate('/admin-dashboard')}
              className="w-full rounded-2xl border border-[#333333] bg-[#262626] p-6 text-left transition hover:border-[#F4D03F]"
            >
              <p className="text-sm font-semibold text-[#F4D03F]">Dashboard tổng quan</p>
              <p className="mt-2 text-xs text-[#9CA3AF]">Xem ngay báo cáo hoạt động trong ngày</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
