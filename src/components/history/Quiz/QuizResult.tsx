type Props = {
  score: number;
  stars: number;
  correct: number;
  total: number;
  attemptNumber: number;
  onRetry: () => void;
  onReview: () => void;
  onClose: () => void;
  nextCta?: () => void;
  nextEventTitle?: string;
};

const starMessages: Record<number, string> = {
  0: 'Bạn có thể luyện tập thêm để đạt được sao.',
  3: 'Khởi đầu tốt! Tiếp tục luyện tập để tăng số sao.',
  6: 'Tuyệt vời! Bạn đã nắm chắc kiến thức.',
  8: 'Xuất sắc! Thử thách bản thân ở mức cao hơn.',
  12: 'Hoàn hảo! Bạn đã trả lời chính xác toàn bộ câu hỏi.',
};

export function QuizResult({
  score,
  stars,
  correct,
  total,
  attemptNumber,
  onRetry,
  onReview,
  onClose,
  nextCta,
  nextEventTitle,
}: Props) {
  const canAdvance = score >= 70;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D0D]/70 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-result-title"
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-br from-[#fff1f5] via-white to-[#efeaff] p-10 text-center shadow-[0_30px_60px_-25px_rgba(90,70,140,0.4)]">
        <div className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-[#F4D03F]/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 -left-14 h-52 w-52 rounded-full bg-amber-300/30 blur-3xl" aria-hidden />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#F4D03F]">
            Lần {attemptNumber}
          </p>
          <h2 id="quiz-result-title" className="text-4xl font-serif text-[#F4D03F]">
            Kết quả Quiz
          </h2>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-base font-semibold">
            <span className="rounded-full bg-[#1A1A1A]/80 px-5 py-2 text-[#F4D03F] shadow-sm">Điểm {score}%</span>
            <span className="rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 px-5 py-2 text-white shadow-sm" aria-label={`Bạn nhận ${stars} sao`}>
              {stars} ⭐
            </span>
            <span className="rounded-full bg-[#1A1A1A]/80 px-5 py-2 text-[#F4D03F] shadow-sm">
              {correct}/{total} câu đúng
            </span>
          </div>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#F4D03F]/80">
            {starMessages[stars] ?? starMessages[0]}
          </p>
          {canAdvance && nextCta && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-900/20 px-6 py-3">
              <p className="text-sm text-emerald-400">
                🎉 Chúc mừng! Bạn đã đạt {score}% và mở khóa sự kiện tiếp theo
                {nextEventTitle && <span className="font-semibold">: "{nextEventTitle}"</span>}
              </p>
            </div>
          )}
          {!canAdvance && nextCta && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-900/20 px-6 py-3">
              <p className="text-sm text-amber-400">
                ⚠️ Bạn cần đạt ít nhất 70% để mở khóa sự kiện tiếp theo. Hãy thử lại!
              </p>
            </div>
          )}
        </div>
        <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-[#F4D03F]/40 bg-[#1A1A1A]/80 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-[#F4D03F] transition hover:bg-[#F4D03F]/10"
          >
            Làm lại
          </button>
          <button
            type="button"
            onClick={onReview}
            className="rounded-full bg-[#F4D03F] px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-[#F4D03F]/90"
          >
            Xem giải thích
          </button>
          {canAdvance && nextCta && (
            <button
              type="button"
              onClick={nextCta}
              className="rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-700 hover:to-emerald-600 flex items-center gap-2"
            >
              <span>Sự kiện tiếp theo</span>
              <span aria-hidden>→</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#0D0D0D] px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-[#0D0D0D]/80"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizResult;
