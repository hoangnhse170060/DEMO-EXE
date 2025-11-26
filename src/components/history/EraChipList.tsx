import type { Era } from '../../data/history';

type Props = {
  eras: Era[];
  selectedEraId: Era['id'];
  onSelect: (id: Era['id']) => void;
};

export function EraChipList({ eras, selectedEraId, onSelect }: Props) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-3" role="tablist" aria-label="Chọn giai đoạn lịch sử">
      {eras.map((era) => {
        const isActive = era.id === selectedEraId;
        return (
          <button
            key={era.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4D03F] ${
              isActive
                ? 'border-[#F4D03F] bg-[#F4D03F] text-[#E5E5E5]'
                : 'border-[#F4D03F]/40 bg-[#1A1A1A] text-[#F4D03F] hover:border-[#F4D03F] hover:text-[#F4D03F]'
            }`}
            onClick={() => onSelect(era.id)}
          >
            {era.name}
          </button>
        );
      })}
    </div>
  );
}

export default EraChipList;
