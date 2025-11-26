import { useMemo } from 'react';

export type HistoryFilters = {
  search: string;
  tags: string[];
  yearRange: [number, number];
};

type Props = {
  filters: HistoryFilters;
  onChange: (next: HistoryFilters) => void;
  availableTags: string[];
  yearBounds: [number, number];
};

export function FilterBar({ filters, onChange, availableTags, yearBounds }: Props) {
  const [minYear, maxYear] = yearBounds;
  const [from, to] = filters.yearRange;

  const sortedTags = useMemo(() => [...availableTags].sort((a, b) => a.localeCompare(b)), [availableTags]);

  return (
    <section aria-label="Bộ lọc dòng thời gian" className="mt-8 rounded-2xl border border-[#F4D03F]/20 bg-[#1A1A1A]/90 p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold uppercase text-[#F4D03F]" htmlFor="history-search">
            Tìm kiếm sự kiện
          </label>
          <input
            id="history-search"
            type="search"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Nhập từ khóa..."
            className="rounded border border-[#F4D03F]/30 px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4D03F]"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase text-[#F4D03F]" htmlFor="year-range">
            Khoảng năm
          </label>
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <span aria-live="polite" aria-atomic="true">
              {from}
            </span>
            <input
              id="year-range-start"
              type="range"
              min={minYear}
              max={to}
              value={from}
              onChange={(event) => {
                const value = Number(event.target.value);
                onChange({ ...filters, yearRange: [Math.min(value, to), to] });
              }}
              className="flex-1 accent-[#F4D03F]"
              aria-label="Năm bắt đầu"
            />
            <span>→</span>
            <input
              id="year-range-end"
              type="range"
              min={from}
              max={maxYear}
              value={to}
              onChange={(event) => {
                const value = Number(event.target.value);
                onChange({ ...filters, yearRange: [from, Math.max(value, from)] });
              }}
              className="flex-1 accent-[#F4D03F]"
              aria-label="Năm kết thúc"
            />
            <span aria-live="polite" aria-atomic="true">
              {to}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-xs font-semibold uppercase text-[#F4D03F]">Thẻ nổi bật</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {sortedTags.map((tag) => {
            const checked = filters.tags.includes(tag);
            return (
              <label key={tag} className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${checked ? 'border-[#F4D03F] bg-[#F4D03F] text-[#E5E5E5]' : 'border-[#F4D03F]/40 text-[#F4D03F] hover:border-[#F4D03F]'}`}>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? filters.tags.filter((item) => item !== tag)
                      : [...filters.tags, tag];
                    onChange({ ...filters, tags: next });
                  }}
                />
                #{tag}
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FilterBar;
