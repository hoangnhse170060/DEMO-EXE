import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, ChevronDown, ChevronLeft, ExternalLink, MapPin } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDeepEventById, type DeepEvent } from '../data/deepEvents';
import { fetchQuizByEvent, type QuizQuestion } from '../data/history';
import ResearchPanel from '../components/history/ResearchPanel';
import QuizLauncher from '../components/history/Quiz/QuizLauncher';
import QuizRunner, { type QuizAnswerRecord, type QuizSummary } from '../components/history/Quiz/QuizRunner';
import QuizResult from '../components/history/Quiz/QuizResult';
import { getActiveUser } from '../lib/auth';
import { gradeQuiz, pickQuestions } from '../lib/quiz';
import {
  getHistoryProgress,
  recordQuizAttempt,
  setLockForEvent,
  updateHistoryProgress,
  setPendingDigitalPurchase,
  type HistoryProgress,
} from '../lib/storage';

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1600&h=900&fit=crop';
const PASSING_SCORE = 70;

type SectionGroup = {
  id: string;
  title: string;
  tone: 'context' | 'analysis' | 'impact' | 'appendix';
  sections: DeepEvent['sections'];
};

export default function EventDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const queryId = search.get('id') ?? undefined;
  const stateEvent = location.state?.event as Partial<DeepEvent> | undefined;
  const eventData = stateEvent?.sections?.length ? (stateEvent as DeepEvent) : getDeepEventById(stateEvent?.id ?? queryId);
  const phaseLabel = location.state?.phase as string | undefined;
  const user = getActiveUser();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [progress, setProgress] = useState<HistoryProgress | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAttemptNumber, setQuizAttemptNumber] = useState(1);
  const [reviewAnswers, setReviewAnswers] = useState<QuizAnswerRecord[] | null>(null);
  const [quizOutcome, setQuizOutcome] = useState<{
    score: number;
    stars: number;
    correct: number;
    total: number;
    attemptNumber: number;
  } | null>(null);
  const progressRatioRef = useRef(0);
  const [sidebarOffset, setSidebarOffset] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const applySidebarOffset = useCallback((isOpen: boolean) => {
    if (!isOpen || typeof window === 'undefined') {
      setIsSidebarOpen(false);
      setSidebarOffset(0);
      return;
    }

    setIsSidebarOpen(true);
    const viewportWidth = window.innerWidth;
    const sidebarWidth = Math.min(Math.max(viewportWidth * 0.3, 320), 400);
    const baseLeft = viewportWidth < 640 ? 64 : viewportWidth < 1024 ? 112 : 128;
    const desiredLeft = sidebarWidth + 24;
    const maxAllowedLeft = Math.max(desiredLeft, baseLeft);
    const viewportLimit = Math.max(baseLeft, viewportWidth - 56);
    const finalLeft = Math.min(maxAllowedLeft, viewportLimit);
    const offset = Math.max(0, finalLeft - baseLeft);
    setSidebarOffset(offset);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleSidebarToggle: EventListener = (event) => {
      const customEvent = event as CustomEvent<{ isOpen?: boolean }>;
      applySidebarOffset(Boolean(customEvent.detail?.isOpen));
    };

    window.addEventListener('sidebar:toggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebar:toggle', handleSidebarToggle);
  }, [applySidebarOffset]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => applySidebarOffset(true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, applySidebarOffset]);

  const heroImage = eventData?.heroImage || eventData?.media?.images?.[0]?.src || DEFAULT_HERO;

  const timelineSections = useMemo(
    () => eventData?.sections.filter((section) => section.kind === 'timeline') ?? [],
    [eventData]
  );

  const sectionGroups: SectionGroup[] = useMemo(() => {
    if (!eventData) return [];
    return [
      {
        id: 'context',
        title: 'Bối cảnh nền',
        tone: 'context' as const,
        sections: eventData.sections.filter((section) => section.kind === 'context'),
      },
      {
        id: 'analysis',
        title: 'Giải thuật sự kiện',
        tone: 'analysis' as const,
        sections: eventData.sections.filter((section) => section.kind === 'analysis'),
      },
      {
        id: 'impact',
        title: 'Ảnh hưởng và di sản',
        tone: 'impact' as const,
        sections: eventData.sections.filter((section) => section.kind === 'impact'),
      },
      {
        id: 'appendix',
        title: 'Phụ lục & tài liệu bổ sung',
        tone: 'appendix' as const,
        sections: eventData.sections.filter((section) => section.kind === 'appendix'),
      },
    ].filter((group) => group.sections.length > 0);
  }, [eventData]);

  const totalPrimarySources = useMemo(
    () => eventData?.sources.filter((source) => source.type === 'primary').length ?? 0,
    [eventData]
  );
  const totalSecondarySources = useMemo(
    () => eventData?.sources.filter((source) => source.type === 'secondary').length ?? 0,
    [eventData]
  );

  useEffect(() => {
    if (!user || !eventData?.id) {
      setProgress(null);
      progressRatioRef.current = 0;
      return;
    }
    const initial = getHistoryProgress(user.id, eventData.id);
    setProgress(initial);
    progressRatioRef.current = initial.readRatio ?? 0;
  }, [user?.id, eventData?.id]);

  useEffect(() => {
    if (!eventData) return;
    const defaults: Record<string, boolean> = {};
    eventData.sections.forEach((section) => {
      if (section.kind === 'context') {
        defaults[section.id] = true;
      }
    });
    setExpandedSections(defaults);
    setActiveImageIndex(0);
  }, [eventData]);

  useEffect(() => {
    if (!eventData) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolled = window.scrollY;
      const totalScroll = documentHeight - windowHeight;
      const progress = totalScroll > 0 ? (scrolled / totalScroll) * 100 : 0;
      setScrollProgress(progress);

      if (user && eventData.id) {
        const ratio = Math.max(0, Math.min(1, progress / 100));
        if (Math.abs(ratio - progressRatioRef.current) >= 0.01) {
          const updated = updateHistoryProgress(user.id, eventData.id, { readRatio: ratio });
          progressRatioRef.current = updated.readRatio ?? ratio;
          setProgress(updated);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [eventData, user]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (!user) {
      const redirectTo = `${location.pathname}${location.search}` || '/event/detail';
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('afterLogin', JSON.stringify({ page: redirectTo.replace(/^\//, '') }));
        window.sessionStorage.setItem('lastVisitedPath', redirectTo);
      }
      navigate('/login', {
        replace: true,
        state: { from: redirectTo },
      });
    }
  }, [user, navigate, location.pathname, location.search]);

  if (!user) {
    return null;
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-[#f6f1e6] flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-amber-900/20 bg-white/80 p-8 text-center shadow-lg">
          <p className="text-sm text-amber-900/80 mb-4">Không tìm thấy hồ sơ sự kiện. Vui lòng quay lại thư viện lịch sử.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-full bg-amber-700 text-white text-sm font-semibold shadow hover:bg-amber-800 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const lockedUntilDate = progress?.lockedUntil ? new Date(progress.lockedUntil) : null;
  const isLocked = lockedUntilDate ? lockedUntilDate.getTime() > Date.now() : false;
  const readRatioPercent = Math.round((progress?.readRatio ?? 0) * 100);
  const canLaunchQuiz = !isLocked && (progress?.readRatio ?? 0) >= 0.8;
  const handleBackToHistory = useCallback(() => {
    window.location.assign('/history');
  }, []);

  const openQuiz = async () => {
    if (!user || !eventData?.id) {
      navigate('/login', { state: { redirectTo: location.pathname + location.search } });
      return;
    }
    if (isLocked && lockedUntilDate) {
      window.alert(`Quiz đã bị khóa đến ${lockedUntilDate.toLocaleString()}.`);
      return;
    }
    if (!canLaunchQuiz) {
      window.alert('Hãy đọc tối thiểu 80% nội dung để mở khóa quiz.');
      return;
    }
    try {
      const attemptNumber = (progress?.attempts.length ?? 0) + 1;
      setQuizAttemptNumber(attemptNumber);
      const bank = await fetchQuizByEvent(eventData.id);
      if (!bank.length) {
        window.alert('Chưa có ngân hàng câu hỏi cho mốc lịch sử này.');
        return;
      }
      const desired = Math.min(bank.length, 5 + Math.floor(Math.random() * 6));
      const questions = pickQuestions(bank, desired);
      setQuizQuestions(questions);
      setReviewAnswers(null);
      setQuizOutcome(null);
      setShowQuiz(true);
    } catch (error) {
      console.error('Không thể tải quiz cho sự kiện', error);
      window.alert('Không thể tải quiz cho sự kiện này. Vui lòng thử lại sau.');
    }
  };

  const handleQuizComplete = (summary: QuizSummary) => {
    if (!user || !eventData?.id) return;
    const correct = summary.correct;
    const total = summary.total;
    const grade = gradeQuiz(correct, total, quizAttemptNumber);
    const attemptRecord = {
      attemptNumber: quizAttemptNumber,
      score: grade.score,
      stars: grade.stars,
      correct,
      total,
      attemptedAt: new Date().toISOString(),
      questionIds: summary.answers.map((record) => record.questionId),
    };

    let updatedProgress = recordQuizAttempt(user.id, eventData.id, attemptRecord);
    const baseAllowed = 2;
    const extra = updatedProgress.extraAttempts ?? 0;
    const totalAllowed = baseAllowed + extra;
    const passedByScore = grade.score >= PASSING_SCORE;

    if (!passedByScore) {
      const failed = (updatedProgress.failedAttempts ?? 0) + 1;
      if (failed >= totalAllowed) {
        const untilIso = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
        updatedProgress = setLockForEvent(user.id, eventData.id, untilIso);
      } else {
        updatedProgress = updateHistoryProgress(user.id, eventData.id, { failedAttempts: failed });
      }
    } else {
      updatedProgress = updateHistoryProgress(user.id, eventData.id, {
        failedAttempts: 0,
        lockedUntil: null,
        completedAt: new Date().toISOString(),
      });
    }

    setProgress(updatedProgress);
    setReviewAnswers(summary.answers);
    setQuizOutcome({ score: grade.score, stars: grade.stars, correct, total, attemptNumber: quizAttemptNumber });
    setShowQuiz(false);
  };

  const handlePurchaseAttempts = () => {
    if (!user || !eventData?.id) {
      navigate('/login');
      return;
    }
    setPendingDigitalPurchase({
      planId: 'attempt-pack-10',
      eventId: eventData.id,
      eventTitle: eventData.headline || 'Sự kiện lịch sử',
      quantity: 10,
      createdAt: new Date().toISOString(),
    });
    const checkoutUrl = `/checkout?productId=attempt-pack-10&eventId=${eventData.id}`;
    window.location.assign(checkoutUrl);
  };


  return (
    <div className="min-h-screen bg-[#f6f1e6] text-amber-950">
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      <button
        onClick={handleBackToHistory}
        className="fixed top-8 left-3 z-40 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:shadow-xl transition-transform duration-300"
        aria-label="Quay lại lịch sử"
      >
        <ChevronLeft size={20} className="text-amber-800" />
      </button>

      <section className="relative min-h-[62vh] lg:min-h-[68vh] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(34,24,14,0.85), rgba(120,68,20,0.55)), url(${heroImage})`,
          }}
        />
        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-[11px] uppercase tracking-[0.4em]">
              {phaseLabel || 'Hồ sơ nghiên cứu'}
            </div>
            <h1 className="mt-6 text-3xl md:text-5xl lg:text-6xl font-serif leading-snug drop-shadow-lg">
              {eventData.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-sm md:text-base lg:text-lg text-white/85 leading-relaxed">
              {eventData.summary}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70">
                  <CalendarDays size={14} /> Ngày diễn ra
                </div>
                <p className="mt-2 text-base font-semibold text-white">
                  {eventData.date || 'Đang bổ sung'}
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70">
                  <MapPin size={14} /> Địa điểm lịch sử
                </div>
                <p className="mt-2 text-base font-semibold text-white">
                  {eventData.location || 'Không rõ'}
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <div className="text-xs uppercase tracking-widest text-white/70">Nguồn trích dẫn</div>
                <p className="mt-2 text-base font-semibold text-white">
                  {totalPrimarySources} sơ cấp • {totalSecondarySources} thứ cấp
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById('reading-start')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-amber-900 shadow-lg hover:shadow-xl transition"
              >
                Thông tin chi tiết
              </button>
             
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 -mt-16 pb-24">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr),minmax(290px,1fr)]">
            <article id="reading-start" className="space-y-12">
              {eventData.media?.images?.length ? (
                <section className="rounded-3xl border border-amber-900/15 bg-white/90 shadow-sm p-6">
                  <header className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-amber-700/70">Tư liệu hình ảnh</p>
                      <h2 className="text-2xl font-serif text-amber-900">Bộ ảnh hiện trường & minh họa</h2>
                    </div>
                    <span className="text-xs text-amber-700/60">{eventData.media.images.length} mục</span>
                  </header>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-amber-900/10 bg-amber-50">
                    <img
                      src={eventData.media.images[activeImageIndex].src}
                      alt={eventData.media.images[activeImageIndex].title || 'Tư liệu hình ảnh'}
                      className="h-80 w-full object-cover"
                    />
                    <div className="flex flex-col gap-1 border-t border-amber-900/10 bg-white/90 px-5 py-4 text-sm text-amber-800">
                      <p className="font-semibold">
                        {eventData.media.images[activeImageIndex].title || 'Tư liệu sự kiện'}
                      </p>
                      <p className="text-xs leading-relaxed text-amber-700">
                        {eventData.media.images[activeImageIndex].caption}
                      </p>
                      {(eventData.media.images[activeImageIndex].credit || eventData.media.images[activeImageIndex].year) && (
                        <p className="text-[11px] uppercase tracking-widest text-amber-600/70">
                          {eventData.media.images[activeImageIndex].credit}
                          {eventData.media.images[activeImageIndex].year ? ` • ${eventData.media.images[activeImageIndex].year}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {eventData.media.images.map((image, index) => (
                      <button
                        key={image.src}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border transition ${
                          activeImageIndex === index
                            ? 'border-amber-700 shadow-lg'
                            : 'border-amber-900/10 hover:border-amber-500'
                        }`}
                      >
                        <img src={image.src} alt={image.title} className="h-full w-full object-cover" />
                        {activeImageIndex === index && (
                          <span className="absolute inset-0 border-2 border-white/80" aria-hidden />
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              {timelineSections.length > 0 && (
                <section className="rounded-3xl border border-amber-900/20 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-8 shadow-sm">
                  <header className="mb-6">
                    <p className="text-xs uppercase tracking-[0.45em] text-amber-700/70">Dòng thời gian</p>
                    <h2 className="mt-2 text-2xl font-serif text-amber-900">Những nhịp chính trước và trong sự kiện</h2>
                  </header>
                  <ol className="relative border-s border-amber-900/20 pl-8 space-y-10">
                    {timelineSections.map((section) => (
                      <li key={section.id} className="relative">
                        <span className="absolute -left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-amber-900/30 bg-amber-100" />
                        <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
                          <h3 className="text-lg font-serif text-amber-900">{section.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-amber-800 whitespace-pre-line">
                            {section.content}
                          </p>
                          {section.bullets?.length ? (
                            <ul className="mt-4 space-y-2 text-sm text-amber-800/90">
                              {section.bullets.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="text-amber-600">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {sectionGroups.map((group) => (
                <section
                  key={group.id}
                  className="rounded-3xl border border-amber-900/15 bg-white/95 shadow-sm"
                >
                  <header className="flex items-center justify-between gap-4 border-b border-amber-900/10 px-6 py-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.45em] text-amber-700/70">
                        {group.tone === 'context' && 'Bối cảnh'}
                        {group.tone === 'analysis' && 'Phân tích'}
                        {group.tone === 'impact' && 'Ảnh hưởng'}
                        {group.tone === 'appendix' && 'Phụ lục'}
                      </p>
                      <h2 className="text-2xl font-serif text-amber-900">{group.title}</h2>
                    </div>
                    <span className="text-xs text-amber-700/60">{group.sections.length} mục</span>
                  </header>
                  <div className="divide-y divide-amber-900/10">
                    {group.sections.map((section) => {
                      const isOpen = expandedSections[section.id] ?? false;
                      return (
                        <article key={section.id}>
                          <button
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-amber-50/60 transition"
                            aria-expanded={isOpen}
                          >
                            <span className="text-base font-semibold text-amber-900">{section.title}</span>
                            <ChevronDown
                              size={18}
                              className={`text-amber-700 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-6 text-sm leading-relaxed text-amber-800 animate-fade-in">
                              <p className="whitespace-pre-line">{section.content}</p>
                              {section.bullets?.length ? (
                                <ul className="mt-4 space-y-2 text-sm text-amber-800/90">
                                  {section.bullets.map((item) => (
                                    <li key={item} className="flex gap-2">
                                      <span className="text-amber-600">—</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}

              {eventData.people?.length ? (
                <section className="rounded-3xl border border-amber-900/20 bg-gradient-to-br from-white via-amber-50/70 to-white p-8 shadow-sm">
                  <header className="mb-6">
                    <p className="text-xs uppercase tracking-[0.45em] text-amber-700/70">Nhân vật chủ chốt</p>
                    <h2 className="mt-2 text-2xl font-serif text-amber-900">Biên chế nhân sự và dấu ấn cá nhân</h2>
                  </header>
                  <div className="grid gap-6 md:grid-cols-2">
                    {eventData.people.map((person) => (
                      <article
                        key={person.id}
                        className="rounded-2xl border border-amber-900/15 bg-white/90 p-5 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          {person.portrait ? (
                            <img
                              src={person.portrait}
                              alt={person.name}
                              className="h-20 w-20 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-900/10 text-2xl font-serif text-amber-700">
                              {person.name.slice(0, 1)}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-amber-900">{person.name}</h3>
                            <p className="text-xs uppercase tracking-widest text-amber-700/70">{person.role}</p>
                            <p className="mt-3 text-sm leading-relaxed text-amber-800">{person.bio}</p>
                          </div>
                        </div>
                        {person.quotes?.length ? (
                          <div className="mt-4 rounded-xl border border-amber-900/10 bg-amber-50/80 px-4 py-3 text-sm italic text-amber-700">
                            “{person.quotes[0]}”
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="rounded-3xl border border-amber-900/20 bg-white/95 shadow-sm p-8">
                <header className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-amber-700/70">Đánh giá nguồn</p>
                    <h2 className="mt-2 text-2xl font-serif text-amber-900">Chú giải tài liệu trích dẫn</h2>
                  </div>
                  <span className="text-xs text-amber-700/60">{eventData.sources.length} nguồn được kiểm chứng</span>
                </header>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {eventData.sources.map((source) => (
                    <article
                      key={source.id}
                      className="rounded-2xl border border-amber-900/15 bg-amber-50/60 p-5 shadow-sm"
                    >
                      <div className="text-xs uppercase tracking-widest text-amber-700/70">
                        {source.type === 'primary' ? 'Nguồn sơ cấp' : 'Nguồn thứ cấp'}
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-amber-900">{source.title}</h3>
                      {source.author || source.year ? (
                        <p className="mt-1 text-xs text-amber-700/80">
                          {source.author ? `${source.author}` : ''}
                          {source.author && source.year ? ' • ' : ''}
                          {source.year || ''}
                        </p>
                      ) : null}
                      {source.citation ? (
                        <p className="mt-3 text-sm italic leading-relaxed text-amber-800/90">
                          {source.citation}
                        </p>
                      ) : null}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-700/70">
                        <span>
                          Độ tin cậy: {source.reliability ? source.reliability.toUpperCase() : 'Chưa đánh giá'}
                        </span>
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900"
                          >
                            Truy cập
                            <ExternalLink size={14} />
                          </a>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="relative overflow-hidden rounded-3xl border border-amber-900/20 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 p-10 text-white shadow-lg">
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-white/10 blur-3xl" aria-hidden />
                  <div className="relative z-10 space-y-4">
                    <h2 className="text-3xl font-serif">Tự lượng giá kiến thức</h2>
                    <p className="max-w-2xl text-sm md:text-base leading-relaxed text-white/90">
                      Hoàn tất bộ câu hỏi thời gian thực để ghi nhận tiến độ nghiên cứu và mở khóa các hồ sơ chuyên sâu tiếp theo.
                    </p>
                    <p className="text-xs uppercase tracking-[0.45em] text-white/70">ĐÃ ĐỌC {readRatioPercent}% HỒ SƠ</p>
                  </div>
                </div>

                {isLocked && lockedUntilDate && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
                    <div className="font-semibold">Quiz tạm thời bị khóa</div>
                    <p className="mt-2">Bạn đã dùng hết lượt thử. Mở lại vào {lockedUntilDate.toLocaleString()} hoặc mua thêm lượt để tiếp tục.</p>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handlePurchaseAttempts}
                        className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-rose-600/90"
                      >
                        Mua +10 lượt
                      </button>
                    </div>
                  </div>
                )}

                <QuizLauncher
                  canLaunch={canLaunchQuiz}
                  onLaunch={openQuiz}
                  attempts={progress?.attempts.length ?? 0}
                  purchasedAttempts={progress?.extraAttempts ?? 0}
                  bestScore={progress?.bestScore}
                  bestStars={progress?.bestStars}
                />

                {reviewAnswers && (
                  <div className="rounded-xl border border-amber-400/30 bg-amber-50/80 p-6 text-sm text-amber-900 shadow-sm">
                    <h4 className="text-base font-semibold text-amber-900">Giải thích câu hỏi gần nhất</h4>
                    <ul className="mt-4 space-y-3">
                      {reviewAnswers.map((answer) => {
                        const question = quizQuestions.find((q) => q.id === answer.questionId);
                        if (!question) return null;
                        const selected =
                          typeof answer.selectedIndex === 'number' ? question.options[answer.selectedIndex] : 'Chưa trả lời';
                        const correct = question.options[answer.correctIndex];
                        return (
                          <li key={answer.questionId} className="rounded-lg bg-white/90 p-4 shadow-sm">
                            <p className="font-semibold text-amber-900">{question.prompt}</p>
                            <p className="mt-1 text-sm text-amber-700">Bạn chọn: {selected}</p>
                            <p className="text-sm text-emerald-700">Đáp án đúng: {correct}</p>
                            {answer.explanation ? (
                              <p className="mt-2 text-sm text-amber-800/80">{answer.explanation}</p>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </section>
            </article>

            <div className="lg:pt-6">
              <ResearchPanel event={eventData} />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#ede3d2] py-10 text-center text-xs text-amber-700/70">
        Hồ sơ trình bày nhằm minh họa bố cục nghiên cứu. Cập nhật {new Date().getFullYear()}.
      </footer>

      {showQuiz && (
        <QuizRunner
          questions={quizQuestions}
          attemptNumber={quizAttemptNumber}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}

      {quizOutcome && (
        <QuizResult
          score={quizOutcome.score}
          stars={quizOutcome.stars}
          correct={quizOutcome.correct}
          total={quizOutcome.total}
          attemptNumber={quizOutcome.attemptNumber}
          onRetry={() => {
            setQuizOutcome(null);
            void openQuiz();
          }}
          onReview={() => setQuizOutcome(null)}
          onClose={() => setQuizOutcome(null)}
        />
      )}
    </div>
  );
}
