type Props = {
  canLaunch: boolean;
  onLaunch: () => void;
  attempts: number;
  purchasedAttempts?: number;
  bestScore?: number;
  bestStars?: number;
};

export function QuizLauncher({ canLaunch, onLaunch, attempts, purchasedAttempts = 0, bestScore, bestStars }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-blue/20 bg-gradient-to-br from-[#fde2f7] via-white to-[#efe8ff] p-6 shadow-2xl">
      <div className="pointer-events-none absolute -top-28 -right-20 h-48 w-48 rounded-full bg-brand-blue/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-44 w-44 rounded-full bg-amber-400/30 blur-3xl" aria-hidden />
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue/80">
            Quiz time
            <span aria-hidden className="text-brand-blue">⚡</span>
          </span>
          <h3 className="text-2xl font-serif text-brand-text">Thử thách kiến thức lịch sử</h3>
          <p className="max-w-2xl text-sm text-brand-text/80">
            Đọc đủ hồ sơ để mở khóa bộ câu hỏi tương tác. Mỗi câu có thời gian giới hạn, có thể kèm hình ảnh hoặc video để bạn phân tích nhanh.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-brand-blue/70">
          <span className="rounded-full bg-white/70 px-4 py-1 text-brand-blue">Lượt đã xài: {attempts}</span>
          {purchasedAttempts > 0 && (
            <span className="rounded-full bg-white/70 px-4 py-1 text-emerald-600">Đã mua thêm: {purchasedAttempts}</span>
          )}
          {typeof bestScore === 'number' && (
            <span className="rounded-full bg-white/70 px-4 py-1 text-brand-text">Điểm cao nhất: {bestScore}%</span>
          )}
          {typeof bestStars === 'number' && bestStars > 0 && (
            <span className="rounded-full bg-white/70 px-4 py-1 text-amber-600">Tối đa: {bestStars} ⭐</span>
          )}
        </div>
        {!canLaunch && (
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f977ce] via-[#ff9bbd] to-[#fdd9ff] p-6 text-white shadow-xl">
            <div className="pointer-events-none absolute -top-16 -left-20 h-40 w-40 rounded-full bg-white/20 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/20 blur-2xl" aria-hidden />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em]">Quiz Time</span>
                <span aria-hidden className="text-lg">❓</span>
              </div>
              <div className="rounded-3xl bg-white/25 p-5 backdrop-blur-sm">
                <p className="text-lg font-semibold leading-relaxed">Quốc gia nào được gọi là “Đất nước Mặt Trời mọc”?</p>
                <div className="mt-4 grid gap-3 text-sm">
                  {['Trung Quốc', 'Nhật Bản', 'Hàn Quốc', 'Thái Lan'].map((option, index) => (
                    <div
                      key={option}
                      className={`flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 ${index === 1 ? 'bg-white text-brand-text shadow-lg' : 'bg-white/10'}`}
                    >
                      <span
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase ${index === 1 ? 'bg-brand-blue text-white' : 'bg-white/30 text-white'}`}
                      >
                        {String.fromCharCode(97 + index)}
                      </span>
                      <span className={`text-sm font-medium ${index === 1 ? 'text-brand-text' : 'text-white'}`}>{option}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/75">Đọc 80% hồ sơ để mở khóa quiz chính thức</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onLaunch}
          disabled={!canLaunch}
          className="self-start rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:bg-brand-blue/40"
          aria-disabled={!canLaunch}
        >
          {canLaunch ? 'Bắt đầu Quiz ngay' : 'Đọc 80% nội dung để mở khóa'}
        </button>
      </div>
    </div>
  );
}

export default QuizLauncher;
