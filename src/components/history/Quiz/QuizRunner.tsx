import { useEffect, useMemo, useRef, useState } from 'react';
import type { QuizQuestion } from '../../../data/history';
import { useTimer } from '../../../hooks/useTimer';

export type QuizAnswerRecord = {
  questionId: string;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
};

export type QuizSummary = {
  correct: number;
  total: number;
  answers: QuizAnswerRecord[];
  durationMs: number;
  startedAt: string;
};

type Props = {
  questions: QuizQuestion[];
  attemptNumber: number;
  onClose: () => void;
  onComplete: (summary: QuizSummary) => void;
};

const DEFAULT_TIME_PER_QUESTION = 25000;

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function QuizRunner({ questions, attemptNumber, onClose, onComplete }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState<QuizAnswerRecord[]>(() =>
    questions.map((question) => ({
      questionId: question.id,
      selectedIndex: null,
      correctIndex: question.answerIndex,
      isCorrect: false,
      explanation: question.explanation ?? '',
    })),
  );
  const [revealed, setRevealed] = useState(false);
  const [timerAnnouncement, setTimerAnnouncement] = useState('');
  const startedAt = useRef(new Date().toISOString());

  const totalDuration = useMemo(() => {
    if (!questions.length) return DEFAULT_TIME_PER_QUESTION;
    return questions.reduce((acc, question) => acc + (question.timePerQuestion ?? DEFAULT_TIME_PER_QUESTION), 0);
  }, [questions]);

  const { timeLeft, reset, start } = useTimer({
    durationMs: totalDuration,
    autoStart: true,
    onTick: (msLeft) => {
      const display = formatTime(msLeft);
      setTimerAnnouncement(`Còn ${display}`);
    },
    onComplete: () => {
      finishQuiz(true);
    },
  });

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )).filter((node) => !node.hasAttribute('disabled'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      previous?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    reset(totalDuration);
    start();
  }, [reset, totalDuration, start]);

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const answerLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    const record = records[currentIndex];
    if (record.selectedIndex !== null) return;

    const isCorrect = optionIndex === currentQuestion.answerIndex;
    const nextRecords = records.slice();
    nextRecords[currentIndex] = {
      ...record,
      selectedIndex: optionIndex,
      isCorrect,
    };
    setRecords(nextRecords);

    if (isCorrect) {
      setTimeout(() => moveToNext(nextRecords), 800);
    } else {
      setRevealed(true);
    }
  };

  const moveToNext = (latestRecords?: QuizAnswerRecord[]) => {
    const snapshot = latestRecords ?? records;
    if (currentIndex >= questions.length - 1) {
      finishQuiz(false, snapshot);
      return;
    }
    setRevealed(false);
    setCurrentIndex((prev) => prev + 1);
  };

  function finishQuiz(forced: boolean, snapshot?: QuizAnswerRecord[]) {
    const baseRecords = snapshot ?? records;
    const evaluated = forced
      ? baseRecords.map((record) => ({
          ...record,
          selectedIndex: record.selectedIndex,
          isCorrect: record.selectedIndex === null ? false : record.isCorrect,
        }))
      : baseRecords;
    const correct = evaluated.filter((entry) => entry.isCorrect).length;
    const total = evaluated.length;
    reset();
    onComplete({
      correct,
      total,
      answers: evaluated,
      durationMs: totalDuration - timeLeft,
      startedAt: startedAt.current,
    });
  }

  if (!questions.length) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/60 px-4" role="dialog" aria-modal="true">
        <div className="w-full max-w-lg rounded-2xl border border-brand-blue bg-white p-6 text-center shadow-xl">
          <p className="text-lg font-semibold text-brand-text">Chưa có ngân hàng câu hỏi cho mốc này.</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/70 backdrop-blur-sm px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-dialog-title"
    >
      <div className="sr-only" aria-live="polite">
        {timerAnnouncement}
      </div>
      <div
        ref={dialogRef}
        className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-br from-[#ffe6f0] via-white to-[#efeaff] shadow-[0_30px_60px_-25px_rgba(90,70,140,0.35)]"
      >
        <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-brand-blue/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-amber-400/25 blur-3xl" aria-hidden />

        <header className="relative z-10 flex flex-col gap-4 border-b border-white/40 px-8 pt-8 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.45em] text-brand-blue">
                Quiz lần {attemptNumber}
                <span aria-hidden>⚡</span>
              </p>
              <h2 id="quiz-dialog-title" className="mt-2 text-3xl font-serif text-brand-text">Quiz Time!</h2>
              <p className="mt-1 text-sm text-brand-text/70" aria-live="polite">
                Câu {currentIndex + 1}/{questions.length}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full bg-white/80 px-5 py-2 text-sm font-semibold text-brand-blue" aria-live="polite">
                ⏳ {formatTime(timeLeft)}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="rounded-full border border-brand-blue/40 bg-white/80 px-5 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/10"
              >
                Thoát
              </button>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-blue via-purple-500 to-pink-500 transition-all"
              style={{ width: `${progressPercent}%` }}
              aria-hidden
            />
          </div>
        </header>

        <section className="relative z-10 grid gap-8 px-8 pb-10 pt-6 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="rounded-3xl bg-white/80 p-6 shadow-[0_15px_40px_-30px_rgba(90,70,140,0.5)]">
              <h3 className="text-xl font-semibold text-brand-text leading-relaxed">{currentQuestion.prompt}</h3>
            </div>
            <div className="grid gap-4">
              {currentQuestion.options.map((option, index) => {
                const record = records[currentIndex];
                const selected = record.selectedIndex === index;
                const correct = record.correctIndex === index;
                const status = record.selectedIndex !== null ? (correct ? 'correct' : selected ? 'incorrect' : 'idle') : 'idle';
                const letter = answerLetters[index] ?? '?';
                const baseClass =
                  'relative flex items-center gap-4 rounded-3xl border-2 px-5 py-4 text-left text-base font-medium shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-blue disabled:cursor-not-allowed';
                const statusClass =
                  status === 'correct'
                    ? 'border-green-500/60 bg-gradient-to-r from-green-100 via-white to-green-50 text-green-700'
                    : status === 'incorrect'
                    ? 'border-rose-500/60 bg-gradient-to-r from-rose-100 via-white to-rose-50 text-rose-700'
                    : 'border-transparent bg-white/85 text-brand-text hover:-translate-y-0.5 hover:border-brand-blue/40';
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(index)}
                    disabled={record.selectedIndex !== null}
                    className={`${baseClass} ${statusClass}`}
                    aria-pressed={selected}
                    aria-disabled={record.selectedIndex !== null}
                  >
                    <span
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold uppercase shadow-inner ${
                        status === 'correct'
                          ? 'bg-green-600 text-white'
                          : status === 'incorrect'
                          ? 'bg-rose-600 text-white'
                          : 'bg-brand-blue/10 text-brand-blue'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="flex-1 text-sm leading-relaxed">{option}</span>
                    {status === 'correct' && (
                      <span className="text-sm font-semibold text-green-600" aria-hidden>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {revealed && (
              <div className="rounded-3xl border border-amber-500/40 bg-amber-100/70 p-5 text-sm text-amber-800" aria-live="polite">
                <p className="font-semibold uppercase tracking-widest">Đáp án đúng</p>
                <p className="mt-1 text-base text-brand-text">
                  {currentQuestion.options[currentQuestion.answerIndex]}
                </p>
                {currentQuestion.explanation && (
                  <p className="mt-3 leading-relaxed text-brand-text/80">{currentQuestion.explanation}</p>
                )}
                <button
                  type="button"
                  onClick={() => moveToNext()}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-blue/90"
                >
                  Tiếp tục
                  <span aria-hidden>→</span>
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            {currentQuestion.media ? (
              <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-[0_20px_40px_-30px_rgba(90,70,140,0.6)]">
                {currentQuestion.media.type === 'image' ? (
                  <figure className="flex flex-col">
                    <img
                      src={currentQuestion.media.src}
                      alt={currentQuestion.media.alt}
                      className="h-56 w-full object-cover"
                    />
                    {(currentQuestion.media.caption || currentQuestion.media.credit) && (
                      <figcaption className="space-y-1 px-4 py-3 text-xs text-brand-text/70">
                        {currentQuestion.media.caption && <p>{currentQuestion.media.caption}</p>}
                        {currentQuestion.media.credit && (
                          <p className="text-[11px] uppercase tracking-[0.25em] text-brand-blue/70">
                            {currentQuestion.media.credit}
                          </p>
                        )}
                      </figcaption>
                    )}
                  </figure>
                ) : currentQuestion.media.platform === 'youtube' ? (
                  <div className="relative h-0 w-full overflow-hidden pb-[56.25%]">
                    <iframe
                      title={currentQuestion.media.alt}
                      src={`https://www.youtube.com/embed/${currentQuestion.media.src}`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    controls
                    poster={currentQuestion.media.poster}
                    className="h-56 w-full object-cover"
                  >
                    <source src={currentQuestion.media.src} />
                  </video>
                )}
                {(currentQuestion.media?.type === 'video' && currentQuestion.media.caption) && (
                  <div className="border-t border-white/40 px-4 py-3 text-xs text-brand-text/70">
                    <p>{currentQuestion.media.caption}</p>
                    {currentQuestion.media.credit && (
                      <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-brand-blue/70">
                        {currentQuestion.media.credit}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full flex-col justify-between rounded-3xl border border-white/40 bg-white/70 p-6 text-sm text-brand-text/70 shadow-inner">
                <div>
                  <p className="text-xs uppercase tracking-[0.45em] text-brand-blue">Gợi ý</p>
                  <p className="mt-3 leading-relaxed">
                    Một số câu hỏi đi kèm hình ảnh, bản đồ hoặc video tư liệu. Hãy chú ý chi tiết thị giác trước khi chọn đáp án.
                  </p>
                </div>
                <p className="mt-6 text-xs uppercase tracking-[0.3em] text-brand-blue/80">Thời gian đang đếm...</p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}

export default QuizRunner;
