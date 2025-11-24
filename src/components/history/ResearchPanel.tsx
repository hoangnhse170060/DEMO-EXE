import { CalendarDays, MapPin, Video, Camera } from 'lucide-react';
import type { DeepEvent } from '../../data/deepEvents';

interface Props {
  event: DeepEvent;
}

export default function ResearchPanel({ event }: Props) {
  const meta = event.meta;
  const primary = event.sources.filter((s) => s.type === 'primary');
  const secondary = event.sources.filter((s) => s.type === 'secondary');
  const heroImage = event.media?.images?.[0]?.src || event.heroImage;
  const supportingImages = event.media?.images?.slice(1, 3) ?? [];
  const leadVideo = event.media?.videos?.[0];

  return (
    <aside className="lg:sticky lg:top-24 space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-amber-900/20 bg-amber-50 shadow-lg">
        {heroImage && (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={event.headline}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-950/70 via-amber-900/50 to-amber-700/40" />
          </div>
        )}
        <div className="relative z-10 p-6 text-white">
          <p className="text-[11px] uppercase tracking-[0.5em] text-amber-100">Hồ sơ nghiên cứu</p>
          <h2 className="mt-3 text-2xl font-serif leading-snug">{event.headline}</h2>
          {event.summary && (
            <p className="mt-3 text-sm leading-relaxed text-amber-100/90">
              {event.summary}
            </p>
          )}
          <div className="mt-5 grid gap-3 text-xs text-amber-100/90">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} />
              <span>{event.date || 'Đang bổ sung'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>{event.location || 'Không rõ địa điểm'}</span>
            </div>
          </div>
        </div>
        {meta && (
          <div className="relative z-10 border-t border-white/20 bg-amber-900/70 px-6 py-5 text-xs text-amber-100/90">
            <p className="font-semibold uppercase tracking-[0.4em] text-amber-200">Ghi chú học thuật</p>
            <div className="mt-3 space-y-2">
              <p><span className="font-semibold">Revision:</span> {meta.revision}</p>
              <p><span className="font-semibold">Cập nhật:</span> {new Date(meta.updatedAt).toLocaleDateString('vi-VN')}</p>
              {meta.methodology && (
                <p><span className="font-semibold">Phương pháp:</span> {meta.methodology}</p>
              )}
              {meta.notes && <p className="italic text-amber-100/80">{meta.notes}</p>}
            </div>
          </div>
        )}
      </section>

      {leadVideo && (
        <section className="rounded-3xl border border-amber-900/20 bg-white shadow-sm">
          <div className="border-b border-amber-900/15 px-5 py-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800">
              <Video size={16} /> Phim tư liệu
            </p>
            <h3 className="mt-2 text-base font-serif text-amber-900">{leadVideo.title}</h3>
          </div>
          <div className="aspect-video w-full overflow-hidden border-b border-amber-900/15">
            {leadVideo.platform === 'youtube' && leadVideo.id ? (
              <iframe
                title={leadVideo.title}
                src={`https://www.youtube.com/embed/${leadVideo.id}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : leadVideo.src ? (
              <video controls className="h-full w-full object-cover">
                <source src={leadVideo.src} />
              </video>
            ) : null}
          </div>
          {leadVideo.platform === 'youtube' && leadVideo.id && (
            <a
              href={`https://www.youtube.com/watch?v=${leadVideo.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-5 py-3 text-xs font-semibold text-amber-700 hover:text-amber-900"
            >
              Mở trên YouTube
              <span aria-hidden>↗</span>
            </a>
          )}
        </section>
      )}

      {supportingImages.length > 0 && (
        <section className="rounded-3xl border border-amber-900/15 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-900">
            <Camera size={16} /> Tư liệu hình ảnh
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {supportingImages.map((image) => (
              <figure key={image.src} className="overflow-hidden rounded-xl border border-amber-900/10">
                <img src={image.src} alt={image.title || image.caption} className="h-28 w-full object-cover" />
                {(image.title || image.caption) && (
                  <figcaption className="px-2 py-1 text-[11px] text-amber-700 line-clamp-2">
                    {image.title || image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {primary.length > 0 && (
        <section className="rounded-3xl border border-amber-900/15 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-900">Nguồn sơ cấp</h3>
          <ul className="space-y-3 text-xs text-amber-800">
            {primary.map((src) => (
              <li key={src.id} className="rounded-xl border border-amber-900/10 bg-amber-50/40 p-3">
                <p className="font-semibold">{src.title}</p>
                {src.author && <p>Tác giả: {src.author}</p>}
                {src.year && <p>Năm: {src.year}</p>}
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-1 text-amber-600 underline"
                  >
                    Mở nguồn
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {secondary.length > 0 && (
        <section className="rounded-3xl border border-amber-900/15 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-900">Nguồn thứ cấp</h3>
          <ul className="space-y-3 text-xs text-amber-800">
            {secondary.map((src) => (
              <li key={src.id} className="rounded-xl border border-amber-900/10 bg-amber-50/20 p-3">
                <p className="font-semibold">{src.title}</p>
                {src.author && <p>Tác giả: {src.author}</p>}
                {src.year && <p>Năm: {src.year}</p>}
                {src.citation && <p className="italic mt-1">{src.citation}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
