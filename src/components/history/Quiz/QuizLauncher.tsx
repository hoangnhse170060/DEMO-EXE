type Props = {
  canLaunch: boolean;
  onLaunch: () => void;
  attempts: number;
  bestScore?: number;
  bestStars?: number;
};

export function QuizLauncher({ canLaunch, onLaunch, attempts, bestScore, bestStars }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#F4D03F]/30 bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-charcoal-800 p-6 shadow-[0_0_30px_rgba(255,215,0,0.15)]">
      <div className="pointer-events-none absolute -top-28 -right-20 h-48 w-48 rounded-full bg-[#F4D03F]/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-44 w-44 rounded-full bg-[#F4D03F]/5 blur-3xl" aria-hidden />
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#F4D03F]">
            Quiz time
            <span aria-hidden className="text-[#F4D03F]">⚡</span>
          </span>
          <h3 className="text-2xl font-serif text-[#F4D03F]">Thử thách kiến thức lịch sử</h3>
          <p className="max-w-2xl text-sm text-gray-100">
            Đọc đủ hồ sơ để mở khóa bộ câu hỏi tương tác. Mỗi câu có thời gian giới hạn, có thể kèm hình ảnh hoặc video để bạn phân tích nhanh.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[#F4D03F]/70">
          {typeof bestScore === 'number' && (
            <span className="rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 px-4 py-1 text-[#F4D03F]">Điểm cao nhất: {bestScore}%</span>
          )}
          {typeof bestStars === 'number' && bestStars > 0 && (
            <span className="rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 px-4 py-1 text-[#F4D03F]">Tối đa: {bestStars} ⭐</span>
          )}
        </div>
        {!canLaunch && (
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-charcoal-700 via-charcoal-800 to-charcoal-900 p-6 border border-[#F4D03F]/20 shadow-[0_0_25px_rgba(255,215,0,0.1)]">
            <div className="pointer-events-none absolute -top-16 -left-20 h-40 w-40 rounded-full bg-[#F4D03F]/10 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[#F4D03F]/5 blur-2xl" aria-hidden />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#F4D03F]">Quiz Time</span>
                <span aria-hidden className="text-lg">❓</span>
              </div>
              <div className="rounded-3xl bg-charcoal-900/50 border border-[#F4D03F]/20 p-5 backdrop-blur-sm">
                <p className="text-lg font-semibold leading-relaxed text-gray-100">Quốc gia nào được gọi là "Đất nước Mặt Trời mọc"?</p>
                <div className="mt-4 grid gap-3 text-sm">
                  {['Trung Quốc', 'Nhật Bản', 'Hàn Quốc', 'Thái Lan'].map((option, index) => (
                    <div
                      key={option}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${index === 1 ? 'bg-[#F4D03F]/20 border-[#F4D03F] text-gray-100 shadow-lg' : 'bg-charcoal-800/50 border-[#F4D03F]/20'}`}
                    >
                      <span
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase ${index === 1 ? 'bg-[#F4D03F] text-charcoal-900' : 'bg-charcoal-700 border border-[#F4D03F]/30 text-[#F4D03F]'}`}
                      >
                        {String.fromCharCode(97 + index)}
                      </span>
                      <span className={`text-sm font-medium ${index === 1 ? 'text-gray-100' : 'text-gray-200'}`}>{option}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#F4D03F]/70">Hãy thử sức với bộ câu hỏi thú vị!</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onLaunch}
          disabled={!canLaunch}
          className="self-start rounded-full bg-[#F4D03F] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:bg-[#F4D03F]/90 disabled:cursor-not-allowed disabled:bg-[#F4D03F]/40"
          aria-disabled={!canLaunch}
        >
          {canLaunch ? 'Bắt đầu Quiz ngay' : 'Bắt đầu Quiz ngay'}
        </button>
      </div>
    </div>
  );
}

export default QuizLauncher;
