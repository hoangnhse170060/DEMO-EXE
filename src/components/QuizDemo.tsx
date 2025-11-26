import { useEffect, useRef, useState } from 'react';

type Question = {
  id: number;
  q: string;
  options: string[];
  a: number; // index of correct option
};

const SAMPLE_QUESTIONS: Question[] = [
  { id: 1, q: 'Ai là người đọc Tuyên ngôn độc lập?', options: ['Hồ Chí Minh', 'Phan Bội Châu', 'Nguyễn Ái Quốc'], a: 0 },
  { id: 2, q: 'Năm nào Việt Nam tuyên bố độc lập?', options: ['1945', '1954', '1975'], a: 0 },
  { id: 3, q: 'Thủ đô nước Việt Nam Dân chủ Cộng hòa?', options: ['Hà Nội', 'Hồ Chí Minh', 'Huế'], a: 0 },
];

const STORAGE_KEY_PREFIX = 'quiz_demo_v1_';

function readState(quizId: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + quizId);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeState(quizId: string, data: any) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + quizId, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export default function QuizDemo({ quizId = 'demo-1', onClose }: { quizId?: string; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const st = readState(quizId) || { baseAttempts: 2, extra: 0, failed: 0, lockedUntil: null };
    setAttemptsLeft((st.baseAttempts || 2) + (st.extra || 0) - (st.failed || 0));
    setLockedUntil(st.lockedUntil ? new Date(st.lockedUntil).getTime() : null);
  }, [quizId]);

  useEffect(() => {
    setTimeLeft(20);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          handleSubmit(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  function updateState(mutator: (s: any) => any) {
    const st = readState(quizId) || { baseAttempts: 2, extra: 0, failed: 0, lockedUntil: null };
    const next = mutator(st) || st;
    writeState(quizId, next);
    setAttemptsLeft((next.baseAttempts || 2) + (next.extra || 0) - (next.failed || 0));
    setLockedUntil(next.lockedUntil ? new Date(next.lockedUntil).getTime() : null);
  }

  async function handleAnswer(choiceIndex: number) {
    const q = SAMPLE_QUESTIONS[idx];
    const isCorrect = choiceIndex === q.a;
    await handleSubmit(isCorrect);
  }

  async function handleSubmit(isCorrect: boolean) {
    const now = Date.now();
    const st = readState(quizId) || { baseAttempts: 2, extra: 0, failed: 0, lockedUntil: null };
    if (st.lockedUntil && new Date(st.lockedUntil).getTime() > now) {
      setStatusMsg('Quiz đang bị khóa tạm thời. Hãy thử lại sau.');
      return;
    }

    const totalAllowed = (st.baseAttempts || 2) + (st.extra || 0);

    if (isCorrect) {
      // reset failed count and move on
      updateState((s) => ({ ...s, failed: 0 }));
      setStatusMsg('Đúng! Sang câu tiếp theo.');
      nextQuestion();
      return;
    }

    // wrong answer
    st.failed = (st.failed || 0) + 1;
    if (st.failed >= totalAllowed) {
      // lock for 12 hours and reset failed and extra
      const locked = new Date(now + 12 * 60 * 60 * 1000).toISOString();
      updateState((s) => ({ ...s, failed: 0, extra: 0, lockedUntil: locked }));
      setStatusMsg('Bạn đã dùng hết lượt thử. Quiz bị khóa 12 giờ. Mua thêm để mở lại.');
      return;
    }

    updateState((s) => ({ ...s, failed: st.failed }));
    setStatusMsg(`Sai rồi. Còn ${totalAllowed - st.failed} lượt.`);
    nextQuestion();
  }

  function nextQuestion() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (idx < SAMPLE_QUESTIONS.length - 1) {
      setIdx((i) => i + 1);
    } else {
      setStatusMsg('Hoàn thành quiz demo.');
      // reset quiz for demo
      updateState((s) => ({ ...s, failed: 0 }));
      setTimeout(() => onClose(), 1500);
    }
  }

  function handlePurchase() {
    // demo purchase: add +10 extra attempts and remove lock
    updateState((s) => ({ ...s, extra: (s.extra || 0) + 10, lockedUntil: null }));
    setStatusMsg('Mua thành công: +10 lượt. Bạn có thể thử lại.');
  }

  const q = SAMPLE_QUESTIONS[idx];

  return (
    <div className="quiz-modal fixed inset-0 z-50 flex items-center justify-center">
      <div className="quiz-backdrop absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="quiz-card relative bg-[#1A1A1A] rounded-lg shadow-2xl w-full max-w-2xl p-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Quiz Demo — Câu {idx + 1} / {SAMPLE_QUESTIONS.length}</h3>
          <div className="text-sm text-gray-600">{attemptsLeft !== null ? `Lượt còn: ${attemptsLeft}` : ''}</div>
        </div>

        {lockedUntil && new Date(lockedUntil) > new Date() ? (
          <div className="p-4 bg-red-50 rounded mb-4">
            <div className="font-medium text-red-700 mb-1">Quiz bị khóa</div>
            <div className="text-sm text-red-600">Mở lại: {new Date(lockedUntil).toLocaleString()}</div>
            <div className="mt-3"><button className="btn-primary" onClick={handlePurchase}>Mua +10 lượt</button></div>
          </div>
        ) : (
          <>
            <div className="mb-2 text-gray-700">{q.q}</div>
            <div className="mb-3 text-sm text-gray-500">Thời gian: {timeLeft}s</div>
            <ul className="space-y-2 mb-4">
              {q.options.map((opt, i) => (
                <li key={i}><button className="btn-outline w-full text-left" onClick={() => handleAnswer(i)}>{opt}</button></li>
              ))}
            </ul>
          </>
        )}

        {statusMsg && <div className="mb-3 text-sm text-gray-800">{statusMsg}</div>}

        <div className="flex justify-end space-x-3">
          <button className="btn-ghost" onClick={onClose}>Đóng</button>
          <button className="btn-secondary" onClick={handlePurchase}>Mua +10 lượt (demo)</button>
        </div>
      </div>
    </div>
  );
}
