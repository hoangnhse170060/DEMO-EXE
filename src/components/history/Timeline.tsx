import { useMemo, useRef, useState } from 'react';
import type { HistoryEvent } from '../../data/history';

const ITEM_HEIGHT = 196;
const WINDOW_COUNT = 8;
const OVERSCAN = 3;

type Props = {
  events: HistoryEvent[];
  activeEventId: string | null;
  completedMap: Record<string, boolean>;
  lockedMap?: Record<string, boolean>;
  onSelect: (eventId: string) => void;
  variant?: 'interactive' | 'preview';
};

export function Timeline({ events, activeEventId, completedMap, lockedMap, onSelect, variant = 'interactive' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = events.length * ITEM_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(events.length, startIndex + WINDOW_COUNT + OVERSCAN * 2);

  const visibleItems = useMemo(() => {
    return events.slice(startIndex, endIndex).map((event, idx) => {
      const absoluteIndex = startIndex + idx;
      const top = absoluteIndex * ITEM_HEIGHT;
      const isActive = variant === 'interactive' && event.id === activeEventId;
      const completed = completedMap[event.id];
      const locked = lockedMap?.[event.id] ?? false;
      const alignment = absoluteIndex % 2 === 0 ? 'left' : 'right';
      const alignWrapper = alignment === 'left' ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16';
      const cardOffset = alignment === 'left' ? 'md:ml-auto' : 'md:mr-auto';
      const tagList = (event.tags ?? []).slice(0, 3);
      const statusLabel = locked ? 'Bị khóa' : completed ? 'Đã hoàn thành' : 'Đang mở';
      const statusClass = locked
        ? 'bg-slate-300 text-slate-600'
        : completed
        ? 'bg-green-600 text-[#E5E5E5]'
        : 'bg-[#F4D03F]/10 text-[#F4D03F]';
      return (
        <div key={event.id} className="absolute inset-x-0 pointer-events-auto" style={{ top }}>
          <div className={`relative flex flex-col md:flex-row ${alignWrapper} pointer-events-auto`}>
            <div className={`relative w-full max-w-xl pl-16 md:pl-0 ${cardOffset} pointer-events-auto`}>
              <span
                aria-hidden
                className="pointer-events-none absolute left-6 top-7 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[#F4D03F] bg-[#1A1A1A] md:left-1/2 md:-translate-x-1/2"
              />
              <button
                type="button"
                onClick={() => {
                  onSelect(event.id);
                }}
                className={`relative z-40 pointer-events-auto w-full rounded-2xl border bg-[#1A1A1A] px-5 py-4 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4D03F] ${
                  isActive
                    ? 'border-[#F4D03F] bg-[#F4D03F]/10 shadow-md'
                    : locked
                    ? 'border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-200'
                    : 'border-[#F4D03F]/20 hover:border-[#F4D03F]/60 hover:shadow-md'
                }`}
                aria-pressed={isActive}
                aria-disabled={locked}
                aria-label={`Mở chi tiết: ${event.title}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-widest text-[#F4D03F]">{event.year}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>
                <h4 className="mt-2 text-lg font-serif text-[#F4D03F]">{event.title}</h4>
                <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{event.summary}</p>
                {tagList.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tagList.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#F4D03F]/10 px-3 py-1 text-[11px] font-semibold text-[#F4D03F]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {variant === 'preview' && (
                  <p className="mt-3 text-sm font-semibold text-[#F4D03F]">
                    Đăng nhập để mở khóa nội dung đầy đủ & quiz tương tác.
                  </p>
                )}
              </button>
              {variant === 'interactive' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(event.id);
                  }}
                  className={`mt-3 w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
                    locked ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-[#F4D03F] text-[#E5E5E5] hover:bg-[#F4D03F]/90'
                  }`}
                  aria-disabled={locked}
                >
                  Xem Chi Tiết
                </button>
              )}
            </div>
          </div>
        </div>
      );
    });
  }, [events, startIndex, endIndex, activeEventId, completedMap, lockedMap, variant]);

  return (
    <div
      ref={containerRef}
      className="relative max-h-[70vh] overflow-y-auto rounded-3xl border border-[#F4D03F]/20 bg-[#1A1A1A]/40 px-2"
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      aria-label="Dòng thời gian sự kiện"
    >
      <div className="pointer-events-none absolute left-6 top-0 h-full w-px bg-[#F4D03F]/20 md:left-1/2" aria-hidden />
      <div style={{ height: totalHeight, position: 'relative' }}>{visibleItems}</div>
    </div>
  );
}

export default Timeline;
