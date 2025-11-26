import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, ChevronDown, ChevronLeft, ExternalLink, MapPin } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDeepEventById, type DeepEvent } from '../data/deepEvents';
import { fetchQuizByEvent, events as historyEvents, type QuizQuestion } from '../data/history';
import ResearchPanel from '../components/history/ResearchPanel';
import QuizLauncher from '../components/history/Quiz/QuizLauncher';
import QuizRunner, { type QuizAnswerRecord, type QuizSummary } from '../components/history/Quiz/QuizRunner';
import QuizResult from '../components/history/Quiz/QuizResult';
import { getActiveUser } from '../lib/auth';
import { gradeQuiz, pickQuestions } from '../lib/quiz';
import {
  getHistoryProgress,
  recordQuizAttempt,
  updateHistoryProgress,
  type HistoryProgress,
} from '../lib/storage';

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1600&h=900&fit=crop';

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

  // Calculate next event based on current event
  const nextEvent = useMemo(() => {
    if (!eventData?.id) return null;
    const sortedEvents = [...historyEvents].sort((a, b) => a.year - b.year);
    const currentIndex = sortedEvents.findIndex(e => e.id === eventData.id);
    if (currentIndex === -1 || currentIndex >= sortedEvents.length - 1) return null;
    return sortedEvents[currentIndex + 1];
  }, [eventData?.id]);

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
        title: 'Phân tích',
        tone: 'analysis' as const,
        sections: eventData.sections.filter((section) => section.kind === 'analysis'),
      },
      {
        id: 'impact',
        title: 'Kết Quả',
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
    if (!eventData?.id) {
      setProgress(null);
      progressRatioRef.current = 0;
      return;
    }
    const userId = user?.id ?? 'guest-user';
    const initial = getHistoryProgress(userId, eventData.id);
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

  if (!eventData) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-[#F4D03F]/20 bg-charcoal-800 p-8 text-center shadow-lg">
          <p className="text-sm text-gray-300 mb-4">Không tìm thấy hồ sơ sự kiện. Vui lòng quay lại thư viện lịch sử.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-full bg-[#F4D03F] text-charcoal-900 text-sm font-semibold shadow hover:bg-[#F4D03F]/90 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const canLaunchQuiz = true;
  const readRatioPercent = Math.round((progress?.readRatio ?? 0) * 100);
  const handleBackToHistory = useCallback(() => {
    window.location.assign('/history');
  }, []);

  const openQuiz = async () => {
    if (!eventData?.id) {
      window.alert('Không tìm thấy sự kiện.');
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
    if (!eventData?.id) return;
    const userId = user?.id ?? 'guest-user';
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

    let updatedProgress = recordQuizAttempt(userId, eventData.id, attemptRecord);

    // Always mark as completed regardless of score
    updatedProgress = updateHistoryProgress(userId, eventData.id, {
      failedAttempts: 0,
      lockedUntil: null,
      completedAt: new Date().toISOString(),
    });

    setProgress(updatedProgress);
    setReviewAnswers(summary.answers);
    setQuizOutcome({ score: grade.score, stars: grade.stars, correct, total, attemptNumber: quizAttemptNumber });
    setShowQuiz(false);
  };


  return (
    <div className="min-h-screen bg-charcoal-900 text-gray-100">
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#F4D03F] via-[#F4D03F]/70 to-[#F4D03F] z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      <button
        onClick={handleBackToHistory}
        className="fixed top-8 left-3 z-40 bg-charcoal-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-transform duration-300 border border-[#F4D03F]/20"
        aria-label="Quay lại lịch sử"
      >
        <ChevronLeft size={20} className="text-[#F4D03F]" />
      </button>

      <section className="relative min-h-[62vh] lg:min-h-[68vh] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(15,15,15,0.85), rgba(50,50,50,0.65)), url(${heroImage})`,
          }}
        />
        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F4D03F]/30 bg-[#F4D03F]/10 px-4 py-1 text-[11px] uppercase tracking-[0.4em] text-[#F4D03F]">
              {phaseLabel || 'LOADING...'}
            </div>
            <h1 className="mt-6 text-3xl md:text-5xl lg:text-6xl font-serif leading-snug drop-shadow-lg text-[#F4D03F]">
              {eventData.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed">
              {eventData.summary}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#F4D03F]/30 bg-charcoal-800 p-4 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#F4D03F]">
                  <CalendarDays size={14} /> Ngày diễn ra
                </div>
                <p className="mt-2 text-base font-semibold text-gray-100">
                  {eventData.date || 'Đang bổ sung'}
                </p>
              </div>
              <div className="rounded-2xl border border-[#F4D03F]/30 bg-charcoal-800 p-4 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#F4D03F]">
                  <MapPin size={14} /> Địa điểm lịch sử
                </div>
                <p className="mt-2 text-base font-semibold text-gray-100">
                  {eventData.location || 'Không rõ'}
                </p>
              </div>
              
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById('reading-start')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full bg-[#F4D03F] px-6 py-3 text-sm font-semibold text-charcoal-900 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition"
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
                <section className="rounded-3xl border border-[#F4D03F]/20 bg-charcoal-800 shadow-lg p-6">
                  <header className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#F4D03F]/70">Tư liệu hình ảnh</p>
                      <h2 className="text-2xl font-serif text-[#F4D03F]">Tư liệu hình ảnh</h2>
                    </div>
                    <span className="text-xs text-gray-300">{eventData.media.images.length} mục</span>
                  </header>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-[#F4D03F]/30 bg-charcoal-900 shadow-xl">
                    <img
                      src={eventData.media.images[activeImageIndex].src}
                      alt={eventData.media.images[activeImageIndex].title || 'Tư liệu hình ảnh'}
                      className="h-80 w-full object-cover"
                    />
                    <div className="flex flex-col gap-1 border-t border-[#F4D03F]/20 bg-charcoal-800 px-5 py-4 text-sm text-gray-200">
                      <p className="font-semibold text-[#F4D03F]">
                        {eventData.media.images[activeImageIndex].title || 'Tư liệu sự kiện'}
                      </p>
                      <p className="text-xs leading-relaxed text-gray-300">
                        {eventData.media.images[activeImageIndex].caption}
                      </p>
                      {(eventData.media.images[activeImageIndex].credit || eventData.media.images[activeImageIndex].year) && (
                        <p className="text-[11px] uppercase tracking-widest text-gray-400/70">
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
                            ? 'border-[#F4D03F] shadow-lg shadow-[#F4D03F/20]-blue/50'
                            : 'border-[#F4D03F]/20 hover:border-[#F4D03F]/50'
                        }`}
                      >
                        <img src={image.src} alt={image.title} className="h-full w-full object-cover" />
                        {activeImageIndex === index && (
                          <span className="absolute inset-0 border-2 border-[#F4D03F]/80" aria-hidden />
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              {timelineSections.length > 0 && (
                <section className="rounded-3xl border border-[#F4D03F]/20 bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-charcoal-800 p-8 shadow-lg">
                  <header className="mb-6">
                    <p className="text-xs uppercase tracking-[0.45em] text-[#F4D03F]/70">Dòng thời gian</p>
                    <h2 className="mt-2 text-2xl font-serif text-[#F4D03F]">Những nhịp chính trước và trong sự kiện</h2>
                  </header>
                  <ol className="relative border-s border-[#F4D03F]/30 pl-8 space-y-10">
                    {timelineSections.map((section) => (
                      <li key={section.id} className="relative">
                        <span className="absolute -left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-[#F4D03F]/50 bg-[#F4D03F]/20" />
                        <div className="rounded-2xl bg-charcoal-800/60 border border-[#F4D03F]/10 p-5 shadow-md">
                          <h3 className="text-lg font-serif text-[#F4D03F]">{section.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-gray-200 whitespace-pre-line">
                            {section.content}
                          </p>
                          {section.bullets?.length ? (
                            <ul className="mt-4 space-y-2 text-sm text-gray-300">
                              {section.bullets.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="text-[#F4D03F]">•</span>
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
                  className="rounded-3xl border border-[#F4D03F]/20 bg-charcoal-800 shadow-lg"
                >
                  <header className="flex items-center justify-between gap-4 border-b border-[#F4D03F]/10 px-6 py-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.45em] text-[#F4D03F]/70">
                        {group.tone === 'context' && 'Bối cảnh'}
                        {group.tone === 'analysis' && 'Phân tích'}
                        {group.tone === 'impact' && 'Kết quả'}
                        {group.tone === 'appendix' && 'Phụ lục'}
                      </p>
                      <h2 className="text-2xl font-serif text-[#F4D03F]">{group.title}</h2>
                    </div>
                    <span className="text-xs text-gray-400">{group.sections.length} mục</span>
                  </header>
                  <div className="divide-y divide-[#F4D03F]/10">
                    {group.sections.map((section) => {
                      const isOpen = expandedSections[section.id] ?? false;
                      return (
                        <article key={section.id}>
                          <button
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-charcoal-700/40 transition"
                            aria-expanded={isOpen}
                          >
                            <span className="text-base font-semibold text-[#F4D03F]">{section.title}</span>
                            <ChevronDown
                              size={18}
                              className={`text-[#F4D03F] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-6 text-sm leading-relaxed text-gray-200 animate-fade-in">
                              <p className="whitespace-pre-line">{section.content}</p>
                              {section.bullets?.length ? (
                                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                                  {section.bullets.map((item) => (
                                    <li key={item} className="flex gap-2">
                                      <span className="text-[#F4D03F]">—</span>
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
                <section className="rounded-3xl border border-[#F4D03F]/20 bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-charcoal-800 p-8 shadow-lg">
                  <header className="mb-6">
                    <p className="text-xs uppercase tracking-[0.45em] text-[#F4D03F]/70">Nhân vật chủ chốt</p>
                    <h2 className="mt-2 text-2xl font-serif text-[#F4D03F]">Biên chế nhân sự và dấu ấn cá nhân</h2>
                  </header>
                  <div className="grid gap-6 md:grid-cols-2">
                    {eventData.people.map((person) => (
                      <article
                        key={person.id}
                        className="rounded-2xl border border-[#F4D03F]/20 bg-charcoal-800/60 p-5 shadow-md hover:border-[#F4D03F]/40 transition"
                      >
                        <div className="flex items-start gap-4">
                          {person.portrait ? (
                            <img
                              src={person.portrait}
                              alt={person.name}
                              className="h-20 w-20 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#F4D03F]/10 text-2xl font-serif text-[#F4D03F]">
                              {person.name.slice(0, 1)}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#F4D03F]">{person.name}</h3>
                            <p className="text-xs uppercase tracking-widest text-gray-400">{person.role}</p>
                            <p className="mt-3 text-sm leading-relaxed text-gray-300">{person.bio}</p>
                          </div>
                        </div>
                        {person.quotes?.length ? (
                          <div className="mt-4 rounded-xl border border-[#F4D03F]/20 bg-[#F4D03F]/10 px-4 py-3 text-sm italic text-[#F4D03F]">
                            “{person.quotes[0]}”
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="rounded-3xl border border-[#F4D03F]/20 bg-charcoal-800 shadow-lg p-8">
                <header className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-[#F4D03F]/70">Đánh giá nguồn</p>
                    <h2 className="mt-2 text-2xl font-serif text-[#F4D03F]">Chú giải tài liệu trích dẫn</h2>
                  </div>
                  <span className="text-xs text-gray-400">{eventData.sources.length} nguồn được kiểm chứng</span>
                </header>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {eventData.sources.map((source) => (
                    <article
                      key={source.id}
                      className="rounded-2xl border border-[#F4D03F]/20 bg-charcoal-800/50 p-5 shadow-md hover:border-[#F4D03F]/40 transition"
                    >
                      
                      <h3 className="mt-2 text-base font-semibold text-[#F4D03F]">{source.title}</h3>
                      {source.author || source.year ? (
                        <p className="mt-1 text-xs text-gray-400">
                          {source.author ? `${source.author}` : ''}
                          {source.author && source.year ? ' • ' : ''}
                          {source.year || ''}
                        </p>
                      ) : null}
                      {source.citation ? (
                        <p className="mt-3 text-sm italic leading-relaxed text-gray-300">
                          {source.citation}
                        </p>
                      ) : null}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                        <span>
                          Độ tin cậy: {source.reliability ? source.reliability.toUpperCase() : 'Chưa đánh giá'}
                        </span>
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#F4D03F] hover:text-[#F4D03F]/80 transition"
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
                <div className="relative overflow-hidden rounded-3xl border border-[#F4D03F]/30 bg-charcoal-800 p-10 shadow-lg">
                  <div className="relative z-10 space-y-4">
                    <h2 className="text-3xl font-serif text-[#F4D03F]">Tự lượng giá kiến thức</h2>
                    <p className="max-w-2xl text-sm md:text-base leading-relaxed text-gray-100">
                      Hoàn tất bộ câu hỏi thời gian thực để ghi nhận tiến độ nghiên cứu và mở khóa các hồ sơ chuyên sâu tiếp theo.
                    </p>
                    <p className="text-xs uppercase tracking-[0.45em] text-[#F4D03F]/80">ĐÃ ĐỌC {readRatioPercent}% HỒ SƠ</p>
                  </div>
                </div>

                <QuizLauncher
                  canLaunch={canLaunchQuiz}
                  onLaunch={openQuiz}
                  attempts={progress?.attempts.length ?? 0}
                  bestScore={progress?.bestScore}
                  bestStars={progress?.bestStars}
                />

                {reviewAnswers && (
                  <div className="rounded-xl border border-[#F4D03F]/30 bg-[#F4D03F]/10 p-6 text-sm text-[#F4D03F] shadow-md">
                    <h4 className="text-base font-semibold text-[#F4D03F]">Giải thích câu hỏi gần nhất</h4>
                    <ul className="mt-4 space-y-3">
                      {reviewAnswers.map((answer) => {
                        const question = quizQuestions.find((q) => q.id === answer.questionId);
                        if (!question) return null;
                        const selected =
                          typeof answer.selectedIndex === 'number' ? question.options[answer.selectedIndex] : 'Chưa trả lời';
                        const correct = question.options[answer.correctIndex];
                        return (
                          <li key={answer.questionId} className="rounded-lg bg-charcoal-800/80 border border-[#F4D03F]/20 p-4 shadow-md">
                            <p className="font-semibold text-[#F4D03F]">{question.prompt}</p>
                            <p className="mt-1 text-sm text-[#F4D03F]/80">Bạn chọn: {selected}</p>
                            <p className="text-sm text-emerald-400">Đáp án đúng: {correct}</p>
                            {answer.explanation ? (
                              <p className="mt-2 text-sm text-gray-300">{answer.explanation}</p>
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

      <footer className="bg-charcoal-900 border-t border-[#F4D03F]/20 py-10 text-center text-xs text-gray-400">
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
          nextCta={nextEvent ? () => {
            setQuizOutcome(null);
            navigate('/event/detail', {
              state: { event: { id: nextEvent.id }, phase: nextEvent.eraId },
            });
          } : undefined}
          nextEventTitle={nextEvent?.title}
        />
      )}
    </div>
  );
}
